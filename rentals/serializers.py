from rest_framework import serializers
from .models import Aluguel

class AluguelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Aluguel
        fields = ['id', 'perfil_cliente', 'carro', 'funcionario', 'data_inicio', 'data_fim', 'valor_total','status']