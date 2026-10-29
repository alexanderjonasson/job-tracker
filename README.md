# Job Tracker

🚧 **Work in progress**

A web app for keeping track of job applications: company, role, link, status (Applied → Interview → Offer / Rejected) and notes. I'm building it to learn full-stack development with Next.js, a database and Docker, and I use it myself while I'm looking for a job.

By [Alexander Jonasson](https://github.com/alexanderjonasson).

## Planned features

- Add, edit and delete job applications
- Track the status of each application
- Notes for each application
- Filter applications by status

## Tech stack

- Next.js (App Router) with TypeScript
- Tailwind CSS
- PostgreSQL
- Docker and Docker Compose

## Progress

- [x] Next.js project with TypeScript and Tailwind
- [x] PostgreSQL running in Docker
- [ ] Database schema
- [ ] List, add, edit and delete applications
- [ ] Run the whole app with Docker Compose

## Getting started

You need Node.js and Docker Desktop.

```bash
npm install
cp .env.example .env
docker compose up -d
npm run dev
```

Set your own password in `.env`, then open [http://localhost:3000](http://localhost:3000).
