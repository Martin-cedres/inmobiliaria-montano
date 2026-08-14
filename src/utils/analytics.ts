/**
 * Utility para registrar eventos de analítica comercial (views, clics a WhatsApp, compartidos)
 * de forma asíncrona y transparente. Funciona de manera agnóstica al dominio actual.
 */
export async function trackPropertyEvent(
  propertyId: string,
  eventType: 'view' | 'whatsapp_click' | 'share_click'
): Promise<void> {
  if (!propertyId) return;

  try {
    // Fuego asíncrono sin bloquear la navegación del usuario
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ propertyId, eventType }),
      keepalive: true, // Asegura que el fetch se complete aun si cambia de página
    }).catch(() => {
      // Ignorar errores silenciosamente para no interrumpir la experiencia de usuario
    });
  } catch (err) {
    // Silencioso
  }
}
