'use client';

import React, { useMemo, useState } from 'react';
import { WeddingInvitationData } from '@/types/wedding';
import { CraftTree, CraftNode } from '@/constants/craft-templates';
import { resolveZenLoveAsset } from '@/lib/zenlove-assets';
import { getFontCssUrl } from '@/lib/zenlove-fonts';

interface ZenLoveCanvasRendererProps {
  craftTree: CraftTree;
  data: WeddingInvitationData;
  onSelectNode?: (nodeId: string, node: CraftNode) => void;
  selectedNodeId?: string | null;
  onEditField?: (field: 'couple' | 'date') => void;
  isInteractive?: boolean;
}

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
              } else if (isCoupleCombinedNode(rawText) && (rawText.includes('Anh Tú') || rawText.includes('Diệu Nhi') || rawText.includes('Vũ Thanh Thành'))) {
                displayText = `${data.groom.shortName || 'Chú Rể'} & ${data.bride.shortName || 'Cô Dâu'}`;
              }
            }

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
                />
              </div>
            );
          }

          // 3. PHOTO BOX RENDERING (Couple Portraits)
          if (type === 'PhotoBox') {
            const rawImg = p.imgKey;
            const customPhoto = data.customPhotoNodes?.[id];
            const imgSrc = customPhoto || resolveZenLoveAsset(rawImg);

            if (!imgSrc) return null;

            return (
              <div
                key={id}
                onClick={(e) => handleNodeClick(id, node, e)}
                style={posStyle}
                className={`overflow-hidden transition-all ${
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
                />
              </div>
            );
          }

          // 4. GEOMETRIC BOX / LINE BOX
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

          // 5. COUNTDOWN WIDGET
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

          // 6. CALENDAR WIDGET
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

          // 7. MAP & VENUE BOX
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

          // 8. BUTTON BOX (RSVP / Lời Chúc)
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

          // 9. GIFT QR BOX
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

          // 10. GUEST AUTO NAME (Hiển thị tên khách tự động)
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
