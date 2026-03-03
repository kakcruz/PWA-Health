#(Vue + Vite)

SPA mobile-first para gestao de aplicacoes, dosagem e progresso corporal.

## Rodar

```bash
npm install
npm run dev
```

## Rotas

- `/` Inicio
- `/agenda` Agendar aplicacao
- `/dosagem` Ajuste de dosagem
- `/progresso` Acompanhamento
- `/conteudo` Conteudo e dicas

## Integracoes

- Supabase client em `src/lib/supabase.js`
- Servicos Supabase em `src/services/supabaseService.js`
- Webhooks n8n em `src/services/webhookService.js`

Configure variaveis de ambiente usando `.env.example`.
