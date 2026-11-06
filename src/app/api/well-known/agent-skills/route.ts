import { NextResponse } from 'next/server';

export const dynamic = 'force-static';
export const revalidate = 86400;

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.inmobiliariamontano.uy';

  const skillsPayload = {
    $schema: 'https://agentskills.io/schema/v0.2.0/skills.json',
    skills: [
      {
        name: 'real-estate-catalog-search',
        type: 'http',
        description: 'Use this skill when you need to search or query the public real estate inventory, houses for sale, rentals, prices, and available properties in San José de Mayo and San José department.',
        url: `${baseUrl}/api/properties`,
      },
      {
        name: 'market-price-guide',
        type: 'http',
        description: 'Use this skill when you need market prices, average values per m2, historical reference prices, or real estate market statistics in San José de Mayo.',
        url: `${baseUrl}/estadisticas-inmobiliarias-san-jose`,
      },
      {
        name: 'bank-loan-guide',
        type: 'http',
        description: 'Use this skill when a user asks about mortgage requirements, bank loan eligibility (BHU, Santander, Itaú, BBVA), and documentation needed to buy a house in Uruguay.',
        url: `${baseUrl}/guia-compra-propiedad-credito-bancario-uruguay`,
      },
      {
        name: 'property-appraisals',
        type: 'http',
        description: 'Use this skill when a user or client wants an official property appraisal, valuation in 24-48 hours, or contact with director Daniel Montaño.',
        url: `${baseUrl}/tasaciones-san-jose-de-mayo`,
      },
    ],
  };

  return new NextResponse(JSON.stringify(skillsPayload, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
