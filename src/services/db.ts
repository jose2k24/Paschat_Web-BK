import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { ChatMessage, Message, ChatRoom, Contact, transformChatMessage } from '@/types/chat';

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
        messageStore.createIndex('by-room', 'chat_id');
        messageStore.createIndex('by-sender', 'sender_id');
        messageStore.createIndex('by-type', 'type');
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
    await this.db!.put('chatRooms', room);
  }

  async saveChatRooms(rooms: ChatRoom[]) {
    if (!this.db) await this.init();
    const tx = this.db!.transaction('chatRooms', 'readwrite');
    await Promise.all(rooms.map(room => tx.store.put(room)));
    await tx.done;
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
    const messages = await this.db!.getAllFromIndex('messages', 'by-room', roomId);
    return messages;
  }

  async getMessagesBySender(senderId: number): Promise<Message[]> {
    if (!this.db) await this.init();
    return this.db!.getAllFromIndex('messages', 'by-sender', senderId);
  }

  async getMessagesByType(type: Message['type']): Promise<Message[]> {
    if (!this.db) await this.init();
    return this.db!.getAllFromIndex('messages', 'by-type', type);
  }

  async getLastMessageByRoom(roomId: number): Promise<Message | undefined> {
    if (!this.db) await this.init();
    const messages = await this.getMessagesByRoom(roomId);
    return messages.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )[0];
  }
}

export const dbService = new DatabaseService();