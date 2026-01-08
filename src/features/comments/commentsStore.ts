import { addActivity } from '../activity/store/activityStore';

export type Comment = {
  id: string;
  productId: string;
  text: string;
  createdAt: number;
  author: string;
};

let comments: Comment[] = [];
const listeners = new Set<() => void>();

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

const stockCache: Record<string, Comment[]> = {};

function getStockComments(productId: string): Comment[] {
  if (stockCache[productId]) return stockCache[productId];

  const count = Math.floor(Math.random() * 2) + 1;
  const shuffled = [...STOCK_COMMENTS].sort(
    () => 0.5 - Math.random()
  );

  const selected = shuffled.slice(0, count).map(
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

const emit = () => listeners.forEach(l => l());

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function addCommentToStore(
  productId: string,
  text: string,
  author: string
) {
  comments = [
    ...comments,
    {
      id: Date.now().toString(),
      productId,
      text,
      createdAt: Date.now(),
      author,
    },
  ];

  addActivity('COMMENT');
  emit();
}

export function getCommentsSnapshot(productId: string): Comment[] {
  return [
    ...getStockComments(productId),
    ...comments.filter(c => c.productId === productId),
  ];
}

export function getCommentsCount() {
  return comments.length;
}

function getStockCommentsCount() {
  return Object.values(stockCache).reduce(
    (sum, list) => sum + list.length,
    0
  );
}

export function getCommentsCountTotal() {
  return comments.length + getStockCommentsCount();
}

export function resetComments() {
  comments = [];
  Object.keys(stockCache).forEach(
    key => delete stockCache[key]
  );
  emit();
}
