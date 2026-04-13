# 🔗 OneLink Geru (Next.js)

Aplicação de redirecionamento inteligente para deep links mobile da **Geru**, migrada para **Next.js (App Router)** e preparada para execução no **Google Cloud Run**.

## ✅ O que a migração preserva

- Página inicial em `/` com detecção de dispositivo.
- Rota dinâmica `/:id` para buscar links no Firestore.
- Em mobile: tenta abrir `appUrl` e faz fallback para loja após ~2s.
- Em desktop: redireciona direto para `webUrl`.
- Firebase Admin via ADC no Cloud Run.

## 🧱 Stack atual

- Next.js 15 (App Router)
- React 19
- TypeScript
- Firebase Admin SDK (Firestore)
- Docker + Cloud Build + Cloud Run

## 📋 Pré-requisitos

- Node.js 22+
- npm
- gcloud SDK

## ⚙️ Variáveis de ambiente

Crie `.env` a partir de `.env.example` e defina ao menos:

```env
FIREBASE_PROJECT_ID=geru-app-dev
```

Opcional para credencial explícita (não necessário no Cloud Run):

```env
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

## 🏃 Execução local

```bash
npm install
npm run dev
```

Build e execução em produção:

```bash
npm run build
npm start
```

## 🗄️ Seed do Firestore

```bash
npm run seed
```

> O script sobrescreve os documentos na coleção `links`.

## 📁 Estrutura principal

```text
app/
        layout.tsx
        page.tsx
        [id]/page.tsx
        not-found.tsx
lib/
        firebase-admin.ts
        links.ts
        device.ts
        types.ts
components/
        redirect-client.tsx
public/assets/
        geru-logo.svg
scripts/
        seed.ts
Dockerfile
cloudbuild.yaml
service.yaml
```

## 🚀 Deploy no Cloud Run

```bash
gcloud builds submit --config cloudbuild.yaml
```

O pipeline faz:
1. Build da imagem Docker.
2. Push para Artifact Registry.
3. Deploy no Cloud Run com `NODE_ENV=production` e `FIREBASE_PROJECT_ID`.
