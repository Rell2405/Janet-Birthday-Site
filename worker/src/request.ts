import { HttpError } from "./http-error";

const textDecoder = new TextDecoder();

export async function readJsonBody(
  request: Request,
  maximumBytes: number,
): Promise<unknown> {
  const contentType = request.headers.get("content-type")?.split(";", 1)[0];
  if (contentType !== "application/json") {
    throw new HttpError(
      415,
      "unsupported_media_type",
      "Content-Type must be application/json.",
    );
  }

  const declaredLength = request.headers.get("content-length");
  if (declaredLength !== null && Number(declaredLength) > maximumBytes) {
    throw new HttpError(413, "payload_too_large", "Request body is too large.");
  }

  if (!request.body) {
    throw new HttpError(400, "missing_body", "A JSON request body is required.");
  }

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    totalBytes += value.byteLength;
    if (totalBytes > maximumBytes) {
      await reader.cancel("Request body exceeded the configured maximum.");
      throw new HttpError(413, "payload_too_large", "Request body is too large.");
    }
    chunks.push(value);
  }

  const body = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }

  try {
    return JSON.parse(textDecoder.decode(body)) as unknown;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new HttpError(400, "invalid_json", "Request body must be valid JSON.");
    }
    throw error;
  }
}

