import { NextResponse } from "next/server";
import { isAdmin } from "../../../lib/auth";
import { getBusinesses, saveBusinesses } from "../../../lib/store";
import type { BusinessRecord } from "../../../lib/types";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  return NextResponse.json(await getBusinesses());
}

export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const body = await request.json();
  const businesses = await getBusinesses();
  const now = new Date().toISOString();
  const record: BusinessRecord = { ...body, id: crypto.randomUUID(), createdAt: now, updatedAt: now };
  if (!record.name || !record.slug || !record.logoUrl || !record.storeImageUrl) return NextResponse.json({ error: "Nom, slug et deux images sont obligatoires" }, { status: 400 });
  if (businesses.some((item) => item.slug === record.slug)) return NextResponse.json({ error: "Ce slug existe déjà" }, { status: 409 });
  businesses.push(record);
  await saveBusinesses(businesses);
  return NextResponse.json(record, { status: 201 });
}

export async function PUT(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const body = await request.json();
  const businesses = await getBusinesses();
  const index = businesses.findIndex((item) => item.id === body.id);
  if (index < 0) return NextResponse.json({ error: "Business introuvable" }, { status: 404 });
  if (businesses.some((item) => item.slug === body.slug && item.id !== body.id)) return NextResponse.json({ error: "Ce slug existe déjà" }, { status: 409 });
  businesses[index] = { ...businesses[index], ...body, updatedAt: new Date().toISOString() };
  await saveBusinesses(businesses);
  return NextResponse.json(businesses[index]);
}

export async function DELETE(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const { id } = await request.json();
  await saveBusinesses((await getBusinesses()).filter((item) => item.id !== id));
  return NextResponse.json({ ok: true });
}
