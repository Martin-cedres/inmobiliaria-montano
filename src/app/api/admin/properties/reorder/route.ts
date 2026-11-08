import { NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { reorderProperties, resetPropertiesOrder } from '@/lib/propertiesStore';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (body.reset) {
      await resetPropertiesOrder();
      revalidateTag('properties', { expire: 0 });
      revalidatePath('/');
      revalidatePath('/admin');
      revalidatePath('/propiedades-san-jose');

      return NextResponse.json({
        success: true,
        message: 'Orden restablecido a cronológico por fecha de publicación',
      });
    }

    if (!Array.isArray(body.orderedIds) || body.orderedIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Se requiere un arreglo de orderedIds válido' },
        { status: 400 }
      );
    }

    await reorderProperties(body.orderedIds);
    revalidateTag('properties', { expire: 0 });
    revalidatePath('/');
    revalidatePath('/admin');
    revalidatePath('/propiedades-san-jose');

    return NextResponse.json({
      success: true,
      message: 'Orden de propiedades actualizado exitosamente',
    });
  } catch (error: any) {
    console.error('Error al reordenar propiedades:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Error al actualizar el orden' },
      { status: 500 }
    );
  }
}
