import Dexie, { type EntityTable } from 'dexie';

interface Session {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  personaConfig: Record<string, unknown>;
}

interface Message {
  id: string;
  sessionId: string;
  role: 'user' | 'critic' | 'historian' | 'pragmatist' | 'expander';
  content: string;
  timestamp: number;
  turnId: string;
}

const db = new Dexie('nexus-boardroom') as Dexie & {
  sessions: EntityTable<Session, 'id'>;
  messages: EntityTable<Message, 'id'>;
};

db.version(1).stores({
  sessions: 'id, createdAt, updatedAt',
  messages: 'id, sessionId, turnId, timestamp',
});

export { db };
export type { Message, Session };
