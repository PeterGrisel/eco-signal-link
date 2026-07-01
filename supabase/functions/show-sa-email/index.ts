Deno.serve(() => new Response(Deno.env.get("GOOGLE_SA_CLIENT_EMAIL") ?? "missing", { headers: { "content-type": "text/plain", "access-control-allow-origin": "*" }}));
