import React, { useState } from "react";
import {
  Phone,
  Mail,
  MessageSquare,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Send,
  Clock,
  Headphones,
  CheckCircle,
  User,
} from "lucide-react";

const SupportPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log("Form submitted:", formData);
    setIsSubmitting(false);
    setIsSubmitted(true);

    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    }, 3000);
  };

  const contactInfo = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: "تلفن ",
      details: ["0764334224"],
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "ایمیل",
      details: ["saadatgroup1996@gmail.com"],
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "واتساپ",
      details: ["0789200605"],
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "آدرس",
      details: ["کابل،پل سوخته،مارکیت محمدی "],
    },
  ];

  const socialMedia = [
    { icon: <Facebook className="w-5 h-5" />, name: "Facebook", url: "#" },
    { icon: <Instagram className="w-5 h-5" />, name: "Instagram", url: "#" },
    { icon: <Twitter className="w-5 h-5" />, name: "Twitter", url: "#" },
    { icon: <MessageSquare className="w-5 h-5" />, name: "Telegram", url: "#" },
  ];
  const [branches] = useState([
    {
      name: "شعبه پرینتر و لوازم  جانبی آن",
      location: "کابل،پل سوخته،مارکیت محمدی ",
      responsible: "اسماعیل سعادت",
      phone: "0789200605",
      whatsapp: "0764334224",
    },
    {
      name: "شعبه موبایل و لوازم جانبی آن",
      location: "کابل , کوته سنگی مارکیت کفتان حٔدران",
      responsible: "محمد احمدی",
      phone: "0747107171",
      whatsapp: "0786865553",
    },
    {
      name: "شعبه فروشات اسکاچ",
      location: "فروشات اسکاچ بصورت آنلاین میباشد با ما به تماس شوید",
      responsible: "غلام یحیی صفری",
      phone: "0778294019",
      whatsapp: "0778294019",
    },
  ]);

  return (
    <div className="min-h-screen mt-24 mb-20 md:mb-0 md:pt-[80px] ">
      {/* Header Section */}
      <div className="my-10 max-w-7xl mx-auto px-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {branches.map((branch, index) => (
            <div
              key={index}
              className="flex flex-col items-start p-6 space-y-2 bg-gray-100 rounded-md shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <h3 className="font-bold text-lg text-center text-gray-900 mb-3">
                {branch.name}
              </h3>
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-5 h-5 text-red-600" />
                <p className="text-gray-700 text-sm">{branch.location}</p>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <User className="w-5 h-5 text-red-600" />
                <p className="text-gray-700 text-sm">{branch.responsible}</p>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Phone className="w-5 h-5 text-red-600" />
                <p className="text-gray-700 text-sm">{branch.phone}</p>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-red-600" />
                <p className="text-gray-700 text-sm">{branch.whatsapp}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Main Content */}
      <div className="max-w-7xl px-5 mx-auto">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Contact Information */}
          <div className="bg-gray-200 rounded-md shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 pb-4 border-b">
              اطلاعات تماس شعبه مرکزی
            </h2>

            <div className="space-y-5">
              {contactInfo.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start justify-center gap-4"
                >
                  <div className="p-3 bg-white text-red-600 rounded-lg">
                    {item.icon}
                  </div>
                  <div className="w-full r">
                    <h3 className="font-semibold  text-gray-900 mb-2">
                      {item.title}
                    </h3>
                    <div className="flex  items-center gap-x-10">
                      {item.details.map((detail, idx) => (
                        <p key={idx} className="text-gray-700 mb-1">
                          {detail}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Social Media */}
            <div className="mt-8 pt-4 flex items-center justify-between  border-t border-gray-400">
              <h3 className="font-semibold text-gray-900 ">شبکه‌های اجتماعی</h3>
              <div className="flex gap-4">
                {socialMedia.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    className="flex items-center justify-center w-12 h-12 bg-gray-100 hover:bg-cyan-800 hover:text-white rounded-full transition-colors duration-300"
                    aria-label={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gray-200 rounded-md shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 pb-4 border-b">
              فرم تماس با ما
            </h2>

            {isSubmitted ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  پیام شما ارسال شد!
                </h3>
                <p className="text-gray-600">
                  ما در اسرع وقت با شما تماس خواهیم گرفت.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      نام *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2.5  focus:outline-none rounded-md focus:ring-2 focus:ring-red-500  transition-all duration-300"
                      placeholder="نام خود را وارد کنید"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      ایمیل *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2.5  focus:outline-none rounded-md focus:ring-2 focus:ring-red-500  transition-all duration-300"
                      placeholder="example@email.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      شماره تماس
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5  focus:outline-none rounded-md focus:ring-2 focus:ring-red-500  transition-all duration-300"
                      placeholder="0912-345-6789"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      موضوع *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2.5  focus:outline-none rounded-md focus:ring-2 focus:ring-red-500  transition-all duration-300"
                      placeholder="موضوع پیام"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    پیام شما *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-2.5  focus:outline-none rounded-md focus:ring-2 focus:ring-red-500  transition-all duration-300 resize-none"
                    placeholder="پیام خود را اینجا بنویسید..."
                  />
                </div>

                <div className="">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full flex items-center justify-center gap-3 py-3 px-8 rounded-lg font-semibold transition-all duration-300 ${
                      isSubmitting
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-red-600 hover:bg-red-700 text-white hover:shadow-lg"
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        در حال ارسال...
                      </>
                    ) : (
                      <>
                        ارسال پیام
                        <Send className="w-5 h-5" />
                      </>
                    )}
                  </button>

                  <p className="text-sm text-gray-500 mt-4 text-center">
                    فیلدهای ستاره‌دار (*) الزامی هستند
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>{" "}
      <div className="mt-4 w-full h-[350px]">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3420.6140809160443!2d69.11995922425312!3d34.505434793664854!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38d168b69a4abc71%3A0xc6065aa84b6fd90a!2sKabul%20Copier!5e1!3m2!1sfa!2s!4v1771223178153!5m2!1sfa!2s"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Branch Location"
        ></iframe>
      </div>
  
    </div>
  );
};

export default SupportPage;
