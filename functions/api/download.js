// Cloudflare Pages Function for gated download access.
// This file is the secure backend for the website download form.
// It validates the request, writes approved records to Supabase,
// and then returns the final ZIP download URL to the frontend.

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

function parseDob(value) {
  // Expecting YYYY-MM-DD from the browser date input.
  const dob = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(dob.getTime()) ? null : dob;
}

function calculateAge(dob) {
  const now = new Date();
  let age = now.getUTCFullYear() - dob.getUTCFullYear();
  const hasHadBirthdayThisYear =
    now.getUTCMonth() > dob.getUTCMonth() ||
    (now.getUTCMonth() === dob.getUTCMonth() && now.getUTCDate() >= dob.getUTCDate());

  if (!hasHadBirthdayThisYear) {
    age -= 1;
  }

  return age;
}

function validatePayload(payload) {
  if (!payload || typeof payload !== "object") {
    return "Request body is required.";
  }

  // Read and normalize the exact JSON fields expected from script.js.
  const name = typeof payload.name === "string" ? payload.name.trim() : "";
  const email = typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";
  const dobValue = typeof payload.dob === "string" ? payload.dob.trim() : "";
  const ageVerified = payload.ageVerified === true;

  if (!name || !email || !dobValue) {
    return "Name, email, and date of birth are required.";
  }

  if (!EMAIL_PATTERN.test(email)) {
    return "A valid email address is required.";
  }

  const dob = parseDob(dobValue);

  if (!dob) {
    return "A valid date of birth is required.";
  }

  if (dob > new Date()) {
    return "Date of birth cannot be in the future.";
  }

  const age = calculateAge(dob);

  if (age < 18) {
    return "You must be at least 18 years old to download this beta.";
  }

  if (!ageVerified) {
    return "Please confirm that you are at least 18 years old.";
  }

  return "";
}

async function insertDownloadRecord(env, payload) {
  // These values must be stored as Cloudflare Pages environment variables.
  const supabaseUrl = env.SUPABASE_URL;
  const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase environment variables.");
  }

  // Insert directly into the Supabase REST API.
  // The service role key stays here on the server and is never sent to the browser.
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
      dob: payload.dob
    })
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Supabase insert failed: ${details}`);
  }
}

export async function onRequest(context) {
  try {
    const { request, env } = context;
    if (request.method !== "POST") {
      return jsonResponse({ error: "Method not allowed. Use POST." }, 405);
    }

    // Point GAME_DOWNLOAD_URL at your final hosted ZIP file when the beta build is ready.
    const gameDownloadUrl = env.GAME_DOWNLOAD_URL;

    if (!gameDownloadUrl) {
      return jsonResponse({ error: "Missing GAME_DOWNLOAD_URL environment variable." }, 500);
    }

    // Parse the JSON body sent by the frontend form.
    const payload = await request.json();
    const validationError = validatePayload(payload);

    if (validationError) {
      return jsonResponse({ error: validationError }, 400);
    }

    // Store the approved download request in Supabase.
    await insertDownloadRecord(env, payload);

    return jsonResponse({
      success: true,
      downloadUrl: gameDownloadUrl
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
