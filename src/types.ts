export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  category: "fruit" | "spice";
  image: string;
  imageAlt?: string;
  benefits: string[];
}

export const PRODUCTS: Product[] = [
  {
    id: "strawberry-powder",
    name: "Poudre de Fraise",
    description: "Fraise transformée naturellement sans additifs, conservant toute sa saveur et ses vitamines.",
    price: 18,
    unit: "250g",
    category: "fruit",
    image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&q=80&w=800",
    benefits: ["Riche en Vitamine C", "Source d'Antioxydants", "Goût intense"]
  },
  {
    id: "mangosteen-powder",
    name: "Poudre de Mangoustan",
    description: "Le 'reine des fruits' transformé en poudre pour ses propriétés exceptionnelles.",
    price: 25,
    unit: "250g",
    category: "fruit",
    image: "https://images.unsplash.com/photo-1590005024862-6b67679a29fb?auto=format&fit=crop&q=80&w=800",
    benefits: ["Super-fruit", "Soutien immunitaire", "Anti-inflammatoire"]
  },
  {
    id: "garlic-powder",
    name: "Poudre d'Ail",
    description: "Ail pur de la RDC, séché et moulu pour une utilisation culinaire facile.",
    price: 12,
    unit: "250g",
    category: "spice",
    image: "https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&q=80&w=800",
    benefits: ["Santé cardiaque", "Antibactérien naturel", "Riche en saveur"]
  },
  {
    id: "pineapple-powder",
    name: "Poudre d'Ananas",
    description: "Ananas tropical séché, parfait pour vos boissons et desserts.",
    price: 15,
    unit: "250g",
    category: "fruit",
    image: "https://images.unsplash.com/photo-1550258114-b834e70e9be1?auto=format&fit=crop&q=80&w=800",
    benefits: ["Aide à la digestion", "Riche en Bromélaïne", "Énergisant"]
  },
  {
    id: "lemon-powder",
    name: "Poudre de Citron",
    description: "Citron frais transformé en poudre fine, idéal pour l'assaisonnement.",
    price: 10,
    unit: "250g",
    category: "fruit",
    image: "https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&q=80&w=800",
    benefits: ["Détoxifiant", "Riche en Vitamine C", "Alcalinisant"]
  },
  {
    id: "soursop-powder",
    name: "Poudre de Corossol",
    description: "Corossol pur, reconnu pour ses vertus thérapeutiques et son goût unique.",
    price: 22,
    unit: "250g",
    category: "fruit",
    image: "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&q=80&w=800",
    benefits: ["Soutien immunitaire", "Relaxant naturel", "Riche en nutriments"]
  },
  {
    id: "beetroot-powder",
    name: "Poudre de Betterave",
    description: "Betterave rouge riche en fer et en minéraux, transformée avec soin.",
    price: 14,
    unit: "250g",
    category: "fruit",
    image: "https://images.unsplash.com/photo-1528133332062-f74f09b452e7?auto=format&fit=crop&q=80&w=800",
    benefits: ["Riche en fer", "Améliore l'endurance", "Détoxifiant"]
  },
  {
    id: "orange-powder",
    name: "Poudre d'Orange",
    description: "Orange premium transformée en poudre pour une saveur authentique.",
    price: 12,
    unit: "200g",
    category: "fruit",
    image: "https://images.unsplash.com/photo-1557800636-894a64c1696f?auto=format&fit=crop&q=80&w=800",
    benefits: ["Vitamine C pure", "Saveur intense", "Multi-usage"]
  }
];
