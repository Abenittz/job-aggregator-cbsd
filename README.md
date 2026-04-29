# 🚀 LinkHire Monorepo

A **production-grade monorepo** built using **TurboRepo**, featuring a modern full-stack architecture with:

- ⚡ **Next.js** (Frontend)
- 🧠 **Express.js** (Backend API)
- 📦 **Shared Packages** (Types, Utils, UI)
- 🔄 **TurboRepo** for task orchestration and caching

---

# 📖 Overview

This project demonstrates how to build a **scalable full-stack application** using a monorepo approach. It is designed to simulate a real-world system such as a **job aggregation platform**, where multiple services and applications share code efficiently.

---

# 🏗 Architecture

```
apps/
web/ → Next.js frontend application
api/ → Express.js backend server

packages/
types/ → Shared TypeScript types
utils/ → Shared helper functions
ui/ → Shared UI components (optional)

turbo.json
pnpm-workspace.yaml
```

---

# 🧠 Key Concepts

## Monorepo

A monorepo allows multiple applications and packages to live in a single repository, enabling:

- Code sharing
- Easier refactoring
- Unified tooling
- Better developer experience

---

## TurboRepo

TurboRepo provides:

- ⚡ Incremental builds
- 🧩 Task pipelines
- 💾 Smart caching
- 🚀 Faster CI/CD

---

## Shared Packages

Shared packages ensure consistency across frontend and backend:

- `@repo/types` → Shared interfaces
- `@repo/utils` → Utility functions
- `@repo/ui` → Reusable components

---

# ⚙️ Tech Stack

| Layer           | Technology           |
| --------------- | -------------------- |
| Frontend        | Next.js (App Router) |
| Backend         | Express.js           |
| Language        | TypeScript           |
| Monorepo        | TurboRepo            |
| Package Manager | pnpm                 |

---

# 🚀 Getting Started

## 1. Clone the Repository

```bash
git clone https://github.com/your-username/hirebase-monorepo.git
cd hirebase-monorepo
```

## 2. Install Dependencies

```bash
pnpm install
```

## 3. Run Development Servers

```bash
pnpm dev
```

### This will start:

- 🌐 Frontend → http://localhost:3000
- ⚙️ Backend → http://localhost:5000

## 🔧 Project Setup Guide (From Scratch)

### Step 1: Create Monorepo

```bash
npx create-turbo@latest
```

Select:

- Package manager → pnpm
- Template → basic

### Step 2: Create Applications

#### Next.js App

Already included in apps/web

#### Express API

```bash
mkdir apps/api
cd apps/api
pnpm init -y
```

Install dependencies:

```bash
pnpm add express cors dotenv
pnpm add -D typescript ts-node-dev @types/node @types/express
```

### Step 3: Create Shared Packages

```bash
mkdir packages/types
```

example:

```bash
// packages/types/index.ts
export interface Job {
  id: number;
  title: string;
  company: string;
}
```

### Step 4: Configure Workspace

#### pnpm-workspace.yaml

```bash
packages:
  - "apps/*"
  - "packages/*"
```

### Step 5: Setup Turbo

turbo.json

```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "dev": {
      "cache": false
    },
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    }
  }
}
```

## 🔗 Using Shared Packages

```bash
import { Job } from "@repo/types";
```
