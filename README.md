
# 📦 EasyCar

## 📝 Projeto Integrador  
**Curso:** Desenvolvimento de Software com Formação BackEnd - Python com Django  
**Instituição de Ensino:** IFB (Instituto Federal de Brasília) - Campus Gama 

---

## 👥 Membros do Projeto
- Isaac Lucas Souza Bezerra  
- Júlia Belo Alves  
- Maria Luiza Antunes de Oliveira  
- Marina Márcia Costa de Souza  
- Matheus Fernandes de Abreu  

---

## 📌 Descrição

Este projeto implementa um sistema para gerenciar **aluguéis de carros**, **perfis de clientes** e **operações internas de funcionários**.  
A aplicação é desenvolvida em **Django**, utilizando **SQLite** como banco de dados.

Além da implementação, o projeto inclui **documentação completa do modelo de dados**, com **MER (Modelo Entidade-Relacionamento)** e **DER (Diagrama Entidade-Relacionamento)** para facilitar a compreensão da estrutura do sistema.

---

## 🛠 Tecnologias Utilizadas

- **Python**
- **Django**
- **SQLite**

---

## ✅ Funcionalidades Principais

- Autenticação de usuários
- Controle de acesso baseado em grupos (**Funcionários** e **Clientes**)
- CRUD para:
  - Clientes
  - Carros
  - Aluguéis
- Consultas específicas por usuário
- Documentação com **MER** e **DER**

---

## 📂 Estrutura do Projeto

- **usuários e perfis**
- **carros**
- **aluguéis**
- **autenticação e permissões**
- **documentação (incluindo MER e DER)**

---

## 🖼 Diagramas

O projeto inclui:

- **MER (Modelo Entidade-Relacionamento)**  
  Representação conceitual das entidades, atributos e relacionamentos do sistema.
  [📄 Clique aqui para abrir o MER (PDF)](MER%20EasyCar.pdf)

- **DER (Diagrama Entidade-Relacionamento)**  
  Diagrama visual com cardinalidades, chaves primárias e estrangeiras, seguindo boas práticas de modelagem.
  ![DER](DER%20EasyCar.jpeg)

---

## ⚙️ Preparando ambiente

### 1. Clonar o repositório

```
git clone https://github.com/IsaacLusca/projeto-integrador-easycar.git
cd projeto-integrador-easycar
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

### 4. Migrações do Banco de Dados

```
python manage.py makemigrations
python manage.py migrate
```


### 5. Rodar o servidor

```
python manage.py runserver
```
