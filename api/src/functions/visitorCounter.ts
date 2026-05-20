import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { CosmosDbService } from "../services/cosmosDbService";

const cosmos = new CosmosDbService();

const ALLOWED_ORIGINS = [
    "http://localhost:4200",
    "https://black-sky-08599bc03.7.azurestaticapps.net",
];

export async function visitorCounter(
    request: HttpRequest,
    context: InvocationContext
): Promise<HttpResponseInit> {
    context.log(`VisitorCounter triggered: ${request.method} ${request.url}`);

    const origin = request.headers.get("origin") ?? "";
    const allowedOrigin = ALLOWED_ORIGINS.indexOf(origin) !== -1 ? origin : ALLOWED_ORIGINS[0];

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, no-cache, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
        "Access-Control-Allow-Origin": allowedOrigin,
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
        return { status: 204, headers };
    }

    try {
        const updated = await cosmos.incrementVisitorCount();
        return {
            status: 200,
            headers,
            jsonBody: { count: updated.count },
        };
    } catch (error) {
        context.error("Cosmos DB error:", error);

        context.log({
            severity: 'error',
            message: 'Cosmos DB operation failed',
            error: error instanceof Error ? error.message : String(error),
            url: request.url,
        });

        return {
            status: 500,
            headers,
            jsonBody: { error: "Failed to access Cosmos DB" },
        };
    }
}

app.http("visitor-count", {
    methods: ["GET", "OPTIONS"],
    authLevel: "anonymous",
    handler: visitorCounter,
});