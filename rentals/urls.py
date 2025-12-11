from django.urls import path
from .views import AlugarCarro

urlpatterns = [
    path('alugar/', AlugarCarro.as_view, name ='alugar'),
]