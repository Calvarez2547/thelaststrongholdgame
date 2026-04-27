// Legacy endpoint kept only as a compatibility shim.
// The site now uses the waitlist flow instead of game downloads.

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });
}

export async function onRequest(context) {
  const { request } = context;

  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed. Use POST." }, 405);
  }

  return jsonResponse(
    {
      error: "Downloads are no longer available. Please use the waitlist signup instead."
    },
    410
  );
}
