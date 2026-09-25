export interface WeddingSong {
  id: string;
  title: string;
  artist: string;
  category: 'vietnamese' | 'international' | 'instrumental' | 'acoustic';
  mode: 'vocal' | 'instrumental'; // 'vocal' = Có Lời, 'instrumental' = Không Lời
  url: string;
  duration?: string;
  cover?: string;
  keywords: string[];
  lyrics?: string;
}

export const POPULAR_WEDDING_SONGS: WeddingSong[] = [
  // --- CHẾ ĐỘ CÓ LỜI (VOCAL - CA SĨ HÁT) ---
  {
    id: 'anh-nang-cua-anh-vocal',
    title: 'Ánh Nắng Của Anh',
    artist: 'Đức Phúc (Bản Có Lời - Giọng Hát Chính Thức)',
    category: 'vietnamese',
    mode: 'vocal',
    url: '/audio/anh-nang-cua-anh.mp3',
    duration: '04:18',
    keywords: ['anh nang cua anh', 'duc phuc', 'nhac cuoi viet nam', 'co loi', 'vocal', 'ban goc'],
    lyrics: `Từ bao lâu nay
Anh cứ mãi cô đơn bơ vơ
Bao lâu rồi ai đâu hay
Ngày cứ thế trôi qua miên man
Riêng anh một mình nơi đây
Những phút giây trôi qua tầm tay
Chờ một ai đó đến bên anh
Lặng nghe những tâm tư này

Là tia nắng ấm
Là em đến bên anh
Cho vơi đi ưu phiền ngày hôm qua
Nhẹ nhàng xóa đi bao
Mây đen vây quanh cuộc đời nơi anh
Phút giây anh mong đến tình yêu ấy
Giờ đây là em
Người anh mơ ước bao đêm

Sẽ luôn thật gần bên em
Sẽ luôn là vòng tay ấm êm
Sẽ luôn là người yêu em
Cùng em đi đến chân trời
Lắng nghe từng nhịp tim anh
Lắng nghe từng lời anh muốn nói
Vì em luôn đẹp nhất khi em cười
Vì em luôn là tia nắng trong anh
Không xa rời...`
  },
  {
    id: 'i-do-vocal',
    title: 'I Do (Yes I Do)',
    artist: '911 Band (Bản Có Lời Tiếng Anh)',
    category: 'international',
    mode: 'vocal',
    url: '/audio/i-do-vocal.mp3',
    duration: '03:25',
    keywords: ['i do', '911', 'wedding song', 'nhac cuoi tieng anh', 'co loi', 'vocal'],
    lyrics: `I'll be by your side, in unforgettable times
I'll take your hand and say "I do"
I will cherish you, I'll be true
For the rest of my life, with you...`
  },
  {
    id: 'yeu-la-cuoi-vocal',
    title: 'Yêu Là Cưới',
    artist: 'Phát Hồ X2X (Bản Có Lời Vui Nhộn)',
    category: 'vietnamese',
    mode: 'vocal',
    url: '/audio/yeu-la-cuoi.mp3',
    duration: '02:58',
    keywords: ['yeu la cuoi', 'phat ho', 'x2x', 'vui tuoi', 'nhac cuoi soi dong', 'co loi'],
    lyrics: `Đếm bao ngày xuân đi qua, xin phép gia đình mẹ cha
Cho rước em về làm dâu, hai đứa ta cùng chung đôi
Yêu là cưới, trên dưới hai nhà cùng vui...`
  },
  {
    id: 'cuoi-thoi-vocal',
    title: 'Cưới Thôi',
    artist: 'Masew x B Ray x TAP (Bản Có Lời Thịnh Hành)',
    category: 'vietnamese',
    mode: 'vocal',
    url: '/audio/cuoi-thoi.mp3',
    duration: '03:02',
    keywords: ['cuoi thoi', 'masew', 'b ray', 'tap', 'nhac cuoi tre trung', 'co loi'],
    lyrics: `Cưới thôi em ơi, chần chừ chi nữa
Hai đứa chung nhà từ nay vui biết mấy...`
  },
  {
    id: 'thang-dien-vocal',
    title: 'Thằng Điên',
    artist: 'JustaTee x Phương Ly (Bản Có Lời Lãng Mạn)',
    category: 'vietnamese',
    mode: 'vocal',
    url: '/audio/thang-dien.mp3',
    duration: '04:45',
    keywords: ['thang dien', 'justatee', 'phuong ly', 'ngot ngao', 'co loi'],
    lyrics: `Cứ tan vào trong giấc mơ này
Để từng ngày có em kề bên...`
  },

  // --- CHẾ ĐỘ KHÔNG LỜI (INSTRUMENTAL - HÒA TẤU PIANO, CELLO, VIOLIN, ACOUSTIC) ---
  {
    id: 'anh-nang-cua-anh-piano',
    title: 'Ánh Nắng Của Anh (Piano Cover)',
    artist: 'Nghệ Sĩ Piano (Hòa Tấu Không Lời Nhẹ Nhàng)',
    category: 'instrumental',
    mode: 'instrumental',
    url: '/audio/wedding-piano-2.mp3',
    duration: '03:45',
    keywords: ['anh nang cua anh', 'piano', 'khong loi', 'hoa tau', 'acoustic'],
    lyrics: `[Bản Hòa Tấu Piano Nhẹ Nhàng - Tuyệt đẹp cho khoảnh khắc làm lễ và đón khách]`
  },
  {
    id: 'canon-in-d',
    title: 'Canon In D Major',
    artist: 'Johann Pachelbel (Hòa Tấu Dây & Đàn Hạc Đám Cưới)',
    category: 'instrumental',
    mode: 'instrumental',
    url: '/audio/wedding-ceremony-5.mp3',
    duration: '05:15',
    keywords: ['canon in d', 'pachelbel', 'classical', 'khong loi', 'nhac lam le', 'hoa tau'],
    lyrics: `[Bản Giao Hưởng Cổ Điển Bất Hủ - Thích hợp cho khoảnh khắc cô dâu bước vào lễ đường]`
  },
  {
    id: 'beautiful-in-white-instrumental',
    title: 'Beautiful In White (Violin & Piano)',
    artist: 'Shane Filan / Romance Strings (Không Lời)',
    category: 'instrumental',
    mode: 'instrumental',
    url: '/audio/wedding-sweet-4.mp3',
    duration: '03:52',
    keywords: ['beautiful in white', 'shane filan', 'khong loi', 'hoa tau', 'violin', 'piano'],
    lyrics: `[Hòa Tấu Lãng Mạn - Tôn vinh vẻ đẹp của cô dâu trong ngày trọng đại]`
  },
  {
    id: 'i-do-acoustic',
    title: 'I Do (Acoustic Strings Hòa Tấu)',
    artist: '911 Band (Bản Không Lời Lãng Mạn)',
    category: 'instrumental',
    mode: 'instrumental',
    url: '/audio/wedding-romance-1.mp3',
    duration: '03:20',
    keywords: ['i do', '911', 'acoustic', 'khong loi', 'hoa tau'],
    lyrics: `[Bản Nhạc Hòa Tấu Êm Đềm - Dành cho thiệp cưới phong cách thanh lịch]`
  },
  {
    id: 'a-thousand-years-instrumental',
    title: 'A Thousand Years (Cello & Strings)',
    artist: 'Christina Perri (Hòa Tấu Không Lời Sâu Lắng)',
    category: 'instrumental',
    mode: 'instrumental',
    url: '/audio/wedding-melody-1.mp3',
    duration: '03:20',
    keywords: ['a thousand years', 'twilight', 'cello', 'khong loi', 'hoa tau'],
    lyrics: `[Giai Điệu Tình Yêu Vượt Thời Gian - Dịu êm và xúc động]`
  },
  {
    id: 'marry-you-acoustic',
    title: 'Marry You (Upbeat Acoustic Guitar)',
    artist: 'Bruno Mars (Không Lời Vui Tươi Rộn Ràng)',
    category: 'instrumental',
    mode: 'instrumental',
    url: '/audio/wedding-happy-6.mp3',
    duration: '03:50',
    keywords: ['marry you', 'bruno mars', 'khong loi', 'vui tuoi', 'guitar'],
    lyrics: `[Giai Điệu Trẻ Trung & Hạnh Phúc - Tạo không khí tươi vui cho thiệp cưới]`
  },
  {
    id: 'until-i-found-you-instrumental',
    title: 'Until I Found You (Vintage Romance Strings)',
    artist: 'Stephen Sanchez (Không Lời Cổ Điển)',
    category: 'instrumental',
    mode: 'instrumental',
    url: '/audio/wedding-acoustic-3.mp3',
    duration: '02:58',
    keywords: ['until i found you', 'vintage', 'retro', 'khong loi', 'hoa tau'],
    lyrics: `[Phong Cách Cổ Điển Quý Phái - Hoàn hảo cho các mẫu thiệp điện ảnh và vintage]`
  }
];

export function findSongByQuery(query: string, modeFilter: 'all' | 'vocal' | 'instrumental' = 'all'): WeddingSong[] {
  let list = POPULAR_WEDDING_SONGS;
  if (modeFilter !== 'all') {
    list = list.filter((s) => s.mode === modeFilter);
  }
  if (!query || query.trim() === '') return list;
  const q = query.toLowerCase().trim();
  return list.filter((s) =>
    s.title.toLowerCase().includes(q) ||
    s.artist.toLowerCase().includes(q) ||
    s.keywords.some((k) => k.toLowerCase().includes(q))
  );
}
