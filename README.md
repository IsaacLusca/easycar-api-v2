# 📦 EasyCar Fullstack v2

## 📝 Projeto

**Origem:** Projeto acadêmico em equipe (IFB – Campus Gama)  
**Evolução:** Continuação e expansão **individual** a partir do projeto original

Este repositório representa a **evolução do projeto EasyCar**, originalmente desenvolvido em equipe, com foco em:
- melhoria das regras de negócio do backend
- refinamento da arquitetura da API
- integração com um frontend web

---

## 👤 Autoria

Projeto original desenvolvido em equipe.  
**Evoluções, novas funcionalidades e integrações desenvolvidas por:**  
- Isaac Lucas Souza Bezerra

---

## 📌 Descrição

O **EasyCar** é um sistema para gerenciamento de **aluguéis de carros**, **clientes** e **operações administrativas**.

Nesta versão evoluída:
- o backend em **Django REST Framework** foi aprimorado
- novas regras de negócio foram implementadas
- o projeto passou a ser **fullstack**, com integração frontend + API
- foco em código mais limpo, organização e escalabilidade

---

## 🛠 Tecnologias Utilizadas

### Backend
- **Python**
- **Django**
- **Django REST Framework**
- **SQLite** (ambiente de desenvolvimento)

### Frontend
- (em desenvolvimento / a definir conforme evolução)

---

## ✅ Funcionalidades

- Autenticação e autorização de usuários
- Controle de acesso por perfil (clientes e funcionários)
- CRUD completo de:
  - Clientes
  - Carros
  - Aluguéis
- Regras de negócio aprimoradas para aluguel
- Endpoints REST organizados e documentados
- Integração com frontend
- Documentação automática da API

---

## 📂 Estrutura do Projeto

- usuários e perfis
- carros
- aluguéis
- autenticação e permissões
- API REST
- integração frontend
- documentação

---

## 🖼 Diagramas

Diagramas herdados do projeto original e utilizados como base conceitual:

- **MER (Modelo Entidade-Relacionamento)**  
  Representação conceitual das entidades e relacionamentos.  
  [📄 MER (PDF)](MER%20EasyCar.pdf)

- **DER (Diagrama Entidade-Relacionamento)**  
  Diagrama lógico com cardinalidades e chaves.  
  ![DER](DER%20EasyCar.jpeg)

---

## ⚙️ Preparando o Ambiente

### 1. Clonar o repositório

```
git clone https://github.com/seu-usuario/easycar-fullstack.git  
cd easycar-fullstack
```

### 2. Criar e ativar ambiente virtual

```
python -m venv .venv  
source .venv/bin/activate   # Linux/Mac  
.venv\Scripts\activate      # Windows
```

### 3. Instalar dependências

```
pip install -r requirements.txt
```

### 4. Aplicar migrações

```
python manage.py makemigrations  
python manage.py migrate
```

### 5. Rodar o servidor

```
python manage.py runserver
```

---

## 📚 Documentação da API

A API REST é documentada com **DRF Spectacular**.

Após iniciar o servidor, acesse:

- ` http://localhost:8000/api/docs/ `

A documentação apresenta todos os endpoints, métodos HTTP, parâmetros e respostas disponíveis.
