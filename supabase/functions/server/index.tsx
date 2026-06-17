import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

app.use("*", logger(console.log));
app.use("/*", cors({
  origin: "*",
  allowHeaders: ["Content-Type", "Authorization"],
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  exposeHeaders: ["Content-Length"],
  maxAge: 600,
}));

const PREFIX = "/make-server-1db0c6b9";

function supabase() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
}

// ── STORAGE SETUP ─────────────────────────────────────────────
async function ensureBuckets() {
  const sb = supabase();
  const buckets = ["make-1db0c6b9-docs", "make-1db0c6b9-animais"];
  for (const name of buckets) {
    const { data: list } = await sb.storage.listBuckets();
    if (!list?.some((b) => b.name === name)) {
      await sb.storage.createBucket(name, { public: false });
    }
  }
}
ensureBuckets().catch(console.error);

// ── HEALTH ────────────────────────────────────────────────────
app.get(`${PREFIX}/health`, (c) => c.json({ status: "ok" }));

// ══════════════════════════════════════════════════════════════
//  ANIMAIS
// ══════════════════════════════════════════════════════════════

// GET /animais  — listar todos
app.get(`${PREFIX}/animais`, async (c) => {
  try {
    const items = await kv.getByPrefix("animal:");
    const animals = items
      .map((i) => { try { return JSON.parse(i.value); } catch { return null; } })
      .filter(Boolean)
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return c.json({ data: animals });
  } catch (e) {
    console.error("GET /animais error:", e);
    return c.json({ error: String(e) }, 500);
  }
});

// GET /animais/:id
app.get(`${PREFIX}/animais/:id`, async (c) => {
  try {
    const id = c.req.param("id");
    const raw = await kv.get(`animal:${id}`);
    if (!raw) return c.json({ error: "Animal não encontrado" }, 404);
    return c.json({ data: JSON.parse(raw) });
  } catch (e) {
    return c.json({ error: String(e) }, 500);
  }
});

// POST /animais — cadastrar
app.post(`${PREFIX}/animais`, async (c) => {
  try {
    const body = await c.req.json();
    const id = crypto.randomUUID();
    const animal = { id, ...body, createdAt: new Date().toISOString() };
    await kv.set(`animal:${id}`, JSON.stringify(animal));
    return c.json({ data: animal }, 201);
  } catch (e) {
    console.error("POST /animais error:", e);
    return c.json({ error: String(e) }, 500);
  }
});

// PUT /animais/:id — atualizar
app.put(`${PREFIX}/animais/:id`, async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const raw = await kv.get(`animal:${id}`);
    if (!raw) return c.json({ error: "Não encontrado" }, 404);
    const updated = { ...JSON.parse(raw), ...body, updatedAt: new Date().toISOString() };
    await kv.set(`animal:${id}`, JSON.stringify(updated));
    return c.json({ data: updated });
  } catch (e) {
    return c.json({ error: String(e) }, 500);
  }
});

// DELETE /animais/:id
app.delete(`${PREFIX}/animais/:id`, async (c) => {
  try {
    const id = c.req.param("id");
    await kv.del(`animal:${id}`);
    return c.json({ success: true });
  } catch (e) {
    return c.json({ error: String(e) }, 500);
  }
});

// POST /animais/upload-foto — upload foto para storage
app.post(`${PREFIX}/animais/upload-foto`, async (c) => {
  try {
    const form = await c.req.formData();
    const file = form.get("file") as File;
    if (!file) return c.json({ error: "Nenhum arquivo enviado" }, 400);
    const ext = file.name.split(".").pop();
    const path = `animais/${Date.now()}.${ext}`;
    const sb = supabase();
    const { error } = await sb.storage.from("make-1db0c6b9-animais").upload(path, file, { contentType: file.type });
    if (error) throw error;
    const { data: signed } = await sb.storage.from("make-1db0c6b9-animais").createSignedUrl(path, 60 * 60 * 24 * 365);
    return c.json({ url: signed?.signedUrl, path });
  } catch (e) {
    console.error("Upload foto animal error:", e);
    return c.json({ error: String(e) }, 500);
  }
});

// ══════════════════════════════════════════════════════════════
//  ADOÇÕES
// ══════════════════════════════════════════════════════════════
app.get(`${PREFIX}/adocoes`, async (c) => {
  try {
    const items = await kv.getByPrefix("adocao:");
    const list = items.map((i) => { try { return JSON.parse(i.value); } catch { return null; } }).filter(Boolean)
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return c.json({ data: list });
  } catch (e) { return c.json({ error: String(e) }, 500); }
});

