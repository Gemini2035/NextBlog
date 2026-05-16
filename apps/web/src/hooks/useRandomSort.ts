import { useState, useEffect, useMemo } from "react";

/**
 * 随机排序 Hook
 * 用于在客户端挂载后对数组进行随机排序，避免 SSR hydration 错误
 * 
 * @param items - 要排序的数组
 * @param limit - 返回的元素数量限制（可选）
 * @returns 排序后的数组
 */
export function useRandomSort<T>(items: T[], limit?: number): T[] {
  const [isMounted, setIsMounted] = useState(false);

  // 在客户端挂载后再进行随机排序，避免 hydration 错误
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 随机排序并限制数量
  const shuffledItems = useMemo(() => {
    if (!isMounted) {
      // SSR 时返回固定顺序，避免 hydration 错误
      return limit ? items.slice(0, limit) : items;
    }
    // 客户端时进行随机排序
    const shuffled = [...items].sort(() => Math.random() - 0.5);
    return limit ? shuffled.slice(0, limit) : shuffled;
  }, [isMounted, items, limit]);

  return shuffledItems;
}

