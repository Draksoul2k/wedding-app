import { ZENLOVE_TEMPLATES, ZenLoveTemplate } from './zenlove-templates';

export type TemplateLayoutType =
  | 'cinelove_movie'
  | 'zenlove_minimal'
  | 'chungdoi_traditional'
  | 'chungdoi_magazine'
  | 'botanical_garden'
  | 'full_long_card';

export interface TemplateColorVariant {
  id: string;
  name: string;
  primaryColor: string;
  accentColor: string;
  frameAsset: string;
  bgTexture?: string;
}

export interface TemplateConfig {
  id: string;
  name: string;
  slug?: string;
  category: 'truyen_thong' | 'hien_dai' | 'hoa_la' | 'toi_gian';
  source: 'chungdoi' | 'zenlove' | 'cinelove' | 'motdoi';
  layoutType: TemplateLayoutType;
  primaryColor: string;
  accentColor: string;
  bgTexture: string;
  cardBg: string;
  envelopeGradient: string;
  sealSymbol: string;
  frameAsset: string;
  longThumbnailUrl?: string;
  description: string;
  tag: string;
  isLongThumbnail?: boolean;
  colorVariants?: TemplateColorVariant[];
}


  export function zenLoveToTemplateConfig(zen: ZenLoveTemplate): TemplateConfig {
  const isTraditional = [
    'hong-phong', 'ruoc-den-ong-sao', 'song-hy-hong-lien', 'song-hy-thanh-ngoc',
    'chu-sa', 'song-phung-hy-thanh', 'trung-thu-01', 'co_ba_red', 'nhat_binh_red'
  ].includes(zen.slug);

  const isFloral = [
    'sen-ngay-hy', 'la-mong-o-liu', 'canh-dong-yeu-thuong', 'hong-yeu-thuong',
    'yeu-nhu-ban-dau', 'vom-may-hong', 'nang-xanh-thuy-tinh', 'dong-xanh', 'nang-trang-ngoi', 'trang-tinh-khoi'
  ].includes(zen.slug);

  const isMinimal = [
    'hen-uoc', 'sac-be-thanh-lich', 'sac-cuoi-be', 'net-chu-tinh-nhan',
    'co-dien-tinh-khoi', 'bich-ngoc', 'sac-xanh-diu-em', 'chieu-nau-dien-anh'
  ].includes(zen.slug);

  const category: TemplateConfig['category'] = isTraditional
    ? 'truyen_thong'
    : isFloral
    ? 'hoa_la'
    : isMinimal
    ? 'toi_gian'
    : 'hien_dai';

  const primaryColor = isTraditional
    ? '#b91c1c'
    : isFloral
    ? '#e11d48'
    : isMinimal
    ? '#78350f'
    : '#1c1917';

  return {
    id: zen.slug || zen.id,
    name: zen.name,
    slug: zen.slug,
    category,
    source: 'zenlove',
    layoutType: isTraditional ? 'chungdoi_traditional' : 'full_long_card',
    primaryColor,
    accentColor: '#d4af37',
    bgTexture: isTraditional ? '#fffbeb' : '#faf8f5',
    cardBg: '#ffffff',
    envelopeGradient: isTraditional ? 'from-red-700 to-rose-900' : 'from-rose-600 to-amber-700',
    sealSymbol: isTraditional ? '囍' : '💍',
    frameAsset: zen.longThumbnailUrl || zen.thumbnailUrl,
    longThumbnailUrl: zen.longThumbnailUrl,
    description: zen.description,
    tag: zen.tag || (zen.templateType === 'premium' ? 'Cao cấp' : 'Mới'),
    isLongThumbnail: true,
  };
}

export const ALL_TEMPLATES: TemplateConfig[] = ZENLOVE_TEMPLATES.map(zenLoveToTemplateConfig);
export const TEMPLATES: TemplateConfig[] = ALL_TEMPLATES;

