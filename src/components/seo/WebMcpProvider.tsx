'use client';

import { useEffect } from 'react';

export function WebMcpProvider() {
  useEffect(() => {
    // Declaración experimental de WebMCP (Google Chrome EPP / WebML standard)
    if (typeof window !== 'undefined' && 'modelContext' in navigator) {
      try {
        const mc = (navigator as any).modelContext;
        if (mc && typeof mc.provideContext === 'function') {
          mc.provideContext({
            serverInfo: {
              name: 'Inmobiliaria Montaño WebMCP',
              version: '1.0.0',
            },
            tools: [
              {
                name: 'buscar_casas_san_jose',
                description: 'Busca casas en venta o alquiler en San José de Mayo y localidades.',
                inputSchema: {
                  type: 'object',
                  properties: {
                    operacion: { type: 'string', enum: ['venta', 'alquiler'] },
                  },
                },
                execute: async (args: any) => {
                  const res = await fetch('/api/properties');
                  const data = await res.json();
                  return data;
                },
              },
            ],
          });
        }
      } catch {
        // Safe fallback if browser doesn't support modelContext API
      }
    }
  }, []);

  return null;
}
