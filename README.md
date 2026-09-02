# SupplyPilot

## Description

Один імпорт списку замовлень — і закупівля на завтра готова. SupplyPilot розкладає страви на інгредієнти, рахує, чого бракує, і формує кошик у «Сільпо» через офіційний MCP-сервер. Рішення, що справді потребують людини, залишаються людині.

Наше рішення надає прогноз замовлення - того, що може знадобитись людині прямо тут і зараз, враховуючи її поведінку та контекст,
формує рекомендоване замовлення, яке можна редагувати або створити нове, і робить замовлення на вашу улюблену адресу.
Щоб розуміти краще розуміти самого себе - кожен з учасників проекту може побачити спільні історію покупок та статистику.

Щоб не губитись у різних контекстах, ми надаємо можливість створити проєкт - для власного типу замовлень та компанії, з якою робитимете замовлення. Кожен із колег зможе записати у проект що йому треба, і на основі цього прийняти найкраще рішення для команди.

## Technical stack

- Bun
- Next.js
- PostgreSQL
- Drizzle ORM
- Vercel AI SDK
- TailwindCSS v4
- Shadcn/ui

## Getting Started

First, install the dependencies:

```bash
bun install
```

Then, run the development server:

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load Google Fonts.

## Migrating the database

First, create a migration:

```bash
bun run db:generate
```

then, apply the migrations:

```bash
bun run db:migrate # add :prod to migrate production DB from .env.production
```
