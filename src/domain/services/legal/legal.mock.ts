import type { LegalDocument } from "@/domain/types";
import type { ILegalService } from "./legal.interface";

const delay = (ms = 180) => new Promise((resolve) => setTimeout(resolve, ms));

const pages: LegalDocument[] = [
  {
    slug: "terms",
    updatedAt: "2026-10-01T00:00:00.000Z",
    locales: {
      vi: {
        title: "Điều khoản và điều kiện",
        content: `## Điều khoản sử dụng

Khi truy cập DND Portal, bạn đồng ý tuân thủ các điều khoản sử dụng của chúng tôi. Portal cung cấp trò chơi HTML5 và các tính năng thành viên như hồ sơ, thư viện game và vòng quay may mắn.

### Tài khoản

Bạn chịu trách nhiệm bảo mật tài khoản (số điện thoại đã xác thực). Không được dùng portal để gian lận, phá hoại dịch vụ hoặc xâm phạm quyền của người khác.

### Coin và phần thưởng

Coin, lượt quay và phần thưởng chỉ có giá trị trong portal, không quy đổi thành tiền mặt trừ khi chúng tôi công bố chương trình riêng.

### Dịch vụ

Chúng tôi có thể tạm ngưng hoặc chỉnh sửa dịch vụ khi cần bảo trì, nâng cấp hoặc tuân thủ pháp luật. Nội dung game thuộc về nhà phát triển tương ứng.

Xem thêm [Chính sách bảo mật](/privacy) và [Dữ liệu cá nhân](/du-lieu-ca-nhan).`,
      },
      en: {
        title: "Terms & conditions",
        content: `## Terms of use

By using DND Portal you agree to these terms. The portal offers HTML5 games and member features such as a profile, a game library, and a lucky wheel.

### Account

You are responsible for your verified phone account. Do not use the portal to cheat, disrupt the service, or infringe other people's rights.

### Coins and rewards

Coins, spins, and rewards stay inside the portal and are not cash unless we announce a specific program.

### Service

We may pause or change the service for maintenance, upgrades, or legal reasons. Game content belongs to the respective developers.

See also the [Privacy policy](/privacy) and [Personal data](/du-lieu-ca-nhan).`,
      },
    },
  },
  {
    slug: "privacy",
    updatedAt: "2026-10-01T00:00:00.000Z",
    locales: {
      vi: {
        title: "Chính sách bảo mật",
        content: `## Chúng tôi thu thập gì

DND Portal thu thập số điện thoại khi bạn đăng nhập, cùng dữ liệu hồ sơ bạn tự điền (tên, ảnh, quốc gia) và lịch sử chơi/lưu game trên thiết bị.

### Mục đích sử dụng

Dữ liệu dùng để vận hành tài khoản, cá nhân hóa thư viện, tính lượt quay và cải thiện trải nghiệm. Chúng tôi **không bán** thông tin cá nhân cho bên thứ ba.

### Kiểm soát của bạn

Bạn có thể chỉnh hồ sơ hoặc đăng xuất bất cứ lúc này. Bản demo hiện lưu dữ liệu trên trình duyệt (localStorage).

Mọi thắc mắc vui lòng xem [Dữ liệu cá nhân](/du-lieu-ca-nhan) hoặc liên hệ qua kênh Zalo trên trang chủ.`,
      },
      en: {
        title: "Privacy policy",
        content: `## What we collect

DND Portal collects your phone number when you sign in, profile fields you provide (name, photo, country), and play/save history stored on your device.

### How we use it

We use this data to run your account, personalize your library, count lucky-wheel spins, and improve the product. We **do not sell** personal data.

### Your control

You can edit your profile or sign out at any time. This demo currently stores data in the browser (localStorage).

For more detail see [Personal data](/du-lieu-ca-nhan) or contact us through the Zalo button on the homepage.`,
      },
    },
  },
  {
    slug: "about",
    updatedAt: "2026-10-01T00:00:00.000Z",
    locales: {
      vi: {
        title: "Về chúng tôi",
        content: `## DND Portal

DND Portal là cổng chơi game trên trình duyệt: chọn game, chơi ngay, nhận coin và theo dõi trò chơi bạn thích.

### Trải nghiệm

Chúng tôi tập trung trải nghiệm nhẹ trên điện thoại, hỗ trợ tiếng Việt và tiếng Anh, cùng các tính năng thành viên như hồ sơ, danh sách đã lưu và vòng quay may mắn.

### Đang xây dựng

Portal đang trong giai đoạn xây dựng. Game, banner và phần thưởng hiện dùng dữ liệu demo trước khi kết nối máy chủ thật.`,
      },
      en: {
        title: "About us",
        content: `## DND Portal

DND Portal is a browser game hub: pick a title, play instantly, earn coins, and keep the games you like.

### Experience

We focus on a light mobile experience, Vietnamese and English, plus member tools such as profiles, saved lists, and a lucky wheel.

### Work in progress

The portal is still being built. Games, banners, and rewards currently use demo data before the live backend is connected.`,
      },
    },
  },
  {
    slug: "registration",
    updatedAt: "2026-10-01T00:00:00.000Z",
    locales: {
      vi: {
        title: "Quản lý đăng ký",
        content: `## Đăng ký tài khoản

Bạn đăng ký / đăng nhập bằng **số điện thoại** và mã OTP. Không cần email hay mật khẩu.

### Quản lý tài khoản

Sau khi đăng nhập, bạn có thể:

- Chỉnh hồ sơ (tên, ảnh, quốc gia, ngày sinh)
- Xem trò chơi đã lưu / đã thích
- Nhận quà hằng ngày và coin

### Ngừng sử dụng

Bạn có thể đăng xuất bất cứ lúc nào từ menu tài khoản. Để yêu cầu xóa tài khoản và dữ liệu liên quan, xem [Dữ liệu cá nhân](/du-lieu-ca-nhan).

> Nội dung trang này do Admin soạn bằng Markdown trên CMS.`,
      },
      en: {
        title: "Registration management",
        content: `## Create an account

You register / sign in with a **phone number** and an OTP. No email or password is required.

### Manage your account

After signing in you can:

- Edit your profile (name, photo, country, birthday)
- View saved / liked games
- Claim the daily gift and coins

### Stop using the service

You can sign out at any time from the account menu. To request account and data deletion, see [Personal data](/du-lieu-ca-nhan).

> This page is written in Markdown by Admin in the CMS.`,
      },
    },
  },
  {
    slug: "personal-data",
    updatedAt: "2026-10-01T00:00:00.000Z",
    locales: {
      vi: {
        title: "Dữ liệu cá nhân",
        content: `## Dữ liệu chúng tôi lưu

Khi bạn dùng DND Portal, chúng tôi có thể lưu:

| Loại | Ví dụ |
| --- | --- |
| Tài khoản | Số điện thoại, token phiên |
| Hồ sơ | Tên, ảnh, quốc gia, ngày sinh |
| Hoạt động | Game đã thích, đã lưu, đã chơi |
| Phần thưởng | Coin, lượt quay, daily claim |

### Quyền của bạn

Bạn có quyền **xem**, **chỉnh sửa** hồ sơ và **yêu cầu xóa** dữ liệu cá nhân.

Bản demo hiện lưu trên trình duyệt (localStorage). Khi kết nối máy chủ thật, bạn có thể gửi yêu cầu xóa qua email liên hệ ở chân trang.

Xem thêm [Chính sách bảo mật](/privacy) và [Quản lý đăng ký](/quan-ly-dang-ky).`,
      },
      en: {
        title: "Personal data",
        content: `## Data we store

When you use DND Portal we may store:

| Type | Examples |
| --- | --- |
| Account | Phone number, session token |
| Profile | Name, photo, country, birthday |
| Activity | Liked, saved, and recently played games |
| Rewards | Coins, spins, daily claims |

### Your rights

You may **view**, **edit** your profile, and **request deletion** of personal data.

This demo stores data in the browser (localStorage). After the live backend is connected, send a deletion request via the contact email in the footer.

See also the [Privacy policy](/privacy) and [Registration management](/quan-ly-dang-ky).`,
      },
    },
  },
];

export const createLegalMock = (): ILegalService => ({
  getPage: async (slug) => {
    await delay();
    const page = pages.find((item) => item.slug === slug);
    if (!page) {
      throw new Error("LEGAL_NOT_FOUND");
    }
    return page;
  },
});
