import { useState, useEffect } from 'react';
import xiaoba from '../assets/img/icons/小八.png';

// 貼圖列表，您可以替換成自己的貼圖URL
const STICKERS = [
  '/stickers/sticker1.png',
  '/stickers/sticker2.png',
  '/stickers/sticker3.png',
  '/stickers/sticker4.png',
  '/stickers/sticker5.png',
  '/stickers/sticker6.png',
  '/stickers/sticker7.png',
  '/stickers/sticker8.png',
  '/stickers/sticker9.png',
  '/stickers/sticker10.png',
  '/stickers/sticker11.png',
  '/stickers/sticker12.png',
  '/stickers/sticker13.png',
  '/stickers/sticker14.png',
  '/stickers/sticker15.png',
  '/stickers/sticker16.png',
  '/stickers/sticker17.png',
  '/stickers/sticker18.png',
  '/stickers/sticker19.png',
  '/stickers/sticker20.png',
  '/stickers/sticker21.png',
  '/stickers/sticker22.png',
  '/stickers/sticker23.png',
  '/stickers/sticker24.png',
  '/stickers/sticker25.png',
  '/stickers/sticker26.png',
  '/stickers/sticker27.png',
  '/stickers/sticker28.png',
  '/stickers/sticker29.png',
  '/stickers/sticker30.png',
  '/stickers/sticker31.png',
  '/stickers/sticker32.png',
  '/stickers/sticker33.png',
  '/stickers/sticker34.png',
  '/stickers/sticker35.png',
  '/stickers/sticker36.png',
  '/stickers/sticker37.png',
  '/stickers/sticker38.png',
  '/stickers/sticker39.png',
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