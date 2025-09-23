import { useState, useCallback } from 'react'

// 故意添加 ESLint 错误来测试 pre-commit 钩子
const unusedVariable = 'test'

/**
 * 使用本地存储的 Hook
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      // 静默处理localStorage读取错误
      return initialValue
    }
  })

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch {
      // 静默处理localStorage设置错误
    }
  }, [key, storedValue])

  return [storedValue, setValue] as const
}