app.post(`${PREFIX}/adocoes`, async (c) => {
  try {
    const body = await c.req.json();
    const id = crypto.randomUUID();
    const record = { id, ...body, status: "pendente", createdAt: new Date().toISOString() };
    await kv.set(`adocao:${id}`, JSON.stringify(record));
    return c.json({ data: record }, 201);
  } catch (e) {
    console.error("POST /adocoes error:", e);
    return c.json({ error: String(e) }, 500);
  }
});

app.put(`${PREFIX}/adocoes/:id/status`, async (c) => {
  try {
    const id = c.req.param("id");
    const { status, observacao } = await c.req.json();
    const raw = await kv.get(`adocao:${id}`);
    if (!raw) return c.json({ error: "Não encontrado" }, 404);
    const updated = { ...JSON.parse(raw), status, observacao, updatedAt: new Date().toISOString() };
    await kv.set(`adocao:${id}`, JSON.stringify(updated));
    return c.json({ data: updated });
  } catch (e) { return c.json({ error: String(e) }, 500); }
});

// ══════════════════════════════════════════════════════════════
//  ABRIGO TEMPORÁRIO
// ══════════════════════════════════════════════════════════════
app.get(`${PREFIX}/abrigos`, async (c) => {
  try {
    const items = await kv.getByPrefix("abrigo:");
    const list = items.map((i) => { try { return JSON.parse(i.value); } catch { return null; } }).filter(Boolean)
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return c.json({ data: list });
  } catch (e) { return c.json({ error: String(e) }, 500); }
});

app.post(`${PREFIX}/abrigos`, async (c) => {
  try {
    const body = await c.req.json();
    const id = crypto.randomUUID();
    const record = { id, ...body, status: "pendente", createdAt: new Date().toISOString() };
    await kv.set(`abrigo:${id}`, JSON.stringify(record));
    return c.json({ data: record }, 201);
  } catch (e) {
    console.error("POST /abrigos error:", e);
    return c.json({ error: String(e) }, 500);
  }
});

app.put(`${PREFIX}/abrigos/:id/status`, async (c) => {
  try {
    const id = c.req.param("id");
    const { status } = await c.req.json();
    const raw = await kv.get(`abrigo:${id}`);
    if (!raw) return c.json({ error: "Não encontrado" }, 404);
    const updated = { ...JSON.parse(raw), status, updatedAt: new Date().toISOString() };
    await kv.set(`abrigo:${id}`, JSON.stringify(updated));
    return c.json({ data: updated });
  } catch (e) { return c.json({ error: String(e) }, 500); }
});

// ══════════════════════════════════════════════════════════════
//  VOLUNTÁRIOS
// ══════════════════════════════════════════════════════════════
app.get(`${PREFIX}/voluntarios`, async (c) => {
  try {
    const items = await kv.getByPrefix("voluntario:");
    const list = items.map((i) => { try { return JSON.parse(i.value); } catch { return null; } }).filter(Boolean)
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return c.json({ data: list });
  } catch (e) { return c.json({ error: String(e) }, 500); }
});

app.post(`${PREFIX}/voluntarios`, async (c) => {
  try {
    const body = await c.req.json();
    const id = crypto.randomUUID();
    const record = { id, ...body, status: "analise", createdAt: new Date().toISOString() };
    await kv.set(`voluntario:${id}`, JSON.stringify(record));
    return c.json({ data: record }, 201);
  } catch (e) {
    console.error("POST /voluntarios error:", e);
    return c.json({ error: String(e) }, 500);
  }
});

app.put(`${PREFIX}/voluntarios/:id/status`, async (c) => {
  try {
    const id = c.req.param("id");
    const { status } = await c.req.json();
    const raw = await kv.get(`voluntario:${id}`);
    if (!raw) return c.json({ error: "Não encontrado" }, 404);
    const updated = { ...JSON.parse(raw), status, updatedAt: new Date().toISOString() };
    await kv.set(`voluntario:${id}`, JSON.stringify(updated));
    return c.json({ data: updated });
  } catch (e) { return c.json({ error: String(e) }, 500); }
});

// ══════════════════════════════════════════════════════════════
//  RESGATES
// ══════════════════════════════════════════════════════════════
app.get(`${PREFIX}/resgates`, async (c) => {
  try {
    const items = await kv.getByPrefix("resgate:");
    const list = items.map((i) => { try { return JSON.parse(i.value); } catch { return null; } }).filter(Boolean)
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return c.json({ data: list });
  } catch (e) { return c.json({ error: String(e) }, 500); }
});

