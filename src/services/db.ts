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
      participants: {
        id: number;
        phone: string;
      }[];
      createdAt: string;
      roomType: 'private' | 'group' | 'channel';
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
    try {
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
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  }

  async saveContact(contact: ChatDBSchema['contacts']['value']) {
    if (!this.db) throw new Error('Database not initialized');
    await this.db.put('contacts', contact);
  }

  async saveContacts(contacts: ChatDBSchema['contacts']['value'][]) {
    if (!this.db) throw new Error('Database not initialized');
    const tx = this.db.transaction('contacts', 'readwrite');
    await Promise.all(contacts.map(contact => tx.store.put(contact)));
    await tx.done;
  }

  async getContact(phone: string) {
    if (!this.db) throw new Error('Database not initialized');
    return await this.db.get('contacts', phone);
  }

  async getAllContacts() {
    if (!this.db) throw new Error('Database not initialized');
    return await this.db.getAll('contacts');
  }

  async saveChatRoom(room: ChatDBSchema['chatRooms']['value']) {
    if (!this.db) throw new Error('Database not initialized');
    await this.db.put('chatRooms', room);
  }

  async getChatRoom(roomId: string) {
    if (!this.db) throw new Error('Database not initialized');
    return await this.db.get('chatRooms', roomId);
  }

  async getAllChatRooms() {
    if (!this.db) throw new Error('Database not initialized');
    return await this.db.getAll('chatRooms');
  }

  async updateContactRoomId(phone: string, roomId: string) {
    if (!this.db) throw new Error('Database not initialized');
    const contact = await this.getContact(phone);
    if (contact) {
      contact.roomId = roomId;
      await this.saveContact(contact);
    }
  }

  async updateChatRoomLastMessage(roomId: string, content: string) {
    if (!this.db) throw new Error('Database not initialized');
    const room = await this.getChatRoom(roomId);
    if (room) {
      room.lastMessage = {
        content,
        timestamp: new Date().toISOString(),
      };
      await this.saveChatRoom(room);
    }
  }

  async deleteContact(phone: string) {
    if (!this.db) throw new Error('Database not initialized');
    await this.db.delete('contacts', phone);
  }

  async deleteChatRoom(roomId: string) {
    if (!this.db) throw new Error('Database not initialized');
    await this.db.delete('chatRooms', roomId);
  }
}

export const dbService = new DatabaseService();