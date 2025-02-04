import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Message, ChatRoom, Contact } from '@/types/chat';

interface ChatDB extends DBSchema {
  contacts: {
    key: string;
    value: Contact;
    indexes: {
      'by-phone': string;
      'by-roomId': number;
    };
  };
  chatRooms: {
    key: number;
    value: ChatRoom;
    indexes: {
      'by-type': string;
      'by-participant': string[];
    };
  };
  messages: {
    key: number;
    value: Message;
    indexes: {
      'by-room': number;
      'by-sender': number;
      'by-date': string;
    };
  };
}

class DatabaseService {
  private db: IDBPDatabase<ChatDB> | null = null;

  async init() {
    if (this.db) return;

    this.db = await openDB<ChatDB>('chat-db', 1, {
      upgrade(db) {
        // Contacts store
        const contactStore = db.createObjectStore('contacts', { keyPath: 'phone' });
        contactStore.createIndex('by-phone', 'phone');
        contactStore.createIndex('by-roomId', 'roomId');

        // Chat rooms store
        const roomStore = db.createObjectStore('chatRooms', { keyPath: 'roomId' });
        roomStore.createIndex('by-type', 'roomType');
        roomStore.createIndex('by-participant', 'participantPhones', { multiEntry: true });

        // Messages store
        const messageStore = db.createObjectStore('messages', { keyPath: 'id' });
        messageStore.createIndex('by-room', 'roomId');
        messageStore.createIndex('by-sender', 'senderId');
        messageStore.createIndex('by-date', 'createdAt');
      },
    });
  }

  async clearAll() {
    if (!this.db) await this.init();
    const tx = this.db!.transaction(['contacts', 'chatRooms', 'messages'], 'readwrite');
    await Promise.all([
      tx.objectStore('contacts').clear(),
      tx.objectStore('chatRooms').clear(),
      tx.objectStore('messages').clear(),
    ]);
    await tx.done;
  }

  // Contact operations
  async saveContact(contact: Contact) {
    if (!this.db) await this.init();
    await this.db!.put('contacts', contact);
  }

  async saveContacts(contacts: Contact[]) {
    if (!this.db) await this.init();
    const tx = this.db!.transaction('contacts', 'readwrite');
    await Promise.all(contacts.map(contact => tx.store.put(contact)));
    await tx.done;
  }

  async getContact(phone: string): Promise<Contact | undefined> {
    if (!this.db) await this.init();
    return this.db!.get('contacts', phone);
  }

  async getContacts(): Promise<Contact[]> {
    if (!this.db) await this.init();
    return this.db!.getAll('contacts');
  }

  async updateContactRoomId(phone: string, roomId: number) {
    if (!this.db) await this.init();
    const contact = await this.getContact(phone);
    if (contact) {
      contact.roomId = roomId;
      await this.saveContact(contact);
    }
  }

  // Chat room operations
  async saveChatRoom(room: ChatRoom) {
    if (!this.db) await this.init();
    const roomWithPhones = {
      ...room,
      participantPhones: room.participants.map(p => p.phone)
    };
    await this.db!.put('chatRooms', roomWithPhones);
  }

  async getChatRoom(roomId: number): Promise<ChatRoom | undefined> {
    if (!this.db) await this.init();
    return this.db!.get('chatRooms', roomId);
  }

  async getAllChatRooms(): Promise<ChatRoom[]> {
    if (!this.db) await this.init();
    return this.db!.getAll('chatRooms');
  }

  async getChatRoomsByType(type: ChatRoom['roomType']): Promise<ChatRoom[]> {
    if (!this.db) await this.init();
    return this.db!.getAllFromIndex('chatRooms', 'by-type', type);
  }

  // Message operations
  async saveMessage(message: Message) {
    if (!this.db) await this.init();
    await this.db!.put('messages', message);
  }

  async saveMessages(messages: Message[]) {
    if (!this.db) await this.init();
    const tx = this.db!.transaction('messages', 'readwrite');
    await Promise.all(messages.map(msg => tx.store.put(msg)));
    await tx.done;
  }

  async getMessagesByRoom(roomId: number): Promise<Message[]> {
    if (!this.db) await this.init();
    const messages = await this.db!.getAllFromIndex('messages', 'by-room', roomId);
    return messages.sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }

  async getMessagesByDate(roomId: number, date: string): Promise<Message[]> {
    if (!this.db) await this.init();
    const messages = await this.getMessagesByRoom(roomId);
    return messages.filter(msg => msg.createdAt.startsWith(date));
  }
}

export const dbService = new DatabaseService();
