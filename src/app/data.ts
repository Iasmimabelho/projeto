export interface Animal {
  id: number;
  name: string;
  age: string;
  size: string;
  sex: string;
  castrated: boolean;
  vaccinated: boolean;
  description: string;
  status: "disponivel" | "tratamento" | "adotado";
  image: string;
  species: string;
  personality: string[];
  apadrinhar?: boolean;
}

export const ANIMALS: Animal[] = [
  {
    id: 1, name: "Thor", age: "2 anos", size: "Grande", sex: "Macho",
    castrated: true, vaccinated: true,
    description: "Labrador dócil e brincalhão, adora crianças e outros animais. Resgatado de situação de abandono em Jacarepaguá.",
    status: "disponivel",
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=500&h=380&fit=crop&auto=format",
    species: "Cachorro", personality: ["Dócil", "Brincalhão", "Sociável"],
  },
  {
    id: 2, name: "Luna", age: "1 ano", size: "Pequeno", sex: "Fêmea",
    castrated: true, vaccinated: true,
    description: "Gatinha carinhosa e tranquila, adora colo e ronronar. Ideal para apartamento. Muito gentil com crianças.",
    status: "disponivel",
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500&h=380&fit=crop&auto=format",
    species: "Gato", personality: ["Carinhosa", "Tranquila", "Independente"],
  },
  {
    id: 3, name: "Bolt", age: "3 anos", size: "Médio", sex: "Macho",
    castrated: false, vaccinated: true,
    description: "Vira-lata energético e leal. Precisa de espaço para correr e brincar. Ótimo cão de companhia.",
    status: "disponivel",
    image: "https://images.unsplash.com/photo-1546238232-20216dec9f72?w=500&h=380&fit=crop&auto=format",
    species: "Cachorro", personality: ["Energético", "Leal", "Curioso"],
  },
  {
    id: 4, name: "Mia", age: "4 meses", size: "Pequeno", sex: "Fêmea",
    castrated: false, vaccinated: true,
    description: "Filhote curiosa e ativa, aprende rápido. Procura família amorosa para crescer junto.",
    status: "disponivel",
    image: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=500&h=380&fit=crop&auto=format",
    species: "Gato", personality: ["Curiosa", "Ativa", "Esperta"],
  },
  {
    id: 5, name: "Rex", age: "5 anos", size: "Grande", sex: "Macho",
    castrated: true, vaccinated: true,
    description: "Pastor Alemão gentil e protetor, excelente com famílias. Em reabilitação após resgate de maus-tratos.",
    status: "tratamento",
    image: "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=500&h=380&fit=crop&auto=format",
    species: "Cachorro", personality: ["Protetor", "Gentil", "Inteligente"],
  },
  {
    id: 6, name: "Pipoca", age: "6 meses", size: "Pequeno", sex: "Fêmea",
    castrated: false, vaccinated: true,
    description: "Calopsita lindíssima, já foi adotada por uma família apaixonada! Você pode apadrinhar outras aves como ela.",
    status: "adotado",
    image: "https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=500&h=380&fit=crop&auto=format",
    species: "Ave", personality: ["Musical", "Carinhosa", "Curiosa"],
    apadrinhar: true,
  },
  {
    id: 7, name: "Frederico", age: "1 ano", size: "Pequeno", sex: "Macho",
    castrated: false, vaccinated: true,
    description: "Coelho anão docinho, adora atenção. Vive bem em apartamento com espaço para pular.",
    status: "disponivel",
    image: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=500&h=380&fit=crop&auto=format",
    species: "Coelho", personality: ["Calmo", "Curioso", "Dócil"],
  },
];

export const STATS = [
  { label: "Animais Resgatados", value: "4.820" },
  { label: "Adoções Realizadas", value: "3.215" },
  { label: "Castrações", value: "8.430" },
  { label: "Vacinas Aplicadas", value: "12.600" },
  { label: "Animais Silvestres", value: "940" },
  { label: "Doações (R$)", value: "892K" },
];

export const PROJECTS = [
  { title: "Patinhas Seguras", desc: "Resgate de cães e gatos abandonados nas ruas e matas da cidade." },
  { title: "Vida Silvestre", desc: "Resgate, reabilitação e soltura monitorada de animais silvestres." },
  { title: "Castração Solidária", desc: "Castração gratuita para famílias em vulnerabilidade social." },
  { title: "Hospital Solidário", desc: "Atendimento veterinário gratuito para animais resgatados." },
];
