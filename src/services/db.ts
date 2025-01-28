import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { ChatMessage, Message, ChatRoom, Contact, transformChatMessage } from '@/types/chat';

interface ChatDB extends DBSchema {
  contacts: {
    key: string;
    value: Contact;
  };
  chatRooms: {
    key: string;
    value: ChatRoom;
  };
  messages: {
    key: string;
    value: ChatMessage;
    indexes: { 'by-room': string };
  };
}

class DatabaseService {
  private db: IDBPDatabase<ChatDB> | null = null;

  async init() {
    this.db = await openDB<ChatDB>('chat-db', 1, {
      upgrade(db) {
        db.createObjectStore('contacts', { keyPath: 'phone' });
        db.createObjectStore('chatRooms', { keyPath: 'roomId' });
        const messageStore = db.createObjectStore('messages', { keyPath: 'id' });
        messageStore.createIndex('by-room', 'roomId');
      },
    });
  }

  async saveContacts(contacts: Contact[]) {
    if (!this.db) await this.init();
    const tx = this.db!.transaction('contacts', 'readwrite');
    await Promise.all(contacts.map(contact => tx.store.put(contact)));
    await tx.done;
  }

  async getContacts() {
    if (!this.db) await this.init();
    return this.db!.getAll('contacts');
  }

  async getContact(phone: string) {
    if (!this.db) await this.init();
    return this.db!.get('contacts', phone);
  }

  async saveChatRoom(room: ChatRoom) {
    if (!this.db) await this.init();
    await this.db!.put('chatRooms', room);
  }

  async saveChatRooms(rooms: ChatRoom[]) {
    if (!this.db) await this.init();
    const tx = this.db!.transaction('chatRooms', 'readwrite');
    await Promise.all(rooms.map(room => tx.store.put(room)));
    await tx.done;
  }

  async getChatRoom(roomId: string) {
    if (!this.db) await this.init();
    return this.db!.get('chatRooms', roomId);
  }

  async saveMessage(message: ChatMessage) {
    if (!this.db) await this.init();
    await this.db!.put('messages', message);
  }

  async saveMessages(messages: ChatMessage[]) {
    if (!this.db) await this.init();
    const tx = this.db!.transaction('messages', 'readwrite');
    await Promise.all(messages.map(msg => tx.store.put(msg)));
    await tx.done;
  }

  async getMessagesByRoom(roomId: string): Promise<Message[]> {
    if (!this.db) await this.init();
    const messages = await this.db!.getAllFromIndex('messages', 'by-room', roomId);
    return messages.map(transformChatMessage);
  }

  async updateContactRoomId(phone: string, roomId: string) {
    if (!this.db) await this.init();
    const contact = await this.db!.get('contacts', phone);
    if (contact) {
      contact.roomId = roomId;
      await this.db!.put('contacts', contact);
    }
  }
}

export const dbService = new DatabaseService();