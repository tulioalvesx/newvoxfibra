# NEWVOX Fibra — Site (Next.js)

Site responsivo (celular/tablet/PC), com:
- Home premium/tecnológica
- Planos por UF/cidade (IBGE) + checagem de cobertura (Strapi)
- WhatsApp flutuante
- Central do assinante: CPF → valida no IXC (CLIENTE ativo) → redireciona

## 1) Rodar local
```bash
npm install
cp .env.example .env
npm run dev
```

## 2) Variáveis importantes
Edite o `.env`:

- `NEXT_PUBLIC_STRAPI_URL` (ex.: `http://localhost:1337`)
- `NEXT_PUBLIC_WHATSAPP_E164`
- `NEXT_PUBLIC_IXC_PORTAL_URL` (ex.: `https://ixc.newvox.com.br`)
- `IXC_HOST` e `IXC_TOKEN` (para validação)

## 3) Deploy
- Suba este projeto no GitHub
- Conecte na Vercel
- Configure as variáveis de ambiente na Vercel (Settings → Environment Variables)