export function findTemplate(idOrSlug?: string | null): TemplateConfig {
  if (!idOrSlug) return ALL_TEMPLATES[0];

  const clean = idOrSlug.toLowerCase().trim().replace(/^cine-/, '');

  const directMatch = ALL_TEMPLATES.find(
    (t) => t.id === clean || (t.slug && t.slug === clean) || t.id === idOrSlug || (t.slug && t.slug === idOrSlug)
  );
  if (directMatch) return directMatch;

  const zenMatch = ZENLOVE_TEMPLATES.find(
    (t) => t.slug === clean || t.id === clean || t.slug === idOrSlug || t.id === idOrSlug
  );
  if (zenMatch) {
    return zenLoveToTemplateConfig(zenMatch);
  }

  return ALL_TEMPLATES[0];
}

export interface BankConfig {
  code: string;
  name: string;
  bin: string;
}

export const VIETNAMESE_BANKS: BankConfig[] = [
  { code: 'MB', name: 'MBBank (Quân Đội)', bin: '970422' },
  { code: 'VCB', name: 'Vietcombank', bin: '970436' },
  { code: 'TCB', name: 'Techcombank', bin: '970407' },
  { code: 'ACB', name: 'ACB Á Châu', bin: '970416' },
  { code: 'VPB', name: 'VPBank', bin: '970432' },
  { code: 'BIDV', name: 'BIDV', bin: '970418' },
  { code: 'VIB', name: 'VIB Quốc Tế', bin: '970441' },
  { code: 'TPB', name: 'TPBank', bin: '970423' },
  { code: 'STB', name: 'Sacombank', bin: '970403' },
  { code: 'HDB', name: 'HDBank', bin: '970437' },
  { code: 'OCB', name: 'OCB Phương Đông', bin: '970448' },
  { code: 'CTG', name: 'VietinBank', bin: '970415' }
];

