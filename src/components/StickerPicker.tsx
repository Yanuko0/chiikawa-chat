import { useState, useEffect } from 'react';
import xiaoba from '../assets/img/icons/小八.png';

// 貼圖列表，您可以替換成自己的貼圖URL
const STICKERS = [
  '/chiikawa-chat/stickers/sticker1.png',
  '/chiikawa-chat/stickers/sticker2.png',
  '/chiikawa-chat/stickers/sticker3.png',
  '/chiikawa-chat/stickers/sticker4.png',
  '/chiikawa-chat/stickers/sticker5.png',
  '/chiikawa-chat/stickers/sticker6.png',
  '/chiikawa-chat/stickers/sticker7.png',
  '/chiikawa-chat/stickers/sticker8.png',
  '/chiikawa-chat/stickers/sticker9.png',
  '/chiikawa-chat/stickers/sticker10.png',
  '/chiikawa-chat/stickers/sticker11.png',
  '/chiikawa-chat/stickers/sticker12.png',
  '/chiikawa-chat/stickers/sticker13.png',
  '/chiikawa-chat/stickers/sticker14.png',
  '/chiikawa-chat/stickers/sticker15.png',
  '/chiikawa-chat/stickers/sticker16.png',
  '/chiikawa-chat/stickers/sticker17.png',
  '/chiikawa-chat/stickers/sticker18.png',
  '/chiikawa-chat/stickers/sticker19.png',
  '/chiikawa-chat/stickers/sticker20.png',
  '/chiikawa-chat/stickers/sticker21.png',
  '/chiikawa-chat/stickers/sticker22.png',
  '/chiikawa-chat/stickers/sticker23.png',
  '/chiikawa-chat/stickers/sticker24.png',
  '/chiikawa-chat/stickers/sticker25.png',
  '/chiikawa-chat/stickers/sticker26.png',
  '/chiikawa-chat/stickers/sticker27.png',
  '/chiikawa-chat/stickers/sticker28.png',
  '/chiikawa-chat/stickers/sticker29.png',
  '/chiikawa-chat/stickers/sticker30.png',
  '/chiikawa-chat/stickers/sticker31.png',
  '/chiikawa-chat/stickers/sticker32.png',
  '/chiikawa-chat/stickers/sticker33.png',
  '/chiikawa-chat/stickers/sticker34.png',
  '/chiikawa-chat/stickers/sticker35.png',
  '/chiikawa-chat/stickers/sticker36.png',
  '/chiikawa-chat/stickers/sticker37.png',
  '/chiikawa-chat/stickers/sticker38.png',
  '/chiikawa-chat/stickers/sticker39.png',
];

interface StickerPickerProps {
  onStickerSelect: (stickerUrl: string) => void;
}

export const StickerPicker = ({ onStickerSelect }: StickerPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loadedStickers, setLoadedStickers] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen && loadedStickers.length === 0) {
      setLoadedStickers(STICKERS);
    }
  }, [isOpen]);

  // 預先載入所有貼圖
  useEffect(() => {
    STICKERS.forEach(stickerUrl => {
      const img = new Image();
      img.src = stickerUrl;
    });
  }, []);

  return (
    <div className="sticker-picker">
      <button
        className="sticker-button"
        onClick={() => setIsOpen(!isOpen)}
        title="選擇貼圖"
      >
        <img
          src={xiaoba}
          alt="貼圖選單"
          className="sticker-menu-icon"
          width={30}
        />
      </button>

      {isOpen && (
        <div className="sticker-container">
          <div className="sticker-grid">
            {loadedStickers.map((sticker, index) => (
              <img
                key={index}
                src={sticker}
                alt={`sticker-${index}`}
                onClick={() => {
                  onStickerSelect(sticker);
                  setIsOpen(false);
                }}
                className="sticker-item"
                loading="lazy"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}; 