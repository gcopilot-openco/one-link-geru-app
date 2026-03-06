# 🔗 OneLink Server

Servidor de redirecionamento inteligente para deep links mobile da **Geru**. Detecta automaticamente o dispositivo do usuário e redireciona para o app instalado, para as lojas (App Store / Play Store) ou para a versão web. Os links são gerenciados via **Firebase Firestore** e o servidor é hospedado no **Google Cloud Run**.

## 🚀 Funcionalidades

- ✅ Detecção automática de dispositivo (Mobile / Desktop)
- ✅ Identificação de plataforma (iOS / Android)
- ✅ Tentativa de abertura do app instalado via deep link
- ✅ Fallback automático para App Store ou Play Store
- ✅ Redirecionamento para web em desktop
- ✅ Links gerenciados no Firebase Firestore (sem deploy para atualizar)
- ✅ Autenticação via Application Default Credentials (ADC) — sem chave privada
- ✅ Templates dinâmicos com Handlebars
- ✅ TypeScript para type safety
- ✅ Hot reload em desenvolvimento

## 📋 Pré-requisitos

- Node.js 22+
- npm
- [Google Cloud SDK](https://cloud.google.com/sdk/docs/install) (`gcloud`)
- Acesso ao projeto GCP `geru-app-dev`

## 🔧 Instalação

```bash
git clone https://github.com/dennerrondinely-open/one-link-geru-app.git
cd one-link-geru-app
npm install
```

### Variáveis de ambiente

Copie o arquivo de exemplo e ajuste:

```bash
cp .env.example .env
```

O único campo obrigatório é:

```env
FIREBASE_PROJECT_ID=geru-app-dev
```

### Credenciais locais (ADC)

O servidor usa Application Default Credentials para acessar o Firestore. Na primeira vez, autentique-se com:

```bash
gcloud auth application-default login
gcloud config set project geru-app-dev
```

## 🏃 Como usar

### Desenvolvimento (com hot reload)
```bash
npm run dev
```

### Build para produção
```bash
npm run build
```

### Executar versão compilada
```bash
npm start
```

O servidor estará disponível em `http://localhost:3000`.

## 📱 Rotas disponíveis

| Rota | Descrição |
|---|---|
| `GET /` | Página inicial com informações do dispositivo |
| `GET /:id` | Redireciona conforme o link configurado no Firestore |

### Links ativos

| ID | Tipo | Destino |
|---|---|---|
| `geru` | `app` | App Geru (iOS / Android / Web) |
| `whatsapp` | `whatsapp` | Atendimento via WhatsApp |
| `achadinhos` | `whatsapp-group` | Grupo Achadinhos Geru no WhatsApp |

## 🔗 Como funciona o redirecionamento

```
Usuário acessa /:id
        ↓
Firestore busca o documento links/{id}
        ↓
Detecta o dispositivo
        ↓
├── iOS     → tenta appUrl → fallback para appStore
├── Android → tenta appUrl → fallback para playStore
└── Desktop → redireciona direto para webUrl
```

Se o app não abrir em ~2 segundos, redireciona automaticamente para a loja.

## 🗄️ Gerenciamento de Links (Firestore)

Os links ficam na coleção `links` do Firestore. Cada documento tem a seguinte estrutura:

```typescript
{
  name: string;          // Nome exibido
  type: "app" | "whatsapp" | "whatsapp-group" | "social" | "web";
  appUrl: string;        // Deep link para abrir o app
  webUrl: string;        // URL fallback para desktop
  appStore: string;      // Link da App Store (iOS)
  playStore: string;     // Link da Play Store (Android)
  phone?: string;        // Número WhatsApp (tipo whatsapp)
  message?: string;      // Mensagem pré-preenchida (tipo whatsapp)
  packageName?: string;  // Package Android (tipo app)
  bundleId?: string;     // Bundle ID iOS (tipo app)
}
```

### Popular o Firestore (primeira vez)

```bash
npx tsx src/scripts/seed.ts
```

> ⚠️ O script sobrescreve os documentos existentes. Edite `src/scripts/seed.ts` antes de rodar se quiser alterar os dados.

## 📁 Estrutura do projeto

```
onelink-server/
├── src/
│   ├── controllers/
│   │   ├── home.ts          # Página inicial
│   │   └── redirect.ts      # Lógica de redirecionamento
│   ├── services/
│   │   ├── firebase.ts      # Inicialização do Firebase Admin (ADC)
│   │   └── links.ts         # Queries no Firestore
│   ├── scripts/
│   │   └── seed.ts          # Script para popular o Firestore
│   ├── types/
│   │   ├── index.ts         # Interfaces TypeScript
│   │   └── express.d.ts     # Extensões do Express
│   ├── views/
│   │   ├── layouts/
│   │   │   ├── main.handlebars      # Layout principal
│   │   │   └── download.handlebars  # Layout de redirecionamento
│   │   ├── home.handlebars
│   │   ├── redirect.handlebars
│   │   └── 404.handlebars
│   ├── assets/
│   │   └── geru-logo.svg
│   ├── routes.ts            # Definição de rotas
│   └── index.ts             # Entry point
├── Dockerfile               # Build multi-stage para Cloud Run
├── cloudbuild.yaml          # Pipeline CI/CD no Cloud Build
├── service.yaml             # Configuração do Cloud Run
├── .env.example
├── tsconfig.json
└── package.json
```

## 🛠️ Stack

| Camada | Tecnologia |
|---|---|
| Runtime | Node.js 22 |
| Linguagem | TypeScript |
| Framework | Express 5 |
| Templates | Handlebars |
| Detecção de UA | express-useragent |
| Banco de dados | Firebase Firestore |
| Auth | Application Default Credentials (ADC) |
| Hospedagem | Google Cloud Run |
| CI/CD | Google Cloud Build |

## 🚀 Deploy (Cloud Run)

O deploy é feito automaticamente via **Cloud Build** a cada push na branch `main`.

### Pipeline (`cloudbuild.yaml`)

1. Build da imagem Docker
2. Push para o Artifact Registry (`us-central1-docker.pkg.dev/geru-app-dev/onelink`)
3. Deploy no Cloud Run com `FIREBASE_PROJECT_ID` injetado via variável de ambiente

### Deploy manual

```bash
gcloud builds submit --config cloudbuild.yaml
```

## 🔒 Segurança

- O servidor usa **firebase-admin** com ADC — nenhuma chave privada é armazenada no código ou no repositório.
- Em produção (Cloud Run), as credenciais são fornecidas automaticamente pela Service Account atribuída ao serviço via IAM.
- As Firestore Security Rules bloqueiam acesso direto à coleção `links` por client SDKs:

```js
match /links/{docId} {
  allow read, write: if false;
}
```

## 👤 Autor

**Denner Rondinely** — [@dennerrondinely](https://github.com/dennerrondinely-open)
