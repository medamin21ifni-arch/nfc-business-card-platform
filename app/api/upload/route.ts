import { NextResponse } from "next/server";
import { isAdmin } from "../../../lib/auth";
import { uploadBusinessImage } from "../../../lib/store";

export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const form = await request.formData();
  const file = form.get("file");
  const slug = String(form.get("slug") || "business");
  const kind = String(form.get("kind") || "store") as "logo" | "store";
  if (!(file instanceof File) || !file.type.startsWith("image/")) return NextResponse.json({ error: "Image invalide" }, { status: 400 });
  if (file.size > 8 * 1024 * 1024) return NextResponse.json({ error: "Image trop lourde (8MB max)" }, { status: 400 });
  return NextResponse.json({ url: await uploadBusinessImage(file, slug, kind) });
}
