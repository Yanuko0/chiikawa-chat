import { useState } from 'react';
import { Popover, Button } from 'antd';
import { DeleteOutlined, UndoOutlined, MessageOutlined } from '@ant-design/icons';
import { Message as MessageType } from '../types';

interface MessageProps {
  message: MessageType;
  currentUserName: string;
  onDelete: (messageId: string) => void;
  onReply: (messageId: string, messageContent: string, userName: string) => void;
  onEdit: (messageId: string, newContent: string) => void;
}

export const Message = ({ 
  message, 
  currentUserName, 
  onDelete, 
  onReply,
  onEdit 
}: MessageProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  
  const isOwnMessage = message.userName === currentUserName;

  const handleEdit = () => {
    if (editContent.trim() === message.content) {
      setIsEditing(false);
      return;
    }
    onEdit(message.id, editContent);
    setIsEditing(false);
  };

  const messageActions = (
    <div className="message-actions">
      <Button 
        icon={<MessageOutlined />} 
        type="text" 
        onClick={() => onReply(message.id, message.content, message.userName)}
      >
        回覆
      </Button>
      {isOwnMessage && (
        <>
          <Button 
            icon={<DeleteOutlined />} 
            type="text" 
            onClick={() => onDelete(message.id)}
          >
            刪除
          </Button>
          <Button 
            icon={<UndoOutlined />} 
            type="text" 
            onClick={() => setIsEditing(true)}
          >
            編輯
          </Button>
        </>
      )}
    </div>
  );

  return (
    <div className={`message ${isOwnMessage ? 'own-message' : ''}`}>
      {message.replyTo && (
        <div className="reply-content">
          回覆 {message.replyTo.userName}：{message.replyTo.content}
        </div>
      )}
      <div className="message-header">
        <small>{message.userName}</small>
        {message.isEdited && <small className="edited-mark">(已編輯)</small>}
      </div>
      <Popover content={messageActions} trigger="hover">
        <div className="message-content">
          {message.isDeleted ? (
            <i>此訊息已被刪除</i>
          ) : isEditing ? (
            <div className="edit-mode">
              <input
                type="text"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleEdit()}
                autoFocus
              />
              <Button size="small" onClick={handleEdit}>確認</Button>
              <Button size="small" onClick={() => setIsEditing(false)}>取消</Button>
            </div>
          ) : (
            message.type === 'text' ? (
              message.content
            ) : (
              <img src={message.content} alt="sticker" className="message-sticker" />
            )
          )}
        </div>
      </Popover>
    </div>
  );
}; 