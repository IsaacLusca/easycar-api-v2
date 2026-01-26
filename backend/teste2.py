import os
import django
import random
from datetime import date, timedelta

# Configuração do ambiente Django (igual ao seu teste.py)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'easycar.settings')
django.setup()

from django.contrib.auth.models import User
from users.models import PerfilCliente
from cars.models import Carro
from rentals.models import Aluguel

def limpar_banco():
    print("Limpando banco de dados...")
    Aluguel.objects.all().delete()
    Carro.objects.all().delete()
    PerfilCliente.objects.all().delete()
    User.objects.exclude(is_superuser=True).delete() # Mantém apenas o superuser se existir
    print("Banco limpo!")

def criar_carros():
    print("Criando carros...")
    lista_carros = [
        {"modelo": "Toyota Corolla", "placa": "ABC-1234", "ano": 2022, "valor": 200.00},
        {"modelo": "Honda Civic", "placa": "XYZ-5678", "ano": 2023, "valor": 250.00},
        {"modelo": "Fiat Uno", "placa": "UNO-1111", "ano": 2010, "valor": 80.00},
        {"modelo": "Chevrolet Onix", "placa": "ONI-2222", "ano": 2021, "valor": 120.00},
        {"modelo": "Hyundai HB20", "placa": "HBZ-3333", "ano": 2022, "valor": 130.00},
        {"modelo": "Jeep Renegade", "placa": "JEP-4444", "ano": 2024, "valor": 300.00},
        {"modelo": "VW Gol", "placa": "GOL-5555", "ano": 2018, "valor": 90.00},
    ]

    objetos_carro = []
    for dados in lista_carros:
        c = Carro.objects.create(
            modelo=dados['modelo'],
            placa=dados['placa'],
            ano=dados['ano'],
            valor_diaria=dados['valor'],
            status='disponivel'
        )
        objetos_carro.append(c)
    
    print(f"{len(objetos_carro)} carros criados.")
    return objetos_carro

def criar_usuarios_e_perfis():
    print("Criando usuários e perfis...")
    
    # Criar um funcionário padrão
    func = User.objects.create_user('funcionario', 'func@easycar.com', 'senha123')
    func.is_staff = True
    func.save()
    print(f"Funcionário criado: {func.username}")

    # Criar clientes
    clientes_dados = [
        {"nome": "João Silva", "user": "joao", "cnh": "12345678901", "tel": "11999990001"},
        {"nome": "Maria Souza", "user": "maria", "cnh": "12345678902", "tel": "11999990002"},
        {"nome": "Pedro Santos", "user": "pedro", "cnh": "12345678903", "tel": "11999990003"},
        {"nome": "Ana Costa", "user": "ana", "cnh": "12345678904", "tel": "11999990004"},
        {"nome": "Carlos Lima", "user": "carlos", "cnh": "12345678905", "tel": "11999990005"},
    ]

    objetos_perfil = []
    for dados in clientes_dados:
        user = User.objects.create_user(
            username=dados['user'],
            email=f"{dados['user']}@email.com",
            password='123',
            first_name=dados['nome'].split()[0],
            last_name=dados['nome'].split()[1]
        )
        
        perfil = PerfilCliente.objects.create(
            user=user,
            cnh=dados['cnh'],
            telefone=dados['tel'],
            endereco=f"Rua Exemplo, {random.randint(10, 900)}"
        )
        objetos_perfil.append(perfil)

    print(f"{len(objetos_perfil)} clientes criados.")
    return func, objetos_perfil

def criar_alugueis(funcionario, carros, perfis):
    print("Gerando aluguéis aleatórios...")
    
    # Criar alguns aluguéis passados (Finalizados)
    for _ in range(5):
        cliente = random.choice(perfis)
        carro = random.choice(carros)
        
        dias = random.randint(2, 10)
        data_inicio = date.today() - timedelta(days=random.randint(20, 100))
        data_fim = data_inicio + timedelta(days=dias)
        valor_total = dias * float(carro.valor_diaria)

        Aluguel.objects.create(
            perfil_cliente=cliente,
            carro=carro,
            funcionario=funcionario,
            data_inicio=data_inicio,
            data_fim=data_fim,
            valor_total=valor_total,
            status='finalizado'
        )

    # Criar alguns aluguéis ativos (Ativos)
    # Precisamos garantir que o carro mude para 'alugado'
    carros_disponiveis = [c for c in carros] # cópia da lista
    random.shuffle(carros_disponiveis)

    for i in range(2): # Criar 2 aluguéis ativos
        if not carros_disponiveis: break
        
        carro = carros_disponiveis.pop()
        cliente = random.choice(perfis)
        
        dias = random.randint(3, 7)
        data_inicio = date.today()
        data_fim = data_inicio + timedelta(days=dias)
        valor_total = dias * float(carro.valor_diaria)

        Aluguel.objects.create(
            perfil_cliente=cliente,
            carro=carro,
            funcionario=funcionario,
            data_inicio=data_inicio,
            data_fim=data_fim,
            valor_total=valor_total,
            status='ativo'
        )
        
        # Atualizar status do carro
        carro.status = 'alugado'
        carro.save()

    print("Aluguéis gerados com sucesso!")

if __name__ == '__main__':
    try:
        limpar_banco()
        carros = criar_carros()
        funcionario, perfis = criar_usuarios_e_perfis()
        criar_alugueis(funcionario, carros, perfis)
        print("\n--- Processo Finalizado: Banco Populado ---")
    except Exception as e:
        print(f"Erro ao popular banco: {e}")