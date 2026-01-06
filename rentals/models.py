from django.db import models
from django.contrib.auth.models import User
from users.models import PerfilCliente
from cars.models import Carro
from datetime import date

class Aluguel(models.Model):
    # related_name serve para facilitar o acesso reverso
    perfil_cliente = models.ForeignKey(PerfilCliente, on_delete=models.CASCADE, related_name='alugueis')
    carro = models.ForeignKey(Carro, on_delete=models.PROTECT, related_name='alugueis')
    funcionario = models.ForeignKey(User, on_delete=models.PROTECT, related_name='alugueis_registrados')
    
    data_inicio = models.DateField()
    data_fim = models.DateField()
    valor_total = models.DecimalField(max_digits=10, decimal_places=2)

    # data e valor final
    data_devolucao = models.DateField(null=True, blank=True)
    valor_final = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    STATUS_CHOICES = [
        ('ativo', 'Ativo'),
        ('finalizado', 'Finalizado'),
        ('cancelado', 'Cancelado'),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ativo')

    def save(self, *args, **kwargs):
        # Calcula valor_total se não estiver definido
        if self.data_inicio and self.data_fim and self.carro and not self.valor_total:
            dias = (self.data_fim - self.data_inicio).days
            if dias <= 0:
                dias = 1
            
            self.valor_total = dias * self.carro.valor_diaria

        # se tiver devolucao real, calcula valor final
        if self.data_devolucao and self.carro:
            dias_reais = (self.data_devolucao - self.data_inicio).days
            if dias_reais <= 0:
                dias_reais = 1       

            self.valor_final = dias_reais * self.carro.valor_diaria

        super().save(*args, **kwargs)

        # Atualiza status do carro
        if self.status == 'ativo':
            self.carro.marcar_como_alugado()
        else:
            self.carro.marcar_como_disponivel()

    def __str__(self):
        return f"Aluguel {self.id} - {self.carro.modelo}"