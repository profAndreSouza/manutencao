# UniSENAI - Sistema de Gestão de Manutenção & Incidentes

Sistema completo em **React (Next.js App Router)** integrado com banco de dados **Turso (LibSQL)** e preparado para deploy instantâneo na **Vercel**, desenvolvido com a identidade visual e padrão estético do **UniSENAI SP (Campus Sorocaba)**, referenciada a partir do projeto `site-mostra`.

---

## 🚀 Tecnologias

- **Frontend & Backend**: React 19 + Next.js (App Router com Serverless Route Handlers)
- **Banco de Dados**: [Turso](https://turso.tech) (SQLite distribuído na edge via `@libsql/client`) com fallback automático para SQLite local (`file:local.db`)
- **Estilização**: Tailwind CSS com paleta institucional UniSENAI (Vermelho SENAI `#b91c1c`, neutros limpos, badges operacionais e tipografia Inter/Space Grotesk)
- **Ícones**: Lucide React
- **Hospedagem**: Vercel (zero-configuração)

---

## 🎯 Principais Funcionalidades

### 1. 💻 Foco Especial em Notebooks (Carrinhos Móveis e Reserva Docente)
- **Gestão por Carrinho**: Visualização organizada por Carrinho A (Lab Informática), Carrinho B (Maker) e Armário Docente.
- **Rastreamento de Hardware**:
  - Patrimônio SENAI individual (`NOTE-SEN-XXXX`)
  - Vaga / Slot no carrinho móvel
  - Marca, modelo, processador, memória RAM e SSD
  - Identificação de tag da fonte/carregador (`FNT-SEN-XXXX`)
  - **Saúde da bateria** (% com alerta visual de desgaste)
- **Abertura Expressa**: Botão de 1 clique para abrir chamado já pré-preenchendo a vaga e o patrimônio do notebook.
- **Matriz de Status**: Modos de exibição em **Grade de Slots** ou **Tabela detalhada**.

### 2. 🚨 Registro e Ciclo de Vida de Incidentes (Chamados)
- **Presets de 1 clique** para falhas recorrentes:
  - Bateria não carrega / estufada
  - Teclado com teclas travando
  - Tela LCD trincada / com linha vertical
  - Carregador com mau contato
  - Lentidão / reinstalação de SO
  - Projetor sem sinal HDMI / ar-condicionado pingando água
- **Classificação por Severidade**: Crítica (com alerta pulsante), Alta, Média e Baixa.
- **Painel de Atendimento Técnico**:
  - Mudança de status (*Aberto*, *Em Análise*, *Em Atendimento*, *Aguardando Peça*, *Resolvido*, *Fechado*).
  - Atribuição de técnico responsável.
  - Laudo técnico e peças de reposição trocadas.
  - Linha do tempo de histórico de intervenções com auditoria de data e autor.
  - Ao marcar como **Resolvido**, o status do equipamento/notebook retorna automaticamente para **Disponível**.

### 3. 🏫 Salas de Aula & Laboratórios
- Monitoramento de ambientes (Laboratórios de Informática 01 e 02, Lab Maker, Mecatrônica, Salas de Aula e Auditório Principal).
- Alertas de interdição e chamados pendentes por sala.

### 4. 🛠️ Equipamentos Gerais
- Controle de impressoras 3D, projetores laser, aparelhos de ar-condicionado e switches de rede.

### 5. 📊 Indicadores e Exportação
- KPIs de disponibilidade de frota (ex: 94.2% disponível).
- Relatórios em **CSV** com suporte a Excel (UTF-8 BOM).

---

## 🛠️ Como Executar Localmente

1. Navegue até a pasta do projeto:
   ```bash
   cd manutencao-unisenai
   ```

2. Instale as dependências (se ainda não tiver instalado):
   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

4. Abra no navegador: [http://localhost:3000](http://localhost:3000)

*Nota: Em ambiente local, se as variáveis do Turso não estiverem configuradas, o sistema inicializa automaticamente um banco SQLite local (`file:local.db`) e popula dados reais de exemplo (notebooks, salas e chamados).*

---

## ☁️ Como Configurar o Turso Database

1. Crie uma conta gratuita em [https://turso.tech](https://turso.tech)
2. Crie um banco de dados:
   ```bash
   turso db create unisenai-manutencao
   ```
3. Obtenha a URL de conexão:
   ```bash
   turso db show --url unisenai-manutencao
   # Exemplo: libsql://unisenai-manutencao-andre.turso.io
   ```
4. Gere o token de autenticação:
   ```bash
   turso db tokens create unisenai-manutencao
   ```
5. Crie um arquivo `.env.local` na raiz com:
   ```env
   TURSO_DATABASE_URL=libsql://unisenai-manutencao-andre.turso.io
   TURSO_AUTH_TOKEN=seu_token_jwt_aqui
   ```

---

## ▲ Deploy na Vercel

1. Envie o código para o seu repositório Git (GitHub/GitLab).
2. Na [Vercel](https://vercel.com), clique em **Add New Project** e selecione o repositório `manutencao-unisenai`.
3. Em **Environment Variables**, adicione:
   - `TURSO_DATABASE_URL`: URL do seu banco Turso
   - `TURSO_AUTH_TOKEN`: Token gerado pelo Turso
4. Clique em **Deploy**. A Vercel detectará o Next.js automaticamente e fará o deploy com funções Serverless na Edge!
