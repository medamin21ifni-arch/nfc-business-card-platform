import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BusinessCard from "../../components/BusinessCard";
import { getBusinesses } from "../../lib/store";

export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; const business = (await getBusinesses()).find((item) => item.slug === slug); return business ? { title: `${business.name} — ${business.locationLabel}`, description: business.description } : { title: "Carte digitale" }; }
export default async function BusinessPage({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const business = (await getBusinesses()).find((item) => item.slug === slug); if (!business) notFound(); return <BusinessCard business={business} />; }
