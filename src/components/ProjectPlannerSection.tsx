import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Briefcase, 
  Settings2, 
  Cpu, 
  Check, 
  Copy, 
  Mail, 
  Sparkles, 
  Smartphone, 
  Globe2, 
  Database, 
  FastForward,
  Clock,
  HelpCircle,
  BookOpen
} from "lucide-react";
import { useApp } from "../context/AppContext";

// Technical Glossaries for non-tech clients
const GLOSSARY = {
  mvp: {
    titleEN: "MVP (Minimum Viable Product)",
    titleFA: "کمینه محصول پذیرفتنی (MVP)",
    descEN: "The quickest, most focused version of your system containing only core functional elements. This lets you validate business ideas and gather real user insights without high initial costs.",
    descFA: "ساده‌ترین نسخه کارآمد از ایده خلاقانه شما با ویژگی‌های پایه. این تکنیک معجزه‌آسا به مالکان پروژه اجازه می‌دهد ایده خود را با بودجه کم در بازار واقعی بسنجند."
  },
  sla: {
    titleEN: "SLA (Service Level Agreement)",
    titleFA: "توافق‌نامه سطح خدمات (SLA)",
    descEN: "A structural standard guarantee regarding the website speed, safety, uptime, and automated backup operations expected of enterprise-grade software products.",
    descFA: "یک ضمانت‌نامه رسمی و فنی برای پایداری ۱۰۰ درصدی سیستم، امنیت تراکنش‌ها، سرعت لود بالا و پشتیبان‌گیری خودکار کدهای سازمانی."
  },
  websockets: {
    titleEN: "WebSockets (Real-time channels)",
    titleFA: "ارتباطات سوکت آنی (WebSockets)",
    descEN: "Continuous, open connection channels allowing server data and the browser UI to stream live two-way messages instantly without requiring page reloads.",
    descFA: "کانال‌های پرسرعت و بازی که اطلاعات سرور و مرورگر کلاینت را به صورت آنی ردوبدل می‌کنند. حیاتی برای چت‌های زنده و بردهای اطلاعات پویای معاملاتی."
  },
  apiAndBackend: {
    titleEN: "APIs & Core Backend",
    titleFA: "توسعه وب‌سرویس و بک‌اند (Backend)",
    descEN: "The logical engine ('brain') running on remote web servers. It secures credential storage, coordinates databasing, and governs complex logic behind client screens.",
    descFA: "مغز متفکر و پایگاه مرکزی برنامه شما روی سرور وب که محاسبات سخت ریاضی، انتقال امن اطلاعات مالی و مدیریت کاربران را کنترل می‌کند."
  },
  completeStack: {
    titleEN: "Complete Stack Architecture",
    titleFA: "پلتفرم کامل و همه‌جانبه (Fullstack)",
    descEN: "A holistic engineering project that maps visual UI screens (frontend) directly with database schemas, session handlers, and server-side computations (backend).",
    descFA: "مهندسی کل بخش‌های محصول که پیوندی یکپارچه میان رابط کاربری ظاهری (فرانت‌اند) و پایگاه امن ذخیره اطلاعات کاربران (بک‌اند) برقرار می‌کند."
  },
  flutter: {
    titleEN: "Flutter & Dart Engine",
    titleFA: "موتور قدرتمند فلاتر (Flutter)",
    descEN: "Google's premium open-source UI creation tool. It compiles pure machine code directly into gorgeous, high-performance apps for both iOS and Android simultaneously.",
    descFA: "فریم‌ورک فوق‌العاده سریع گوگل که امکان می‌دهد خروجی‌های کاملاً بومی، روان و زیبا برای آیفون (iOS) و اندروید با یک سورس‌کد واحد ایجاد شوند."
  },
  django: {
    titleEN: "Django & REST Framework (Python)",
    titleFA: "سرور جنگو و پایتون (Django)",
    descEN: "A highly robust, secure web backend framework built using Python. Perfect for fast development speeds, strong protection against cyber leaks, and simple server scaling.",
    descFA: "یکی از امن‌ترین دستاوردهای مهندسی پایتون با دیوارهای امنیتی چندلایه در برابر حملات وب، ایده‌آل برای ساخت پایدارترین کدهای سمت سرور."
  },
  postgresql: {
    titleEN: "PostgreSQL relational database",
    titleFA: "دیتابیس رابطه‌ای PostgreSQL",
    descEN: "An enterprise SQL relational database. It ensures structural data consistency, flawless database tables, and robust memory management of millions of data entries.",
    descFA: "یک سیستم کارآمد با ساختار جدولی منظم و امنیت تضمین‌شده تراکنش‌ها، مناسب برای برنامه‌هایی با فلو و ارتباط‌های آماری گسترده بین کاربران."
  }
};

