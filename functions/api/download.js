// Cloudflare Pages Function for The Last Stronghold game download.
// It validates the form data, stores the download record in Supabase,
// and returns the Google Drive download URL to the frontend.

const GAME_DOWNLOAD_URL =
  "https://drive.google.com/uc?export=download&id=1QKEoT3qp0JEfvzjUwkpGn5jW1xvqLD32";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });
}

function validatePayload(payload) {
  if (!payload || typeof payload !== "object") {
    return "Request body is required.";
  }

  const name = typeof payload.name === "string" ? payload.name.trim() : "";
  const email = typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";
  const dob = typeof payload.dob === "string" ? payload.dob.trim() : "";

  if (!name || !email || !dob) {
    return "Name, email, and date of birth are required.";
  }

  if (!EMAIL_PATTERN.test(email)) {
    return "A valid email address is required.";
  }

  if (Number.isNaN(Date.parse(`${dob}T00:00:00Z`))) {
    return "A valid date of birth is required.";
  }

  return "";
}

async function insertDownload(env, payload) {
  const supabaseUrl = env.SUPABASE_URL;
  const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase environment variables.");
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/downloads`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      Prefer: "return=minimal"
    },
    body: JSON.stringify({
      name: payload.name.trim(),
      email: payload.email.trim().toLowerCase(),
      dob: payload.dob.trim()
    })
  });

  if (!response.ok) {
    throw new Error("Download request could not be saved.");
  }
}

export async function onRequest(context) {
  try {
    const { request, env } = context;

    if (request.method !== "POST") {
      return jsonResponse({ error: "Method not allowed. Use POST." }, 405);
    }

    const payload = await request.json();
    const validationError = validatePayload(payload);

    if (validationError) {
      return jsonResponse({ error: validationError }, 400);
    }

    await insertDownload(env, payload);

    return jsonResponse({
      success: true,
      downloadUrl: GAME_DOWNLOAD_URL
    });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return jsonResponse({ error: "Invalid JSON request body." }, 400);
    }

    return jsonResponse(
      {
        error: error instanceof Error ? error.message : "Unexpected server error."
      },
      500
    );
  }
}
