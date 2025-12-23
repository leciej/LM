export type Product = {
  id: string;
  name: string;
  artist: string;
  price: number;
  description: string;
  image?: string; // placeholder (pod backend / image-picker)
};

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Zachód słońca nad jeziorem',
    artist: 'Anna Kowalska',
    price: 120,
    description:
      'Delikatna akwarela przedstawiająca ciepły zachód słońca nad spokojnym jeziorem.',
  },
  {
    id: '2',
    name: 'Leśna ścieżka',
    artist: 'Marek Nowak',
    price: 95,
    description:
      'Akwarela z motywem leśnej ścieżki, idealna do wnętrz w stylu boho.',
  },
  {
    id: '3',
    name: 'Miasto w deszczu',
    artist: 'Julia Wiśniewska',
    price: 150,
    description:
      'Nowoczesna akwarela przedstawiająca miasto podczas deszczowego wieczoru.',
  },
  {
    id: '4',
    name: 'Góry o poranku',
    artist: 'Piotr Zieliński',
    price: 180,
    description:
      'Ręcznie malowana akwarela ukazująca górski krajobraz o wczesnym poranku.',
  },
  {
    id: '5',
    name: 'Kwiaty polne',
    artist: 'Katarzyna Maj',
    price: 80,
    description:
      'Lekka i jasna akwarela z motywem polnych kwiatów.',
  },
];
