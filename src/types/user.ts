export type UserRole = 'superadmin' | 'admin' | 'agente';
export type UserStatus = 'activo' | 'inactivo';

export interface User {
  id: string;
  email: string;
  name: string;
  image?: string | null;
  role: UserRole;
  status: UserStatus;
  created_at: string;
  updated_at: string;
  last_login_at?: string | null;
}

export interface UserSessionPayload {
  id: string;
  email: string;
  name: string;
  image?: string | null;
  role: UserRole;
}
