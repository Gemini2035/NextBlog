import type { ReactNode } from "react";

export const DEFAULT_BRIEF_ITEM_LIMIT = 6;

const hashString = (value: string) => {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
};

export const selectBriefItems = <T,>(
  items: T[],
  seed: number,
  getKey: (item: T, index: number) => string | number,
  limit = DEFAULT_BRIEF_ITEM_LIMIT
) => {
  return [...items]
    .map((item, index) => ({
      item,
      order: hashString(`${seed}:${getKey(item, index)}:${index}`),
    }))
    .sort((left, right) => left.order - right.order)
    .slice(0, limit)
    .map(({ item }) => item);
};

interface BriefItemSelectionProps<T> {
  children: (items: T[]) => ReactNode;
  getKey: (item: T, index: number) => string | number;
  items: T[];
  limit?: number;
  seed: number;
}

export function BriefItemSelection<T>({
  children,
  getKey,
  items,
  limit,
  seed,
}: BriefItemSelectionProps<T>) {
  return <>{children(selectBriefItems(items, seed, getKey, limit))}</>;
}
