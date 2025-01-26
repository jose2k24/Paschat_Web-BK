import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface ChatDBSchema extends DBSchema {
  contacts: {
    key: string;
    value: {
      phone: string;
      name: string | null;
      profile: string | null;
      roomId: string | null;
    };
  };
  chatRooms: {
    key: string;
    value: {
      roomId: string;
      participants: string[];
      createdAt: string;
      lastMessage?: {
        content: string;
        timestamp: string;
      };
    };
  };
}

class DatabaseService {
  private db: IDBPDatabase<ChatDBSchema> | null = null;
  private dbName = 'paschat-db';
  private version = 1;

  async init() {
    this.db = await openDB<ChatDBSchema>(this.dbName, this.version, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('contacts')) {
          db.createObjectStore('contacts', { keyPath: 'phone' });
        }
        if (!db.objectStoreNames.contains('chatRooms')) {
          db.createObjectStore('chatRooms', { keyPath: 'roomId' });
        }
      },
    });
  }

  async saveContact(contact: ChatDBSchema['contacts']['value']) {
    await this.db?.put('contacts', contact);
  }

  async getContact(phone: string) {
    return await this.db?.get('contacts', phone);
  }

  async getAllContacts() {
    return await this.db?.getAll('contacts') || [];
  }

  async saveChatRoom(room: ChatDBSchema['chatRooms']['value']) {
    await this.db?.put('chatRooms', room);
  }

  async getChatRoom(roomId: string) {
    return await this.db?.get('chatRooms', roomId);
  }

  async updateContactRoomId(phone: string, roomId: string) {
    const contact = await this.getContact(phone);
    if (contact) {
      contact.roomId = roomId;
      await this.saveContact(contact);
    }
  }

  async updateChatRoomLastMessage(roomId: string, content: string) {
    const room = await this.getChatRoom(roomId);
    if (room) {
      room.lastMessage = {
        content,
        timestamp: new Date().toISOString(),
      };
      await this.saveChatRoom(room);
    }
  }
}

export const dbService = new DatabaseService();