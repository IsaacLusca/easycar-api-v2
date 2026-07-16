# EasyCar Fullstack v2

Sistema fullstack para gerenciamento de aluguéis de carros, clientes e operações administrativas.

## Tecnologias

### Backend
- Python / Django 6 / Django REST Framework
- PostgreSQL (produção) / SQLite (desenvolvimento local)
- DRF Spectacular (documentação automática da API)

### Frontend
- React 19 + Vite
- Docker

## Estrutura

```
easycar-api-v2/
├── backend/       # API Django REST
│   ├── cars/      # App de carros
│   ├── rentals/   # App de aluguéis
│   ├── users/     # App de usuários
│   └── easycar/   # Configurações do Django
├── frontend/      # App React + Vite
└── docker-compose.yml
```

## Rodar com Docker (recomendado)

```bash
docker-compose up --build
```

- Backend: http://localhost:8000
- Frontend: http://localhost:5173
- Documentação da API: http://localhost:8000/api/docs/
- PgAdmin: http://localhost:5050 (admin@admin.com / admin)

## Rodar sem Docker

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate   # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Funcionalidades

- Autenticação e autorização por perfil (clientes e funcionários)
- CRUD de clientes, carros e aluguéis
- Regras de negócio para aluguel
- Endpoints REST documentados
- Integração frontend + API

## Deploy

- **Frontend:** https://easycar-api-v2.vercel.app
- **Backend:** https://easycar-api.onrender.com
- **Documentação da API:** https://easycar-api.onrender.com/api/docs/
- **Admin:** https://easycar-api.onrender.com/admin/

### Usuários de teste

| Usuário | Senha | Perfil |
|---------|-------|--------|
| admin | 123 | Funcionário |
| joao | 123 | Cliente |
| maria | 123 | Cliente |

## Autor

Isaac Lucas Souza Bezerra
