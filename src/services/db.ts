import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Message, ChatRoom, Contact, Channel, Group } from '@/types/chat';

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
      'by-participant': string;
    };
  };
  messages: {
    key: number;
    value: Message;
    indexes: {
      'by-room': number;
      'by-sender': number;
      'by-type': string;
      'by-date': string;
    };
  };
  communities: {
    key: number;
    value: Channel | Group;
    indexes: {
      'by-type': string;
      'by-name': string;
      'by-visibility': string;
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
        roomStore.createIndex('by-participant', 'participants.*.phone');

        // Messages store
        const messageStore = db.createObjectStore('messages', { keyPath: 'id' });
        messageStore.createIndex('by-room', 'roomId');
        messageStore.createIndex('by-sender', 'senderId');
        messageStore.createIndex('by-type', 'type');
        messageStore.createIndex('by-date', 'createdAt');

        // Communities store
        const communityStore = db.createObjectStore('communities', { keyPath: 'id' });
        communityStore.createIndex('by-type', 'type');
        communityStore.createIndex('by-name', 'name');
        communityStore.createIndex('by-visibility', 'visibility');
      },
    });
  }

  async clearAll() {
    if (!this.db) await this.init();
    const tx = this.db!.transaction(['contacts', 'chatRooms', 'messages', 'communities'], 'readwrite');
    await Promise.all([
      tx.objectStore('contacts').clear(),
      tx.objectStore('chatRooms').clear(),
      tx.objectStore('messages').clear(),
      tx.objectStore('communities').clear(),
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

  // Chat room operations
  async saveChatRoom(room: ChatRoom) {
    if (!this.db) await this.init();
    await this.db!.put('chatRooms', room);
  }

  async getChatRoom(roomId: number): Promise<ChatRoom | undefined> {
    if (!this.db) await this.init();
    return this.db!.get('chatRooms', roomId);
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
    return this.db!.getAllFromIndex('messages', 'by-room', roomId);
  }

  async getMessagesByDate(roomId: number, date: string): Promise<Message[]> {
    if (!this.db) await this.init();
    const messages = await this.getMessagesByRoom(roomId);
    return messages.filter(msg => msg.createdAt.startsWith(date));
  }

  // Community operations
  async saveCommunity(community: Channel | Group) {
    if (!this.db) await this.init();
    await this.db!.put('communities', community);
  }

  async getCommunity(id: number): Promise<Channel | Group | undefined> {
    if (!this.db) await this.init();
    return this.db!.get('communities', id);
  }

  async searchCommunities(keyword: string): Promise<(Channel | Group)[]> {
    if (!this.db) await this.init();
    const communities = await this.db!.getAll('communities');
    return communities.filter(c => 
      c.name.toLowerCase().includes(keyword.toLowerCase()) ||
      c.description.toLowerCase().includes(keyword.toLowerCase())
    );
  }
}

export const dbService = new DatabaseService();