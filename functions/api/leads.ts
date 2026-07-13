interface Env {
  DB?: {
    prepare: (query: string) => {
      bind: (...args: any[]) => {
        run: () => Promise<any>;
        all: () => Promise<{ results: any[] }>;
      };
      run: () => Promise<any>;
      all: () => Promise<{ results: any[] }>;
    };
    exec: (query: string) => Promise<any>;
  };
}

// Interface estendida com o método waitUntil obrigatório para o Cloudflare Workers
interface RequestContext {
  request: Request;
  env: Env;
  waitUntil: (promise: Promise<any>) => void;
}

const CORS_HEADERS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// URL única do fluxo da Ana Flávia dentro do seu n8n
const N8N_WEBHOOK_URL = "https://n8n.francorafael.com/webhook/69bf5cb1-ea37-4ee3-a313-f5cfe13a50a0";

// OPTIONS handler for preflight requests
export async function onRequestOptions(): Promise<Response> {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

// GET /api/leads - Retrieve all leads sorted by date descending
export async function onRequestGet(context: RequestContext): Promise<Response> {
  const { env } = context;

  if (!env.DB) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "D1 Database 'DB' binding is missing in Cloudflare Pages."
      }),
      { status: 500, headers: CORS_HEADERS }
    );
  }

  try {
    const { results } = await env.DB.prepare("SELECT * FROM leads ORDER BY id DESC").all();
    return new Response(
      JSON.stringify({ success: true, leads: results }),
      { status: 200, headers: CORS_HEADERS }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, error: error.message || "Failed to query leads database." }),
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

// POST /api/leads - Create a new lead and sync with n8n
export async function onRequestPost(context: RequestContext): Promise<Response> {
  const { request, env, waitUntil } = context;

  if (!env.DB) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "D1 Database 'DB' binding is missing in Cloudflare Pages."
      }),
      { status: 500, headers: CORS_HEADERS }
    );
  }

  try {
    const lead = await request.json() as {
      id: string;
      name: string;
      company: string;
      phone: string;
      segment: string;
      email: string;
      message?: string;
      date: string;
    };

    // Validations
    if (!lead.name || !lead.company || !lead.phone || !lead.email) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing required fields (name, company, phone, email)." }),
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const leadId = lead.id || Date.now().toString();
    const leadSegment = lead.segment || "moda";
    const leadMessage = lead.message || "";
    const leadDate = lead.date || new Date().toISOString();

    // 1. Salva no banco de dados D1 local da Cloudflare
    await env.DB.prepare(
      "INSERT OR REPLACE INTO leads (id, name, company, phone, segment, email, message, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    )
      .bind(
        leadId,
        lead.name,
        lead.company,
        lead.phone,
        leadSegment,
        lead.email,
        leadMessage,
        leadDate
      )
      .run();

    // 2. Monta o objeto estruturado para enviar ao n8n
    const payloadParaN8n = {
      id: leadId,
      name: lead.name,
      company: lead.company,
      phone: lead.phone,
      segment: leadSegment,
      email: lead.email,
      message: leadMessage,
      date: leadDate,
      source: "anaflaviafranco.com"
    };

    // 3. Envia os dados de forma assíncrona para o n8n sem atrasar o carregamento da página do usuário
    waitUntil(
      fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "X-Source-Application": "Cloudflare-Pages" 
        },
        body: JSON.stringify(payloadParaN8n)
      }).catch(err => console.error("Falha ao enviar lead para o n8n:", err))
    );

    return new Response(
      JSON.stringify({ success: true, lead: payloadParaN8n }),
      { status: 201, headers: CORS_HEADERS }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, error: error.message || "Failed to insert lead into database." }),
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

// DELETE /api/leads - Clear all leads (Administrative)
export async function onRequestDelete(context: RequestContext): Promise<Response> {
  const { env } = context;

  if (!env.DB) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "D1 Database 'DB' binding is missing in Cloudflare Pages."
      }),
      { status: 500, headers: CORS_HEADERS }
    );
  }

  try {
    await env.DB.prepare("DELETE FROM leads").run();
    return new Response(
      JSON.stringify({ success: true, message: "All leads cleared from D1 database." }),
      { status: 200, headers: CORS_HEADERS }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, error: error.message || "Failed to clear leads from database." }),
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
