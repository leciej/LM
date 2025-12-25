export type Product = {
  id: string;
  name: string;
  artist: string; // fikcyjna marka / „autor”
  price: number;
  description: string;
  image?: string; // stock image (zawsze obecny)
};

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Akwarela Ultramarine Blue – Ambitny Kobalt',
    artist: 'Akademia Farb Wodnych',
    price: 26.99,
    description:
      'Intensywna farba akwarelowa o wyraźnym charakterze i silnej potrzebie dominacji nad paletą. Lubi porządek, czyste pociągnięcia i nie toleruje przypadkowych rozmyć.',
    image:
      'https://images.unsplash.com/photo-1508264165352-258859e62245',
  },
  {
    id: '2',
    name: 'Akwarela Burnt Sienna – Kontrolowany Chaos',
    artist: 'Akademia Farb Wodnych',
    price: 24.5,
    description:
      'Ciepły, ziemisty kolor akwarelowy o pozornej dzikości, który w rzeczywistości doskonale współpracuje z kompozycją. Sprawdza się w pejzażach i studiach architektury.',
    image:
      'https://images.unsplash.com/photo-1513364776144-60967b0f800f',
  },
  {
    id: '3',
    name: 'Pędzel akwarelowy okrągły #6 – Precyzyjny Strateg',
    artist: 'WaterMind Tools',
    price: 15.99,
    description:
      'Okrągły pędzel akwarelowy z syntetycznym włosiem. Zapewnia pełną kontrolę nad detalem i dobrze trzyma wodę. Idealny do świadomych, zaplanowanych pociągnięć.',
    image:
      'https://images.unsplash.com/photo-1589987607627-616cac0d7c06de',
  },
  {
    id: '4',
    name: 'Pędzel akwarelowy płaski #10 – Monumentalny Gest',
    artist: 'WaterMind Tools',
    price: 18.49,
    description:
      'Płaski pędzel do szerokich pociągnięć i zdecydowanych efektów. Dobrze sprawdza się przy tłach i większych formach akwarelowych.',
    image:
      'https://images.unsplash.com/photo-1607082349566-187342175e2f',
  },
  {
    id: '5',
    name: 'Papier akwarelowy 300 g/m² – Dyscyplina Formy',
    artist: 'AquaPaper Institute',
    price: 42.0,
    description:
      'Wysokiej jakości papier akwarelowy o dużej gramaturze. Odporny na falowanie i wielokrotne poprawki. Stabilna baza dla ambitnych kompozycji.',
    image:
      'https://images.unsplash.com/photo-1580136579312-94651dfd596d',
  },
];
