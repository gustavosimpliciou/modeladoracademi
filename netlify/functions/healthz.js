import { json, handleOptions } from "./_utils.js";

export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return handleOptions();
  return json({ status: "ok" });
};