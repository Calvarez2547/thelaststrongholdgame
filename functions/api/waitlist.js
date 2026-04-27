// Cloudflare Pages Function for The Last Stronghold waitlist signup.
// This endpoint validates the request, stores the signup in Supabase,
// and returns a success response without exposing any download URL.

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
  const waitlistConsent = payload.waitlistConsent === true;

  if (!name || !email) {
    return "Name and email are required.";
  }

  if (!EMAIL_PATTERN.test(email)) {
    return "A valid email address is required.";
  }

  if (!waitlistConsent) {
    return "Waitlist consent is required.";
  }

  return "";
}

async function insertWaitlistSignup(env, payload) {
  const supabaseUrl = env.SUPABASE_URL;
  const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase environment variables.");
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/waitlist_signups`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      Prefer: "return=minimal,resolution=merge-duplicates"
    },
    body: JSON.stringify({
      name: payload.name.trim(),
      email: payload.email.trim().toLowerCase()
    })
  });

  if (!response.ok) {
    throw new Error("Waitlist signup could not be saved.");
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

    await insertWaitlistSignup(env, payload);

    return jsonResponse({
      success: true,
      message: "Waitlist signup saved."
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
