from rest_framework import serializers
from .models import Aluguel
from django.contrib.auth.models import User
from cars.models import Carro
from datetime import date
from decimal import Decimal
from django.core.exceptions import ValidationError as DjangoValidationError # Importe isso

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
    
    # Calcula valor parcial atual para exibir
    def get_valor_parcial_atual(self, obj):
        if obj.status == 'cancelado':
            return Decimal('0.00')

        # Se já tiver valor final mostra 
        if obj.valor_final is not None:
            return obj.valor_final
             
        multa, parcial = obj.calcular_pendencias()
        return multa + parcial

    # metodo para tratar erros de validação do modelo
    def create(self, validated_data):
        try:
            return super().create(validated_data)
        except DjangoValidationError as e:
            # Converte erro do Django para erro da API
            raise serializers.ValidationError(e.message_dict)

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

        elif novo_status == 'cancelado':
            instance.valor_final = Decimal('0.00')
            instance.data_devolucao = date.today()
        
        # Realiza a atualização padrão do Django REST Framework com tratamento de erro
        try:
            instance = super().update(instance, validated_data)
        except DjangoValidationError as e:
            raise serializers.ValidationError(e.message_dict)

        # se o status foi alterado para finalizado, marca o carro como disponível
        if instance.status in ['finalizado', 'cancelado']:
            instance.carro.marcar_como_disponivel() 
        
        return instance