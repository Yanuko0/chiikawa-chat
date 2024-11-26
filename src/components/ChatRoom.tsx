import { useState, useEffect, useRef } from 'react';
import { collection, addDoc, orderBy, query, onSnapshot, deleteDoc, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { StickerPicker } from './StickerPicker';
import chiikawaBg from '../assets/img/bg/chiikawa_bg.jpg';

interface Message {
  id: string;
  type: 'text' | 'sticker';
  content: string;
  userName: string;
  createdAt: Date;
}

interface ChatRoomProps {
  isAdmin?: boolean;
}

export const ChatRoom = ({ isAdmin = false }: ChatRoomProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('chatUserName') || `訪客${Math.floor(Math.random() * 1000)}`;
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('chatUserName', userName);

    const messagesRef = collection(db, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messages: Message[] = [];
      snapshot.forEach((doc) => {
        messages.push({ id: doc.id, ...doc.data() } as Message);
      });
      setMessages(messages);
    });

    return () => unsubscribe();
  }, [userName]);

  // 滾動到底部的函數
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 當消息更新時滾動到底部
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    await addDoc(collection(db, 'messages'), {
      type: 'text',
      content: newMessage,
      userName: userName,
      createdAt: new Date()
    });

    setNewMessage('');
    scrollToBottom();
  };

  const handleStickerSelect = async (stickerUrl: string) => {
    await addDoc(collection(db, 'messages'), {
      type: 'sticker',
      content: stickerUrl,
      userName: userName,
      createdAt: new Date()
    });
  };

  // 清除本地訊息
  const clearLocalMessages = () => {
    setMessages([]);
  };

  // 清除 Firebase 資料庫中的訊息
  const clearFirebaseMessages = async () => {
    if (!window.confirm('確定要清除所有聊天記錄嗎？')) {
      return;
    }

    try {
      const messagesRef = collection(db, 'messages');
      const querySnapshot = await getDocs(messagesRef);
      
      // 批次刪除所有訊息
      const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      
      console.log('聊天室已清除');
    } catch (error) {
      console.error('清除聊天室時發生錯誤:', error);
    }
  };

  return (
    <div 
      className="chat-room"
    >
      <div className="chat-header">
        <div className="user-info">
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="輸入您的名稱"
            className="name-input"
          />
        </div>
        {isAdmin && (
          <div className="chat-controls">
            <button 
              onClick={clearFirebaseMessages}
              className="clear-button"
            >
              清除聊天室
            </button>
          </div>
        )}
      </div>
      <div 
        className="messages"
        style={{
          backgroundImage: `linear-gradient(
            rgba(255, 255, 255, 0.5),
            rgba(255, 255, 255, 0.5)
          ), url(${chiikawaBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`message ${message.userName === userName ? 'own-message' : ''}`}
          >
            <div className="message-header">
              <small>{message.userName}</small>
            </div>
            <div className="message-content">
              {message.type === 'text' ? (
                message.content
              ) : (
                <img 
                  src={message.content} 
                  alt="sticker" 
                  className="message-sticker"
                />
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="message-form">
        <StickerPicker onStickerSelect={handleStickerSelect} />
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="輸入訊息..."
        />
        <button type="submit">發送</button>
      </form>
    </div>
  );
}; 