export default function ProjectPlannerSection() {
  const { lang, isRtl } = useApp();
  
  // Interactive Options State
  const [platform, setPlatform] = useState<"mobile" | "web" | "backend" | "fullstack">("fullstack");
  const [scale, setScale] = useState<"mvp" | "production" | "enterprise">("production");
  const [hasRealtime, setHasRealtime] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  // Estimates Engine
  const [estimates, setEstimates] = useState({
    hours: 140,
    timeline: "6-8 weeks"
  });

  // Re-calculate live estimations based on selected configurations
  useEffect(() => {
    let hours = 100;
    let timeline = "4-6 weeks";

    // 1. Platform Factor
    if (platform === "mobile") {
      hours = 110;
      timeline = "5-7 weeks";
    } else if (platform === "web") {
      hours = 90;
      timeline = "4-6 weeks";
    } else if (platform === "backend") {
      hours = 120;
      timeline = "6-8 weeks";
    } else if (platform === "fullstack") {
      hours = 160;
      timeline = "8-10 weeks";
    }

    // 2. Scale Factor
    if (scale === "mvp") {
      hours = Math.round(hours * 0.75);
      timeline = platform === "fullstack" ? "5-7 weeks" : "3-5 weeks";
    } else if (scale === "enterprise") {
      hours = Math.round(hours * 1.5);
      timeline = platform === "fullstack" ? "12-16 weeks" : "8-12 weeks";
    }

    // 3. Optional Features Factor
    if (hasRealtime) {
      hours += 25;
    }

    setEstimates({
      hours,
      timeline
    });
  }, [platform, scale, hasRealtime]);

  // Dynamic stack rendering based on Amir's exact engineering values (Flutter, Django, React, etc.)
  const getRecommendedStack = () => {
    const list: { name: string; term?: keyof typeof GLOSSARY }[] = [];
    if (platform === "mobile") {
      list.push({ name: "Flutter & Dart (Multi-platform App)", term: "flutter" });
      list.push(
        hasRealtime 
          ? { name: "Firebase Realtime DB / WebSockets", term: "websockets" } 
          : { name: "RESTful Local SQLite Sync", term: "apiAndBackend" }
      );
      list.push({ name: "Riverpod Core State Engine" });
    } else if (platform === "web") {
      list.push({ name: "Vite (TypeScript) & React / Vue.js" });
      list.push({ name: "Tailwind CSS premium responsive UI" });
      if (hasRealtime) {
        list.push({ name: "Socket.io (Realtime bidirectional loops)", term: "websockets" });
      }
    } else if (platform === "backend") {
      list.push({ name: "Django System Shell (Python)", term: "django" });
      list.push({ name: "PostgreSQL relational database", term: "postgresql" });
      list.push({ name: "Django REST Framework & JWT Tokens", term: "apiAndBackend" });
      if (hasRealtime) {
        list.push({ name: "Redis / Celery live task queues" });
      }
    } else {
      list.push({ name: "Flutter Mobile App + Web Dashboards", term: "flutter" });
      list.push({ name: "Python & Django Enterprise API", term: "django" });
      list.push({ name: "PostgreSQL core database engine", term: "postgresql" });
      list.push(
        hasRealtime 
          ? { name: "WebSocket channels & Redis live synchronization", term: "websockets" } 
          : { name: "Robust multi-tenant relational patterns", term: "postgresql" }
      );
    }
    return list;
  };

  // Human-friendly interactive tooltip component
  const TermTooltip = ({ term, dir = "top" }: { term: keyof typeof GLOSSARY; dir?: "top" | "bottom" }) => {
    const [hovered, setHovered] = useState(false);
    const item = GLOSSARY[term];
    if (!item) return null;

    return (
      <span 
        className="inline-flex items-center relative mx-1 select-none cursor-pointer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => setHovered(!hovered)}
      >
        <span 
          className={`w-3.5 h-3.5 inline-flex items-center justify-center rounded-full text-[9px] font-mono leading-none border transition-all ${
            hovered 
              ? "bg-accent-teal/20 text-accent-teal border-accent-teal/40 scale-110" 
              : "bg-stone-100 dark:bg-glass-sub-bg text-stone-500 dark:text-text-dim border-stone-200 dark:border-glass-border hover:bg-stone-200 dark:hover:bg-glass-sub-bg/85 hover:text-stone-800 dark:hover:text-text-main"
          }`}
          title="Click to toggle or hover"
        >
          ?
        </span>
        
        <AnimatePresence>
          {hovered && (
            <motion.span
              initial={
                dir === "top" 
                  ? { opacity: 0, y: 8, scale: 0.95 } 
                  : { opacity: 0, y: -8, scale: 0.95 }
              }
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={
                dir === "top" 
                  ? { opacity: 0, y: 8, scale: 0.95 } 
                  : { opacity: 0, y: -8, scale: 0.95 }
              }
              transition={{ duration: 0.15 }}
              className={`absolute z-50 ${
                dir === "top" ? "bottom-full mb-2" : "top-full mt-2"
              } ${
                isRtl ? "right-[-100px]" : "left-[-100px]"
              } p-3.5 rounded-xl bg-tooltip-bg border border-glass-border shadow-[0_16px_32px_rgba(0,0,0,0.15)] dark:shadow-[0_16px_32px_rgba(0,0,0,0.6)] flex flex-col gap-1.5 pointer-events-none`}
              style={{ width: "232px" }}
            >
              {/* Little anchor point */}
              {dir === "top" ? (
                <span className="absolute top-full left-[104px] w-2.5 h-2.5 bg-tooltip-bg border-r border-b border-glass-border rotate-45" />
              ) : (
                <span className="absolute bottom-full left-[104px] w-2.5 h-2.5 bg-tooltip-bg border-l border-t border-glass-border rotate-45" />
              )}
              
              <span className="font-sans text-[11px] font-bold text-accent-teal uppercase tracking-wide block">
                {lang === "fa" ? item.titleFA : item.titleEN}
              </span>
              <span className="font-sans text-[10px] text-text-dim leading-relaxed block font-light">
                {lang === "fa" ? item.descFA : item.descEN}
              </span>
            </motion.span>
          )}
        </AnimatePresence>
      </span>
    );
  };

  // Automated custom blueprint outline message generator
  const getBriefText = () => {
    const stackSummary = getRecommendedStack().map(el => el.name).join(", ");
    return `Hi Amir, I mapped out a project brief using your Portfolio Planner:
- Platform requested: ${platform.toUpperCase()}
- Scale tier: ${scale.toUpperCase()}
- Real-time event channels: ${hasRealtime ? "YES" : "NO"}
- Suggested Stack: ${stackSummary}
- Target Timeline: ${estimates.timeline}

I'd love to jump on an introduction call to discuss building this!`;
  };

  const copyBrief = () => {
    navigator.clipboard.writeText(getBriefText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="planner" className="py-20 w-full relative overflow-hidden bg-bg-space/35 border-t border-glass-border">
      {/* Visual background accents */}
      <div className="absolute right-0 top-1/4 w-96 h-96 bg-accent-blue/5 rounded-full filter blur-[120px] pointer-events-none select-none" />
      <div className="absolute left-10 bottom-10 w-80 h-80 bg-accent-teal/5 rounded-full filter blur-[100px] pointer-events-none select-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Module Header block */}
        <div className="text-center mb-14 select-none">
          <span className="font-mono text-[10px] text-accent-blue font-bold tracking-widest bg-accent-blue/10 px-3 py-1 rounded-full uppercase">
            {lang === "en" ? "Consultation Engine" : "موتور مشاوره پروژه"}
          </span>
          <h2 className="font-display font-medium text-3xl md:text-4xl text-text-main tracking-tight flex items-center justify-center gap-2.5 mt-3">
            <Briefcase className="text-accent-teal" size={24} />
            <span>{lang === "en" ? "Interactive Project Advisor" : "برنامه‌ریز تعاملی پروژه‌"}</span>
          </h2>
          <p className="font-sans text-xs md:text-sm text-text-dim mt-2 max-w-xl mx-auto font-light leading-relaxed">
            {lang === "en" 
              ? "Instantly evaluate your software architecture, build an initial technical stack, and discover how raw ideas transform into production code."
              : "به صورت خلاقانه ایده خام خود را ارزیابی کنید، پشته کدهای فنی پیشنهادی را بسازید و مراحل تبدیل ایده به محصول نهایی را ببینید."
            }
          </p>
        </div>

        {/* Core Layout Splitter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch text-left">
          
          {/* LEFT COLUMN: Input Selection Panel */}
          <div className="lg:col-span-5 flex flex-col gap-6 bg-white dark:bg-[#181918]/65 border border-stone-200 dark:border-glass-border rounded-2xl p-6 shadow-xl">
            
            <div className="flex items-center justify-between pb-4 border-b border-glass-border select-none text-text-main">
              <div className="flex items-center gap-2">
                <Settings2 size={16} className="text-accent-teal" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider">
                  {lang === "en" ? "Interactive Parameters" : "تنظیم پارامترهای تعاملی"}
                </span>
              </div>
              <span className="text-[9px] text-[#A1A2A1]/60 font-mono hidden sm:inline-block">
                {lang === "en" ? "Hover ? below for glossary" : "عبارات فنی راهنما دارند"}
              </span>
            </div>

            {/* Step 1: Platforms option cards */}
            <div className="space-y-2.5 text-left">
              <label className="block font-mono text-[11px] text-text-dim uppercase tracking-wider font-semibold select-none">
                {lang === "en" ? "1. Targeted Platform Architecture" : "۱. معماری پلتفرم هدف"}
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: "mobile", labelEN: "Mobile App", labelFA: "اپلیکیشن موبایل", icon: <Smartphone size={14} />, term: "flutter" },
                  { id: "web", labelEN: "Web Dashboard", labelFA: "داشبورد تحت وب", icon: <Globe2 size={14} />, term: "completeStack" },
                  { id: "backend", labelEN: "Backend & API", labelFA: "سیستم بک‌آند", icon: <Database size={14} />, term: "apiAndBackend" },
                  { id: "fullstack", labelEN: "Complete Stack", labelFA: "پلتفرم کامل", icon: <Cpu size={14} />, term: "completeStack" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setPlatform(item.id as any)}
                    className={`flex items-center justify-between py-3 px-3.5 text-xs rounded-xl border text-left cursor-pointer transition-all duration-200 select-none ${
                      platform === item.id 
                        ? "bg-accent-blue/15 border-accent-blue/60 text-text-main font-semibold shadow-md shadow-accent-blue/5" 
                        : "bg-stone-50 dark:bg-glass-sub-bg border-stone-200 dark:border-glass-border/30 text-stone-600 dark:text-text-dim hover:bg-stone-100 dark:hover:bg-glass-sub-bg/80 hover:text-text-main hover:border-stone-300 dark:hover:border-glass-border"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-accent-teal">{item.icon}</span>
                      <span className="font-sans text-[11px]">
                        {lang === "fa" ? item.labelFA : item.labelEN}
                      </span>
                    </div>
                    {item.term && <TermTooltip term={item.term as any} dir="bottom" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Choose project complexity scale */}
            <div className="space-y-2.5 text-left">
              <label className="block font-mono text-[11px] text-text-dim uppercase tracking-wider font-semibold select-none">
                {lang === "en" ? "2. Scale Tier & Quality Assurance" : "۲. سطح کیفیت و میزان پیچیدگی"}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "mvp", titleEN: "MVP Tier", titleFA: "نمونه اولیه", descEN: "Speed to validation", descFA: "اعتبارسنجی سریع ایده", term: "mvp" },
                  { id: "production", titleEN: "Production", titleFA: "محصول نهایی", descEN: "Fully optimized SaaS", descFA: "سرویس ابری بهینه", term: "apiAndBackend" },
                  { id: "enterprise", titleEN: "Enterprise", titleFA: "سازمانی", descEN: "High load SLA scale", descFA: "کارایی و امنیت بالا", term: "sla" },
                ].map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setScale(item.id as any)}
                    className={`flex flex-col justify-between gap-1 p-2.5 rounded-xl border text-left cursor-pointer transition-all duration-200 select-none h-20 ${
                      scale === item.id
                        ? "bg-accent-teal/15 border-accent-teal/60 text-text-main font-semibold"
                        : "bg-stone-50 dark:bg-glass-sub-bg border-stone-200 dark:border-glass-border/30 text-stone-600 dark:text-text-dim hover:bg-stone-100 dark:hover:bg-glass-sub-bg hover:text-text-main hover:border-stone-300 dark:hover:border-glass-border"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-sans text-[11px]">{lang === "fa" ? item.titleFA : item.titleEN}</span>
                      {item.term && <TermTooltip term={item.term as any} dir="bottom" />}
                    </div>
                    <span className="text-[9px] text-[#A1A2A1]/70 font-light leading-snug">
                      {lang === "fa" ? item.descFA : item.descEN}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 3: Fast realtime WebSockets channel option toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-stone-200 dark:border-glass-border bg-stone-50 dark:bg-glass-sub-bg select-none hover:border-stone-300 dark:hover:border-glass-border/80 transition-all">
              <div className="flex flex-col gap-0.5 text-left pr-2">
                <span className="font-sans text-xs font-semibold text-text-main flex items-center gap-1">
                  <FastForward className="text-accent-blue" size={13} />
                  <span>{lang === "fa" ? "سوکت و همگام‌سازی آنی" : "Real-time sync / WebSockets"}</span>
                  <TermTooltip term="websockets" />
                </span>
                <span className="text-[10px] text-text-dim font-light leading-relaxed max-w-[200px] sm:max-w-[240px]">
                  {lang === "fa" 
                    ? "برای پیام‌رسان‌ها، آپدیت مستقیم چارت‌ها و اعلان‌های بدون تاخیر."
                    : "For messaging streams, live charts, and microsecond visual telemetry updates."
                  }
                </span>
              </div>
              <button
                onClick={() => setHasRealtime(!hasRealtime)}
                className={`relative w-10 h-5 rounded-full transition-colors duration-200 cursor-pointer shrink-0 ${
                  hasRealtime ? "bg-accent-blue" : "bg-stone-200 dark:bg-glass-sub-bg border border-stone-300 dark:border-glass-border"
                }`}
              >
                <div 
                  className={`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-transform duration-200 ${
                    hasRealtime ? "translate-x-5" : "translate-x-0"
                  }`} 
                />
              </button>
            </div>

          </div>

          {/* RIGHT COLUMN: Output Visualization Board */}
          <div className="lg:col-span-7 flex flex-col justify-between bg-white dark:bg-[#131413] border border-stone-200 dark:border-glass-border rounded-2xl shadow-2xl relative">
            
            {/* Viewport Header Bar */}
            <div className="flex items-center justify-between px-4 py-3.5 bg-stone-50 dark:bg-glass-sub-bg border-b border-stone-200 dark:border-glass-border select-none rounded-t-2xl">
              <div className="flex items-center gap-1.5">
                <Sparkles size={13} className="text-accent-teal animate-pulse" />
                <span className="font-mono text-[10px] text-accent-blue font-bold uppercase tracking-wider">
                  {lang === "en" ? "System Proposal Architecture" : "معماری پروپوزال پیشنهادی"}
                </span>
              </div>
              <div className="text-[9px] font-mono text-text-dim/80 flex items-center gap-1">
                <BookOpen size={10} className="text-accent-teal" />
                <span>{lang === "en" ? "EDUCATIONAL RUNTIME" : "اموزشی"}</span>
              </div>
            </div>

            {/* Core Estimates Output Grid */}
            <div className="p-6 md:p-8 flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 relative">
              
              {/* Box 1: Dynamic recommended architectural stack */}
              <div className="flex flex-col gap-3">
                <div className="text-[10px] font-mono text-text-dim uppercase tracking-widest border-b border-stone-200 dark:border-glass-border pb-1 select-none flex items-center justify-between">
                  <span>{lang === "en" ? "Curated Technical Stack" : "پشته فنّی پیشنهادی"}</span>
                  <span className="text-[8px] text-[#A1A2A1]/40">{lang === "en" ? "Hover icons" : "روی ؟ نگه دارید"}</span>
                </div>
                <ul className="space-y-2 mt-2">
                  {getRecommendedStack().map((item, idx) => (
                    <motion.li 
                      key={item.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.08 }}
                      className="flex items-start gap-2.5 text-xs font-sans font-light text-text-dim"
                    >
                      <Check className="text-accent-teal w-4 h-4 shrink-0 mt-0.5" />
                      <div className="flex items-center flex-wrap gap-0.5">
                        <span>{item.name}</span>
                        {item.term && <TermTooltip term={item.term} dir="bottom" />}
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Box 2: ENLIGHTENING DEVELOPMENT PROSESS/MILESTONES FOR NON-TECHIES */}
              <div className="flex flex-col justify-between gap-4 p-4 rounded-xl bg-stone-50 dark:bg-glass-sub-bg border border-stone-200 dark:border-glass-border">
                
                <div className="flex flex-col gap-1.5">
                  <span className="font-mono text-[9px] text-stone-500 dark:text-[#A1A2A1]/70 uppercase tracking-wider select-none flex items-center gap-1.5 border-b border-stone-200 dark:border-glass-border pb-1.5">
                    <BookOpen size={11} className="text-accent-teal" />
                    {lang === "fa" ? "مراحل توسعه نرم افزار شما:" : "Your Software Journey Phases:"}
                  </span>
                  
                  {/* Phase Blocks */}
                  <div className="space-y-3 mt-1 text-left">
                    <div className="flex gap-2 items-start">
                      <span className="w-4 h-4 rounded-full bg-accent-blue/15 text-accent-blue text-[9px] font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
                      <div className="space-y-0.5">
                        <span className="block font-sans text-[11px] font-bold text-text-main leading-none">
                          {lang === "fa" ? "نقشه راه دیتابیس و وایرفریم" : "Blueprint & Schema Drafting"}
                        </span>
                        <span className="block text-[10px] text-text-dim font-light leading-snug">
                          {lang === "fa" 
                            ? "طراحی روابط آماری دیتابیس ایمن و مسیرهای بهینه صفحات."
                            : "Drafting relational models, endpoint routes, and structural data relationships."
                          }
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 items-start">
                      <span className="w-4 h-4 rounded-full bg-accent-teal/15 text-accent-teal text-[9px] font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
                      <div className="space-y-0.5">
                        <span className="block font-sans text-[11px] font-bold text-text-main leading-none">
                          {lang === "fa" ? "کدنویسی تمیز کلاینت و سرور" : "Core System Programming"}
                        </span>
                        <span className="block text-[10px] text-text-dim font-light leading-snug">
                          {lang === "fa" 
                            ? "نوشتن کدهای روان با فلاتر یا فریم‌ورک‌ها و اتصال به وب‌سرویس‌ها."
                            : "Polishing dynamic client interfaces and building solid, secure backends."
                          }
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 items-start">
                      <span className="w-4 h-4 rounded-full bg-purple-600/15 dark:bg-purple-400/15 text-purple-600 dark:text-purple-400 text-[9px] font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
                      <div className="space-y-0.5">
                        <span className="block font-sans text-[11px] font-bold text-text-main leading-none">
                          {lang === "fa" ? "پکیج تست و دیپلوی پایدار" : "QA Check & Cloud Launch"}
                        </span>
                        <span className="block text-[10px] text-text-dim font-light leading-snug">
                          {lang === "fa" 
                            ? "تست فشار لود تراکنش‌ها و راه‌اندازی دائمی محصول روی ابر سرور."
                            : "Deep stress testing, deploying container servers, and setting auto-backups."
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Duration/Hours Details remaining intact because dates are enlightening */}
                <div className="grid grid-cols-2 gap-2 border-t border-stone-200 dark:border-glass-border pt-3">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-mono text-text-dim select-none flex items-center gap-1">
                      <Clock size={10} />
                      {lang === "fa" ? "تلاش خالص خالص" : "Pure Code Time"}
                    </span>
                    <span className="text-xs font-mono font-bold text-accent-teal mt-0.5">
                      ~ {estimates.hours} {lang === "fa" ? "ساعت کار فنی" : "pure tech hrs"}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-mono text-text-dim select-none">
                      {lang === "fa" ? "تحویل استاندارد" : "Timeline Range"}
                    </span>
                    <span className="text-xs font-mono font-bold text-text-main mt-0.5">
                      {estimates.timeline}
                    </span>
                  </div>
                </div>

              </div>

            </div>

             {/* Core Action Footer: Instantly generate copyable briefing message */}
            <div className="border-t border-stone-200 dark:border-glass-border bg-stone-50 dark:bg-[#0b0c0b]/90 p-5 mt-auto rounded-b-2xl">
              <div className="p-4 bg-white dark:bg-glass-sub-bg rounded-xl border border-stone-200 dark:border-glass-border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div className="text-left w-full sm:w-auto sm:max-w-[250px]">
                  <div className="font-sans text-xs font-semibold text-text-main">
                    {lang === "fa" ? "پیکربندی هوشمند آماده است" : "Your customized brief is built!"}
                  </div>
                  <p className="font-sans text-[11px] text-text-dim font-light leading-relaxed mt-0.5">
                    {lang === "fa" 
                      ? "پیش‌نویس معماری فنی حاصل شده را کپی کرده یا با زدن ارسال ایمیل مستقیماً با امیر مشاوره کنید."
                      : "Copy this clear educational code proposal outline or consult with Amir via email directly."
                    }
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                  {/* Copy config button */}
                  <button
                    onClick={copyBrief}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 font-mono text-[10px] px-3.5 py-2.5 rounded-lg bg-stone-100 hover:bg-stone-200 dark:bg-glass-sub-bg dark:hover:bg-glass-sub-bg/90 border border-stone-200 dark:border-glass-border text-text-main transition-all cursor-pointer select-none"
                  >
                    {copied ? (
                      <>
                        <Check size={12} className="text-accent-teal" />
                        <span className="text-accent-teal">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={12} />
                        <span>{lang === "fa" ? "کپی پیش‌نویس" : "Copy Brief"}</span>
                      </>
                    )}
                  </button>

                  {/* Mail to Amir directly with brief auto-populated */}
                  <a
                    href={`mailto:amirrezesf@gmail.com?subject=Project Brief Consultation (${platform.toUpperCase()})&body=${encodeURIComponent(getBriefText())}`}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 font-mono text-[10px] px-3.5 py-2.5 rounded-lg bg-accent-blue hover:bg-accent-blue/85 border border-accent-blue/20 text-white font-bold shadow-md shadow-accent-blue/10 transition-all cursor-pointer select-none text-center"
                  >
                    <Mail size={12} className="inline" />
                    <span>{lang === "fa" ? "ارسال ایمیل" : "Email Amir"}</span>
                  </a>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

