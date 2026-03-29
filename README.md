
# Church Members (MVP)

Aplicação Angular para controle inicial de membros da igreja, focada em validação funcional com uso interno.

## Objetivo desta versão

Esta primeira versão foi construída para:
- cadastrar membros
- visualizar lista com ordenação e filtro por data
- visualizar familiares em modal
- remover membro com confirmação

Sem autenticação e sem backend persistente nesta fase, para validar fluxo e usabilidade rapidamente.

## Stack atual

- Angular 21
- TypeScript
- TailwindCSS
- NG-ZORRO (componentes de UI)
- RxJS (`BehaviorSubject`) para estado em memória

## Funcionalidades implementadas

### 1. Cadastro de membros
Rota: `/members/create`

Campos:
- Nome completo
- E-mail
- Data de nascimento
- Família (select com busca e seleção múltipla)

Regras:
- Nome obrigatório (mínimo 3 caracteres)
- E-mail válido
- Data obrigatória
- Ao selecionar familiares no cadastro, o vínculo é atualizado dos dois lados

### 2. Tabela de membros
Rota principal: `/home`

Recursos:
- Ordenação por nome, e-mail e aniversário
- Filtro por data de referência
- Reset de filtros
- Ação de família por linha:
	- abre modal com a lista de familiares do membro
	- modal com controle de overflow vertical e horizontal

### 3. Remoção de membros
Rota: `/members/delete`

Fluxo:
- Pode receber nome por query param ao clicar em `Delete` na tabela
- Exibe confirmação antes de remover
- Remove apenas o membro selecionado
- Também remove o nome dele da família dos outros membros

## Rotas atuais

- `/home`
- `/members/create`
- `/members/delete`

## Estado atual de dados

Atualmente os dados ficam em memória no serviço `GetMembers`:
- não persistem após reload da página
- ideal para MVP de validação com usuário final

## Como rodar localmente

Pré-requisito:
- Node.js + npm

Instalação:
```bash
npm install
```

Execução:
```bash
npm run start
```

A aplicação sobe em:
- `http://localhost:4200`

## Scripts disponíveis

```bash
npm run start
npm run build
npm run test
npm run watch
```

## Limitações desta versão (MVP)

- Sem autenticação/autorização
- Sem backend dedicado
- Sem banco persistente
- Sem auditoria de alterações

## Próxima evolução 

Opção A:
- Supabase (Postgres + Auth + RLS)

Opção B (perfil backend):
- API Java (Spring Boot) + banco relacional

Recomendado para próxima etapa:
1. adicionar `id` único para membros
2. persistir dados em banco
3. autenticação básica (usuário pastor)
4. controle de acesso por rota/operação
5. logs/auditoria mínima de alterações

## Status

MVP funcional para demonstração e coleta de feedback.
