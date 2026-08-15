import fs from 'fs';
import path from 'path';
import { getDbClient } from '@/lib/db';
import { User, UserRole, UserStatus } from '@/types/user';
import { SUPERADMIN_EMAIL } from '@/lib/auth';

const USERS_FILE_PATH = path.join(process.cwd(), 'src', 'db', 'users.json');

function getConnectionString(): string | undefined {
  return process.env.DATABASE_URL || process.env.POSTGRES_URL;
}

/**
 * Lee la lista de usuarios desde el archivo JSON local.
 */
async function readLocalUsers(): Promise<User[]> {
  try {
    if (!fs.existsSync(USERS_FILE_PATH)) {
      await fs.promises.mkdir(path.dirname(USERS_FILE_PATH), { recursive: true });
      await fs.promises.writeFile(USERS_FILE_PATH, JSON.stringify([], null, 2), 'utf-8');
      return [];
    }
    const data = await fs.promises.readFile(USERS_FILE_PATH, 'utf-8');
    return JSON.parse(data || '[]');
  } catch (error) {
    console.error('Error leyendo users.json local:', error);
    return [];
  }
}

/**
 * Guarda la lista de usuarios en el archivo JSON local.
 */
async function writeLocalUsers(users: User[]): Promise<void> {
  try {
    await fs.promises.mkdir(path.dirname(USERS_FILE_PATH), { recursive: true });
    await fs.promises.writeFile(USERS_FILE_PATH, JSON.stringify(users, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error guardando users.json local:', error);
  }
}

/**
 * Asegura que la tabla de usuarios exista en Neon Postgres si hay conexión.
 */
export async function ensureUsersTable(): Promise<void> {
  const connectionString = getConnectionString();
  if (!connectionString) return;

  const sql = getDbClient();
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(64) PRIMARY KEY,
      email VARCHAR(128) NOT NULL UNIQUE,
      name VARCHAR(128) NOT NULL,
      image TEXT,
      role VARCHAR(32) NOT NULL DEFAULT 'admin',
      status VARCHAR(32) NOT NULL DEFAULT 'activo',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      last_login_at TIMESTAMP WITH TIME ZONE
    );
  `;
  await sql`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);`;
}

/**
 * Busca un usuario por su correo electrónico (lowercased).
 */
export async function findUserByEmail(email: string): Promise<User | null> {
  const connectionString = getConnectionString();
  const cleanEmail = email.trim().toLowerCase();

  if (connectionString) {
    await ensureUsersTable();
    const sql = getDbClient();
    const rows = await sql`
      SELECT id, email, name, image, role, status, created_at, updated_at, last_login_at
      FROM users
      WHERE LOWER(email) = ${cleanEmail}
      LIMIT 1;
    `;
    if (rows.length === 0) return null;
    return rows[0] as unknown as User;
  }

  // Fallback a archivo JSON local
  const users = await readLocalUsers();
  const found = users.find((u) => u.email.toLowerCase() === cleanEmail);
  return found || null;
}

/**
 * Procesa el ingreso con Google:
 * 1. Si es martinfernandocedres@gmail.com, se auto-crea/actualiza como superadmin.
 * 2. Si es otro correo, verifica si ya fue previamente autorizado por el superadmin.
 * 3. Retorna el objeto User o null si no está autorizado.
 */
export async function upsertGoogleUser(email: string, name: string, image?: string): Promise<User | null> {
  const connectionString = getConnectionString();
  const cleanEmail = email.trim().toLowerCase();
  const isSuperadmin = cleanEmail === SUPERADMIN_EMAIL.toLowerCase();
  const now = new Date().toISOString();

  if (connectionString) {
    await ensureUsersTable();
    const sql = getDbClient();
    const existing = await findUserByEmail(cleanEmail);

    if (isSuperadmin) {
      if (!existing) {
        const id = `usr_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
        const rows = await sql`
          INSERT INTO users (id, email, name, image, role, status, last_login_at)
          VALUES (${id}, ${cleanEmail}, ${name}, ${image || null}, 'superadmin', 'activo', ${now})
          RETURNING id, email, name, image, role, status, created_at, updated_at, last_login_at;
        `;
        return rows[0] as unknown as User;
      } else {
        const rows = await sql`
          UPDATE users
          SET name = ${name},
              image = COALESCE(${image || null}, image),
              role = 'superadmin',
              status = 'activo',
              last_login_at = ${now},
              updated_at = ${now}
          WHERE LOWER(email) = ${cleanEmail}
          RETURNING id, email, name, image, role, status, created_at, updated_at, last_login_at;
        `;
        return rows[0] as unknown as User;
      }
    }

    if (!existing || existing.status !== 'activo') return null;

    const rows = await sql`
      UPDATE users
      SET name = ${name},
          image = COALESCE(${image || null}, image),
          last_login_at = ${now},
          updated_at = ${now}
      WHERE LOWER(email) = ${cleanEmail}
      RETURNING id, email, name, image, role, status, created_at, updated_at, last_login_at;
    `;
    return rows[0] as unknown as User;
  }

  // Manejo con JSON Local
  const users = await readLocalUsers();
  const index = users.findIndex((u) => u.email.toLowerCase() === cleanEmail);

  if (isSuperadmin) {
    if (index === -1) {
      const newUser: User = {
        id: `usr_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        email: cleanEmail,
        name,
        image: image || null,
        role: 'superadmin',
        status: 'activo',
        created_at: now,
        updated_at: now,
        last_login_at: now,
      };
      users.push(newUser);
      await writeLocalUsers(users);
      return newUser;
    } else {
      users[index] = {
        ...users[index],
        name,
        image: image || users[index].image,
        role: 'superadmin',
        status: 'activo',
        last_login_at: now,
        updated_at: now,
      };
      await writeLocalUsers(users);
      return users[index];
    }
  }

  if (index === -1 || users[index].status !== 'activo') return null;

  users[index] = {
    ...users[index],
    name,
    image: image || users[index].image,
    last_login_at: now,
    updated_at: now,
  };
  await writeLocalUsers(users);
  return users[index];
}

/**
 * Registra o autoriza a un nuevo usuario (Solo ejecutado por Super Admin).
 */
export async function authorizeUser(email: string, name: string, role: UserRole): Promise<User> {
  const connectionString = getConnectionString();
  const cleanEmail = email.trim().toLowerCase();
  const now = new Date().toISOString();

  if (connectionString) {
    await ensureUsersTable();
    const sql = getDbClient();
    const existing = await findUserByEmail(cleanEmail);

    if (existing) {
      const rows = await sql`
        UPDATE users
        SET name = ${name},
            role = ${role},
            status = 'activo',
            updated_at = ${now}
        WHERE LOWER(email) = ${cleanEmail}
        RETURNING id, email, name, image, role, status, created_at, updated_at, last_login_at;
      `;
      return rows[0] as unknown as User;
    }

    const id = `usr_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const rows = await sql`
      INSERT INTO users (id, email, name, role, status)
      VALUES (${id}, ${cleanEmail}, ${name}, ${role}, 'activo')
      RETURNING id, email, name, image, role, status, created_at, updated_at, last_login_at;
    `;
    return rows[0] as unknown as User;
  }

  // JSON Local
  const users = await readLocalUsers();
  const index = users.findIndex((u) => u.email.toLowerCase() === cleanEmail);

  if (index !== -1) {
    users[index] = {
      ...users[index],
      name,
      role,
      status: 'activo',
      updated_at: now,
    };
    await writeLocalUsers(users);
    return users[index];
  }

  const newUser: User = {
    id: `usr_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    email: cleanEmail,
    name,
    image: null,
    role,
    status: 'activo',
    created_at: now,
    updated_at: now,
    last_login_at: null,
  };

  users.push(newUser);
  await writeLocalUsers(users);
  return newUser;
}

/**
 * Obtiene la lista completa de usuarios autorizados.
 */
export async function getAllUsers(): Promise<User[]> {
  const connectionString = getConnectionString();

  if (connectionString) {
    await ensureUsersTable();
    const sql = getDbClient();
    const rows = await sql`
      SELECT id, email, name, image, role, status, created_at, updated_at, last_login_at
      FROM users
      ORDER BY created_at DESC;
    `;
    return rows as unknown as User[];
  }

  return await readLocalUsers();
}

/**
 * Actualiza el rol o estado de un usuario por su ID.
 */
export async function updateUserRoleOrStatus(id: string, role?: UserRole, status?: UserStatus): Promise<User | null> {
  const connectionString = getConnectionString();
  const now = new Date().toISOString();

  if (connectionString) {
    await ensureUsersTable();
    const sql = getDbClient();

    const userRows = await sql`SELECT email FROM users WHERE id = ${id};`;
    if (userRows.length > 0 && userRows[0].email.toLowerCase() === SUPERADMIN_EMAIL.toLowerCase()) {
      role = 'superadmin';
      status = 'activo';
    }

    const rows = await sql`
      UPDATE users
      SET role = COALESCE(${role || null}, role),
          status = COALESCE(${status || null}, status),
          updated_at = ${now}
      WHERE id = ${id}
      RETURNING id, email, name, image, role, status, created_at, updated_at, last_login_at;
    `;

    if (rows.length === 0) return null;
    return rows[0] as unknown as User;
  }

  // JSON Local
  const users = await readLocalUsers();
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return null;

  if (users[index].email.toLowerCase() === SUPERADMIN_EMAIL.toLowerCase()) {
    role = 'superadmin';
    status = 'activo';
  }

  users[index] = {
    ...users[index],
    role: role || users[index].role,
    status: status || users[index].status,
    updated_at: now,
  };

  await writeLocalUsers(users);
  return users[index];
}

/**
 * Elimina a un usuario autorizado por su ID.
 */
export async function deleteUser(id: string): Promise<boolean> {
  const connectionString = getConnectionString();

  if (connectionString) {
    await ensureUsersTable();
    const sql = getDbClient();

    const userRows = await sql`SELECT email FROM users WHERE id = ${id};`;
    if (userRows.length > 0 && userRows[0].email.toLowerCase() === SUPERADMIN_EMAIL.toLowerCase()) {
      throw new Error('No es posible eliminar al Super Admin principal.');
    }

    await sql`DELETE FROM users WHERE id = ${id};`;
    return true;
  }

  // JSON Local
  const users = await readLocalUsers();
  const target = users.find((u) => u.id === id);
  if (target && target.email.toLowerCase() === SUPERADMIN_EMAIL.toLowerCase()) {
    throw new Error('No es posible eliminar al Super Admin principal.');
  }

  const filtered = users.filter((u) => u.id !== id);
  await writeLocalUsers(filtered);
  return true;
}
