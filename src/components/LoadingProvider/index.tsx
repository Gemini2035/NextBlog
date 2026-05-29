'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { createRoot } from 'react-dom/client';
import { Loading } from '@/ui';
import { cn } from '@/utils';

interface SpinnerFadeOverlayProps {
  visible: boolean;
  durationMs: number;
  onExited?: () => void;
  children: ReactNode;
}

function SpinnerFadeOverlay({
  visible,
  durationMs,
  onExited,
  children,
}: SpinnerFadeOverlayProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const onExitedRef = useRef(onExited);
  onExitedRef.current = onExited;

  useEffect(() => {
    if (visible) return;
    const el = wrapperRef.current;
    const handleEnd = () => {
      onExitedRef.current?.();
    };
    el?.addEventListener('transitionend', handleEnd);
    const fallback = setTimeout(handleEnd, durationMs + 50);
    return () => {
      el?.removeEventListener('transitionend', handleEnd);
      clearTimeout(fallback);
    };
  }, [visible, durationMs]);

  return (
    <div
      ref={wrapperRef}
      className={cn(
        'fixed inset-0 pointer-events-none transition-opacity duration-600',
        visible ? 'opacity-100' : 'opacity-0'
      )}
      style={{ transitionDuration: `${durationMs}ms` }}
    >
      {children}
    </div>
  );
}

type TLoadingState = {
  id: string;
  loadingSelector: string[];
};

interface LoadingContextValue {
  loading: TLoadingState[];
  handleSetLoading: (value: TLoadingState) => void;
}

const LoadingContext = createContext<LoadingContextValue | null>(null);

const LOADING_OVERLAY_CLASS = 'loading-provider-overlay';
const SPINNER_PORTAL_ID = 'loading-spinner-portal';
const FADE_DURATION_MS = 600;
const LOADING_CLASS_NAMES = [
  'pointer-events-none',
  'select-none',
  'opacity-60',
  'transition-opacity',
  'duration-600',
];

function getOrCreateSpinnerPortalContainer(): HTMLElement {
  if (typeof document === 'undefined') {
    return null as unknown as HTMLElement;
  }
  let el = document.getElementById(SPINNER_PORTAL_ID);
  if (!el) {
    el = document.createElement('div');
    el.id = SPINNER_PORTAL_ID;
    Object.assign(el.style, {
      position: 'fixed',
      inset: '0',
      pointerEvents: 'none',
      zIndex: '9999',
    });
    document.documentElement.appendChild(el);
  }
  return el;
}

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState<TLoadingState[]>([]);
  const spinnerRootRef = useRef<ReturnType<typeof createRoot> | null>(null);
  const fadeOutRenderedRef = useRef(false);

  const loadingContainerInfos = useMemo(() => {
    if (typeof document === 'undefined') return [];
    const selectors = Array.from(
      new Set(loading.map(({ loadingSelector }) => loadingSelector).flat())
    ).map((selector) => ({
      selector,
      element: document.querySelector(selector),
    }));
    const result: string[] = [];
    const root = document.body;
    selectors.forEach(({ selector, element }) => {
      let current = element;
      while (current) {
        if (current === root) {
          result.push(selector);
          break;
        }
        current = current?.parentElement ?? null;
        if (
          selectors.some(({ element: parentElement }) => parentElement === current)
        ) break;
      }
    });
    return result;
  }, [loading]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const allContainers = document.querySelectorAll('[data-loading-container]');
    allContainers.forEach((el) => {
      el.classList.remove(...LOADING_CLASS_NAMES);
      const overlay = el.querySelector(`.${LOADING_OVERLAY_CLASS}`);
      if (overlay?.parentNode) {
        ;(overlay as HTMLElement).remove();
      }
    });

    loadingContainerInfos.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((el) => {
        if (!(el instanceof HTMLElement)) return;
        el.classList.add(...LOADING_CLASS_NAMES);
        el.setAttribute('data-loading-container', selector);
        el.style.position = el.style.position || 'relative';

        let overlay = el.querySelector(`.${LOADING_OVERLAY_CLASS}`);
        if (!overlay) {
          overlay = document.createElement('div');
          overlay.className = LOADING_OVERLAY_CLASS;
          Object.assign((overlay as HTMLElement).style, {
            position: 'absolute',
            inset: '0',
            pointerEvents: 'none',
            zIndex: 10,
          });
          el.appendChild(overlay);
        }
      });
    });

    const hasLoading = loadingContainerInfos.length > 0;
    const portalContainer = getOrCreateSpinnerPortalContainer();
    if (portalContainer) {
      if (hasLoading) {
        fadeOutRenderedRef.current = false;
        if (!spinnerRootRef.current) {
          spinnerRootRef.current = createRoot(portalContainer);
        }
        spinnerRootRef.current.render(
          <SpinnerFadeOverlay
            visible
            durationMs={FADE_DURATION_MS}
            onExited={() => spinnerRootRef.current?.render(null)}
          >
            <div
              className={cn(
                'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
              )}
            >
              <Loading variant="spinner" size="lg" />
            </div>
          </SpinnerFadeOverlay>
        );
      } else if (spinnerRootRef.current && !fadeOutRenderedRef.current) {
        fadeOutRenderedRef.current = true;
        spinnerRootRef.current.render(
          <SpinnerFadeOverlay
            visible={false}
            durationMs={FADE_DURATION_MS}
            onExited={() => spinnerRootRef.current?.render(null)}
          >
            <div
              className={cn(
                'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
              )}
            >
              <Loading variant="spinner" size="lg" />
            </div>
          </SpinnerFadeOverlay>
        );
      }
    }

    return () => {
      spinnerRootRef.current?.render(null);
    };
  }, [loadingContainerInfos]);

  const handleSetLoading = ({ id, ...rest }: TLoadingState) => {
    setLoading((prev) => {
      const index = prev.findIndex((item) => item.id === id);
      if (index !== -1) {
        return prev.filter((_, i) => i !== index);
      }
      return [...prev, { id, ...rest }];
    });
  };

  return (
    <LoadingContext.Provider value={{ loading, handleSetLoading }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const ctx = useContext(LoadingContext);
  if (!ctx) {
    throw new Error('useLoading must be used within LoadingProvider');
  }
  return ctx;
}
