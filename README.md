# UniSENAI - Sistema de Gestão de Manutenção & Ocorrências de Equipamentos

Sistema web em **React 19 + Next.js (App Router)** com banco de dados **Turso (LibSQL)** e hospedagem na **Vercel**, desenhado sob medida para atender o procedimento operacional padrão do **UniSENAI SP (Campus Sorocaba)**, utilizando como referência estética o projeto `site-mostra`.

---

## 👥 Usuários Demo Disponíveis (Alternância em 1 Clique no Cabeçalho)

1. **Professor Demo: Prof. Carlos Roberto**
   - **Perfil**: Docente & Coordenador Técnico (Atuação nos períodos Diurno e Noturno).
   - **Funcionalidades**: Acesso a ocorrências de todos os períodos (Manhã, Tarde e Noite), cruzamento de reincidências por notebook, identificação da turma/usuário anterior sem conflitos entre turnos e **emissão de Orientações Formais por Escrito** com modelo imprimível para alunos do CAI, CT, CST e FIC.

2. **Aluno Demo: Lucas Silva**
   - **Perfil**: Aluno do Curso Superior de Tecnologia em ADS (Período Noturno).
   - **Funcionalidades**: Botão **"Na Retirada"** (substituto do formulário do Microsoft Forms). Permite ao aluno, ao retirar o notebook da vaga numerada no início da aula, registrar imediatamente avarias pré-existentes (tecla solta, tela trincada, carregador ausente), gerando comprovante oficial que resguarda a turma e notifica os professores.

---

## 🏫 Mapeamento dos Ambientes e Inventário de Equipamentos

| Ambiente | Tipo | Equipamentos & Capacidade |
| :--- | :--- | :--- |
| **Sala 1** | Sala de Aula / Carrinho Móvel | **32 Notebooks** Lenovo ThinkPad E14 (`NOTE-S01-01` a `32`) com vagas numeradas e fontes |
| **Sala 2** | Sala de Aula / Carrinho Móvel | **32 Notebooks** Lenovo ThinkPad E14 (`NOTE-S02-01` a `32`) com vagas numeradas e fontes |
| **Sala 3** | Sala de Aula Teórica | Projetor interativo, lousa e climatização (35 alunos) |
| **Sala 4** | Sala de Aula / Carrinho Móvel | **32 Notebooks** Dell Latitude 3420 (`NOTE-S04-01` a `32`) com vagas numeradas e fontes |
| **Sala 5** | Sala de Aula / Carrinho Móvel | **32 Notebooks** Dell Latitude 3420 (`NOTE-S05-01` a `32`) com vagas numeradas e fontes |
| **Informática 4** | Laboratório de Computação | **21 Computadores Desktop** Core i7, 32GB RAM (`PC-INF4-01` a `21`) |
| **Laboratório CNC** | Laboratório de Mecânica | **21 Computadores** CAD/CAM (`PC-CNC-01` a `21`) e máquinas de usinagem CNC |
| **Laboratório de Projetos** | Laboratório Maker & Eletrônica | **10 Computadores** (`PC-PROJ-01` a `10`) + **Multímetros Digitais Minipa/Hikari** + **Fontes de Bancada DC Ajustáveis** + **Caixas de Kits Didáticos Arduino/ESP32** |

---

## 🎯 Solução para o Acompanhamento entre Períodos (Diurno x Noturno)

> *"A proposta é simples: sempre que um aluno retirar um equipamento e identificar alguma irregularidade, deverá registrar a ocorrência, informando o número do notebook, a sala, a turma e o problema encontrado.*
> *É importante que os professores de todos os períodos tenham acesso aos registros, permitindo acompanhar as ocorrências, identificar reincidências e, quando possível, verificar os responsáveis. Dessa forma, poderemos realizar orientações formais, inclusive por escrito, tanto para alunos do CAI/CT/FIC quanto do CST.*
> *Quero destacar que a intenção não é colocar os professores do período diurno contra os do noturno, tampouco atribuir responsabilidades de forma generalizada. Pelo contrário, precisamos encontrar um denominador comum e estabelecer um procedimento de trabalho que atenda adequadamente a todos os usuários da escola."*

### Como o sistema atende esse procedimento:
1. **Fim do registro informal / Substituto do Forms**: O aluno clica em **"Na Retirada"**, seleciona sua sala (1, 2, 4 ou 5) e o número do notebook (1 a 32), assinala o problema e envia em menos de 30 segundos.
2. **Rastreabilidade sem atrito**: O sistema cruza quem usou o notebook anteriormente (Ex: Turma da tarde do CAI Usinagem x Turma da noite do CST ADS), permitindo que os professores identifiquem a origem real do dano.
3. **Emissão de Orientação Formal por Escrito**: O professor abre o chamado na aba **"Acompanhamento (Turnos)"** e gera com 1 clique o **Termo de Orientação Pedagógica Formal**, pronto para impressão e assinatura de representantes de turma ou alunos envolvidos.

---

## 🚀 Como Executar Localmente

1. Entre na pasta:
   ```bash
   cd c:\projetos\unisenai\manutencao-unisenai
   ```

2. Inicie o servidor:
   ```bash
   npm run dev
   ```

3. Abra no navegador: **[http://localhost:3000](http://localhost:3000)**

*Em desenvolvimento local sem variáveis de ambiente, o sistema utiliza automaticamente o banco local SQLite (`local.db`) pré-populado com os 128 notebooks, 52 computadores, multímetros, fontes e kits didáticos.*

---

## ☁️ Deploy na Vercel com Turso Database

1. Crie seu banco no Turso:
   ```bash
   turso db create unisenai-manutencao
   turso db show --url unisenai-manutencao
   turso db tokens create unisenai-manutencao
   ```
2. Na [Vercel](https://vercel.com), importe o repositório e configure em **Environment Variables**:
   - `TURSO_DATABASE_URL`: `libsql://unisenai-manutencao.turso.io`
   - `TURSO_AUTH_TOKEN`: seu token de autenticação
3. Deploy imediato com suporte a Serverless Edge Handlers!