app.post(`${PREFIX}/resgates`, async (c) => {
  try {
    const body = await c.req.json();
    const id = crypto.randomUUID();
    const record = { id, ...body, status: "recebido", createdAt: new Date().toISOString() };
    await kv.set(`resgate:${id}`, JSON.stringify(record));
    return c.json({ data: record }, 201);
  } catch (e) {
    console.error("POST /resgates error:", e);
    return c.json({ error: String(e) }, 500);
  }
});

app.put(`${PREFIX}/resgates/:id/status`, async (c) => {
  try {
    const id = c.req.param("id");
    const { status } = await c.req.json();
    const raw = await kv.get(`resgate:${id}`);
    if (!raw) return c.json({ error: "Não encontrado" }, 404);
    const updated = { ...JSON.parse(raw), status, updatedAt: new Date().toISOString() };
    await kv.set(`resgate:${id}`, JSON.stringify(updated));
    return c.json({ data: updated });
  } catch (e) { return c.json({ error: String(e) }, 500); }
});

// ══════════════════════════════════════════════════════════════
//  DENÚNCIAS
// ══════════════════════════════════════════════════════════════
app.get(`${PREFIX}/denuncias`, async (c) => {
  try {
    const items = await kv.getByPrefix("denuncia:");
    const list = items.map((i) => { try { return JSON.parse(i.value); } catch { return null; } }).filter(Boolean)
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return c.json({ data: list });
  } catch (e) { return c.json({ error: String(e) }, 500); }
});

app.post(`${PREFIX}/denuncias`, async (c) => {
  try {
    const body = await c.req.json();
    const id = crypto.randomUUID();
    const record = { id, ...body, status: "analise", createdAt: new Date().toISOString() };
    await kv.set(`denuncia:${id}`, JSON.stringify(record));
    return c.json({ data: record }, 201);
  } catch (e) {
    console.error("POST /denuncias error:", e);
    return c.json({ error: String(e) }, 500);
  }
});

app.put(`${PREFIX}/denuncias/:id/status`, async (c) => {
  try {
    const id = c.req.param("id");
    const { status } = await c.req.json();
    const raw = await kv.get(`denuncia:${id}`);
    if (!raw) return c.json({ error: "Não encontrado" }, 404);
    const updated = { ...JSON.parse(raw), status, updatedAt: new Date().toISOString() };
    await kv.set(`denuncia:${id}`, JSON.stringify(updated));
    return c.json({ data: updated });
  } catch (e) { return c.json({ error: String(e) }, 500); }
});

// ══════════════════════════════════════════════════════════════
//  DOAÇÕES
// ══════════════════════════════════════════════════════════════
app.get(`${PREFIX}/doacoes`, async (c) => {
  try {
    const items = await kv.getByPrefix("doacao:");
    const list = items.map((i) => { try { return JSON.parse(i.value); } catch { return null; } }).filter(Boolean)
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return c.json({ data: list });
  } catch (e) { return c.json({ error: String(e) }, 500); }
});

app.post(`${PREFIX}/doacoes`, async (c) => {
  try {
    const body = await c.req.json();
    const id = crypto.randomUUID();
    const record = { id, ...body, status: "confirmado", createdAt: new Date().toISOString() };
    await kv.set(`doacao:${id}`, JSON.stringify(record));
    return c.json({ data: record }, 201);
  } catch (e) {
    console.error("POST /doacoes error:", e);
    return c.json({ error: String(e) }, 500);
  }
});

// ══════════════════════════════════════════════════════════════
//  APADRINHAMENTOS
// ══════════════════════════════════════════════════════════════
app.get(`${PREFIX}/apadrinhamentos`, async (c) => {
  try {
    const items = await kv.getByPrefix("apadrinhamento:");
    const list = items.map((i) => { try { return JSON.parse(i.value); } catch { return null; } }).filter(Boolean)
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return c.json({ data: list });
  } catch (e) { return c.json({ error: String(e) }, 500); }
});

app.post(`${PREFIX}/apadrinhamentos`, async (c) => {
  try {
    const body = await c.req.json();
    const id = crypto.randomUUID();
    const record = { id, ...body, status: "ativo", createdAt: new Date().toISOString() };
    await kv.set(`apadrinhamento:${id}`, JSON.stringify(record));
    return c.json({ data: record }, 201);
  } catch (e) {
    console.error("POST /apadrinhamentos error:", e);
    return c.json({ error: String(e) }, 500);
  }
});

