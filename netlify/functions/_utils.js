// Netlify Function helpers
export function json(data, status = 200) {
  return {
    statusCode: status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS"
    },
    body: JSON.stringify(data)
  };
}

export function error(message, status = 400) {
  return json({ error: message }, status);
}

export function getQuery(event, key) {
  return event.queryStringParameters?.[key];
}

export function getBody(event) {
  try {
    return event.body ? JSON.parse(event.body) : {};
  } catch {
    return {};
  }
}

export function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  };
}

export function handleOptions() {
  return {
    statusCode: 200,
    headers: corsHeaders(),
    body: ""
  };
}