import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { updateUserRoleOrStatus, deleteUser } from '@/lib/usersStore';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession(request);

  if (!session || session.role !== 'superadmin') {
    return NextResponse.json(
      { success: false, error: 'No autorizado. Se requiere rol de Super Admin.' },
      { status: 403 }
    );
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const { role, status } = body;

    const updatedUser = await updateUserRoleOrStatus(id, role, status);

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, error: 'Usuario no encontrado.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Usuario actualizado correctamente.',
      data: updatedUser,
    });
  } catch (error) {
    console.error('Error actualizando usuario:', error);
    return NextResponse.json(
      { success: false, error: 'Error al actualizar usuario.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession(request);

  if (!session || session.role !== 'superadmin') {
    return NextResponse.json(
      { success: false, error: 'No autorizado. Se requiere rol de Super Admin.' },
      { status: 403 }
    );
  }

  const { id } = await params;

  try {
    await deleteUser(id);
    return NextResponse.json({
      success: true,
      message: 'Usuario eliminado correctamente.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error al eliminar usuario.' },
      { status: 400 }
    );
  }
}
