'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { WeddingInvitationData } from '@/types/wedding';
import { CraftTree, CraftNode } from '@/constants/craft-templates';
import { resolveZenLoveAsset, getCleanWeddingPhoto } from '@/lib/zenlove-assets';
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
}> = ({ id, imgList, data, borderRadius }) => {
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
  const imgSrc = customPhoto || resolveZenLoveAsset(currentItem?.imageKey) || getCleanWeddingPhoto(`${id}_${currentIndex}`);

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
        }}
        onError={(e) => {
          e.currentTarget.src = getCleanWeddingPhoto(`${id}_${currentIndex}`);
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

export const ZenLoveCanvasRenderer: React.FC<ZenLoveCanvasRendererProps> = ({
  craftTree,
  data,
  onSelectNode,
  selectedNodeId,
  onEditField,
  isInteractive = true,
}) => {
  const [internalSelectedId, setInternalSelectedId] = useState<string | null>(null);
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

  // 2. Extract and load all unique font families from text nodes
  const fontUrls = useMemo(() => {
    const urls = new Set<string>();
    for (const node of Object.values(craftTree)) {
      if (node.type?.resolvedName === 'TextBox' && node.props?.fontFamily) {
        const url = getFontCssUrl(node.props.fontFamily);
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
    'hồng ngọc', 'mai anh', 'huyền my', 'thùy linh', 'ngọc trâm', 'thảo vy', 'mỹ mai', 'đỗ mỹ mai'
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
              } else if (isCoupleCombinedNode(rawText) && (rawText.includes('Anh Tú') || rawText.includes('Diệu Nhi') || rawText.includes('Vũ Thanh Thành') || rawText.includes('Gia Khang') || rawText.includes('Thanh Trúc'))) {
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
          if (type === 'ZenStockBox') {
            const rawImg = p.imgKey;
            const imgSrc = resolveZenLoveAsset(rawImg);
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

          // 3. PHOTO BOX RENDERING (Couple Portraits)
          if (type === 'PhotoBox') {
            const rawImg = p.imgKey;
            const customPhoto = data.customPhotoNodes?.[id];
            const imgSrc = customPhoto || resolveZenLoveAsset(rawImg) || getCleanWeddingPhoto(id);

            return (
              <div
                key={id}
                onClick={(e) => handleNodeClick(id, node, e)}
                style={posStyle}
                className={`overflow-hidden transition-all bg-stone-100/50 ${
                  isInteractive ? 'cursor-pointer hover:outline hover:outline-1 hover:outline-sky-400' : ''
                } ${isSelected ? 'ring-2 ring-sky-500' : ''}`}
              >
                <img
                  src={imgSrc}
                  alt={p.alt || 'Ảnh cưới'}
                  className="w-full h-full object-cover block select-none pointer-events-none"
                  style={{
                    borderRadius: Array.isArray(p.borderRadius)
                      ? `${p.borderRadius[0]}px ${p.borderRadius[1]}px ${p.borderRadius[2]}px ${p.borderRadius[3]}px`
                      : undefined,
                  }}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = getCleanWeddingPhoto(id);
                  }}
                />
              </div>
            );
          }

          // 4. CAROUSEL BOX (Photo Slider / Album)
          if (type === 'CarouselBox') {
            const imgList: Array<{ id: string; imageKey: string; alt?: string }> = p.imgList || [];
            if (imgList.length === 0) return null;

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
                />
              </div>
            );
          }

          // 5. PHOTO GALLERY BOX (Wedding Gallery Grid)
          if (type === 'PhotoGalleryBox') {
            const photos: Array<{ id: string; imageKey: string; alt?: string }> = p.photos || [];
            if (photos.length === 0) return null;

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
                <div className="w-full h-full grid grid-cols-2 gap-2 p-1 overflow-hidden bg-transparent">
                  {photos.slice(0, 4).map((item, idx) => {
                    const customPhoto = data.customPhotoNodes?.[`${id}_${idx}`];
                    const imgSrc = customPhoto || resolveZenLoveAsset(item.imageKey) || getCleanWeddingPhoto(`${id}_${idx}`);
                    return (
                      <div key={item.id || idx} className="w-full h-full rounded-lg overflow-hidden bg-stone-100 shadow-xs relative">
                        <img
                          src={imgSrc}
                          alt={item.alt || 'Ảnh cưới'}
                          className="w-full h-full object-cover block select-none pointer-events-none hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.currentTarget.src = getCleanWeddingPhoto(`${id}_${idx}`);
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          }

          // 6. RSVP BOX V2 (Interactive attendance confirmation)
          if (type === 'RsvpBoxV2') {
            const btnColor = p.buttonColor || data.primaryColor || '#8a1528';
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

            return (
              <div
                key={id}
                style={posStyle}
                className="p-4 rounded-2xl flex flex-col justify-between text-center"
              >
                <div className="text-xs uppercase font-bold tracking-widest mb-2" style={{ color: p.color || '#8a1528' }}>
                  Tháng {displayMonth} / {displayYear}
                </div>
                <div className="grid grid-cols-7 gap-1 text-[11px] font-mono opacity-85" style={{ color: p.color || '#444444' }}>
                  <span>T2</span><span>T3</span><span>T4</span><span>T5</span><span>T6</span><span>T7</span><span className="font-bold text-rose-600">CN</span>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                    <div
                      key={d}
                      className={`h-6 flex items-center justify-center rounded-full ${
                        d === displayDayNum ? 'bg-rose-600 text-white font-bold shadow-md ring-2 ring-rose-200' : ''
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

          // 13. GIFT QR BOX
          if (type === 'GiftQrBox') {
            const qrAccount = data.groom?.bank?.accountNumber || '0988889999';
            const qrBank = data.groom?.bank?.bankCode || 'MB';
            const qrUrl = `https://img.vietqr.io/image/${qrBank}-${qrAccount}-compact2.png?amount=0&addInfo=MungCuoi`;
            return (
              <div
                key={id}
                style={posStyle}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/95 backdrop-blur-md shadow-xl border border-stone-200 text-center"
              >
                <div className="w-28 h-28 p-1 bg-white rounded-xl shadow-xs border border-stone-200">
                  <img src={qrUrl} alt="VietQR Mừng Cưới" className="w-full h-full object-contain" />
                </div>
                <span className="text-[10px] font-bold text-stone-800 mt-1.5 uppercase">
                  Mừng Cưới Cặp Đôi
                </span>
              </div>
            );
          }

          // 14. GUEST AUTO NAME (Hiển thị tên khách tự động)
          if (type === 'GuestAutoName') {
            return (
              <div
                key={id}
                style={posStyle}
                className="flex items-center justify-center font-bold text-stone-800"
              >
                <span>Kính mời: Quý Khách</span>
              </div>
            );
          }

          // Default fallback
          return null;
        })}
      </div>
    </div>
  );
};
