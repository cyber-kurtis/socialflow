export function jsonResponse(data: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
}

export function errorResponse(message: string, status = 400) {
  return jsonResponse({ ok: false, error: message }, { status });
}
