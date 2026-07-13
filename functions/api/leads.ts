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
// teste forms

interface RequestContext {
  request: Request;
  env: Env;
}


const CORS_HEADERS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// Initialize the database table if it doesn't exist
async function ensureTableExists(db: NonNullable<Env["DB"]>) {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS leads (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      company TEXT NOT NULL,
      phone TEXT NOT NULL,
      segment TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT,
      date TEXT NOT NULL
    );
  `);
}

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
        error: "D1 Database 'DB' binding is missing in Cloudflare Pages. Please create a D1 database and bind it with the variable name 'DB' in Pages dashboard settings under Functions."
      }),
      { status: 500, headers: CORS_HEADERS }
    );
  }

  try {
    await ensureTableExists(env.DB);
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

// POST /api/leads - Create a new lead
export async function onRequestPost(context: RequestContext): Promise<Response> {
  const { request, env } = context;

  if (!env.DB) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "D1 Database 'DB' binding is missing in Cloudflare Pages. Please create a D1 database and bind it with the variable name 'DB' in Pages dashboard settings under Functions."
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

    await ensureTableExists(env.DB);

    await env.DB.prepare(
      "INSERT OR REPLACE INTO leads (id, name, company, phone, segment, email, message, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    )
      .bind(
        lead.id || Date.now().toString(),
        lead.name,
        lead.company,
        lead.phone,
        lead.segment || "moda",
        lead.email,
        lead.message || "",
        lead.date || new Date().toLocaleString("pt-BR")
      )
      .run();

    return new Response(
      JSON.stringify({ success: true, lead }),
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
        error: "D1 Database 'DB' binding is missing in Cloudflare Pages. Please create a D1 database and bind it with the variable name 'DB' in Pages dashboard settings under Functions."
      }),
      { status: 500, headers: CORS_HEADERS }
    );
  }

  try {
    await ensureTableExists(env.DB);
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
