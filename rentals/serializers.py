from rest_framework import serializers
from .models import Aluguel
from django.contrib.auth.models import User
from cars.models import Carro
from datetime import date
from decimal import Decimal

class AluguelSerializer(serializers.ModelSerializer):
    valor_total = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    funcionario_nome = serializers.CharField(source='funcionario.username', read_only=True)
    cliente_nome = serializers.CharField(source='perfil_cliente.user.username', read_only=True)
    funcionario = serializers.PrimaryKeyRelatedField(queryset= User.objects.filter(groups__name='Funcionários'))
    status = serializers.ChoiceField(choices=Aluguel.STATUS_CHOICES)
    carro_modelo= serializers.CharField(source='carro.modelo', read_only=True)
    carro_placa= serializers.CharField(source='carro.placa', read_only=True)
    
    carro = serializers.PrimaryKeyRelatedField(
        queryset=Carro.objects.exclude(status='indisponivel')
    )

    # campos adicionais para dia e valor parcial
    dias_corridos = serializers.SerializerMethodField()
    valor_parcial_atual = serializers.SerializerMethodField()

    class Meta:
        model = Aluguel
        fields = ['id', 'perfil_cliente', 'cliente_nome', 'carro','carro_modelo', 'carro_placa',
                  'funcionario', 'funcionario_nome','data_inicio', 'data_fim', 'valor_total', 
                  'status', 'dias_corridos', 'valor_parcial_atual']
   
    # Calcula dias corridos entre data_inicio e hoje (ou data_fim se já passou)
    def get_dias_corridos(self, obj):
        if obj.status == 'cancelado':
            return 0

        # se acaba, conta ate a devolucao, se ativo, conta ate hoje
        if obj.data_devolucao:
            fim = obj.data_devolucao
        else:
            fim = date.today()
        
        if obj.data_inicio:
            dias = (fim - obj.data_inicio).days
            return dias if dias > 0 else 0
        return 0

    # Calcula valor parcial e valor da multa que será cobrada se houver atraso
    def get_valor_multa_e_parcial(self, obj):   
        hoje = date.today()
        multa = Decimal('0.00') 
        valor_parcial = Decimal('0.00')

        # Garante que temos as datas necessárias
        if obj.data_inicio and obj.data_fim and obj.carro:
            if hoje > obj.data_fim:
                dias_atraso = (hoje - obj.data_fim).days
                multa = dias_atraso * obj.carro.valor_diaria * Decimal('1.2')

            # calcula valor parcial até hoje ou data_fim
            data_limite_contrato = min(hoje, obj.data_fim)
            dias_uso = (data_limite_contrato - obj.data_inicio).days
            
            if dias_uso <= 0:
                dias_uso = 1
                
            valor_parcial = dias_uso * obj.carro.valor_diaria

        return multa, valor_parcial
    
    # Calcula valor parcial atual para exibir
    def get_valor_parcial_atual(self, obj):
        if obj.status == 'cancelado':
            return Decimal('0.00')

        # Se já tiver valor final mostra 
        if obj.valor_final is not None:
            return obj.valor_final
             
        multa, parcial = self.get_valor_multa_e_parcial(obj)
        return multa + parcial

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

        if novo_status == 'finalizado':
            # se for finalizado ou cancelado, impede alteração de certos campos
            campos_para_ignorar = ['carro', 'data_inicio', 'data_fim', 'perfil_cliente']
            for campo in campos_para_ignorar:
                if campo in validated_data:
                    validated_data.pop(campo)
                    
            instance.data_devolucao = date.today()
            multa, valor_parcial = self.get_valor_multa_e_parcial(instance)
            instance.valor_final = valor_parcial + multa

        elif novo_status == 'cancelado':
            instance.valor_final = Decimal('0.00')
            instance.data_devolucao = date.today()
        
        # Realiza a atualização padrão do Django REST Framework
        instance = super().update(instance, validated_data)

        # se o status foi alterado para finalizado, marca o carro como disponível
        if instance.status in ['finalizado', 'cancelado']:
            instance.carro.marcar_como_disponivel() 
        
        return instance