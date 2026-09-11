import "server-only";
import { del, list, put } from "@vercel/blob";
import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { BusinessRecord } from "./types";

const blobPath = "nfc-business-platform/businesses.json";
const localPath = path.join(process.cwd(), "data", "businesses.json");

function key() {
  return createHash("sha256").update(process.env.ADMIN_PASSWORD || "local-development-key").digest();
}

function encrypt(value: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), encrypted]).toString("base64url");
}

function decrypt(value: string) {
  const raw = Buffer.from(value, "base64url");
  const decipher = createDecipheriv("aes-256-gcm", key(), raw.subarray(0, 12));
  decipher.setAuthTag(raw.subarray(12, 28));
  return Buffer.concat([decipher.update(raw.subarray(28)), decipher.final()]).toString("utf8");
}

export async function getBusinesses(): Promise<BusinessRecord[]> {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const result = await list({ prefix: blobPath, token: process.env.BLOB_READ_WRITE_TOKEN });
    const file = result.blobs.find((item) => item.pathname === blobPath);
    if (!file) return [];
    const response = await fetch(file.url, { cache: "no-store" });
    if (!response.ok) throw new Error("Unable to read business storage");
    const text = await response.text();
    return JSON.parse(decrypt(text)) as BusinessRecord[];
  }
  try {
    return JSON.parse(await readFile(localPath, "utf8")) as BusinessRecord[];
  } catch {
    return [];
  }
}

export async function saveBusinesses(businesses: BusinessRecord[]) {
  const serialized = JSON.stringify(businesses, null, 2);
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    await put(blobPath, encrypt(serialized), {
      access: "public",
      addRandomSuffix: false,
      contentType: "text/plain",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    return;
  }
  await mkdir(path.dirname(localPath), { recursive: true });
  await writeFile(localPath, serialized, "utf8");
}

export async function uploadBusinessImage(file: File, slug: string, kind: "logo" | "store") {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    const bytes = Buffer.from(await file.arrayBuffer());
    return `data:${file.type};base64,${bytes.toString("base64")}`;
  }
  const safeName = `${slug}-${kind}-${Date.now()}-${file.name.replace(/[^a-z0-9.-]/gi, "-")}`;
  const result = await put(`nfc-business-platform/images/${safeName}`, file, {
    access: "public",
    addRandomSuffix: false,
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });
  return result.url;
}
