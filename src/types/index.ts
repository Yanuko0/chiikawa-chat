export interface Message {
  id: string;
  type: 'text' | 'sticker';
  content: string;
  userName: string;
  createdAt: Date;
  isDeleted?: boolean;
  replyTo?: {
    id: string;
    content: string;
    userName: string;
} | null;
  isEdited?: boolean;
  groupId: string;
} 