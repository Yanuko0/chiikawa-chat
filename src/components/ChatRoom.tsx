import { useState, useEffect, useRef } from 'react';
import { collection, addDoc, orderBy, query, onSnapshot, deleteDoc, getDocs, updateDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { StickerPicker } from './StickerPicker';
import chiikawaBg from '../assets/img/bg/chiikawa_bg.jpg';
import { message, Button } from 'antd';


import { Message } from './Message';

interface Message {
  id: string;
  type: 'text' | 'sticker';
  content: string;
  userName: string;
  createdAt: Date;
  displayTime: string;
  isDeleted?: boolean;
  replyTo?: {
    id: string;
    content: string;
    userName: string;
  } | null;
  isEdited?: boolean;
  groupId: string;
  readBy?: string[];
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
  const [replyTo, setReplyTo] = useState<Message['replyTo']>();

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
  }, []);

  // 滾動到底部的函數
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 當消息更新時滾動到底部
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 刪除訊息
  const handleDeleteMessage = async (messageId: string) => {
    try {
      const messageRef = doc(db, 'messages', messageId);
      await updateDoc(messageRef, {
        isDeleted: true
      });
      message.success('訊息已刪除');
    } catch (error) {
      message.error('刪除訊息失敗');
    }
  };

  // 編輯訊息
  const handleEditMessage = async (messageId: string, newContent: string) => {
    try {
      const messageRef = doc(db, 'messages', messageId);
      await updateDoc(messageRef, {
        content: newContent,
        isEdited: true
      });
      message.success('訊息已更新');
    } catch (error) {
      message.error('編輯訊息失敗');
    }
  };

  // 回覆訊息
  const handleReplyMessage = (messageId: string, content: string, userName: string) => {
    setReplyTo({
      id: messageId,
      content,
      userName
    });
  };

  // 添加一個格式化時間的輔助函數
  const formatMessageTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? '下午' : '上午';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    
    return `${ampm} ${formattedHours}:${formattedMinutes}`;
  };

  // 修改發送訊息的函數
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    try {
      const now = new Date();
      const messageData = {
        type: 'text' as const,
        content: newMessage,
        userName: userName,
        createdAt: now,
        displayTime: formatMessageTime(now),  // 添加顯示時間
        replyTo: replyTo || null,
        isDeleted: false,
        isEdited: false,
        readBy: [userName],
      };

      console.log('Sending message:', messageData); // 用於除錯

      await addDoc(collection(db, 'messages'), messageData);
      
      setNewMessage('');
      setReplyTo(null);
      scrollToBottom();
    } catch (error) {
      console.error('發送錯誤:', error); // 顯示具體錯誤
      message.error(`發送訊息失敗: ${error}`);
    }
  };

  // 修改貼圖發送函數
  const handleStickerSelect = async (stickerUrl: string) => {
    try {
      const now = new Date();
      const messageData = {
        type: 'sticker' as const,
        content: stickerUrl,
        userName: userName,
        createdAt: now,
        displayTime: formatMessageTime(now),  // 添加顯示時間
        isDeleted: false,
        isEdited: false,
        readBy: [userName],
      };

      await addDoc(collection(db, 'messages'), messageData);
    } catch (error) {
      console.error('發送貼圖錯誤:', error);
      message.error('發送貼圖失敗');
    }
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
      console.error('清除聊天室時發送錯誤:', error);
    }
  };

  // 新增已讀處理函數
  const handleMessageRead = async (messageId: string) => {
    try {
      const messageRef = doc(db, 'messages', messageId);
      const messageDoc = await getDoc(messageRef);
      
      if (messageDoc.exists()) {
        const currentReadBy = messageDoc.data().readBy || [];
        if (!currentReadBy.includes(userName)) {
          await updateDoc(messageRef, {
            readBy: [...currentReadBy, userName]
          });
        }
      }
    } catch (error) {
      console.error('更新已讀狀態失敗:', error);
    }
  };

  // 在 useEffect 中監聽新訊息並標記已讀
  useEffect(() => {
    const messagesRef = collection(db, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          handleMessageRead(change.doc.id);
        }
      });
    });

    return () => unsubscribe();
  }, [userName]);

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
        {messages.map((msg) => (
          <Message
            key={msg.id}
            message={msg}
            currentUserName={userName}
            onDelete={handleDeleteMessage}
            onReply={handleReplyMessage}
            onEdit={handleEditMessage}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="input-area">
        {replyTo && (
          <div className="reply-preview" style={{
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            color:"white",
            padding: '8px',
            borderRadius: '4px',
            marginBottom: '8px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>回覆 {replyTo.userName}：{replyTo.content}</span>
            <Button 
              type="text" 
              size="small" 
              onClick={() => setReplyTo(null)}
              style={{ color: 'white' }}
            >
              取消回覆
            </Button>
          </div>
        )}
        <form onSubmit={handleSubmit} className="message-form">
          <div className="input-wrapper">
            <div className="button-group">
              <StickerPicker onStickerSelect={handleStickerSelect} />
            </div>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="輸入訊息..."
            />
            <button type="submit">發送</button>
          </div>
        </form>
      </div>
    </div>
  );
}; 


