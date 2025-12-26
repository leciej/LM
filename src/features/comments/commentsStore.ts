export type Comment = {
  id: string;
  productId: string;
  text: string;
  createdAt: number;
  author: string;
};

let comments: Comment[] = [];
const listeners = new Set<() => void>();

/* =========================
   STOCKOWE DANE
   ========================= */

const STOCK_AUTHORS = [
  'Rudolf H.',
  'Ewa B.',
  'Jan K.',
  'Anna M.',
  'Gość',
];

const STOCK_COMMENTS = [
  'Świetna akwarela, kolory naprawdę robią klimat 🎨',
  'Bardzo przyjemna kompozycja',
  'Delikatne, ale z charakterem',
  'Idealne do jasnego wnętrza',
  'Czuć rękę artysty',
  'Na żywo musi wyglądać jeszcze lepiej',
];

// cache → losowanie stabilne per produkt
const stockCache: Record<string, Comment[]> = {};

function getStockComments(productId: string): Comment[] {
  if (stockCache[productId]) {
    return stockCache[productId];
  }

  const count = Math.floor(Math.random() * 2) + 1; // 1–2
  const shuffledTexts = [...STOCK_COMMENTS].sort(
    () => 0.5 - Math.random()
  );

  const selected = shuffledTexts.slice(0, count).map(
    (text, index) => ({
      id: `stock-${productId}-${index}`,
      productId,
      text,
      createdAt: 0,
      author:
        STOCK_AUTHORS[
          Math.floor(Math.random() * STOCK_AUTHORS.length)
        ],
    })
  );

  stockCache[productId] = selected;
  return selected;
}

/* =========================
   SUBSKRYPCJA
   ========================= */

const emit = () => listeners.forEach(l => l());

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/* =========================
   API
   ========================= */

export function addCommentToStore(
  productId: string,
  text: string
): void {
  comments = [
    ...comments,
    {
      id: Date.now().toString(),
      productId,
      text,
      createdAt: Date.now(),
      author: 'Ty',
    },
  ];

  emit();
}

export function getCommentsSnapshot(
  productId: string
): Comment[] {
  const real = comments.filter(
    c => c.productId === productId
  );

  const stock = getStockComments(productId);

  return [...stock, ...real];
}

export function getCommentsCount(): number {
  // ❗ liczymy tylko realne
  return comments.length;
}

export function resetComments() {
  comments = [];
  Object.keys(stockCache).forEach(
    key => delete stockCache[key]
  );
  emit();
}
