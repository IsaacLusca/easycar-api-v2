from django.db import models
from django.contrib.auth.models import User
from users.models import PerfilCliente
from cars.models import Carro

class Aluguel(models.Model):
    # related_name serve para facilitar o acesso reverso
    perfil_cliente = models.ForeignKey(PerfilCliente, on_delete=models.CASCADE, related_name='alugueis')
    carro = models.ForeignKey(Carro, on_delete=models.PROTECT, related_name='alugueis')
    funcionario = models.ForeignKey(User, on_delete=models.PROTECT, related_name='alugueis_registrados')
    
    data_inicio = models.DateField()
    data_fim = models.DateField()
    valor = models.DecimalField(max_digits=10, decimal_places=2)

    STATUS_CHOICES = [
        ('ativo', 'Ativo'),
        ('finalizado', 'Finalizado'),
        ('cancelado', 'Cancelado'),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ativo')

    def __str__(self):
        return f"Aluguel {self.id} - {self.carro.modelo}"