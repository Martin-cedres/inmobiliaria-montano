'use client';

import { useEffect, useRef, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { trackPageView } from '@/utils/telemetry';

function GlobalPageViewTrackerInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastTrackedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname) return;

    // Ignorar rutas administrativas, autenticación o APIs
    if (
      pathname.startsWith('/admin') ||
      pathname.startsWith('/login') ||
      pathname.startsWith('/api') ||
      pathname.startsWith('/_next')
    ) {
      return;
    }

    const currentUrl = searchParams?.toString() ? `${pathname}?${searchParams.toString()}` : pathname;

    // Evitar disparos duplicados en el mismo render o hidratación
    if (lastTrackedRef.current === currentUrl) return;
    lastTrackedRef.current = currentUrl;

    // Enviar evento de telemetría de visita global a la página
    trackPageView(pathname);
  }, [pathname, searchParams]);

  return null;
}

export function GlobalPageViewTracker() {
  return (
    <Suspense fallback={null}>
      <GlobalPageViewTrackerInner />
    </Suspense>
  );
}
