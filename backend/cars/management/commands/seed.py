from django.core.management.base import BaseCommand
from django.contrib.auth.models import User, Group
from cars.models import Carro
from users.models import PerfilCliente
from rentals.models import Aluguel
from datetime import date, timedelta

class Command(BaseCommand):
    help = "Popula o banco com dados de exemplo"

    def handle(self, *args, **options):
        self.stdout.write("Criando dados de exemplo...")

        # Cria grupos
        Group.objects.get_or_create(name="clientes")
        Group.objects.get_or_create(name="funcionarios")

        # Cria funcionario (staff)
        if not User.objects.filter(username="admin").exists():
            admin = User.objects.create_superuser("admin", "admin@email.com", "123")
            admin.first_name = "Admin"
            admin.save()
            grupo_func = Group.objects.get(name="funcionarios")
            admin.groups.add(grupo_func)
            self.stdout.write(f"  Admin: admin / 123")

        # Cria cliente
        if not User.objects.filter(username="joao").exists():
            user = User.objects.create_user("joao", "joao@email.com", "123")
            user.first_name = "Joao"
            user.save()
            grupo_cli = Group.objects.get(name="clientes")
            user.groups.add(grupo_cli)
            PerfilCliente.objects.get_or_create(
                user=user,
                defaults={
                    "cnh": "12345678901",
                    "telefone": "61999999999",
                    "endereco": "Qd 01 Lt 01, Gama - DF",
                },
            )
            self.stdout.write(f"  Cliente: joao / 123")

        if not User.objects.filter(username="maria").exists():
            user = User.objects.create_user("maria", "maria@email.com", "123")
            user.first_name = "Maria"
            user.save()
            grupo_cli = Group.objects.get(name="clientes")
            user.groups.add(grupo_cli)
            PerfilCliente.objects.get_or_create(
                user=user,
                defaults={
                    "cnh": "98765432101",
                    "telefone": "61888888888",
                    "endereco": "CL 02 Bloco A, Taguatinga - DF",
                },
            )
            self.stdout.write(f"  Cliente: maria / 123")

        # Cria carros
        carros_data = [
            ("Fiat Uno", "ABC1A23", 2018, 80.00),
            ("VW Gol", "DEF2B34", 2020, 90.00),
            ("Chevrolet Onix", "GHI3C45", 2022, 110.00),
            ("Toyota Corolla", "JKL4D56", 2023, 200.00),
            ("Honda Civic", "MNO5E67", 2024, 220.00),
            ("Ford Ka", "PQR6F78", 2019, 85.00),
        ]

        carros = []
        for modelo, placa, ano, valor in carros_data:
            carro, created = Carro.objects.get_or_create(
                placa=placa,
                defaults={
                    "modelo": modelo,
                    "ano": ano,
                    "valor_diaria": valor,
                    "status": "disponivel",
                },
            )
            if created:
                carros.append(carro)
                self.stdout.write(f"  Carro: {modelo} ({placa})")

        # Cria alugueis de exemplo
        admin = User.objects.get(username="admin")
        joao_perfil = PerfilCliente.objects.get(user__username="joao")

        if not Aluguel.objects.exists():
            carros_disponiveis = Carro.objects.filter(status="disponivel")[:2]
            for i, carro in enumerate(carros_disponiveis):
                inicio = date.today() - timedelta(days=7 * (i + 1))
                fim = inicio + timedelta(days=3)
                Aluguel.objects.create(
                    perfil_cliente=joao_perfil,
                    carro=carro,
                    funcionario=admin,
                    data_inicio=inicio,
                    data_fim=fim,
                    status="finalizado" if fim < date.today() else "ativo",
                )
            self.stdout.write(f"  Alugueis de exemplo criados")

        self.stdout.write(self.style.SUCCESS("Banco populado com sucesso!"))
