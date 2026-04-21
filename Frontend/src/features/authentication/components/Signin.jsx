import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  Loader,
  Shield,
  KeyRound,
  Building2,
  ChevronRight,
  Sparkles,
  Eye,
  EyeOff,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signIn, clearUserError } from "../../../state/userSlice/userSlice";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(clearUserError());
  }, [dispatch]);

  useEffect(() => {
    if (currentUser) {
      navigate("/dashboard");
    }
  }, [currentUser, navigate]);

  const handleSignin = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    dispatch(signIn({ email, password }));
  };

  return (
    <div className="w-full h-screen overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-950">
        {/* Geometric Pattern */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute border border-slate-500/20"
              style={{
                width: Math.random() * 200 + 50,
                height: Math.random() * 200 + 50,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                borderRadius: Math.random() > 0.5 ? "50%" : "20%",
              }}
              animate={{
                x: [0, Math.random() * 40 - 20],
                y: [0, Math.random() * 40 - 20],
                rotate: [0, 360],
              }}
              transition={{
                duration: Math.random() * 20 + 20,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          ))}
        </div>

        {/* Floating Particles */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full h-full flex items-center justify-center p-4">
        {/* Left Side - Branding */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden lg:block flex-1 max-w-2xl px-12"
        >
          <div className="space-y-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="inline-flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-slate-800/40 to-slate-900/40 backdrop-blur-sm border border-slate-700/50"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  سعادت گروپ
                </h1>
                <p className="text-slate-400 text-sm mt-1">
                  سیستم مدیریت اختصاصی
                </p>
              </div>
            </motion.div>

            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-5xl font-bold text-white leading-tight"
              >
                سیستم مدیریتی
                <br />
                <span className="text-cyan-300">سعادت</span> گروپ
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="text-slate-300 text-lg max-w-xl"
              >
                دسترسی امن به پنل مدیریتی پیشرفته سعادت گروپ
              </motion.div>
            </div>

            {/* Features List */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="grid grid-cols-2 gap-4 mt-12"
            >
              {[
                { icon: Shield, text: "احراز هویت دو مرحله‌ای" },
                { icon: Sparkles, text: "داشبورد پیشرفته" },
                { icon: KeyRound, text: "دسترسی سطح‌بندی شده" },
                { icon: Lock, text: "رمزنگاری پیشرفته" },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 + index * 0.1 }}
                  className="flex items-center gap-3 p-4 rounded-xl bg-slate-800/30 backdrop-blur-sm border border-slate-700/30 hover:border-cyan-500/30 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-cyan-400" />
                  </div>
                  <span className="text-slate-300 text-sm">{item.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Right Side - Login Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="w-full max-w-md"
        >
          {/* Form Container */}
          <div className="relative">
            {/* Glow Effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-600/20 rounded-3xl blur-2xl"></div>

            {/* Glass Card */}
            <div className="relative bg-gradient-to-b from-slate-900/80 to-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden">
              {/* Form Header */}
              <div className="p-8 border-b border-slate-700/50">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                    <Lock className="w-6 h-6 text-white" />
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      مدیریت ورود
                    </h2>
                    <p className="text-slate-400 text-sm">
                      دسترسی محدود به کاربران مجاز
                    </p>
                  </div>
                </div>
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 backdrop-blur-sm"
                    >
                      <p className="text-red-300 text-sm text-center">
                        {error}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Form */}
              <div className="p-8">
                <form onSubmit={handleSignin} className="space-y-6">
                  {/* Email Field */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <label className="block text-sm font-medium text-slate-400 mb-2">
                      ایمیل مدیریتی
                    </label>
                    <div
                      className={`relative transition-all duration-300 ${focusedField === "email" ? "ring-2 ring-cyan-500/50 ring-offset-2 ring-offset-slate-900 rounded-lg" : ""}`}
                    >
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <Mail
                          className={`w-5 h-5 transition-colors ${focusedField === "email" ? "text-cyan-400" : "text-slate-500"}`}
                        />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setFocusedField("email")}
                        onBlur={() => setFocusedField(null)}
                        placeholder="admin@saadatgroup.com"
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3.5 pr-12 pl-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 transition-all duration-300"
                        dir="ltr"
                      />
                    </div>
                  </motion.div>

                  {/* Password Field */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <label className="block text-sm font-medium text-slate-400 mb-2">
                      رمز عبور
                    </label>
                    <div
                      className={`relative transition-all duration-300 ${focusedField === "password" ? "ring-2 ring-cyan-500/50 ring-offset-2 ring-offset-slate-900 rounded-lg" : ""}`}
                    >
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <KeyRound
                          className={`w-5 h-5 transition-colors ${focusedField === "password" ? "text-cyan-400" : "text-slate-500"}`}
                        />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => setFocusedField("password")}
                        onBlur={() => setFocusedField(null)}
                        placeholder="••••••••"
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3.5 pr-24 pl-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 transition-all duration-300"
                        dir="ltr"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </motion.div>

                  {/* Submit Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onHoverStart={() => setIsHovered(true)}
                      onHoverEnd={() => setIsHovered(false)}
                      type="submit"
                      disabled={loading}
                      className="w-full relative overflow-hidden rounded-xl py-4 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-700 text-white font-bold text-lg shadow-lg hover:shadow-xl hover:shadow-cyan-500/25 transition-all duration-500 group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      <div className="relative flex items-center justify-center gap-3">
                        {loading ? (
                          <>
                            <Loader className="w-5 h-5 animate-spin" />
                            <span>در حال ورود...</span>
                          </>
                        ) : (
                          <>
                            <span>ورود به پنل مدیریت</span>
                            <motion.div
                              animate={{ x: isHovered ? -5 : 0 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              <ChevronRight className="w-5 h-5 rotate-180" />
                            </motion.div>
                          </>
                        )}
                      </div>
                    </motion.button>
                  </motion.div>

                  {/* Forgot Password Link */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="pt-6 border-t border-slate-700/50"
                  >
                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => navigate("/forgot-password")}
                        className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors inline-flex items-center gap-1"
                      >
                        <KeyRound className="w-4 h-4" />
                        بازیابی رمز عبور مدیریتی
                      </button>
                    </div>
                  </motion.div>
                </form>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
