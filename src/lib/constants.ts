export enum CasketPart {
  BODY = "body",
  CAP = "cap",
  HANDLE = "handle", 
  ENDCAP = "endcap",
  PILLOW = "pillow",
  MOULDING = "moulding",
  INTERIOR = "interior",
  HARDWARE = "hardware"
}

export enum Material {
  GLOSSY = "glossy",
  WOOD = "wood",
  FABRIC = "fabric",
  METAL = "metal",
  PLASTIC = "plastic"
}

export interface CasketPartConfig {
  name: string;
  color: string;
  material: Material;
}

export const materials = {
  [Material.GLOSSY]: {
    name: "High-Gloss Finish",
    description: "Smooth reflective surface with a premium look"
  },
  [Material.WOOD]: {
    name: "Natural Wood",
    description: "Traditional wood grain texture"
  },
  [Material.FABRIC]: {
    name: "Fabric",
    description: "Soft textile finish for interior components"
  },
  [Material.METAL]: {
    name: "Metal",
    description: "Durable metallic finish for hardware components"
  },
  [Material.PLASTIC]: {
    name: "Composite",
    description: "Versatile and durable synthetic material"
  }
};

// Default configurations for each casket part
export const partConfigs: Record<CasketPart, CasketPartConfig> = {
  [CasketPart.BODY]: {
    name: "Main Body",
    color: "#FFFFFF",
    material: Material.GLOSSY
  },
  [CasketPart.CAP]: {
    name: "Cap Panel",
    color: "#FFFFFF",
    material: Material.GLOSSY
  },
  [CasketPart.HANDLE]: {
    name: "Handles",
    color: "#D4AF37",
    material: Material.METAL
  },
  [CasketPart.ENDCAP]: {
    name: "Metal Endcaps",
    color: "#D4AF37",
    material: Material.METAL
  },
  [CasketPart.PILLOW]: {
    name: "Pillow",
    color: "#F8F8FF",
    material: Material.FABRIC
  },
  [CasketPart.MOULDING]: {
    name: "Decorative Edges",
    color: "#D4AF37",
    material: Material.METAL
  },
  [CasketPart.INTERIOR]: {
    name: "Interior Lining",
    color: "#F8F8FF",
    material: Material.FABRIC
  },
  [CasketPart.HARDWARE]: {
    name: "Hardware",
    color: "#D4AF37",
    material: Material.METAL
  }
};

// Standard casket dimensions in meters
export const CASKET_DIMENSIONS = {
  length: 2.1, // 210 cm
  width: 0.7,  // 70 cm
  height: 0.6  // 60 cm
};

// Available styles typical in Philippine caskets
export const CASKET_STYLES = [
  { id: "traditional", name: "Traditional" },
  { id: "modern", name: "Modern" },
  { id: "catholic", name: "Catholic" },
  { id: "premium", name: "Premium" },
  { id: "basic", name: "Basic" }
];


// dashboard
export const bookings = [
  {
    id: 1,
    deceasedName: "Sarah Johnson",
    customerName: "Michael Johnson",
    customerEmail: "michael.johnson@email.com",
    customerPhone: "+1 (555) 123-4567",
    location: "Grace Memorial Chapel",
    date: "March 15, 2025",
    time: "10:00 AM",
    attendees: 120,
    status: "Confirmed",
    services: {
      casket: "Premium Mahogany",
      flowers: "White Lilies & Roses",
      memorial: "Digital Memorial Service",
    },
    additionalNotes:
      "Family requests privacy during the service. Digital memorial link will be shared with attendees.",
    totalPrice: 8500,
    image:
      "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&q=80&w=1000",
  },
  {
    id: 2,
    deceasedName: "Robert Wilson",
    customerName: "Emily Wilson",
    customerEmail: "emily.wilson@email.com",
    customerPhone: "+1 (555) 234-5678",
    location: "Eternal Peace Cemetery",
    date: "March 16, 2025",
    time: "2:30 PM",
    attendees: 80,
    status: "Pending",
    services: {
      casket: "Classic Oak",
      flowers: "Mixed Seasonal Bouquet",
      memorial: "Traditional Service",
    },
    additionalNotes:
      "Please arrange for live music during the service. Family prefers classical compositions.",
    totalPrice: 6800,
    image:
      "https://images.unsplash.com/photo-1544829832-c8047d6a8d04?auto=format&fit=crop&q=80&w=1000",
  },
  {
    id: 3,
    deceasedName: "Maria Rodriguez",
    customerName: "Carlos Rodriguez",
    customerEmail: "carlos.rodriguez@email.com",
    customerPhone: "+1 (555) 345-6789",
    location: "Sacred Heart Church",
    date: "March 17, 2025",
    time: "11:15 AM",
    attendees: 150,
    status: "Confirmed",
    services: {
      casket: "Silver Steel",
      flowers: "Red & White Roses",
      memorial: "Hybrid Service",
    },
    additionalNotes:
      "Bilingual service requested. Please ensure all materials are available in both English and Spanish.",
    totalPrice: 7200,
    image:
      "https://images.unsplash.com/photo-1490122417551-6ee9691429d0?auto=format&fit=crop&q=80&w=1000",
  },
];