// ══════════════════════════════════════════════════════════════
//  UPLOAD DOCS (storage)
// ══════════════════════════════════════════════════════════════
app.post(`${PREFIX}/upload-doc`, async (c) => {
  try {
    const form = await c.req.formData();
    const file = form.get("file") as File;
    const folder = (form.get("folder") as string) || "docs";
    if (!file) return c.json({ error: "Nenhum arquivo" }, 400);
    const ext = file.name.split(".").pop();
    const path = `${folder}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
    const sb = supabase();
    const { error } = await sb.storage.from("make-1db0c6b9-docs").upload(path, file, { contentType: file.type });
    if (error) throw error;
    const { data: signed } = await sb.storage.from("make-1db0c6b9-docs").createSignedUrl(path, 60 * 60 * 24 * 30);
    return c.json({ url: signed?.signedUrl, path });
  } catch (e) {
    console.error("Upload doc error:", e);
    return c.json({ error: String(e) }, 500);
  }
});

// ══════════════════════════════════════════════════════════════
//  STATS (dashboard)
// ══════════════════════════════════════════════════════════════
app.get(`${PREFIX}/stats`, async (c) => {
  try {
    const [animais, adocoes, abrigos, voluntarios, resgates, denuncias, doacoes, apadrinhamentos] = await Promise.all([
      kv.getByPrefix("animal:"),
      kv.getByPrefix("adocao:"),
      kv.getByPrefix("abrigo:"),
      kv.getByPrefix("voluntario:"),
      kv.getByPrefix("resgate:"),
      kv.getByPrefix("denuncia:"),
      kv.getByPrefix("doacao:"),
      kv.getByPrefix("apadrinhamento:"),
    ]);

    const parsedDoacoes = doacoes
      .map((i) => { try { return JSON.parse(i.value); } catch { return null; } })
      .filter(Boolean);

    const totalDoacoes = parsedDoacoes.reduce((sum: number, d: any) => sum + Number(d.valor || 0), 0);

    return c.json({
      animais: animais.length,
      adocoes: adocoes.length,
      abrigos: abrigos.length,
      voluntarios: voluntarios.length,
      resgates: resgates.length,
      denuncias: denuncias.length,
      doacoes: doacoes.length,
      apadrinhamentos: apadrinhamentos.length,
      totalDoacoes,
    });
  } catch (e) {
    console.error("GET /stats error:", e);
    return c.json({ error: String(e) }, 500);
  }
});
// ═══════════════════════════════════════
// USUÁRIOS
// ═══════════════════════════════════════

// Cadastro
app.post(`${PREFIX}/usuarios`, async (c) => {
  try {
    const body = await c.req.json();

    const id = crypto.randomUUID();

    const usuario = {
      id,
      nome: body.nome,
      email: body.email,
      senha: body.senha,
      tipo: "usuario",
      createdAt: new Date().toISOString(),
    };

    await kv.set(`usuario:${id}`, JSON.stringify(usuario));

    return c.json({ data: usuario }, 201);
  } catch (e) {
    return c.json({ error: String(e) }, 500);
  }
});

// Login
app.post(`${PREFIX}/login`, async (c) => {
  try {
    const { email, senha } = await c.req.json();

    const usuarios = await kv.getByPrefix("usuario:");

    const usuario = usuarios
      .map((u) => JSON.parse(u.value))
      .find(
        (u) =>
          u.email === email &&
          u.senha === senha
      );

    if (!usuario) {
      return c.json(
        { error: "Email ou senha inválidos" },
        401
      );
    }

    return c.json({ data: usuario });
  } catch (e) {
    return c.json({ error: String(e) }, 500);
  }
});
// ═══════════════════════════════════════
// ADMINS
// ═══════════════════════════════════════

app.post(`${PREFIX}/admins`, async (c) => {
  try {
    const body = await c.req.json();

    const id = crypto.randomUUID();

    const admin = {
      id,
      nome: body.nome,
      email: body.email,
      senha: body.senha,
      tipo: "admin",
      createdAt: new Date().toISOString(),
    };

    await kv.set(`admin:${id}`, JSON.stringify(admin));

    return c.json({ data: admin });
  } catch (e) {
    return c.json({ error: String(e) }, 500);
  }
});

// Login Admin
app.post(`${PREFIX}/admin/login`, async (c) => {
  try {
    const { email, senha } = await c.req.json();

    const admins = await kv.getByPrefix("admin:");

    const admin = admins
      .map((a) => JSON.parse(a.value))
      .find(
        (a) =>
          a.email === email &&
          a.senha === senha
      );

    if (!admin) {
      return c.json(
        { error: "Admin inválido" },
        401
      );
    }

    return c.json({ data: admin });
  } catch (e) {
    return c.json({ error: String(e) }, 500);
  }
});
Deno.serve(app.fetch);
