import React from 'react'

const mega_Menu = ({ onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="fixed left-0 top-[55px] w-full min-h-[200px] z-40 bg-gray-300  border-indigo-100 shadow-lg"
      onMouseLeave={onClose}
    >
      <div className="mx-auto max-w-7xl px-6 py-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-4">
        {/* {renderContent()} */}
      </div>
    </motion.div>
  );
};

export default mega_Menu
