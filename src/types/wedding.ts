import type { WEDDING_CONFIG } from '@/constants';

export type WeddingConfigType = typeof WEDDING_CONFIG;

export interface CeremonyInfo {
  id: string;
  type: 'thanh_hon' | 'vu_quy' | 'tiec_cuoi' | 'hon_le';
  title: string;
  dateSolar: string;        // YYYY-MM-DD
  dateLunar: string;        // vd: 16 Tháng 3 Năm Giáp Thìn
  time: string;             // vd: 11:30
  venueName: string;        // Trung tâm tiệc cưới Melisa / Tư gia
  address: string;          // 85 Thoại Ngọc Hầu, Tân Phú, TP.HCM
  mapUrl?: string;          // Google Maps link
  note?: string;            // vd: Nhà Trai kính mời / Nhà Gái kính mời
}

export interface BankAccount {
  bankCode: string;         // MB, VCB, ACB, TPB, VPB...
  bankName: string;         // Ngân hàng TMCP Quân Đội
  accountNumber: string;
  accountName: string;
  qrUrl?: string;
}

export interface WeddingInvitationData {
  id: string;
  slug: string;             // URL định danh: nam-huong
  templateId: string;       // ID mẫu: song-hy-red, minimalism-red, etc.
  themeName: string;
  primaryColor: string;     // Mã màu: #b91c1c
  fontFamily: string;
  musicTrackUrl?: string;   // Nhạc MP3
  musicTitle?: string;
  fallingEffect: 'petals' | 'hearts' | 'sparkles' | 'none';

  // Thông tin Chú rể
  groom: {
    fullName: string;
    shortName: string;
    birthOrder: string;     // Trưởng nam, Thứ nam, Út nam
    fatherName: string;
    motherName: string;
    address: string;
    avatarUrl?: string;
    bank: BankAccount;
  };

  // Thông tin Cô dâu
  bride: {
    fullName: string;
    shortName: string;
    birthOrder: string;     // Trưởng nữ, Ái nữ, Út nữ
    fatherName: string;
    motherName: string;
    address: string;
    avatarUrl?: string;
    bank: BankAccount;
  };

  // Câu chuyện tình yêu / Thông điệp
  loveStory?: {
    title: string;
    content: string;
    quotes?: string;
  };

  // Danh sách sự kiện hôn lễ
  ceremonies: CeremonyInfo[];

  // Album ảnh
  heroPhoto: string;
  heroPhotoPosition?: 'top' | 'center' | 'bottom';
  galleryImages: string[];

  // Tùy chọn hiển thị
  enableMusic: boolean;
  enableVietQR: boolean;
  enableGuestbook: boolean;
  enableRSVP: boolean;
  thankYouMessage: string;

  // Typography & Kiểu chữ trực tiếp (Cinelove Editor)
  typography?: {
    fontFamily?: string;
    fontSize?: number;
    color?: string;
    fontWeight?: string;
    fontStyle?: string;
    textDecoration?: string;
    textTransform?: string;
    textAlign?: string;
    opacity?: number;
    letterSpacing?: number;
    shadow?: string;
  };

  // Dress Code gợi ý trang phục
  dressCode?: {
    enabled: boolean;
    title: string;
    description: string;
    colors: Array<{ name: string; hex: string }>;
  };
}

export interface GuestWish {
  id: string;
  invitationId: string;
  guestName: string;
  relationship: 'ban_chu_re' | 'ban_co_dau' | 'dong_nghiep' | 'ho_hang' | 'khac';
  content: string;
  createdAt: string;
}

export interface RSVPResponse {
  id: string;
  invitationId: string;
  guestName: string;
  phone?: string;
  attendeesCount: number;
  attendingSide: 'nha_trai' | 'nha_gai';
  isAttending: boolean;
  message?: string;
  createdAt: string;
}
