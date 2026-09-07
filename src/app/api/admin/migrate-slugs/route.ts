import { NextResponse } from 'next/server';
import { getAllProperties, saveProperty } from '@/lib/propertiesStore';
import { generatePropertySlug } from '@/utils/seo';
import { revalidatePath, revalidateTag } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  return handleMigration(request);
}

export async function GET(request: Request) {
  return handleMigration(request);
}

async function handleMigration(request: Request) {
  try {
    const properties = await getAllProperties();
    let updatedCount = 0;
    const migrations: { codeRef: string; oldSlug: string; newSlug: string }[] = [];

    for (const prop of properties) {
      const standardSlug = generatePropertySlug({
        title: prop.title,
        codeRef: prop.codeRef,
        category: prop.category,
        operation: prop.operation,
        neighborhood: prop.location?.neighborhood,
        address: prop.location?.address,
        city: prop.location?.city,
        features: prop.features,
      });

      if (prop.slug !== standardSlug) {
        const previous = prop.previousSlugs || [];
        const updatedPrevious = previous.includes(prop.slug) ? previous : [...previous, prop.slug];

        prop.previousSlugs = updatedPrevious;
        prop.slug = standardSlug;

        await saveProperty(prop);
        updatedCount++;
        migrations.push({
          codeRef: prop.codeRef,
          oldSlug: previous[previous.length - 1] || prop.slug,
          newSlug: standardSlug,
        });
      }
    }

    if (updatedCount > 0) {
      try {
        revalidateTag('properties', { expire: 0 });
        revalidatePath('/');
        revalidatePath('/admin');
        revalidatePath('/sitemap.xml');
        for (const m of migrations) {
          revalidatePath(`/propiedad/${m.newSlug}`);
          revalidatePath(`/propiedad/${m.oldSlug}`);
        }
      } catch (cacheErr) {
        console.warn('Error invalidando tags en migración:', cacheErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Migración completada. ${updatedCount} propiedades actualizadas.`,
      updatedCount,
      totalProperties: properties.length,
      migrations,
    });
  } catch (error: any) {
    console.error('Error en /api/admin/migrate-slugs:', error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Error durante la migración de slugs',
      },
      { status: 500 }
    );
  }
}
