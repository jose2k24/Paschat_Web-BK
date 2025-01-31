import { useState, useEffect } from 'react';
import { apiService } from '@/services/api';
import { dbService } from '@/services/db';
import { toast } from 'sonner';

export const useContacts = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getSavedContacts();
      
      if (response.data) {
        await dbService.saveContacts(
          response.data.map(contact => ({
            phone: contact.phone,
            profile: contact.profile,
            name: null,
            roomId: null,
          }))
        );
      }
    } catch (err) {
      console.error('Failed to load contacts:', err);
      setError('Failed to load contacts');
      toast.error('Failed to load contacts');
    } finally {
      setIsLoading(false);
    }
  };

  const createChatRoom = async (contactPhone: string) => {
    try {
      const userPhone = localStorage.getItem('userPhone');
      if (!userPhone) throw new Error('User not logged in');

      const contact = await dbService.getContact(contactPhone);
      if (!contact) throw new Error('Contact not found');

      if (contact.roomId) {
        return contact.roomId;
      }

      const response = await apiService.createChatRoom(userPhone, contactPhone);
      
      if (response.data) {
        const roomId = parseInt(response.data.roomId.toString(), 10);
        
        await dbService.saveChatRoom({
          roomId,
          participants: response.data.participants,
          createdAt: response.data.createdAt,
          roomType: 'private'
        });

        await dbService.updateContactRoomId(contactPhone, roomId);
        
        return roomId;
      }
      
      throw new Error('Failed to create chat room');
    } catch (err) {
      console.error('Failed to create chat room:', err);
      toast.error('Failed to create chat room');
      throw err;
    }
  };

  return {
    isLoading,
    error,
    loadContacts,
    createChatRoom,
  };
};