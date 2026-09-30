import { json, handleOptions } from "./_utils.js";

export default async (event) => {
  if (event.httpMethod === "OPTIONS") return handleOptions();
  return json({ status: "ok" });
};