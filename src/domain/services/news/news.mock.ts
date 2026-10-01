import { DEFAULT_COVER } from "@/domain/constants";
import { GAME_INTRO, GAME_THUMBNAIL, type NewsItem } from "@/domain/types";
import type { INewsService } from "./news.interface";

const delay = (ms = 220) => new Promise((resolve) => setTimeout(resolve, ms));

const news: NewsItem[] = [
  {
    id: "news-001",
    slug: "khai-truong-dnd-portal",
    title: "Khai trương DND Portal",
    description: "Cổng chơi game trình duyệt mở cửa: chọn game, nhận coin mỗi ngày.",
    thumbnailUrl: GAME_THUMBNAIL,
    bannerUrl: DEFAULT_COVER,
    publishedAt: "2026-10-01T08:00:00.000Z",
    content: `## Chào mừng đến DND Portal

Portal đã mở để bạn **chơi ngay trên trình duyệt**, không cần cài app.

- Chọn thể loại yêu thích trên trang chủ
- Đăng nhập bằng số điện thoại để lưu game
- Quay vòng may mắn mỗi ngày

> Nội dung bài viết do Admin soạn bằng Markdown trên CMS.

### Bắt đầu thế nào?

1. Mở trang chủ
2. Chọn một game
3. Bấm **Chơi ngay**

Xem thêm [Điều khoản](/terms) nếu bạn muốn biết cách dùng coin.`,
  },
  {
    id: "news-002",
    slug: "vong-quay-may-man",
    title: "Vòng quay may mắn lên sóng",
    description: "Mỗi ngày có lượt quay để nhận coin. Kết quả do máy chủ quyết định.",
    thumbnailUrl: GAME_INTRO,
    bannerUrl: GAME_THUMBNAIL,
    publishedAt: "2026-09-28T10:00:00.000Z",
    content: `## Quay là có coin

Nút bánh xe góc phải trang chủ mở **vòng quay may mắn**.

| Ô thưởng | Ghi chú |
| --- | --- |
| 5–20 coin | Xuất hiện nhiều |
| 50–200 coin | Hiếm hơn |

Bạn cần đăng nhập. Hết lượt thì quay lại ngày hôm sau.

\`Admin có thể sửa bảng thưởng và nội dung bài này trên CMS.\``,
  },
  {
    id: "news-003",
    slug: "thu-vien-game-cua-toi",
    title: "Thư viện game của tôi",
    description: "Lưu, thích và xem game vừa chơi ngay từ header.",
    thumbnailUrl: GAME_THUMBNAIL,
    bannerUrl: GAME_INTRO,
    publishedAt: "2026-09-20T09:30:00.000Z",
    content: `## Bookmark trên header

Bấm icon bookmark để mở **Trò chơi của tôi**:

- **Danh sách** — lưu từ trang game (cần login)
- **Gần đây** — tự ghi khi bạn vào trang chi tiết
- **Đã thích** — bấm like trên trang game

Không cần nhớ URL. Mở lại portal là thấy ngay.`,
  },
  {
    id: "news-004",
    slug: "cap-nhat-the-loai",
    title: "Thêm hàng loạt thể loại trên Home",
    description: "Arcade, puzzle, .io, đua xe và nhiều mục khác đã lên trang chủ.",
    thumbnailUrl: GAME_INTRO,
    bannerUrl: DEFAULT_COVER,
    publishedAt: "2026-09-12T07:15:00.000Z",
    content: `## Home đủ thể loại

Mỗi section trên Home là một thể loại. Bấm **Xem thêm** để xem hết game.

Admin đổi banner hoặc mô tả thể loại trên CMS mà **không cần sửa code frontend**.`,
  },
  {
    id: "news-005",
    slug: "huong-dan-dang-nhap",
    title: "Hướng dẫn đăng nhập OTP",
    description: "Dùng số điện thoại, nhập OTP 6 số. Bản demo dùng mã 123456.",
    thumbnailUrl: GAME_THUMBNAIL,
    bannerUrl: GAME_THUMBNAIL,
    publishedAt: "2026-09-05T14:00:00.000Z",
    content: `## Đăng nhập nhanh

1. Bấm **Đăng nhập** trên header
2. Nhập số điện thoại
3. Điền OTP

Bản demo: OTP là \`123456\`.

Sau khi vào, bạn chỉnh hồ sơ ngay trong drawer, không bắt buộc vào trang profile.`,
  },
  {
    id: "news-006",
    slug: "su-kien-cuoi-tuan",
    title: "Sự kiện cuối tuần: x2 lượt quay",
    description: "Cuối tuần portal tặng thêm lượt quay. Theo dõi bài này để biết mốc.",
    thumbnailUrl: GAME_INTRO,
    bannerUrl: GAME_INTRO,
    publishedAt: "2026-08-30T11:00:00.000Z",
    content: `## Weekend boost

Trong khung giờ sự kiện, số lượt quay trong ngày **tăng lên**.

Admin chỉ cần sửa ngày và mô tả trong CMS:

\`\`\`
Từ 19:00 thứ Sáu đến 23:59 Chủ nhật
\`\`\`

Coin nhận được cộng thẳng vào số dư tài khoản.`,
  },
];

export const createNewsMock = (): INewsService => ({
  listNews: async () => {
    await delay();
    return [...news].sort(
      (left, right) =>
        new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime()
    );
  },
  getNews: async (id) => {
    await delay();
    const item = news.find((entry) => entry.id === id || entry.slug === id);
    if (!item) {
      throw new Error("News not found");
    }
    return item;
  },
});
