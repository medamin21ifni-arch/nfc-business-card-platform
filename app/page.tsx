import Link from "next/link";
import { getBusinesses } from "../lib/store";
export const dynamic = "force-dynamic";
export default async function Home() { const businesses = await getBusinesses(); return <main className="platform-home"><div className="platform-panel"><span className="platform-kicker">NFC BUSINESS CARDS</span><h1>Votre fabrique de cartes digitales.</h1><p>Créez une carte élégante pour chaque client depuis un seul espace privé.</p><Link className="platform-button" href="/admin">Ouvrir l’Admin Panel</Link>{businesses.length > 0 && <div className="platform-links"><strong>Cartes publiées</strong>{businesses.map((item) => <Link key={item.id} href={`/${item.slug}`}>{item.name} <span>↗</span></Link>)}</div>}</div></main>; }
