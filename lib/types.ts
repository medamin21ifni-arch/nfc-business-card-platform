export type BusinessRecord = {
  id: string;
  name: string;
  slug: string;
  logoUrl: string;
  storeImageUrl: string;
  heroEyebrow: string;
  heroHeadline: string;
  heroSecondary: string;
  category: string;
  description: string;
  locationLabel: string;
  address: string;
  phone: string;
  whatsapp: string;
  whatsappMessage: string;
  instagram?: string;
  tiktok?: string;
  facebook?: string;
  website?: string;
  mapsUrl: string;
  storeHeading: string;
  storeStatus?: string;
  footerText: string;
  primaryColor: string;
  secondaryColor: string;
  createdAt: string;
  updatedAt: string;
};

export const emptyBusiness: Omit<BusinessRecord, "id" | "createdAt" | "updatedAt"> = {
  name: "",
  slug: "",
  logoUrl: "",
  storeImageUrl: "",
  heroEyebrow: "Votre beauté, votre histoire",
  heroHeadline: "Révélez votre éclat",
  heroSecondary: "BEAUTÉ · SOINS · STYLE",
  category: "Beauté · Cosmétique",
  description: "Une expérience beauté pensée pour vous.",
  locationLabel: "Votre ville",
  address: "",
  phone: "",
  whatsapp: "",
  whatsappMessage: "Bonjour, je vous contacte depuis votre carte digitale.",
  mapsUrl: "",
  storeHeading: "Notre boutique",
  storeStatus: "Ouvert aujourd’hui",
  footerText: "La beauté nous rapproche",
  primaryColor: "#111111",
  secondaryColor: "#d91f5b",
};
