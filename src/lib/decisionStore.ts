import fs from 'fs/promises';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'src', 'db', 'decisions.json');

export interface DecisionRecord {
  actionId: string;
  status: 'pending' | 'approved' | 'dismissed';
  updatedAt: string;
}

export interface DecisionsDatabase {
  decisions: Record<string, 'pending' | 'approved' | 'dismissed'>;
  history: DecisionRecord[];
}

export async function getDecisionDatabase(): Promise<DecisionsDatabase> {
  try {
    const raw = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch {
    const initial: DecisionsDatabase = {
      decisions: {},
      history: [],
    };
    try {
      await fs.writeFile(DB_PATH, JSON.stringify(initial, null, 2), 'utf-8');
    } catch {}
    return initial;
  }
}

export async function recordDecisionAction(
  actionId: string,
  status: 'pending' | 'approved' | 'dismissed'
): Promise<DecisionsDatabase> {
  const db = await getDecisionDatabase();
  db.decisions[actionId] = status;
  db.history.push({
    actionId,
    status,
    updatedAt: new Date().toISOString(),
  });

  try {
    await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error al guardar decisions.json:', err);
  }

  return db;
}
