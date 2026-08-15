import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getAllUsers, authorizeUser } from '@/lib/usersStore';
import { UserRole } from '@/types/user';

export async function GET(request: NextRequest) {
  const session = await getSession(request);

  if (!session || session.role !== 'superadmin') {
    return NextResponse.json(
      { success: false, error: 'No autorizado. Se requiere rol de Super Admin.' },
      { status: 403 }
    );
  }

  try {
    const users = await getAllUsers();
    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    console.error('Error listando usuarios:', error);
    return NextResponse.json(
      { success: false, error: 'Error al consultar usuarios.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession(request);

  if (!session || session.role !== 'superadmin') {
    return NextResponse.json(
      { success: false, error: 'No autorizado. Se requiere rol de Super Admin.' },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { email, name, role } = body;

    if (!email || !name || !role) {
      return NextResponse.json(
        { success: false, error: 'Faltan campos obligatorios (email, nombre, rol).' },
        { status: 400 }
      );
    }

    const validRoles: UserRole[] = ['superadmin', 'admin', 'agente'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { success: false, error: 'Rol inválido. Roles válidos: superadmin, admin, agente.' },
        { status: 400 }
      );
    }

    const user = await authorizeUser(email, name, role as UserRole);

    return NextResponse.json({
      success: true,
      message: `Usuario ${user.email} autorizado exitosamente con rol ${user.role}.`,
      data: user,
    });
  } catch (error) {
    console.error('Error autorizando usuario:', error);
    return NextResponse.json(
      { success: false, error: 'Error al autorizar usuario.' },
      { status: 500 }
    );
  }
}
