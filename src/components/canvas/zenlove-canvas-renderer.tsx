'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { WeddingInvitationData } from '@/types/wedding';
import { CraftTree, CraftNode } from '@/constants/craft-templates';
import {
  resolveZenLoveAsset,
  getCleanWeddingPhoto,
  isWatermarkedAsset,
  isDecorativeAsset,
} from '@/lib/zenlove-assets';
import { getFontCssUrl } from '@/lib/zenlove-fonts';

interface ZenLoveCanvasRendererProps {
  craftTree: CraftTree;
  data: WeddingInvitationData;
  onSelectNode?: (nodeId: string, node: CraftNode) => void;
  selectedNodeId?: string | null;
  onEditField?: (field: 'couple' | 'date') => void;
  isInteractive?: boolean;
}

// 1. CAROUSEL WIDGET (Handles CarouselBox with auto-cycle, smooth transition and clean photos)
const CarouselWidget: React.FC<{
  id: string;
  imgList: Array<{ id: string; imageKey: string; alt?: string }>;
  data: WeddingInvitationData;
  borderRadius?: number[];
  width?: number;
  height?: number;
}> = ({ id, imgList, data, borderRadius, width = 500, height = 650 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (imgList.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % imgList.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [imgList.length]);

  const currentItem = imgList[currentIndex] || imgList[0];
  const customPhoto = data.customPhotoNodes?.[`${id}_${currentIndex}`] || data.customPhotoNodes?.[id];
  const imgSrc = customPhoto || resolveZenLoveAsset(currentItem?.imageKey) || getCleanWeddingPhoto(`${id}_${currentIndex}`, width, height);

  return (
    <div className="w-full h-full relative overflow-hidden bg-stone-100 shadow-sm">
      <img
        key={currentIndex}
        src={imgSrc}
        alt={currentItem?.alt || 'Album ảnh cưới'}
        className="w-full h-full object-cover block select-none pointer-events-none transition-all duration-700 ease-in-out"
        style={{
          borderRadius: Array.isArray(borderRadius)
            ? `${borderRadius[0]}px ${borderRadius[1]}px ${borderRadius[2]}px ${borderRadius[3]}px`
            : undefined,
          objectPosition: 'center center',
        }}
        onError={(e) => {
          e.currentTarget.src = getCleanWeddingPhoto(`${id}_${currentIndex}`, width, height);
        }}
      />
      {/* Dots Indicator */}
      {imgList.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/35 backdrop-blur-xs pointer-events-none z-10">
          {imgList.map((_, idx) => (
            <span
              key={idx}
              className={`block rounded-full transition-all ${
                idx === currentIndex ? 'w-4 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// 2. PHOTO GALLERY WIDGET (Interactive wedding album with featured photo & thumbnail strip)
const PhotoGalleryWidget: React.FC<{
  id: string;
  photos: Array<{ id: string; imageKey: string; alt?: string }>;
  data: WeddingInvitationData;
  borderRadius?: number[];
  width?: number;
  height?: number;
}> = ({ id, photos, data, borderRadius, width = 500, height = 450 }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!photos || photos.length === 0) return null;

  const activeItem = photos[activeIndex] || photos[0];
  const customActive = data.customPhotoNodes?.[`${id}_${activeIndex}`] || data.customPhotoNodes?.[id];
  const activeSrc = customActive || resolveZenLoveAsset(activeItem?.imageKey) || getCleanWeddingPhoto(`${id}_${activeIndex}`, width, height);

  return (
    <div className="w-full h-full flex flex-col justify-between p-2 select-none">
      {/* Featured Main Photo */}
      <div className="w-full relative flex-1 min-h-[260px] rounded-xl overflow-hidden shadow-sm bg-stone-100 group">
        <img
          src={activeSrc}
          alt={activeItem?.alt || 'Album ảnh cưới'}
          className="w-full h-full object-cover block select-none pointer-events-none transition-all duration-500"
          style={{ objectPosition: 'center center' }}
          onError={(e) => {
            e.currentTarget.src = getCleanWeddingPhoto(`${id}_${activeIndex}`, width, height);
          }}
        />

        {/* Prev / Next Navigation Arrows */}
        {photos.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-xs text-base font-bold transition-all cursor-pointer opacity-80 hover:opacity-100 z-10"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveIndex((prev) => (prev + 1) % photos.length);
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-xs text-base font-bold transition-all cursor-pointer opacity-80 hover:opacity-100 z-10"
            >
              ›
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Strip */}
      {photos.length > 1 && (
        <div className="flex gap-2 mt-2 overflow-x-auto pb-1 scrollbar-none justify-center">
          {photos.slice(0, 8).map((item, idx) => {
            const customThumb = data.customPhotoNodes?.[`${id}_${idx}`];
            const thumbSrc = customThumb || resolveZenLoveAsset(item.imageKey) || getCleanWeddingPhoto(`${id}_${idx}`, 80, 80);
            const isActive = idx === activeIndex;

            return (
              <button
                key={item.id || idx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIndex(idx);
                }}
                className={`relative w-14 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                  isActive ? 'border-rose-600 scale-105 shadow-md' : 'border-stone-200 opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={thumbSrc}
                  alt={item.alt || 'Ảnh thu nhỏ'}
                  className="w-full h-full object-cover"
                  style={{ objectPosition: 'center center' }}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const ZenLoveCanvasRenderer: React.FC<ZenLoveCanvasRendererProps> = ({
  craftTree,
  data,
  onSelectNode,
  selectedNodeId,
  onEditField,
  isInteractive = true,
}) => {
  const [internalSelectedId, setInternalSelectedId] = useState<string | null>(null);
  const [isGiftModalOpen, setIsGiftModalOpen] = useState<boolean>(false);
  const activeSelectedId = selectedNodeId !== undefined ? selectedNodeId : internalSelectedId;
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  // 1. Root Container Config
  const rootNode = craftTree['ROOT'];
  const rootProps = rootNode?.props || {};
  const canvasWidth = rootProps.width || 500;
  const canvasHeight = rootProps.height || 5000;
  const rootBgColor = rootProps.backgroundColor || '#ffffff';
  const rootBgImage = resolveZenLoveAsset(rootProps.backgroundImage);

  React.useEffect(() => {
    if (!containerRef.current) return;
    const updateScale = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      if (w > 0 && w < canvasWidth) {
        setScale(w / canvasWidth);
      } else {
        setScale(1);
      }
    };
    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [canvasWidth]);

  // 2. Extract and load all unique font families from all nodes
  const fontUrls = useMemo(() => {
    const urls = new Set<string>();
    for (const node of Object.values(craftTree)) {
      const fam = node.props?.fontFamily;
      if (fam && typeof fam === 'string') {
        const url = getFontCssUrl(fam);
        if (url) urls.add(url);
      }
    }
    if (data.typography?.fontFamily) {
      const url = getFontCssUrl(data.typography.fontFamily);
      if (url) urls.add(url);
    }
    return Array.from(urls);
  }, [craftTree, data.typography?.fontFamily]);

  // 3. Sort children nodes by zIndex
  const sortedNodes = useMemo(() => {
    const list: Array<{ id: string; node: CraftNode }> = [];
    for (const [id, node] of Object.entries(craftTree)) {
      if (id === 'ROOT') continue;
      list.push({ id, node });
    }
    return list.sort((a, b) => (a.node.props?.zIndex || 0) - (b.node.props?.zIndex || 0));
  }, [craftTree]);

  // Common demo names in ZenLove templates to recognize and replace with real user names
  const GROOM_NAMES = new Set([
    'anh tú', 'đức mạnh', 'mạnh đức', 'văn tuấn', 'tuấn', 'bá khang', 'gia khang', 'minh trí',
    'hoàng hải', 'hoàng long', 'tuấn khang', 'chú rể', 'quang vinh', 'hải đăng', 'minh quân',
    'thanh tùng', 'hoàng nam', 'ngọc sơn', 'tiến dũng', 'anh tuấn', 'thành thành', 'vũ thanh thành'
  ]);

  const BRIDE_NAMES = new Set([
    'diệu nhi', 'lệ quyên', 'ngọc lan', 'lan nhi', 'quỳnh anh', 'ngọc oanh', 'thanh trúc',
    'thanh hằng', 'mỹ châu', 'phương nga', 'bảo trâm', 'cô dâu', 'thu trang', 'lan anh',
    'hồng ngọc', 'mai anh', 'huyền my', 'thùy linh', 'ngọc trâm', 'thảo vy', 'mỹ mai', 'đỗ mỹ mai',
    'ngọc anh'
  ]);

  const isGroomNameNode = (text: string): boolean => {
    const clean = text.toLowerCase().replace(/<[^>]+>/g, '').trim();
    return GROOM_NAMES.has(clean);
  };

  const isBrideNameNode = (text: string): boolean => {
    const clean = text.toLowerCase().replace(/<[^>]+>/g, '').trim();
    return BRIDE_NAMES.has(clean);
  };

  const isCoupleCombinedNode = (text: string): boolean => {
    const clean = text.toLowerCase().replace(/<[^>]+>/g, '').trim();
    return (
      clean.includes('&') ||
      clean.includes(' và ') ||
      clean.includes(' love ') ||
      clean.includes(' loves ') ||
      clean.includes('·') ||
      clean.includes('wedding invitation')
    );
  };

  // Watermark text suppressor
  const isZenLoveWatermarkText = (txt: string): boolean => {
    const clean = txt.toLowerCase().replace(/<[^>]+>/g, '').trim();
    return (
      clean.includes('zenlove.me') ||
      clean.includes('thiết kế thiệp tại zenlove') ||
      clean.includes('thiết kế thiệp online tại zenlove') ||
      clean.includes('thiết kế thiệp cưới tại zenlove') ||
      clean.includes('thiệp online tại zenlove') ||
      clean.includes('@zenlove') ||
      clean.includes('zenlove wedding') ||
      clean === 'zenlove'
    );
  };

  const handleNodeClick = (id: string, node: CraftNode, e: React.MouseEvent) => {
    if (!isInteractive) return;
    e.stopPropagation();
    setInternalSelectedId(id);
    onSelectNode?.(id, node);

    const type = node.type?.resolvedName;
    if (type === 'TextBox') {
      const txt = node.props?.text || '';
      if (isGroomNameNode(txt) || isBrideNameNode(txt) || isCoupleCombinedNode(txt)) {
        onEditField?.('couple');
      }
    }
  };

  const mainCeremony = data.ceremonies?.[0];
  const targetDateStr = mainCeremony?.dateSolar || '2026-12-29';
  const [targetYear, targetMonth, targetDay] = targetDateStr.split('-');

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden select-none bg-white"
      style={{
        backgroundColor: rootBgColor,
        height: `${canvasHeight * scale}px`,
      }}
    >
      {/* Dynamic Font Stylesheets injection */}
      {fontUrls.map((url) => (
        <link key={url} rel="stylesheet" href={url} />
      ))}

      {/* Main Canvas Viewport: fixed 500px width layout with CSS transform scale */}
      <div
        className="relative origin-top-left transition-transform"
        style={{
          width: `${canvasWidth}px`,
          height: `${canvasHeight}px`,
          transform: `scale(${scale})`,
          backgroundColor: rootBgColor,
          backgroundImage: rootBgImage ? `url(${rootBgImage})` : undefined,
          backgroundRepeat: 'repeat',
          backgroundSize: '512px 512px',
        }}
      >
        {sortedNodes.map(({ id, node }) => {
          const type = node.type?.resolvedName;
          const p = node.props || {};
          const isSelected = activeSelectedId === id;

          // Common positioning styles
          const posStyle: React.CSSProperties = {
            position: 'absolute',
            top: typeof p.top === 'number' ? `${p.top}px` : p.top,
            left: typeof p.left === 'number' ? `${p.left}px` : p.left,
            width: typeof p.width === 'number' ? `${p.width}px` : p.width,
            height: typeof p.height === 'number' ? `${p.height}px` : p.height,
            zIndex: p.zIndex || 1,
            opacity: p.opacity ?? 1,
            transform: p.rotation ? `rotate(${p.rotation}deg)` : undefined,
            transformOrigin: 'center center',
          };

          // 1. TEXT BOX RENDERING
          if (type === 'TextBox') {
            const rawText = p.text || '';

            // Suppress competitor watermark text completely
            if (isZenLoveWatermarkText(rawText)) {
              return null;
            }

            let displayText = rawText;

            // Direct custom text node override
            if (data.customTextNodes && data.customTextNodes[id] !== undefined) {
              displayText = data.customTextNodes[id];
            } else {
              // Dynamic Couple Name replacement
              const isGroom = isGroomNameNode(rawText);
              const isBride = isBrideNameNode(rawText);

              if (isGroom) {
                displayText = data.groom.shortName || data.groom.fullName || 'Chú Rể';
              } else if (isBride) {
                displayText = data.bride.shortName || data.bride.fullName || 'Cô Dâu';
              } else if (
                isCoupleCombinedNode(rawText) &&
                (rawText.includes('Anh Tú') ||
                  rawText.includes('Diệu Nhi') ||
                  rawText.includes('Vũ Thanh Thành') ||
                  rawText.includes('Gia Khang') ||
                  rawText.includes('Thanh Trúc') ||
                  rawText.includes('Mạnh Đức') ||
                  rawText.includes('Ngọc Anh'))
              ) {
                displayText = `${data.groom.shortName || 'Chú Rể'} & ${data.bride.shortName || 'Cô Dâu'}`;
              }
            }

            // Sanitize any remaining competitor venue names
            displayText = displayText
              .replace(/Khách sạn ZenLove/gi, mainCeremony?.venueName || 'The Mira Convention Center')
              .replace(/Trung tâm tiệc cưới ZenLove/gi, mainCeremony?.venueName || 'Trung Tâm Tiệc Cưới')
              .replace(/ZenLove Hotel/gi, mainCeremony?.venueName || 'The Mira Hotel')
              .replace(/ZenLove Plaza/gi, 'Trung Tâm Hội Nghị')
              .replace(/Zenlove restaurant/gi, 'Nhà Hàng Tiệc Cưới')
              .replace(/Nhà hàng ZenLove/gi, 'Nhà Hàng Tiệc Cưới')
              .replace(/ZenLove/g, 'Hạnh Phúc');

            // Keep the designer's exact font styling unless specifically chosen
            const fontFam = p.fontFamily;
            const fontCol = p.color || '#111827';
            const fontSz = p.fontSize ? `${p.fontSize}px` : '16px';

            return (
              <div
                key={id}
                onClick={(e) => handleNodeClick(id, node, e)}
                style={{
                  ...posStyle,
                  fontFamily: fontFam ? `'${fontFam}', sans-serif` : undefined,
                  fontSize: fontSz,
                  color: fontCol,
                  textAlign: (p.textAlign || 'center') as any,
                  fontWeight: p.fontWeight || 'normal',
                  textTransform: (p.textTransform || 'none') as any,
                  lineHeight: p.lineHeight ? `${p.lineHeight}` : 1.3,
                  letterSpacing: p.letterSpacing ? `${p.letterSpacing}px` : undefined,
                }}
                className={`transition-all ${
                  isInteractive ? 'cursor-pointer hover:outline hover:outline-1 hover:outline-sky-400' : ''
                } ${isSelected ? 'ring-2 ring-sky-500 rounded-xs' : ''}`}
              >
                {/* Visual Selection handles */}
                {isSelected && (
                  <>
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-white rounded shadow-md border border-gray-200 px-2 py-0.5 flex items-center gap-1.5 text-[10px] text-gray-700 whitespace-nowrap z-50">
                      <span>✏️ Đang chọn để sửa</span>
                    </div>
                    <div className="absolute -top-1 -left-1 w-2 h-2 bg-white border border-sky-500 rounded-full" />
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-white border border-sky-500 rounded-full" />
                    <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-white border border-sky-500 rounded-full" />
                    <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-white border border-sky-500 rounded-full" />
                  </>
                )}
                {/* Render HTML content safely */}
                <div dangerouslySetInnerHTML={{ __html: displayText }} />
              </div>
            );
          }

          // 2. ZEN STOCK BOX (Stickers, Floral Flourishes, Calligraphy, Double Happiness)
          // 2. ZEN STOCK BOX (Background Cards, Frames, Vector Shapes, Stickers, Floral Flourishes)
          if (type === 'ZenStockBox') {
            const rawImg = p.imgKey;
            const imgSrc = resolveZenLoveAsset(rawImg);
            const isSvg = p.zenStockType === 'svg' || (rawImg && rawImg.endsWith('.svg')) || (rawImg && rawImg.includes('shapeElements'));
            const bgColor = p.svgColor || p.backgroundColor || p.color || 'transparent';
            const isPlainRect = rawImg && rawImg.includes('mguzpb69ndhffzq0.svg');

            if (isSvg) {
              if (isPlainRect) {
                // Solid rectangular background card (e.g. invitation section card, calendar card, rsvp card, gift card)
                return (
                  <div
                    key={id}
                    onClick={(e) => handleNodeClick(id, node, e)}
                    style={{
                      ...posStyle,
                      backgroundColor: bgColor,
                      borderRadius: Array.isArray(p.borderRadius)
                        ? `${p.borderRadius[0]}px ${p.borderRadius[1]}px ${p.borderRadius[2]}px ${p.borderRadius[3]}px`
                        : undefined,
                      border: p.borderSize
                        ? `${p.borderSize}px ${p.borderStyle || 'solid'} ${p.borderColor || 'transparent'}`
                        : undefined,
                      boxShadow: p.hasBoxShadow && p.boxShadow
                        ? `${p.boxShadow.offsetX || 0}px ${p.boxShadow.offsetY || 0}px ${p.boxShadow.blur || 10}px ${p.boxShadow.spread || 0}px ${p.boxShadow.color || 'rgba(0,0,0,0.1)'}`
                        : undefined,
                    }}
                    className={`transition-all ${
                      isInteractive ? 'cursor-pointer hover:outline hover:outline-1 hover:outline-sky-400' : ''
                    } ${isSelected ? 'ring-2 ring-sky-500' : ''}`}
                  />
                );
              }

              // Vector shapes (arches, scallops, borders, dividers) tinted with svgColor via CSS mask
              return (
                <div
                  key={id}
                  onClick={(e) => handleNodeClick(id, node, e)}
                  style={{
                    ...posStyle,
                    backgroundColor: bgColor !== 'transparent' ? bgColor : '#465c3d',
                    WebkitMaskImage: imgSrc ? `url(${imgSrc})` : undefined,
                    maskImage: imgSrc ? `url(${imgSrc})` : undefined,
                    WebkitMaskSize: '100% 100%',
                    maskSize: '100% 100%',
                    WebkitMaskRepeat: 'no-repeat',
                    maskRepeat: 'no-repeat',
                    borderRadius: Array.isArray(p.borderRadius)
                      ? `${p.borderRadius[0]}px ${p.borderRadius[1]}px ${p.borderRadius[2]}px ${p.borderRadius[3]}px`
                      : undefined,
                    border: p.borderSize
                      ? `${p.borderSize}px ${p.borderStyle || 'solid'} ${p.borderColor || 'transparent'}`
                      : undefined,
                  }}
                  className={`transition-all ${
                    isInteractive ? 'cursor-pointer hover:outline hover:outline-1 hover:outline-sky-400' : ''
                  } ${isSelected ? 'ring-2 ring-sky-500' : ''}`}
                />
              );
            }

            // Graphic raster elements: transparent PNG/WEBP florals, hearts, wax seals, stamps
            if (!imgSrc) return null;
            return (
              <div
                key={id}
                onClick={(e) => handleNodeClick(id, node, e)}
                style={posStyle}
                className={`transition-all ${
                  isInteractive ? 'cursor-pointer hover:outline hover:outline-1 hover:outline-sky-400' : ''
                } ${isSelected ? 'ring-2 ring-sky-500' : ''}`}
              >
                <img
                  src={imgSrc}
                  alt="Họa tiết trang trí"
                  className="w-full h-full object-contain block select-none pointer-events-none"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            );
          }

          // 3. PHOTO BOX RENDERING (Couple Portraits and Decorative Shapes/Envelopes)
          if (type === 'PhotoBox') {
            const rawImg = p.imgKey;
            const customPhoto = data.customPhotoNodes?.[id];
            const width = typeof p.width === 'number' ? p.width : 500;
            const height = typeof p.height === 'number' ? p.height : 500;
            const isDecorative = isDecorativeAsset(rawImg);

            // Always match the template thumbnail photo by default unless custom user photo is set
            const imgSrc = customPhoto || resolveZenLoveAsset(rawImg) || getCleanWeddingPhoto(id, width, height);

            return (
              <div
                key={id}
                onClick={(e) => handleNodeClick(id, node, e)}
                style={{
                  ...posStyle,
                  backgroundColor: p.backgroundColor || undefined,
                  borderRadius: Array.isArray(p.borderRadius)
                    ? `${p.borderRadius[0]}px ${p.borderRadius[1]}px ${p.borderRadius[2]}px ${p.borderRadius[3]}px`
                    : undefined,
                  padding: Array.isArray(p.padding)
                    ? `${p.padding[0]}px ${p.padding[1]}px ${p.padding[2]}px ${p.padding[3]}px`
                    : undefined,
                  border: p.borderSize
                    ? `${p.borderSize}px ${p.borderStyle || 'solid'} ${p.borderColor || 'transparent'}`
                    : undefined,
                  boxShadow: p.hasBoxShadow && p.boxShadow
                    ? `${p.boxShadow.offsetX || 0}px ${p.boxShadow.offsetY || 0}px ${p.boxShadow.blur || 10}px ${p.boxShadow.spread || 0}px ${p.boxShadow.color || 'rgba(0,0,0,0.1)'}`
                    : undefined,
                }}
                className={`overflow-hidden transition-all ${
                  isInteractive ? 'cursor-pointer hover:outline hover:outline-1 hover:outline-sky-400' : ''
                } ${isSelected ? 'ring-2 ring-sky-500' : ''}`}
              >
                <img
                  src={imgSrc}
                  alt={p.alt || 'Ảnh cưới'}
                  className="w-full h-full block select-none pointer-events-none"
                  style={{
                    objectFit: isDecorative ? 'contain' : 'cover',
                    objectPosition: 'center center',
                    borderRadius: Array.isArray(p.borderRadius)
                      ? `${p.borderRadius[0]}px ${p.borderRadius[1]}px ${p.borderRadius[2]}px ${p.borderRadius[3]}px`
                      : undefined,
                  }}
                  loading="lazy"
                  onError={(e) => {
                    if (isDecorative) {
                      e.currentTarget.style.display = 'none';
                    } else {
                      e.currentTarget.src = getCleanWeddingPhoto(id, width, height);
                    }
                  }}
                />
              </div>
            );
          }

          // 4. CAROUSEL BOX (Photo Slider / Album)
          if (type === 'CarouselBox') {
            const imgList: Array<{ id: string; imageKey: string; alt?: string }> = p.imgList || [];
            if (imgList.length === 0) return null;
            const width = typeof p.width === 'number' ? p.width : 460;
            const height = typeof p.height === 'number' ? p.height : 640;

            return (
              <div
                key={id}
                onClick={(e) => handleNodeClick(id, node, e)}
                style={{
                  ...posStyle,
                  borderRadius: Array.isArray(p.borderRadius)
                    ? `${p.borderRadius[0]}px ${p.borderRadius[1]}px ${p.borderRadius[2]}px ${p.borderRadius[3]}px`
                    : undefined,
                }}
                className={`overflow-hidden relative transition-all ${
                  isInteractive ? 'cursor-pointer hover:outline hover:outline-1 hover:outline-sky-400' : ''
                } ${isSelected ? 'ring-2 ring-sky-500' : ''}`}
              >
                <CarouselWidget
                  id={id}
                  imgList={imgList}
                  data={data}
                  borderRadius={p.borderRadius}
                  width={width}
                  height={height}
                />
              </div>
            );
          }

          // 5. PHOTO GALLERY BOX (Interactive Wedding Gallery with featured photo & thumbnails)
          if (type === 'PhotoGalleryBox') {
            const photos: Array<{ id: string; imageKey: string; alt?: string }> = p.photos || [];
            if (photos.length === 0) return null;
            const width = typeof p.width === 'number' ? p.width : 500;
            const height = typeof p.height === 'number' ? p.height : 450;

            return (
              <div
                key={id}
                onClick={(e) => handleNodeClick(id, node, e)}
                style={{
                  ...posStyle,
                  borderRadius: Array.isArray(p.borderRadius)
                    ? `${p.borderRadius[0]}px ${p.borderRadius[1]}px ${p.borderRadius[2]}px ${p.borderRadius[3]}px`
                    : undefined,
                }}
                className={`overflow-hidden relative transition-all ${
                  isInteractive ? 'cursor-pointer hover:outline hover:outline-1 hover:outline-sky-400' : ''
                } ${isSelected ? 'ring-2 ring-sky-500' : ''}`}
              >
                <PhotoGalleryWidget
                  id={id}
                  photos={photos}
                  data={data}
                  borderRadius={p.borderRadius}
                  width={width}
                  height={height}
                />
              </div>
            );
          }

          // 6. RSVP BOX V2 (Interactive attendance confirmation)
          if (type === 'RsvpBoxV2') {
            const btnColor = p.buttonColor || data.primaryColor || '#465c3d';
            const textColor = p.color || '#1c1917';
            const title = p.titleText || 'Xác nhận tham dự';

            return (
              <div
                key={id}
                style={{
                  ...posStyle,
                  backgroundColor: p.backgroundColor || '#ffffff',
                  borderRadius: Array.isArray(p.borderRadius)
                    ? `${p.borderRadius[0]}px ${p.borderRadius[1]}px ${p.borderRadius[2]}px ${p.borderRadius[3]}px`
                    : '16px',
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.08)',
                }}
                className="p-5 flex flex-col justify-between border border-stone-100"
              >
                <div className="text-center mb-2">
                  <h3 className="font-serif font-bold text-base" style={{ color: textColor }}>{title}</h3>
                  <p className="text-[11px] text-stone-500 mt-0.5">Sự hiện diện của quý khách là niềm vinh hạnh cho chúng tôi</p>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <label className="block text-[11px] font-medium text-stone-600 mb-1">{p.nameLabel || 'Họ và tên'}</label>
                    <input
                      type="text"
                      placeholder="Nhập tên của bạn"
                      className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-rose-500"
                      readOnly={!isInteractive}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-stone-600 mb-1">{p.attendLabel || 'Bạn sẽ tham dự chứ?'}</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="flex-1 py-1 px-2 rounded-md border text-[11px] font-medium bg-rose-50 border-rose-200 text-rose-800"
                      >
                        {p.attendYesText || 'Sẽ tham dự'}
                      </button>
                      <button
                        type="button"
                        className="flex-1 py-1 px-2 rounded-md border text-[11px] font-medium bg-stone-50 border-stone-200 text-stone-600"
                      >
                        {p.attendNoText || 'Rất tiếc không thể'}
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  style={{ backgroundColor: btnColor, color: p.buttonTextColor || '#ffffff' }}
                  className="w-full py-2 rounded-lg text-xs font-bold shadow-sm hover:opacity-95 transition-opacity mt-3 cursor-pointer"
                >
                  {p.submitText || 'Gửi lời phản hồi'}
                </button>
              </div>
            );
          }

          // 7. ENVELOPE BOX (Interactive open invitation envelope)
          if (type === 'EnvelopeBox') {
            return (
              <div
                key={id}
                onClick={(e) => handleNodeClick(id, node, e)}
                style={posStyle}
                className="flex items-center justify-center relative cursor-pointer group"
              >
                <div className="w-full h-full rounded-2xl bg-gradient-to-br from-rose-800 to-red-950 shadow-2xl p-4 flex flex-col items-center justify-center text-center text-amber-200 border-2 border-amber-300/40">
                  <div className="w-12 h-12 rounded-full border border-amber-300/60 bg-red-900/80 flex items-center justify-center text-xl shadow-inner mb-2 group-hover:scale-110 transition-transform">
                    囍
                  </div>
                  <span className="font-serif text-sm tracking-widest uppercase font-semibold">Thiệp Mời Thành Hôn</span>
                  <span className="text-[10px] text-amber-300/75 mt-0.5">Chạm để mở thiệp</span>
                </div>
              </div>
            );
          }

          // 8. GEOMETRIC BOX / LINE BOX
          if (type === 'GeometricBox' || type === 'LineBox') {
            return (
              <div
                key={id}
                onClick={(e) => handleNodeClick(id, node, e)}
                style={{
                  ...posStyle,
                  backgroundColor: p.fill || 'transparent',
                  border: p.borderSize ? `${p.borderSize}px ${p.borderStyle || 'solid'} ${p.borderColor || 'transparent'}` : undefined,
                  borderRadius: p.shapeType === 'circle' ? '9999px' : undefined,
                }}
                className={isInteractive ? 'cursor-pointer hover:outline hover:outline-1 hover:outline-sky-400' : ''}
              />
            );
          }

          // 9. COUNTDOWN WIDGET
          if (type === 'CountdownBoxV2' || type === 'CountdownBox') {
            return (
              <div
                key={id}
                style={posStyle}
                className="flex items-center justify-center p-2 rounded-xl text-center"
              >
                <div
                  className="px-6 py-2.5 rounded-full border border-amber-300/40 backdrop-blur-xs shadow-md flex items-center gap-4 text-xs font-serif"
                  style={{ color: p.color || '#ecede8' }}
                >
                  <div className="text-center">
                    <span className="block font-bold text-base">30</span>
                    <span className="text-[10px] uppercase opacity-75">Ngày</span>
                  </div>
                  <span>:</span>
                  <div className="text-center">
                    <span className="block font-bold text-base">12</span>
                    <span className="text-[10px] uppercase opacity-75">Giờ</span>
                  </div>
                  <span>:</span>
                  <div className="text-center">
                    <span className="block font-bold text-base">45</span>
                    <span className="text-[10px] uppercase opacity-75">Phút</span>
                  </div>
                  <span>:</span>
                  <div className="text-center">
                    <span className="block font-bold text-base">00</span>
                    <span className="text-[10px] uppercase opacity-75">Giây</span>
                  </div>
                </div>
              </div>
            );
          }

          // 10. CALENDAR WIDGET
          if (type === 'CalendarBoxV2' || type === 'CalendarBox') {
            const displayMonth = targetMonth || '12';
            const displayYear = targetYear || '2026';
            const displayDayNum = parseInt(targetDay || '29', 10);
            const isNoStyle = p.calendarType === 'NO_STYLE';
            const highlightColor = p.themeColor || data.primaryColor || '#ff5757';
            const textColor = p.color || '#ffffff';
            const fontFam = p.fontFamily || 'Lora Regular';

            return (
              <div
                key={id}
                style={{
                  ...posStyle,
                  fontFamily: fontFam ? `'${fontFam}', sans-serif` : undefined,
                  backgroundColor: !isNoStyle ? (p.backgroundColor || '#ffffff') : 'transparent',
                  borderRadius: !isNoStyle ? (Array.isArray(p.borderRadius) ? `${p.borderRadius[0]}px` : '16px') : undefined,
                  boxShadow: !isNoStyle ? '0 10px 25px -5px rgba(0,0,0,0.08)' : undefined,
                }}
                className="flex flex-col justify-between text-center p-2"
              >
                <div className="text-xs uppercase font-bold tracking-widest mb-1.5" style={{ color: textColor }}>
                  Tháng {displayMonth}.{displayYear}
                </div>
                <div className="grid grid-cols-7 gap-1 text-[11px] opacity-90 mb-1" style={{ color: textColor }}>
                  <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span className="font-bold">Sun</span>
                </div>
                <div className="grid grid-cols-7 gap-1 text-[11px] opacity-90" style={{ color: textColor }}>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                    <div
                      key={d}
                      style={{
                        backgroundColor: d === displayDayNum ? highlightColor : 'transparent',
                        color: d === displayDayNum ? '#ffffff' : textColor,
                      }}
                      className={`h-6 flex items-center justify-center rounded-full ${
                        d === displayDayNum ? 'font-bold shadow-md ring-2 ring-white/30' : ''
                      }`}
                    >
                      {d}
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          // 11. MAP & VENUE BOX
          if (type === 'MapBox') {
            return (
              <div
                key={id}
                style={posStyle}
                className="rounded-2xl overflow-hidden shadow-lg border border-stone-200 bg-white/95 flex flex-col items-center justify-center p-4 text-center"
              >
                <span className="text-2xl mb-1">📍</span>
                <p className="text-xs font-bold text-stone-800 line-clamp-1">
                  {mainCeremony?.venueName || 'Trung Tâm Tiệc Cưới'}
                </p>
                <p className="text-[10px] text-stone-500 mb-2 line-clamp-1">
                  {mainCeremony?.address || p.address || 'Số 1 Lương Yên, Hà Nội'}
                </p>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent((mainCeremony?.venueName || '') + ' ' + (mainCeremony?.address || ''))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-1.5 rounded-full bg-stone-900 text-white text-[10px] font-bold shadow-md hover:bg-stone-800 transition-all cursor-pointer inline-block"
                >
                  Xem bản đồ chỉ đường
                </a>
              </div>
            );
          }

          // 12. BUTTON BOX (RSVP / Lời Chúc)
          if (type === 'ButtonBox') {
            return (
              <div
                key={id}
                onClick={(e) => handleNodeClick(id, node, e)}
                style={posStyle}
                className="flex items-center justify-center"
              >
                <button
                  type="button"
                  style={{
                    backgroundColor: p.backgroundColor || data.primaryColor || '#8a1528',
                    color: p.color || '#ffffff',
                    borderRadius: p.borderRadius ? `${p.borderRadius[0]}px` : '9999px',
                    fontSize: p.fontSize ? `${p.fontSize}px` : '14px',
                    fontWeight: p.fontWeight || 'bold',
                  }}
                  className="w-full h-full shadow-md hover:opacity-90 transition-all flex items-center justify-center px-4 py-2 cursor-pointer"
                >
                  {p.text || 'Xác nhận tham dự'}
                </button>
              </div>
            );
          }

          // 13. GIFT QR BOX (Hộp Quà Mừng Cưới Interactive Widget)
          if (type === 'GiftQrBox') {
            const hasIcon = Boolean(p.imgKey);
            const iconUrl = resolveZenLoveAsset(p.imgKey);

            if (hasIcon && iconUrl) {
              return (
                <div
                  key={id}
                  onClick={(e) => {
                    handleNodeClick(id, node, e);
                    setIsGiftModalOpen(true);
                  }}
                  style={posStyle}
                  className="flex items-center justify-center cursor-pointer group"
                  title="Chạm để mở Hộp Quà Mừng Cưới"
                >
                  <img
                    src={iconUrl}
                    alt="Hộp quà mừng cưới"
                    className="w-full h-full object-contain block select-none pointer-events-none group-hover:scale-110 transition-transform duration-300 drop-shadow-md"
                  />
                </div>
              );
            }

            // Standalone QR code if no icon is specified
            const qrAccount = data.groom?.bank?.accountNumber || '0988889999';
            const qrBank = data.groom?.bank?.bankCode || 'MB';
            const qrUrl = `https://img.vietqr.io/image/${qrBank}-${qrAccount}-compact2.png?amount=0&addInfo=MungCuoi`;
            return (
              <div
                key={id}
                onClick={() => setIsGiftModalOpen(true)}
                style={{
                  ...posStyle,
                  borderRadius: Array.isArray(p.borderRadius)
                    ? `${p.borderRadius[0]}px`
                    : '12px',
                }}
                className="overflow-hidden cursor-pointer shadow-md bg-white p-2 flex items-center justify-center"
              >
                <img src={qrUrl} alt="VietQR Mừng Cưới" className="w-full h-full object-contain" />
              </div>
            );
          }

          // 14. GUEST AUTO NAME (Hiển thị tên khách tự động chuẩn phông & màu)
          if (type === 'GuestAutoName') {
            const fontFam = p.fontFamily || 'Aquarelle';
            const fontCol = p.color || data.primaryColor || '#465c3d';
            const fontSz = p.fontSize ? `${p.fontSize}px` : '36px';
            const text = (data as any).guestName || p.textDefault || 'Quý Khách';

            return (
              <div
                key={id}
                onClick={(e) => handleNodeClick(id, node, e)}
                style={{
                  ...posStyle,
                  fontFamily: fontFam ? `'${fontFam}', cursive, sans-serif` : undefined,
                  fontSize: fontSz,
                  color: fontCol,
                  fontStyle: p.fontStyle || 'italic',
                  fontWeight: p.fontWeight || 'normal',
                  textAlign: (p.textAlign || 'center') as any,
                  letterSpacing: p.letterSpacing ? `${p.letterSpacing}px` : undefined,
                  lineHeight: p.lineHeight ? `${p.lineHeight}` : 1.4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                className={isInteractive ? 'cursor-pointer hover:outline hover:outline-1 hover:outline-sky-400' : ''}
              >
                <span>{text}</span>
              </div>
            );
          }

          // 15. CONTAINER / GROUP BOX (Sub-containers and grouped section cards)
          if (type === 'Container' || type === 'GroupBox') {
            return (
              <div
                key={id}
                onClick={(e) => handleNodeClick(id, node, e)}
                style={{
                  ...posStyle,
                  backgroundColor: p.backgroundColor || undefined,
                  backgroundImage: p.backgroundImage ? `url(${resolveZenLoveAsset(p.backgroundImage)})` : undefined,
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'cover',
                  borderRadius: Array.isArray(p.borderRadius)
                    ? `${p.borderRadius[0]}px ${p.borderRadius[1]}px ${p.borderRadius[2]}px ${p.borderRadius[3]}px`
                    : undefined,
                  border: p.borderSize
                    ? `${p.borderSize}px ${p.borderStyle || 'solid'} ${p.borderColor || 'transparent'}`
                    : undefined,
                  boxShadow: p.hasBoxShadow && p.boxShadow
                    ? `${p.boxShadow.offsetX || 0}px ${p.boxShadow.offsetY || 0}px ${p.boxShadow.blur || 10}px ${p.boxShadow.spread || 0}px ${p.boxShadow.color || 'rgba(0,0,0,0.1)'}`
                    : undefined,
                }}
                className={`transition-all ${
                  isInteractive ? 'cursor-pointer hover:outline hover:outline-1 hover:outline-sky-400' : ''
                } ${isSelected ? 'ring-2 ring-sky-500' : ''}`}
              />
            );
          }

          // Default fallback
          return null;
        })}
      </div>

      {/* Interactive Gift Modal Popup */}
      {isGiftModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsGiftModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl relative text-center border border-stone-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsGiftModalOpen(false)}
              className="absolute top-3 right-3 text-stone-400 hover:text-stone-700 text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center bg-stone-100 cursor-pointer transition-colors"
            >
              ✕
            </button>
            <div className="text-3xl mb-1">🎁</div>
            <h3 className="font-serif font-bold text-lg text-stone-800 mb-1">Hộp Quà Mừng Cưới</h3>
            <p className="text-xs text-stone-500 mb-4">Gửi quà mừng hoặc lời chúc phúc đến cô dâu & chú rể</p>

            {/* QR Code */}
            <div className="w-48 h-48 mx-auto p-2 bg-stone-50 rounded-xl border border-stone-200 shadow-inner flex items-center justify-center mb-4">
              <img
                src={`https://img.vietqr.io/image/${data.groom?.bank?.bankCode || 'MB'}-${data.groom?.bank?.accountNumber || '0988889999'}-compact2.png?amount=0&addInfo=MungCuoi`}
                alt="VietQR Mừng Cưới"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="bg-stone-50 p-3 rounded-xl text-xs space-y-1.5 text-stone-700 text-left border border-stone-100 mb-4">
              <div className="flex justify-between">
                <span className="text-stone-500">Ngân hàng:</span>
                <span className="font-bold">{data.groom?.bank?.bankName || 'MBBank (Quân Đội)'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Số tài khoản:</span>
                <span className="font-mono font-bold text-rose-700">{data.groom?.bank?.accountNumber || '0988889999'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Chủ tài khoản:</span>
                <span className="font-bold uppercase">{data.groom?.bank?.accountName || data.groom?.fullName || 'TRAN MINH TRI'}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(data.groom?.bank?.accountNumber || '0988889999');
                alert('Đã sao chép số tài khoản!');
              }}
              className="w-full py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              📋 Sao chép số tài khoản
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
