import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Unlock, ShieldAlert, Loader2 } from "lucide-react";
import Swal from "sweetalert2";

const SecurityGate = ({ children, sectionName }) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);


  const handleUnlock = (e) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      if (pin === "1234") {
        setIsUnlocked(true);
      } else {
        Swal.fire({
          title: "رمز اشتباه",
          text: "شما اجازه دسترسی به این بخش را ندارید.",
          icon: "error",
          confirmButtonColor: "#000"
        });
      }
      setLoading(false);
    }, 800);
  };

  if (isUnlocked) return children;

  return (
    <div className="flex items-center justify-center min-h-[400px] bg-gray-50 rounded-md border-2 border-dashed border-gray-200">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-md w-full p-8 bg-white rounded-md shadow-xl text-center"
      >
        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldAlert size={32} />
        </div>
        <h2 className="text-xl font-black text-gray-900 mb-2">بخش محافظت شده</h2>
        <p className="text-sm text-gray-500 mb-6">
          ورود به بخش <span className="font-bold text-black ">{sectionName}</span> نیاز به رمز عبور  دارد.
        </p>
        
        <form onSubmit={handleUnlock} className="space-y-4">
          <div className="relative">
            <Lock className="absolute right-3 top-3 text-gray-400" size={20} />
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="رمز عبور خود را وارد کنید..."
              className="w-full pr-10 pl-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-black outline-none text-center "
              autoFocus
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-black text-white rounded-md font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition shadow-lg"
          >
            {loading ? <Loader2 className="animate-spin" /> : <><Unlock size={18}/> باز کردن دسترسی</>}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default SecurityGate;