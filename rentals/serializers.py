from rest_framework import serializers
from .models import Aluguel
from django.contrib.auth.models import User

class AluguelSerializer(serializers.ModelSerializer):
    valor_total = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    funcionario_nome = serializers.CharField(source='funcionario.username', read_only=True)
    cliente_nome = serializers.CharField(source='perfil_cliente.user.username', read_only=True)
    funcionario = serializers.PrimaryKeyRelatedField(queryset= User.objects.filter(groups__name='Funcionários'))
    status = serializers.CharField(read_only = True)
    carro_modelo= serializers.CharField(source='carro.modelo', read_only=True)
    carro_placa= serializers.CharField(source='carro.placa', read_only=True)

    class Meta:
        model = Aluguel
        fields = ['id', 'perfil_cliente', 'cliente_nome', 'carro', 'carro_modelo', 'carro_placa','funcionario', 'funcionario_nome', 'data_inicio', 'data_fim', 'valor_total', 'status']

    def validate(self, aluguel):
        data_inicio = aluguel["data_inicio"]
        data_fim = aluguel["data_fim"]

        if data_inicio and data_fim:
            if data_fim < data_inicio:
                raise serializers.ValidationError({
                    "data_fim": "A data de fim não pode ser menor que a data de início."
                })

        if aluguel["carro"] and data_inicio and data_fim:
            conflito = Aluguel.objects.filter(
            carro= aluguel["carro"],
            data_inicio__lte=data_fim,
            data_fim__gte=data_inicio
        )
            if self.instance:
                conflito = conflito.exclude(id=self.instance.id)

            if conflito.exists():
                raise serializers.ValidationError({
                "carro": "Este carro já está alugado nesse período."
            })

        return aluguel


