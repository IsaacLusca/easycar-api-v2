from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import viewsets, permissions
from .models import PerfilCliente
from .serializers import PerfilClienteSerializer

# classe para visualizar os perfis dos clientes
class PerfilClienteViewSet(viewsets.ReadOnlyModelViewSet):
    # pega os perfis de clientes
    queryset = PerfilCliente.objects.select_related('user').all()
    # usa o serializador de perfil de cliente
    serializer_class = PerfilClienteSerializer
    permission_classes = [permissions.IsAuthenticated]