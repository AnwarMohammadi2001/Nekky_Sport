import React, { useState } from "react";
import {
  CheckCircle,
  MapPin,
  Phone,
  Award,
  Package,
  Users,
  Truck,
  Target,
  Eye,
  Globe,
  Calendar,
  Shield,
} from "lucide-react";

const About = () => {
  const [language, setLanguage] = useState("persian");

  const content = {
    persian: {
      nav: {
        home: "خانه",
        about: "درباره ما",
        products: "محصولات",
        branches: "شعب",
        contact: "تماس",
      },
      hero: {
        title: " سعادت گروپ",
        subtitle: "کیفیت | صداقت | تعهد | مسئولیت‌پذیری | پیشرفت دوامدار",
      },
      story: {
        title: "داستان ما",
        paragraphs: [
          "نیکی سپورت یک مجموعه پویا و تخصصی در زمینه فروش محصولات و تجهیزات ورزشی است که با هدف ترویج سبک زندگی سالم و فعال فعالیت می‌کند. این مجموعه با تکیه بر دانش فنی، تیم حرفه‌ای و رویکرد مشتری‌محور، تلاش دارد بهترین و باکیفیت‌ ترین محصولات ورزشی را مطابق با نیاز بازار افغانستان عرضه نماید. ما در نیکی سپورت بر این باوریم که موفقیت پایدار در گرو صداقت، تعهد، و رضایت مشتری است؛ به همین دلیل، ایجاد ارتباطی ماندگار و قابل اعتماد با مشتریان و همکاران تجاری، همواره اولویت اصلی ما بوده است.",
        ],
      },
      whyUs: {
        title: "چرا نیکی سپورت؟ ",
        reasons: [
          {
            icon: Award,
            title: "کیفیت تضمین شده",
            description:
              "تمامی محصولات با بالاترین استانداردهای کیفیت تولید می‌شوند",
          },
          {
            icon: Calendar,
            title: "چهار دهه تجربه",
            description: "۴۰ سال سابقه درخشان در صنعت تولید و توزیع",
          },
          {
            icon: Users,
            title: "پشتیبانی اختصاصی",
            description: "خدمات پس از فروش و پشتیبانی ۲۴ ساعته",
          },
          {
            icon: Truck,
            title: "تحویل سریع",
            description: "شبکه توزیع گسترده برای تحویل به موقع",
          },
        ],
      },
      products: {
        title: "دسته‌بندی محصولات",
        categories: [
          {
            name: "مواد غذایی",
            count: "بیش از ۵۰۰ قلم",
            color: "bg-green-100 text-green-800",
          },
          {
            name: "پوشاک",
            count: "برندهای معتبر",
            color: "bg-blue-100 text-blue-800",
          },
          {
            name: "لوازم خانگی",
            count: "گارانتی اصلی",
            color: "bg-purple-100 text-purple-800",
          },
          {
            name: "کالای دیجیتال",
            count: "تکنولوژی روز",
            color: "bg-red-100 text-red-800",
          },
          {
            name: "آرایشی و بهداشتی",
            count: "برندهای جهانی",
            color: "bg-pink-100 text-pink-800",
          },
          {
            name: "کالاهای ورزشی",
            count: "تجهیزات حرفه‌ای",
            color: "bg-orange-100 text-orange-800",
          },
        ],
      },
      branches: {
        title: "شعب ما در سراسر کشور",
        list: [
          {
            city: "تهران",
            address: "خیابان ولیعصر، نرسیده به میدان ولیعصر، پلاک ۱۲۳۴",
            phone: "۰۲۱-۱۲۳۴۵۶۷۸",
            hours: "۸:۰۰ - ۲۱:۰۰",
          },
          {
            city: "مشهد",
            address: "بلوار وکیل‌آباد، بین وکیل‌آباد ۱۰ و ۱۲",
            phone: "۰۵۱-۳۱۲۳۴۵۶۷",
            hours: "۸:۰۰ - ۲۱:۰۰",
          },
          {
            city: "اصفهان",
            address: "چهارباغ بالا، جنب هتل عباسی",
            phone: "۰۳۱-۳۲۱۲۳۴۵۶",
            hours: "۸:۰۰ - ۲۰:۰۰",
          },
          {
            city: "شیراز",
            address: "خیابان زند، بعد از بازار وکیل",
            phone: "۰۷۱-۳۷۲۲۳۴۵۶",
            hours: "۸:۰۰ - ۲۰:۰۰",
          },
        ],
      },
      mission: {
        title: "ماموریت ما",
        icon: Target,
        text: "ارائه خدمات و محصولات معیاری، ایجاد اعتماد پایدار با مشتریان و سهم‌گیری مؤثر در رشد اقتصادی کشور.",
      },
      vision: {
        title: "چشم‌انداز ما",
        icon: Eye,
        text: "تبدیل‌شدن به یک مجموعه معتبر و پیشرو در عرصه خدمات تخنیکی، تولیدی و تجارتی در سطح افغانستان و منطقه.",
      },
      stats: [
        { value: "۴۰+", label: "سال تجربه" },
        { value: "۱۲+", label: "شعبه فعال" },
        { value: "۵۰۰۰+", label: "محصول" },
        { value: "۱۰۰+", label: "همکار" },
      ],
    },
  };

  const currentContent = content[language];
  const isRTL = language === "persian";

  return (
    <div
      className="min-h-screen pt-14 md:pt-[150px] bg-gray-50"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Hero Section */}

      <main className="md:max-w-7xl mx-auto px-8 sm:px-8 lg:px-8 py-12">
        {/* Story Section */}
        <section className="mb-20 ">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className={`space-y-6 ${isRTL ? "text-right" : "text-left"}`}>
              <h2 className="text-3xl md:text-2xl  text-center md:text-right font-bold text-gray-900 mb-4">
                {currentContent.story.title}
              </h2>
              {currentContent.story.paragraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className="text-lg text-gray-700 text-justify leading-relaxed"
                >
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="relative  px-4 sm:px-6 pt-10 md:pt-14 lg:px-8">
            <img src="about.jpeg" alt="" className="rounded-md" />
              
            </div>
          </div>
        </section>

        {/* Why Us Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
              {currentContent.whyUs.title}
            </h2>
            <div className="w-24 h-1 bg-red-600 mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {currentContent.whyUs.reasons.map((reason, index) => (
              <div
                key={index}
                className="bg-white rounded-md p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-lg bg-black/10 text-red-600 mb-6">
                  <reason.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {reason.title}
                </h3>
                <p className="text-gray-600">{reason.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default About;
