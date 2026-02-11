import type { EndpointsMap, Mode, Format } from "./types";
import { ENDPOINTS } from "./endpoints.generated.js";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store",
};

function getRandomElement<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getExamplesForMode(endpoint: EndpointsMap[string], mode: Mode): readonly string[] {
  const modeExamples = endpoint.examplesByMode?.[mode];
  if (modeExamples && modeExamples.length > 0) return modeExamples;
  return endpoint.examples;
}

function resolveMode(endpoint: EndpointsMap[string], requested: Mode): Mode {
  return endpoint.modes.includes(requested) ? requested : "normal";
}

/** When mode is omitted, pick a random mode from the endpoint; otherwise use (and resolve) the requested mode. */
function getEffectiveMode(endpoint: EndpointsMap[string], url: URL, requestedMode: Mode): Mode {
  return url.searchParams.has("mode")
    ? resolveMode(endpoint, requestedMode)
    : (getRandomElement(endpoint.modes) as Mode);
}

function toText(endpoint: EndpointsMap[string], mode: Mode): string {
  const resolved = resolveMode(endpoint, mode);
  const examples = getExamplesForMode(endpoint, resolved);
  return getRandomElement(examples);
}

function toJson(endpoint: EndpointsMap[string], mode: Mode) {
  const resolved = resolveMode(endpoint, mode);
  const examples = getExamplesForMode(endpoint, resolved);
  return {
    name: endpoint.name,
    description: endpoint.description,
    example: getRandomElement(examples),
    mode: resolved,
  };
}

export async function handleRequest(request: Request): Promise<Response> {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: CORS_HEADERS,
    });
  }

  const url = new URL(request.url);
  const pathname = url.pathname.replace(/^\/+|\/+$/g, "").toLowerCase();
  const mode = (url.searchParams.get("mode") || "normal") as Mode;
  const format = (url.searchParams.get("format") || "json") as Format;

  if (pathname === "" || pathname === "help") {
    const endpointsList = Object.values(ENDPOINTS).map((e) => ({
      name: e.name,
      description: e.description,
      path: `/${e.name}`,
      exampleCount: e.examples.length,
      modes: e.modes,
    }));

    const helpJson = {
      service: "DOaaS",
      description:
        "DevOps-as-a-Service — endpoint responses for excuses, motivations, reality checks, and more",
      version: "1.0",
      baseUrl: `${url.origin}/`,
      usage: {
        path: "/:endpoint",
        query: {
          mode: "normal | chaos | corporate | security | wholesome | toxic | sarcastic | devops",
          format: "json | text",
        },
        note: "Omitting mode picks a random mode from that endpoint's supported modes; use ?mode=... to filter.",
        examples: [
          "/blame?format=text",
          "/motivate?mode=wholesome&format=json",
          "/random?format=json",
        ],
      },
      endpoints: endpointsList,
    };

    if (format === "text") {
      const helpText = `DOaaS Endpoints:
Available endpoints: ${Object.keys(ENDPOINTS).join(", ")}
Use /:endpoint?mode=normal|chaos|corporate|security|wholesome|toxic|sarcastic|devops&format=json|text
Omitting mode picks a random mode per endpoint; use ?mode=... to filter.
Examples:
  /blame?format=text
  /motivate?mode=wholesome&format=json
`;
      return new Response(helpText, {
        status: 200,
        headers: {
          ...CORS_HEADERS,
          ...NO_STORE_HEADERS,
          "Content-Type": "text/plain; charset=utf-8",
        },
      });
    }

    return new Response(JSON.stringify(helpJson, null, 2), {
      status: 200,
      headers: {
        ...CORS_HEADERS,
        ...NO_STORE_HEADERS,
        "Content-Type": "application/json; charset=utf-8",
      },
    });
  }

  if (pathname === "random") {
    let keys = Object.keys(ENDPOINTS).filter((k) => k !== "random");
    if (url.searchParams.has("mode")) {
      const requestedMode = url.searchParams.get("mode") as Mode;
      keys = keys.filter((k) => {
        const ep = ENDPOINTS[k as keyof typeof ENDPOINTS];
        return (ep.modes as readonly Mode[]).includes(requestedMode);
      });
      if (keys.length === 0) {
        return new Response(
          JSON.stringify(
            {
              error: "No endpoint supports the requested mode",
              requestedMode,
              supportedModes: [...new Set(Object.values(ENDPOINTS).flatMap((e) => e.modes))],
            },
            null,
            2
          ),
          {
            status: 404,
            headers: {
              ...CORS_HEADERS,
              ...NO_STORE_HEADERS,
              "Content-Type": "application/json; charset=utf-8",
            },
          }
        );
      }
    }
    const randomKey = getRandomElement(keys);
    const endpoint = ENDPOINTS[randomKey as keyof typeof ENDPOINTS];
    const effectiveMode = getEffectiveMode(endpoint, url, mode);
    const body =
      format === "text"
        ? toText(endpoint, effectiveMode)
        : JSON.stringify(toJson(endpoint, effectiveMode), null, 2);
    return new Response(body, {
      status: 200,
      headers: {
        ...CORS_HEADERS,
        ...NO_STORE_HEADERS,
        "Content-Type":
          format === "text" ? "text/plain; charset=utf-8" : "application/json; charset=utf-8",
      },
    });
  }

  if (!(pathname in ENDPOINTS)) {
    return new Response(JSON.stringify({ error: "Endpoint not found" }, null, 2), {
      status: 404,
      headers: {
        ...CORS_HEADERS,
        ...NO_STORE_HEADERS,
        "Content-Type": "application/json; charset=utf-8",
      },
    });
  }

  const endpoint = ENDPOINTS[pathname as keyof typeof ENDPOINTS];
  const effectiveMode = getEffectiveMode(endpoint, url, mode);
  const body =
    format === "text"
      ? toText(endpoint, effectiveMode)
      : JSON.stringify(toJson(endpoint, effectiveMode), null, 2);

  return new Response(body, {
    status: 200,
    headers: {
      ...CORS_HEADERS,
      ...NO_STORE_HEADERS,
      "Content-Type":
        format === "text" ? "text/plain; charset=utf-8" : "application/json; charset=utf-8",
    },
  });
}

/** Module worker entry: default export is used by Wrangler; named handleRequest is for tests. */
export default {
  fetch: handleRequest,
};
