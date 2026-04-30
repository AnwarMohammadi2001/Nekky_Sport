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
import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

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

    try {
      const response = await axios.post(`${BASE_URL}/api/contact`, formData, {
        headers: { "Content-Type": "application/json" },
        timeout: 10000,
      });

      if (response.data.success) {
        toast.success(response.data.message || "پیام شما با موفقیت ارسال شد!");
        setIsSubmitted(true);

        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });

        // Hide success message after 5 seconds
        setTimeout(() => {
          setIsSubmitted(false);
        }, 5000);
      } else {
        toast.error(response.data.message || "خطا در ارسال پیام");
      }
    } catch (error) {
      console.error("Contact form error:", error);

      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.code === "ECONNABORTED") {
        toast.error("زمان درخواست به پایان رسید. لطفاً دوباره تلاش کنید.");
      } else {
        toast.error("خطا در ارسال پیام. لطفاً دوباره تلاش کنید.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: "تلفن",
      details: ["0784576164", "0748648401"],
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "ایمیل",
      details: ["info@nekysport.com"],
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "واتساپ",
      details: ["0748648401"],
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "آدرس",
      details: ["بین کوته سنگی و گولایی دواخانه مارکیت باختریان منزل دوم"],
    },
  ];

  const socialMedia = [
    { icon: <Facebook className="w-5 h-5" />, name: "Facebook", url: "#" },
    {
      icon: <Instagram className="w-5 h-5" />,
      name: "Instagram",
      url: "https://www.instagram.com/nekysport/",
    },
    { icon: <Twitter className="w-5 h-5" />, name: "Twitter", url: "#" },
    { icon: <MessageSquare className="w-5 h-5" />, name: "Telegram", url: "#" },
  ];

  return (
    <div className="min-h-screen mt-24 mb-20 md:mb-0 md:pt-[80px]" dir="rtl">
      {/* Main Content */}
      <div className="max-w-7xl px-5 mx-auto">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Contact Information */}
          <div className="bg-gray-200 rounded-md shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 pb-4 border-b">
              اطلاعات تماس
            </h2>

            <div className="space-y-5">
              {contactInfo.map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="p-3 bg-white text-red-600 rounded-lg shrink-0">
                    {item.icon}
                  </div>
                  <div className="w-full">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {item.title}
                    </h3>
                    <div className="flex flex-col gap-1">
                      {item.details.map((detail, idx) => (
                        <p key={idx} className="text-gray-700">
                          {detail}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Social Media */}
            <div className="mt-8 pt-4 flex items-center justify-between border-t border-gray-400">
              <h3 className="font-semibold text-gray-900">شبکه‌های اجتماعی</h3>
              <div className="flex gap-4">
                {socialMedia.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-12 h-12 bg-gray-100 hover:bg-red-600 hover:text-white rounded-full transition-colors duration-300"
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
                  از تماس شما سپاسگزاریم. ما در اسرع وقت با شما تماس خواهیم
                  گرفت.
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
                      className="w-full px-4 py-2.5 bg-white focus:outline-none rounded-md focus:ring-2 focus:ring-red-500 transition-all duration-300"
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
                      className="w-full px-4 py-2.5 bg-white focus:outline-none rounded-md focus:ring-2 focus:ring-red-500 transition-all duration-300"
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
                      className="w-full px-4 py-2.5 bg-white focus:outline-none rounded-md focus:ring-2 focus:ring-red-500 transition-all duration-300"
                      placeholder="شماره تماس"
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
                      className="w-full px-4 py-2.5 bg-white focus:outline-none rounded-md focus:ring-2 focus:ring-red-500 transition-all duration-300"
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
                    className="w-full px-4 py-2.5 bg-white focus:outline-none rounded-md focus:ring-2 focus:ring-red-500 transition-all duration-300 resize-none"
                    placeholder="پیام خود را اینجا بنویسید..."
                  />
                </div>

                <div>
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
      </div>

      {/* Google Maps */}
      <div className="mt-8 w-full h-[350px]">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3287.771182567933!2d69.11421037574705!3d34.508684793491405!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38d169000348e631%3A0x96725fdbe37e8424!2z2YbbjNqp24wg2LPZvtmI2LHYqiB8IE5la3kgU3BvcnQ!5e0!3m2!1sen!2s!4v1777538467022!5m2!1sen!2s"
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
