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
          "سعادت گروپ یک مجموعه تجارتی چندبخشی و در حال گسترش است که در عرصه‌های خدمات تخنیکی، تولیدی و تجارتی فعالیت می‌کند. این مجموعه با اتکا بر تجربه عملی، مدیریت منظم و دیدگاه توسعه‌محور، تلاش دارد خدمات و محصولات معیاری، باکیفیت و قابل اعتماد را مطابق با نیازهای بازار افغانستان عرضه نماید. ما باور داریم که رشد پایدار از صداقت، تعهد کاری و رضایت مشتری آغاز می‌شود؛ از همین‌رو، ایجاد روابط دوامدار و حرفه‌ای با مشتریان و همکاران تجارتی از اولویت‌های اساسی ما به شمار می‌رود.",
        ],
      },
      whyUs: {
        title: "چرا گروه سعادت؟",
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
              <div className="text-center flex flex-col items-center ">
                <img src="sdf.png" alt="" className="h-20 mb-2" />
                <h1 className="text-5xl md:text-3xl font-bold mb-4">
                  {currentContent.hero.title}
                </h1>
                <p className="text-xl md:text-xl text-red-600 mb-8 max-w-xl mx-auto">
                  {currentContent.hero.subtitle}
                </p>
              </div>
              <div className="flex items-center justify-center gap-x-5">
                <div className="border w-[200px] rounded-md flex flex-col items-center justify-center py-3 px-6 bg-gray-100">
                  <p>+100</p>
                  <p>محصول</p>
                </div>
                <div className="border w-[200px] rounded-md flex flex-col items-center justify-center py-3 px-6 bg-gray-100">
                  <p>+50</p>
                  <p>مشتری فعال</p>
                </div>
              </div>
            </div>
          </div>
          <div className=" py-10">
            <h2 className="text-2xl md:text-xl text-center font-bold text-gray-700 mb-8  border-blue-600 pr-4"></h2>
            <div className="text-center mb-12">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                بخش‌های فعالیت ما
              </h2>
              <div className="w-24 h-1 bg-red-600 mx-auto"></div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Section 1 */}
              <div className="bg-white shadow-md hover:shadow-xl transition duration-300 rounded-md p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  Kabul Color Copier
                </h3>
                <p className="text-gray-600 leading-7 text-justify">
                  بخش تخصصی فروش و خدمات تخنیکی دستگاه‌های فتوکاپی. در این بخش
                  خدمات فروش، نصب، ترمیم، سرویس و تأمین پرزه‌جات دستگاه‌های
                  فتوکاپی با معیارهای مسلکی ارائه می‌گردد. هدف ما فراهم‌سازی
                  راهکارهای مطمئن و مؤثر برای ادارات دولتی، شرکت‌های خصوصی،
                  مراکز تعلیمی و مطبعه‌ها می‌باشد. پشتیبانی سریع، دقت در اجرا و
                  مسئولیت‌پذیری، اساس فعالیت این بخش را تشکیل می‌دهد.
                </p>
              </div>

              {/* Section 2 */}
              <div className="bg-white shadow-md hover:shadow-xl transition duration-300 rounded-md p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-700 mb-3">
                  تولید اسکاچ و سیم ظرفشویی
                </h3>
                <p className="text-gray-600 leading-7 text-justify">
                  تولیدی سعادت به‌عنوان بخش تولیدی سعادت گروپ، با هدف حمایت از
                  تولید داخلی و کاهش وابستگی به محصولات وارداتی فعالیت می‌نماید.
                  این واحد با تمرکز بر کیفیت، دوام و قیمت رقابتی، تلاش دارد
                  محصولات مورد اعتماد بازار را عرضه نماید.
                </p>
              </div>

              {/* Section 3 */}
              <div className="bg-white shadow-md hover:shadow-xl transition duration-300 rounded-md p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-700 mb-3">
                  واردات و فروش موبایل و لوازم جانبی
                </h3>
                <p className="text-gray-600 leading-7 text-justify">
                  در بخش تجارتی، سعادت گروپ در زمینه واردات و فروش موبایل و
                  لوازم جانبی فعالیت داشته و با انتخاب تأمین‌کنندگان معتبر،
                  محصولات باکیفیت را به مشتریان عرضه می‌نماید. شفافیت در معاملات
                  و رضایت مشتری از اصول اساسی این بخش می‌باشد.
                </p>
              </div>
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

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-10">
          <div className="bg-gradient-to-br from-blue-50 to-white rounded-md p-8 shadow-lg">
            <div className="flex items-center gap-x-2 mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 text-cyan-800 mr-4">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                {currentContent.mission.title}
              </h3>
            </div>
            <p className="text-gray-700 leading-relaxed">
              {currentContent.mission.text}
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-white rounded-md p-8 shadow-lg">
            <div className="flex items-center gap-x-2 mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 text-cyan-800 mr-4">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                {currentContent.vision.title}
              </h3>
            </div>
            <p className="text-gray-700 leading-relaxed">
              {currentContent.vision.text}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;
