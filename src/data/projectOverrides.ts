import financePic from "../assets/images/project_finance_1779800506775.png";
import crmPic from "../assets/images/project_crm_1779800526364.png";
import chatPic from "../assets/images/project_chat_1779800542886.png";
import deliveryPic from "../assets/images/project_delivery_1779800558133.png";

/**
 * Manual overrides applied on top of the auto-fetched pinned-repository data.
 * Only include what GitHub cannot know: screenshots and Persian copy.
 * Anything defined here wins over the fetched value for that language.
 *
 * Matching is by repository name (case-insensitive), so a repo can be
 * overridden regardless of the order GitHub returns it in.
 */
export const projectOverrides: Record<
  string,
  {
    image?: string;
    title?: string;
    description?: string;
    category?: string;
    techStack?: string[];
    fa?: {
      title: string;
      description: string;
      category: string;
    };
  }
> = {
  "Finance-App": {
    image: financePic,
    title: "Finance App Design",
    description:
      "A comprehensive mobile finance dashboard built with Flutter. Features real-time tracking, expense analytics, and glassmorphism UI components.",
    category: "Fintech",
    techStack: ["Flutter", "Dart", "Firebase"],
    fa: {
      title: "طراحی اپلیکیشن مالی",
      description:
        "یک داشبورد مالی جامع موبایل ساخته شده با فلاتر. دارای قابلیت ردیابی آنی تراکنش‌ها، تحلیل هزینه‌ها و کامپوننت‌های شیشه‌ای (Glassmorphism).",
      category: "فناوری مالی",
    },
  },
  "Maze-CRM": {
    image: crmPic,
    title: "CRM Tool Dashboard",
    description:
      "An enterprise-grade CRM dashboard for managing customer relationships and sales pipelines. High-performance data visualization with clean responsive views.",
    category: "SaaS",
    techStack: ["Vue.js", "Vuex", "Sass"],
    fa: {
      title: "داشبورد سیستم CRM",
      description:
        "داشبورد پیشرفته CRM برای مدیریت ارتباط با مشتریان و قیف فروش. نمایش کارآمد داده‌ها به همراه صفحات واکنش‌گرا و مدرن.",
      category: "سیستم‌های ابری",
    },
  },
  "Chat-App": {
    image: chatPic,
    title: "Chat Application",
    description:
      "End-to-end encrypted messaging application featuring real-time socket communication, adaptive screen state, and dynamic user status tracking.",
    category: "Real-time",
    techStack: ["React", "Node.js", "Socket.io"],
    fa: {
      title: "پیام‌رسان هوشمند",
      description:
        "یک برنامه چت رمزگذاری شده سرتاسری با قابلیت ارتباط آنی سوکت، رابط کاربری تطبیق‌پذیر و نمایش پوسته‌ی وضعیت کاربران.",
      category: "ارتباطات آنی",
    },
  },
  "Food-App": {
    image: deliveryPic,
    title: "Food Delivery App",
    description:
      "Modern food ordering platform with integrated maps, payment gateways, and a custom delivery path tracking algorithm.",
    category: "E-Commerce",
    techStack: ["React Native", "Django", "PostgreSQL"],
    fa: {
      title: "اپلیکیشن سفارش غذا",
      description:
        "پلتفرم مدرن سفارش آنلاین غذا با نقشه‌های تعاملی یکپارچه، درگاه پرداخت و الگوریتم پیشرفته‌ی ردیابی مسیر تحویل.",
      category: "تجارت الکترونیکی",
    },
  },
};