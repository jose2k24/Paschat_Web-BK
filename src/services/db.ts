import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { ChatMessage, ChatRoom } from '@/types/chat';

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
    value: ChatRoom;
  };
  messages: {
    key: number;
    value: ChatMessage;
    indexes: { 'by-room': string };
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
          if (!db.objectStoreNames.contains('messages')) {
            const messageStore = db.createObjectStore('messages', { keyPath: 'id' });
            messageStore.createIndex('by-room', 'roomId');
          }
        },
      });
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  }

  // Contact methods
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

  // Chat room methods
  async saveChatRoom(room: ChatRoom) {
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

  // Message methods
  async saveMessage(message: ChatMessage) {
    if (!this.db) throw new Error('Database not initialized');
    await this.db.put('messages', message);
  }

  async saveMessages(messages: ChatMessage[]) {
    if (!this.db) throw new Error('Database not initialized');
    const tx = this.db.transaction('messages', 'readwrite');
    await Promise.all(messages.map(message => tx.store.put(message)));
    await tx.done;
  }

  async getMessagesByRoom(roomId: string) {
    if (!this.db) throw new Error('Database not initialized');
    return await this.db.getAllFromIndex('messages', 'by-room', roomId);
  }

  async updateContactRoomId(phone: string, roomId: string) {
    if (!this.db) throw new Error('Database not initialized');
    const contact = await this.getContact(phone);
    if (contact) {
      contact.roomId = roomId;
      await this.saveContact(contact);
    }
  }
}

export const dbService = new DatabaseService();