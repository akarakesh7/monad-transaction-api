(() => {
    var __defProp = Object.defineProperty;
    var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
  
    // index.js
    var ALLOWED_ORIGINS = [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://127.0.0.1:5173",
      "http://127.0.0.1:5174",
      "https://cryptowalletsx.com",
      "https://www.cryptowalletsx.com"
    ];
    addEventListener("fetch", (event) => {
      event.respondWith(handleRequest(event.request));
    });
    function isValidApiKey(request) {
      const apiKeyHeader = request.headers.get("X-API-Key");
      const url = new URL(request.url);
      const apiKeyParam = url.searchParams.get("api_key");
      const validApiKey = API_KEY;
      return apiKeyHeader === validApiKey || apiKeyParam === validApiKey;
    }
    __name(isValidApiKey, "isValidApiKey");
    async function handleRequest(request) {
      if (request.method === "OPTIONS") {
        return handleCors(request, new Response(null, { status: 204 }));
      }
      try {
        if (request.method !== "GET") {
          return handleCors(request, new Response(JSON.stringify({ error: "Method not allowed" }), {
            status: 405,
            headers: { "Content-Type": "application/json" }
          }));
        }
        if (!isValidApiKey(request)) {
          return handleCors(request, new Response(
            JSON.stringify({ error: "Unauthorized. Invalid or missing API key." }),
            {
              status: 401,
              headers: { "Content-Type": "application/json" }
            }
          ));
        }
        const url = new URL(request.url);
        const address = url.searchParams.get("address");
        const page = url.searchParams.get("page") || "1";
        const limit = url.searchParams.get("limit") || "100";
        if (!address) {
          return handleCors(request, new Response(
            JSON.stringify({ error: "Wallet address is required" }),
            {
              status: 400,
              headers: { "Content-Type": "application/json" }
            }
          ));
        }
        const thirdwebUrl = `https://insight.thirdweb.com/v1/transactions?chain=10143&filter_from_address=${address}&limit=${limit}&page=${page}`;
        const clientId = THIRDWEB_CLIENT_ID;
        const response = await fetch(`${thirdwebUrl}&clientId=${clientId}`, {
          headers: {
            "Content-Type": "application/json"
            // Any additional headers needed
          }
        });
        if (!response.ok) {
          const errorText = await response.text();
          console.error("ThirdWeb API error:", errorText);
          return handleCors(request, new Response(
            JSON.stringify({ error: "Failed to fetch transaction data" }),
            {
              status: response.status,
              headers: { "Content-Type": "application/json" }
            }
          ));
        }
        const data = await response.json();
        const transformedData = {
          success: true,
          data,
          pagination: {
            currentPage: parseInt(page),
            limit: parseInt(limit),
            total: data.result_count || 0
          }
        };
        return handleCors(request, new Response(
          JSON.stringify(transformedData),
          {
            status: 200,
            headers: { "Content-Type": "application/json" }
          }
        ));
      } catch (error) {
        console.error("Worker error:", error);
        return handleCors(request, new Response(
          JSON.stringify({ error: "An error occurred processing your request" }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" }
          }
        ));
      }
    }
    __name(handleRequest, "handleRequest");
    function handleCors(request, response) {
      const origin = request.headers.get("Origin");
      const corsHeaders = {
        "Access-Control-Allow-Origin": ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, X-API-Key",
        "Access-Control-Max-Age": "86400"
      };
      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      return response;
    }
    __name(handleCors, "handleCors");
  })();
  //# sourceMappingURL=index.js.map
  