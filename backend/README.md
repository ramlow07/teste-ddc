# Desafio Técnico Full-Stack

Olá! Seja bem-vindo(a) ao nosso desafio técnico. Este projeto foi cuidadosamente preparado para simular um ambiente real, com um backend parcialmente funcional que precisa da sua ajuda para ganhar vida.

O objetivo principal não é apenas entregar um produto final, mas sim entender sua linha de raciocínio, sua capacidade de resolver problemas e suas decisões técnicas ao longo do caminho, o teste não tem uma conclusão, é apenas um ponto de partida para uma conversa técnica, e seu raciocínio e a forma como lida com problemas são mais importantes que o resultado final.

## 🎯 O Objetivo

Seu desafio é construir a parte que falta da aplicação (o frontend), configurar o ambiente completo (banco de dados e backend) e entregar uma solução funcional rodando localmente.

O produto final deve ser uma aplicação completa onde o frontend consome as rotas de CRUD e de analytics disponibilizadas pelo backend, com o banco de dados devidamente populado e o ambiente totalmente "dockerizado".

## 💻 O Ponto de Partida

Você está recebendo:
* Um **backend em NestJS** com algumas funcionalidades prontas, mas com espaço para melhorias. Ele contém as rotas de negócio e algumas queries de analytics propositalmente lentas.
* Um **schema de banco de dados Prisma** e um **script de seed** para popular a base com um volume considerável de dados.
* A configuração do **Docker** para orquestrar os serviços.

## ✅ Suas Tarefas

Sua missão, caso decida aceitar, envolve as seguintes etapas:

1.  **Configuração do Ambiente (Setup):**
    * Orquestrar e rodar toda a aplicação (backend, frontend e banco de dados) utilizando Docker.
    * Garantir que o banco de dados PostgreSQL seja iniciado corretamente.
    * Executar o script de seed (`npm run seed` no container do backend) para popular o banco de dados com milhões de registros.

2.  **Desenvolvimento do Frontend:**
    * Criar uma nova aplicação **Frontend** do zero. Recomendamos o uso de **Next.js com TypeScript e Tailwind CSS**, mas você tem a liberdade para escolher as ferramentas que julgar mais adequadas.
    * Desenvolver as telas necessárias para consumir e exibir os dados das rotas de CRUD do backend.
    * Criar uma tela ou um "dashboard" para exibir os dados provenientes da rota de analytics.
    * Implementar uma interface minimamente agradável e funcional para o usuário.

3.  **Melhorias e Testes no Backend:**
    * Analisar o código do backend e identificar pontos de melhoria (performance, estrutura, boas práticas, etc.).
    * **Escrever testes unitários** para as rotas e serviços existentes, garantindo a confiabilidade do código. A ferramenta é Jest, que já está configurada.
    * Otimizar as queries lentas, se encontrar uma maneira eficiente de fazê-lo.
    * Implementar quaisquer outras melhorias que você considere importantes, como tratamento de erros, logging ou validação de dados.

## 🛠️ Ferramentas

Você tem total liberdade para usar quaisquer bibliotecas, frameworks, IAs ou ferramentas que auxiliem na conclusão do desafio, desde que você entenda o que está fazendo. O backend já usa NestJS, Prisma e PostgreSQL.

## 🧠 Critérios de Avaliação: O Mais Importante

Entenda que este desafio é uma ferramenta para iniciarmos uma conversa técnica aprofundada.

* **O teste é individual.** Queremos avaliar a sua forma de trabalhar.
* **O código é importante, mas seu raciocínio é crucial.** O resultado final será analisado, mas o mais importante será a **entrevista técnica pós-teste**.
* **Esteja preparado(a) para explicar o que você fez, porquê fez, e qual raciocínio você seguiu.** Queremos ouvir sobre suas decisões:
    * Por que escolheu determinada biblioteca ou abordagem?
    * Quais foram as maiores dificuldades que encontrou e como as superou?
    * O que você mudaria no projeto se tivesse mais tempo?
    * Como você justifica as otimizações (ou a falta delas) que aplicou?

O objetivo final é avaliar sua capacidade de aprender, adaptar-se e, acima de tudo, articular suas decisões técnicas de forma clara e coerente.

Boa sorte e divirta-se! Estamos ansiosos para ver sua solução.