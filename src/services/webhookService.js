const baseUrl = import.meta.env.VITE_N8N_BASE_URL || "";

function buildUrl(path) {
  if (!path) return "";
  return `${baseUrl}${path}`;
}

async function sendWebhook(path, payload) {
  const url = buildUrl(path);
  if (!url) return { skipped: true, reason: "Webhook nao configurado" };
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    throw new Error(`Falha no webhook: ${res.status}`);
  }
  return res.json().catch(() => ({ success: true }));
}

export function createApplicationWebhook(payload) {
  return sendWebhook(import.meta.env.VITE_N8N_CREATE_APPLICATION_WEBHOOK, payload);
}

export function sendReminderWebhook(payload) {
  return sendWebhook(import.meta.env.VITE_N8N_SEND_REMINDER_WEBHOOK, payload);
}

export function updateProgressWebhook(payload) {
  return sendWebhook(import.meta.env.VITE_N8N_UPDATE_PROGRESS_WEBHOOK, payload);
}
