import os
import django

# configuracoes
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "easycar.settings")
django.setup()

from django.contrib.auth.models import User
from users.serializers import UserSerializer

# remove 
User.objects.filter(username='aranha').delete()

# cria
usuario = User.objects.create_user(username='aranha', password='senha123', is_active=True)

# atualiza a senha com o serializer 
dados_para_update = {'senha': 'nova_senha123'}
serializer = UserSerializer(usuario, data=dados_para_update, partial=True)

if serializer.is_valid():
    serializer.save()
else:
    print("Erro:", serializer.errors)

# recarrega dados do banco
usuario.refresh_from_db()

# verifica senhas
senha_antiga_esta_correta = usuario.check_password('senha123')
senha_nova_esta_correta = usuario.check_password('nova_senha123')

print("senha antiga correta?", senha_antiga_esta_correta)  
print("senha nova correta?", senha_nova_esta_correta)      
