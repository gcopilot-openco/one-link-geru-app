# 🔗 OneLink Server

Servidor de redirecionamento inteligente para deep links mobile. Detecta automaticamente o dispositivo do usuário e redireciona para o app instalado ou para as lojas (App Store/Play Store).

## 🚀 Funcionalidades

- ✅ Detecção automática de dispositivo (Mobile/Desktop)
- ✅ Identificação de plataforma (iOS/Android)
- ✅ Tentativa de abertura do app instalado
- ✅ Fallback automático para App Store ou Play Store
- ✅ Redirecionamento para web em desktop
- ✅ Templates dinâmicos com Handlebars
- ✅ TypeScript para type safety
- ✅ Hot reload em desenvolvimento

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn

## 🔧 Instalação

```bash
# Clone o repositório
git clone https://github.com/dennerrondinely/one-link.git
cd onelink-server

# Instale as dependências
npm install
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

O servidor estará disponível em `http://localhost:3000`

## 📱 Testando

### No Desktop
Acesse `http://localhost:3000` para ver a página inicial com informações do seu dispositivo.

### No Mobile
1. Descubra seu IP local: `ifconfig` ou `ip addr`
2. Acesse do celular: `http://SEU-IP:3000`
3. Teste os links:
   - `/instagram-demo` - Tenta abrir Instagram
   - `/whatsapp-demo` - Tenta abrir WhatsApp
   - `/geru` - Tenta abrir app Geru

## 🔗 Como funciona

### 1. Usuário acessa o link
```
http://localhost:3000/instagram-demo
```

### 2. Servidor detecta o dispositivo
- **Mobile iOS**: Tenta abrir `instagram://` → Fallback para App Store
- **Mobile Android**: Tenta abrir Intent URL → Fallback para Play Store
- **Desktop**: Redireciona direto para versão web

### 3. Timeout inteligente
Se o app não abrir em 2 segundos, redireciona automaticamente para a loja.

## 📁 Estrutura do projeto

```
onelink-server/
├── src/
│   ├── controllers/
│   │   ├── home.ts         # Controller da página inicial
│   │   └── redirect.ts     # Controller de redirecionamento
│   ├── types/
│   │   ├── index.ts        # Interfaces TypeScript
│   │   └── express.d.ts    # Extensões do Express
│   ├── views/
│   │   ├── layouts/
│   │   │   ├── main.handlebars
│   │   │   └── download.handlebars
│   │   ├── home.handlebars
│   │   ├── redirect.handlebars
│   │   └── 404.handlebars
│   ├── constants.ts        # Configuração de links
│   ├── routes.ts           # Definição de rotas
│   └── index.ts            # Entry point
├── dist/                   # Código compilado
├── tsconfig.json           # Config TypeScript
└── package.json
```

## ⚙️ Configuração de Links

Edite `src/constants.ts` para adicionar novos links:

```typescript
const links: Links = {
  "seu-link": {
    appUrl: "seuapp://path",
    webUrl: "https://seu-site.com",
    name: "Seu App",
    appStore: "https://apps.apple.com/app/id123456",
    playStore: "https://play.google.com/store/apps/details?id=com.seu.app",
  },
};
```

## 🎨 Personalizando Templates

Os templates Handlebars estão em `src/views/`:

- `home.handlebars` - Página inicial
- `redirect.handlebars` - Página de redirecionamento
- `layouts/download.handlebars` - Layout para mobile

## 🛠️ Stack Tecnológico

- **Node.js** - Runtime JavaScript
- **TypeScript** - Type safety
- **Express** - Framework web
- **Handlebars** - Template engine
- **express-useragent** - Detecção de dispositivos
- **tsx** - TypeScript executor com hot reload

## 📊 Logs

O servidor registra todos os acessos no console:

```
[2026-01-16T10:30:45.123Z] instagram-demo - Mobile - iOS
[2026-01-16T10:31:20.456Z] whatsapp-demo - Desktop - MacOS
```

## 🚀 Deploy

### Vercel
```bash
# Instale Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Railway
1. Conecte seu repositório GitHub
2. Configure o build command: `npm run build`
3. Configure o start command: `npm start`

### Render
1. Crie um novo Web Service
2. Build Command: `npm install && npm run build`
3. Start Command: `npm start`

## 🔒 Variáveis de Ambiente

Crie um arquivo `.env` (opcional):

```env
PORT=3000
NODE_ENV=production
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit suas mudanças: `git commit -m 'Adiciona nova funcionalidade'`
4. Push para a branch: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

## 📝 Licença

ISC

## 👤 Autor

**Denner Rondinely**
- GitHub: [@dennerrondinely](https://github.com/dennerrondinely)

## 🙏 Agradecimentos

- [Express](https://expressjs.com/)
- [Handlebars](https://handlebarsjs.com/)
- [TypeScript](https://www.typescriptlang.org/)

---

⭐ Se este projeto foi útil, considere dar uma estrela no GitHub!
