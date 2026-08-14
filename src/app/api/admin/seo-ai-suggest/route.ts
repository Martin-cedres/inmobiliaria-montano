import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      category = 'casa',
      operation = 'venta',
      priceAmount,
      priceCurrency = 'USD',
      neighborhood = 'Centro',
      city = 'San José de Mayo',
      bedrooms,
      builtAreaM2,
      plotAreaM2,
      features = {},
      guarantees = [],
    } = body;

    const opText = operation === 'alquiler' ? 'Alquiler' : 'Venta';
    const currSym = priceCurrency === 'USD' ? 'USD' : 'UYU $';
    const priceFormatted = priceAmount ? `${currSym} ${Number(priceAmount).toLocaleString()}` : '';
    const dormStr = bedrooms ? `${bedrooms} dorms` : '';
    const zoneStr = neighborhood ? `${neighborhood}, ${city}` : city;

    // Atributos clave
    const keyBadges: string[] = [];
    if (features.bankCreditEligible) keyBadges.push('Apta crédito bancario');
    if (features.titlesUpToDate) keyBadges.push('Títulos al día');
    if (features.acceptsTradeIn) keyBadges.push('Acepta permuta');
    if (features.carAccess || features.garage) keyBadges.push('Garage / Entrada auto');
    if (features.barbecue) keyBadges.push('Parrillero');
    if (features.garden) keyBadges.push('Jardín verde');
    if (features.oseWater) keyBadges.push('Agua OSE');
    if (guarantees.length > 0) keyBadges.push(`Garantías ${guarantees.join('/')}`);

    const badgeStr = keyBadges.slice(0, 2).join(' • ');

    // 📈 Variante A: Inversión / Oportunidad
    const titleA = `${opText} ${category.toUpperCase()} en ${neighborhood} | Excelente Oportunidad | Inmobiliaria Montaño`.substring(0, 60);
    const descA = `Oportunidad en ${zoneStr}: ${category} ${dormStr} por ${priceFormatted}. ${badgeStr ? badgeStr + '. ' : ''}Coordiná tu visita con Daniel Montaño.`.substring(0, 155);

    // 🏡 Variante B: Familiar / Calidez
    const titleB = `${category.toUpperCase()} de ${bedrooms || 2} Dormitorios en ${neighborhood} | Fondo & Confort - San José`.substring(0, 60);
    const descB = `Excelente ${category.toLowerCase()} en ${neighborhood}, San José. Ideal para disfrutar en familia con excelente iluminación. Consultá directo por WhatsApp.`.substring(0, 155);

    // 📐 Variante C: Técnico / Financiero
    const areaStr = builtAreaM2 ? `${builtAreaM2}m² edif.` : plotAreaM2 ? `${plotAreaM2}m² terr.` : '';
    const titleC = `${category.toUpperCase()} ${opText} ${areaStr} en ${neighborhood} | ${features.bankCreditEligible ? 'Apta Banco' : 'Títulos al Día'}`.substring(0, 60);
    const descC = `${category} en ${zoneStr}. ${areaStr} ${badgeStr ? '— ' + badgeStr : ''}. Precio: ${priceFormatted}. Atención personalizada por Daniel Montaño.`.substring(0, 155);

    return NextResponse.json({
      success: true,
      variants: [
        {
          id: 'A',
          label: '📈 Variante A (Oportunidad / Comercial)',
          title: titleA,
          description: descA,
        },
        {
          id: 'B',
          label: '🏡 Variante B (Familiar / Calidez)',
          title: titleB,
          description: descB,
        },
        {
          id: 'C',
          label: '📐 Variante C (Técnico / Financiero)',
          title: titleC,
          description: descC,
        },
      ],
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Error al generar sugerencias SEO' },
      { status: 500 }
    );
  }
}
