from django.db import models
from django.contrib.auth.models import User
from users.models import PerfilCliente
from cars.models import Carro
from datetime import date
from decimal import Decimal

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

    # Calcula valor parcial e valor da multa de forma centralizada
    def calcular_pendencias(self):
        hoje = date.today()
        # Se já devolveu, usa a data da devolução, senão usa hoje
        data_base = self.data_devolucao if self.data_devolucao else hoje
        
        multa = Decimal('0.00') 
        valor_parcial = Decimal('0.00')

        # Garante que temos as datas necessárias
        if self.data_inicio and self.data_fim and self.carro:
            if data_base > self.data_fim:
                dias_atraso = (data_base - self.data_fim).days
                multa = dias_atraso * self.carro.valor_diaria * Decimal('1.2')

            # calcula valor parcial até hoje ou data_fim
            data_limite_contrato = min(data_base, self.data_fim)
            dias_uso = (data_limite_contrato - self.data_inicio).days
            
            if dias_uso <= 0:
                dias_uso = 1
                
            valor_parcial = dias_uso * self.carro.valor_diaria

        return multa, valor_parcial

    def save(self, *args, **kwargs):
        # Calcula valor_total se não estiver definido
        if self.data_inicio and self.data_fim and self.carro and not self.valor_total:
            dias = (self.data_fim - self.data_inicio).days
            if dias <= 0:
                dias = 1
            
            self.valor_total = dias * self.carro.valor_diaria

        # se tiver devolucao real e valor final ainda não existir, calcula automaticamente
        if self.data_devolucao and self.carro and self.valor_final is None:
            multa, parcial = self.calcular_pendencias()
            self.valor_final = parcial + multa

        super().save(*args, **kwargs)

        # Atualiza status do carro
        if self.status == 'ativo':
            self.carro.marcar_como_alugado()
        else:
            self.carro.marcar_como_disponivel()

    def __str__(self):
        return f"Aluguel {self.id} - {self.carro.modelo}"