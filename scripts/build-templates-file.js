const fs = require('fs');
const path = require('path');

const masterTemplates = JSON.parse(fs.readFileSync('scripts/master-templates.json', 'utf8'));

const outPath = path.join(__dirname, '..', 'src', 'constants', 'templates.ts');

const code = `export type TemplateLayoutType =
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
  category: 'truyen_thong' | 'hien_dai' | 'hoa_la' | 'toi_gian';
  source: 'chungdoi' | 'zenlove' | 'cinelove';
  layoutType: TemplateLayoutType;
  primaryColor: string;
  accentColor: string;
  bgTexture: string;
  cardBg: string;
  envelopeGradient: string;
  sealSymbol: string;
  frameAsset: string;
  description: string;
  tag: string;
  isLongThumbnail?: boolean;
  colorVariants?: TemplateColorVariant[];
}

export const TEMPLATES: TemplateConfig[] = ${JSON.stringify(masterTemplates, null, 2)};

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
  slug: 'thanh-tung-lan-anh',
  templateId: 'cine-thiep-cuoi-61',
  themeName: 'CineLove - Điện Ảnh Hiện Đại 61',
  primaryColor: '#1c1917',
  fontFamily: 'Pattaya',
  musicTrackUrl: 'https://assets.mixkit.co/music/preview/mixkit-beautiful-dream-493.mp3',
  musicTitle: 'I Do - 911 (Wedding Song)',
  fallingEffect: 'petals' as const,

  groom: {
    fullName: 'Trần Thanh Tùng',
    shortName: 'Thanh Tùng',
    birthOrder: 'Trưởng Nam',
    fatherName: 'Trần Quang Vinh',
    motherName: 'Nguyễn Thị Tuyết',
    address: '124 Hoàng Hoa Thám, Ba Đình, Hà Nội',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
    bank: {
      bankCode: 'MB',
      bankName: 'MBBank',
      accountNumber: '0988889999',
      accountName: 'TRAN THANH TUNG',
      qrUrl: 'https://img.vietqr.io/image/MB-0988889999-compact2.png?amount=0&addInfo=Mung+cuoi+Tung+Anh'
    }
  },

  bride: {
    fullName: 'Lê Lan Anh',
    shortName: 'Lan Anh',
    birthOrder: 'Ái Nữ',
    fatherName: 'Lê Văn Hoàng',
    motherName: 'Phạm Thu Hương',
    address: '56 Nguyễn Đình Chiểu, Quận 3, TP. Hồ Chí Minh',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&auto=format&fit=crop&q=80',
    bank: {
      bankCode: 'VCB',
      bankName: 'Vietcombank',
      accountNumber: '9988776655',
      accountName: 'LE LAN ANH',
      qrUrl: 'https://img.vietqr.io/image/VCB-9988776655-compact2.png?amount=0&addInfo=Mung+cuoi+Tung+Anh'
    }
  },

  loveStory: {
    title: 'Hành Trình Tình Yêu',
    content: 'Từ ánh nhìn đầu tiên dưới cơn mưa rào Hà Nội đến ngày ta nguyện chung đôi trên con đường hạnh phúc.',
    quotes: '“Hôn nhân không phải là tìm một người hoàn hảo, mà là cùng nhau vun đắp một tình yêu vẹn nguyên.”'
  },

  ceremonies: [
    {
      id: 'c1',
      type: 'vu_quy' as const,
      title: 'LỄ VU QUY (NHÀ GÁI)',
      dateSolar: '2026-10-24',
      dateLunar: '15 Tháng 9 Năm Bính Ngọ',
      time: '09:00',
      venueName: 'Tư gia Nhà Gái',
      address: '56 Nguyễn Đình Chiểu, Phường Võ Thị Sáu, Quận 3, TP.HCM',
      mapUrl: 'https://maps.google.com/?q=District+3+Ho+Chi+Minh',
      note: 'Gia đình Nhà Gái hân hạnh đón tiếp'
    },
    {
      id: 'c2',
      type: 'thanh_hon' as const,
      title: 'LỄ THÀNH HÔN (NHÀ TRAI)',
      dateSolar: '2026-10-25',
      dateLunar: '16 Tháng 9 Năm Bính Ngọ',
      time: '11:00',
      venueName: 'Tư gia Nhà Trai',
      address: '124 Hoàng Hoa Thám, Ba Đình, Hà Nội',
      mapUrl: 'https://maps.google.com/?q=Ba+Dinh+Ha+Noi',
      note: 'Gia đình Nhà Trai hân hạnh đón tiếp'
    },
    {
      id: 'c3',
      type: 'tiec_cuoi' as const,
      title: 'TIỆC CƯỚI CHUNG VUI',
      dateSolar: '2026-10-25',
      dateLunar: '16 Tháng 9 Năm Bính Ngọ',
      time: '18:00',
      venueName: 'Trung Tâm Tiệc Cưới Grand Palace',
      address: '142/18 Cộng Hòa, Phường 4, Quận Tân Bình, TP.HCM',
      mapUrl: 'https://maps.google.com/?q=Grand+Palace+Cong+Hoa',
      note: 'Rất hân hạnh được đón tiếp Quý Khách'
    }
  ],

  heroPhoto: '',
  galleryImages: [
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&auto=format&fit=crop&q=80'
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
`;

fs.writeFileSync(outPath, code, 'utf8');
console.log('Successfully generated clean templates.ts with unified color variants and CineLove templates!');
