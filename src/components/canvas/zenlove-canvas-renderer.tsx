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
    // Also include user-selected typography font if set
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

  const GROOM_NAMES = new Set([
    'anh tú', 'đức mạnh', 'mạnh đức', 'văn tuấn', 'tuấn', 'bá khang', 'gia khang', 'minh trí',
    'hoàng hải', 'hoàng long', 'tuấn khang', 'chú rể', 'quang vinh', 'hải đăng', 'minh quân',
    'thanh tùng', 'hoàng nam', 'ngọc sơn', 'tiến dũng', 'anh tuấn'
  ]);

  const BRIDE_NAMES = new Set([
    'diệu nhi', 'lệ quyên', 'ngọc lan', 'lan nhi', 'quỳnh anh', 'ngọc oanh', 'thanh trúc',
    'thanh hằng', 'mỹ châu', 'phương nga', 'bảo trâm', 'cô dâu', 'thu trang', 'lan anh',
    'hồng ngọc', 'mai anh', 'huyền my', 'thùy linh', 'ngọc trâm', 'thảo vy'
  ]);

  // Helper to determine if a text node represents groom or bride name
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
    return clean.includes('&') || clean.includes(' và ') || clean.includes(' love ') || clean.includes(' loves ');
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

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden select-none"
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
              const isCombined = isCoupleCombinedNode(rawText);

              if (isGroom) {
                displayText = data.groom.shortName || data.groom.fullName || 'Chú Rể';
              } else if (isBride) {
                displayText = data.bride.shortName || data.bride.fullName || 'Cô Dâu';
              } else if (isCombined) {
                displayText = `${data.groom.shortName || 'Gia Khang'} & ${data.bride.shortName || 'Thanh Trúc'}`;
              }
            }

            const isNameRelated = isGroomNameNode(rawText) || isBrideNameNode(rawText) || isCoupleCombinedNode(rawText);

            const fontFam = (isNameRelated || isSelected) && data.typography?.fontFamily
              ? data.typography.fontFamily
              : p.fontFamily;
            const fontCol = (isNameRelated || isSelected) && data.typography?.color
              ? data.typography.color
              : p.color;
            const fontSz = (isNameRelated || isSelected) && data.typography?.fontSize
              ? `${data.typography.fontSize}px`
              : `${p.fontSize || 16}px`;

            return (
              <div
                key={id}
                onClick={(e) => handleNodeClick(id, node, e)}
                style={{
                  ...posStyle,
                  fontFamily: fontFam ? `'${fontFam}', serif` : undefined,
                  fontSize: fontSz,
                  color: fontCol || '#111827',
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
                      <span className="hover:text-sky-600">📋 Sao chép</span>
                      <span className="text-gray-300">|</span>
                      <span className="hover:text-rose-600">🗑️ Xóa</span>
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

          // 2. PHOTO BOX RENDERING
          if (type === 'PhotoBox') {
            const rawImg = p.imgKey;
            // If it's a replaceable portrait frame and user uploaded a photo, use user photo!
            const imgSrc = (p.isReplaceable && data.heroPhoto)
              ? data.heroPhoto
              : resolveZenLoveAsset(rawImg);

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
                  alt={p.alt || 'Template Element'}
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

          // 3. GEOMETRIC BOX / LINE BOX
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

          // 4. COUNTDOWN WIDGET
          if (type === 'CountdownBoxV2') {
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

          // 5. CALENDAR WIDGET
          if (type === 'CalendarBoxV2') {
            return (
              <div
                key={id}
                style={posStyle}
                className="p-4 rounded-2xl flex flex-col justify-between text-center"
              >
                <div className="text-xs uppercase font-bold tracking-widest mb-2" style={{ color: p.color || '#ece4d8' }}>
                  Tháng 12 / 2026
                </div>
                <div className="grid grid-cols-7 gap-1 text-[11px] font-mono opacity-85" style={{ color: p.color || '#ece4d8' }}>
                  <span>T2</span><span>T3</span><span>T4</span><span>T5</span><span>T6</span><span>T7</span><span className="font-bold text-amber-300">CN</span>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                    <div
                      key={d}
                      className={`h-6 flex items-center justify-center rounded-full ${
                        d === 29 ? 'bg-amber-400 text-stone-900 font-bold shadow-md ring-2 ring-white/80' : ''
                      }`}
                    >
                      {d}
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          // 6. MAP & VENUE BOX
          if (type === 'MapBox') {
            return (
              <div
                key={id}
                style={posStyle}
                className="rounded-2xl overflow-hidden shadow-lg border border-white/20 bg-stone-100 flex flex-col items-center justify-center p-4 text-center"
              >
                <span className="text-2xl mb-1">📍</span>
                <p className="text-xs font-bold text-stone-800 line-clamp-1">
                  {data.ceremonies[0]?.venueName || 'Trung Tâm Tiệc Cưới'}
                </p>
                <p className="text-[10px] text-stone-500 mb-2 line-clamp-1">
                  {data.ceremonies[0]?.address || p.address || 'Số 1 Lương Yên, Hà Nội'}
                </p>
                <button
                  type="button"
                  className="px-4 py-1.5 rounded-full bg-stone-900 text-white text-[10px] font-bold shadow-md hover:bg-stone-800 transition-all cursor-pointer"
                >
                  Xem bản đồ chỉ đường
                </button>
              </div>
            );
          }

          // 7. GIFT QR BOX
          if (type === 'GiftQrBox') {
            const qrAccount = data.groom?.bank?.accountNumber || '1903686868';
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

          // Default fallback for unknown craft node
          return null;
        })}
      </div>
    </div>
  );
};