export const DEFAULT_WEDDING_DATA = {
  id: 'mau-thiep-demo',
  slug: 'thanh-hang-minh-tri',
  templateId: 'sen-ngay-hy',
  themeName: 'Sen Ngày Hỷ - ZenLove',
  primaryColor: '#8a1528',
  fontFamily: 'The Nautigal',
  musicTrackUrl: '/audio/anh-nang-cua-anh.mp3',
  musicTitle: 'Ánh Nắng Của Anh - Đức Phúc (Bản Có Lời)',
  fallingEffect: 'petals' as const,
  typography: {
    fontFamily: 'The Nautigal',
    fontSize: 42,
    color: '#111827',
    fontWeight: 'bold',
    fontStyle: 'normal',
    textDecoration: 'none',
    textTransform: 'none',
    textAlign: 'center',
    opacity: 1,
    letterSpacing: 0,
    shadow: 'soft'
  },

  groom: {
    fullName: 'Trần Minh Trí',
    shortName: 'Minh Trí',
    birthOrder: 'Trưởng Nam',
    fatherName: 'Trần Anh Tài',
    motherName: 'Phạm Thu Hương',
    address: 'Phường Bãi Cháy, TP. Hạ Long, Tỉnh Quảng Ninh',
    avatarUrl: 'https://cdn-resource.zenlove.me/templates/9efa3cd1-7346-4ec6-b1c2-0a8da3d1d09d/images/Ny0yMDI0MDIwODEyMjE1OS1odGZncF8xNzY1NDc0MDU2Xzc3cg.jpg',
    bank: {
      bankCode: 'MB',
      bankName: 'MBBank',
      accountNumber: '0988889999',
      accountName: 'TRAN MINH TRI',
      qrUrl: 'https://img.vietqr.io/image/MB-0988889999-compact2.png?amount=0&addInfo=Mung+cuoi+Tri+Hang'
    }
  },

  bride: {
    fullName: 'Lê Thanh Hằng',
    shortName: 'Thanh Hằng',
    birthOrder: 'Ái Nữ',
    fatherName: 'Lê Văn Hải',
    motherName: 'Nguyễn Mai Thu',
    address: 'Quận Ba Đình, TP. Hà Nội',
    avatarUrl: 'https://cdn-resource.zenlove.me/templates/9efa3cd1-7346-4ec6-b1c2-0a8da3d1d09d/images/OC0yMDI0MDIwODEyMjE1OS1ib3F0bi0xXzE3NjU0NzUyNzNfMTEw.jpg',
    bank: {
      bankCode: 'VCB',
      bankName: 'Vietcombank',
      accountNumber: '9988776655',
      accountName: 'LE THANH HANG',
      qrUrl: 'https://img.vietqr.io/image/VCB-9988776655-compact2.png?amount=0&addInfo=Mung+cuoi+Tri+Hang'
    }
  },

  loveStory: {
    title: 'OUR LOVE STORY',
    content: 'Giữa muôn vạn gặp gỡ chúng mình may mắn tìm thấy nhau. Từ những ngày đầu bỡ ngỡ, qua bao vui buồn và thử thách, tình yêu vẫn lớn dần, hóa thành sự thấu hiểu và đồng hành. Hóa ra hạnh phúc chẳng phải điều xa xôi mà là có một người để cùng sẻ chia, cùng nắm tay đi hết chặng đường dài phía trước...',
    quotes: '“Chúng mình gặp nhau giữa dòng đời”'
  },

  ceremonies: [
    {
      id: 'c1',
      type: 'thanh_hon' as const,
      title: 'LỄ THÀNH HÔN',
      dateSolar: '2025-12-09',
      dateLunar: '20 Tháng 10 Năm Ất Tỵ',
      time: '11:45',
      venueName: 'Khách sạn Mường Thanh Luxury Quảng Ninh',
      address: 'Phường Bãi Cháy, TP. Hạ Long, Tỉnh Quảng Ninh',
      mapUrl: 'https://maps.google.com/?q=Muong+Thanh+Luxury+Quang+Ninh',
      note: 'Rất hân hạnh được đón tiếp Quý Khách cùng gia đình'
    },
    {
      id: 'c2',
      type: 'vu_quy' as const,
      title: 'LỄ VU QUY (NHÀ GÁI)',
      dateSolar: '2025-12-08',
      dateLunar: '19 Tháng 10 Năm Ất Tỵ',
      time: '09:00',
      venueName: 'Tư gia Nhà Gái',
      address: 'Quận Ba Đình, TP. Hà Nội',
      mapUrl: 'https://maps.google.com/?q=Ba+Dinh+Ha+Noi',
      note: 'Gia đình Nhà Gái hân hạnh đón tiếp'
    },
    {
      id: 'c3',
      type: 'tiec_cuoi' as const,
      title: 'TIỆC CƯỚI CHUNG VUI',
      dateSolar: '2025-12-09',
      dateLunar: '20 Tháng 10 Năm Ất Tỵ',
      time: '12:00',
      venueName: 'Trung Tâm Tiệc Cưới Mường Thanh Luxury',
      address: 'Phường Bãi Cháy, TP. Hạ Long, Tỉnh Quảng Ninh',
      mapUrl: 'https://maps.google.com/?q=Muong+Thanh+Luxury+Quang+Ninh',
      note: 'Khai tiệc mừng hạnh phúc'
    }
  ],

  heroPhoto: '',
  galleryImages: [
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800&auto=format&fit=crop&q=80'
  ],

  enableMusic: true,
  enableVietQR: true,
  enableGuestbook: true,
  enableRSVP: true,
  thankYouMessage: 'Sự hiện diện và lời chúc phúc của Quý Khách là niềm vinh hạnh to lớn cho gia đình chúng tôi!',

  dressCode: {
    enabled: true,
    title: 'Dress Code & Gợi Ý Trang Phục',
    description: 'Để buổi tiệc thêm phần trang trọng và những bức hình kỷ niệm thật hài hòa, kính mong Quý Khách ưu tiên trang phục theo các gam màu gợi ý dưới đây:',
    colors: [
      { name: 'Trắng Sữa', hex: '#FAF9F6' },
      { name: 'Be / Pastel', hex: '#EAD7C5' },
      { name: 'Nâu Đất', hex: '#C27D56' },
      { name: 'Xanh Sage', hex: '#8FA392' },
      { name: 'Vàng Cát', hex: '#D1AC00' }
    ]
  }
};
