from rest_framework import serializers
from .models import Aluguel
from django.contrib.auth.models import User
from cars.models import Carro

class AluguelSerializer(serializers.ModelSerializer):
    valor_total = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    funcionario_nome = serializers.CharField(source='funcionario.username', read_only=True)
    cliente_nome = serializers.CharField(source='perfil_cliente.user.username', read_only=True)
    funcionario = serializers.PrimaryKeyRelatedField(queryset= User.objects.filter(groups__name='Funcionários'))
    status = serializers.ChoiceField(choices=Aluguel.STATUS_CHOICES)
    carro_modelo= serializers.CharField(source='carro.modelo', read_only=True)
    carro_placa= serializers.CharField(source='carro.placa', read_only=True)
    
    class Meta:
        model = Aluguel
        fields = ['id', 'perfil_cliente', 'cliente_nome', 'carro', 'carro_modelo', 'carro_placa','funcionario', 'funcionario_nome', 'data_inicio', 'data_fim', 'valor_total', 'status']

    def validate(self, data):
            # logica para validação de datas e conflito de aluguel
            if self.instance:
                data_inicio = data.get("data_inicio", self.instance.data_inicio)
                data_fim = data.get("data_fim", self.instance.data_fim)
                carro = data.get("carro", self.instance.carro)
            else:
                data_inicio = data.get("data_inicio")
                data_fim = data.get("data_fim")
                carro = data.get("carro")

            # valida datas
            if data_inicio and data_fim:
                if data_fim < data_inicio:
                    raise serializers.ValidationError({"data_fim": "A data de fim não pode ser menor que a data de início."})

            # valida conflito de datas para o mesmo carro
            if carro and data_inicio and data_fim:
                conflito = Aluguel.objects.filter(
                    carro=carro,
                    data_inicio__lte=data_fim,
                    data_fim__gte=data_inicio
                ).exclude(status__in=['finalizado', 'cancelado']) # ignora aluguéis que não estão ativos
                
                if self.instance:
                    conflito = conflito.exclude(id=self.instance.id)

                if conflito.exists():
                    raise serializers.ValidationError({"carro": "Este carro já está alugado nesse período."})

            return data

    def update(self, instance, validated_data):
        # impedir alteração de aluguel finalizado ou cancelado
        if instance.status in ['finalizado', 'cancelado']:
            raise serializers.ValidationError("Não é possível alterar um aluguel que já foi finalizado ou cancelado.")

        # Verifica se o usuário está tentando mudar o status agora
        novo_status = validated_data.get('status')

        if novo_status in ['finalizado', 'cancelado']:
            # se for finalizado ou cancelado, impede alteração de certos campos
            campos_para_ignorar = ['carro', 'data_inicio', 'data_fim', 'perfil_cliente']
            for campo in campos_para_ignorar:
                if campo in validated_data:
                    validated_data.pop(campo)

        # Realiza a atualização padrão do Django REST Framework
        instance = super().update(instance, validated_data)

        # se o status foi alterado para finalizado, marca o carro como disponível
        if instance.status in ['finalizado', 'cancelado']:
            instance.carro.marcar_como_disponivel() 
        
        return instance