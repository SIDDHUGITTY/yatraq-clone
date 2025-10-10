"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ open, onClose, title, children, actions }) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative w-11/12 max-h-[90vh] overflow-y-auto md:w-3/4 lg:w-2/3 rounded-xl bg-white p-6 shadow-xl"
            initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-2xl font-bold text-red-500"
              aria-label="Close"
            >
              &times;
            </button>

            {title && <h3 className="mb-4 text-2xl font-bold">{title}</h3>}

            <div>{children}</div>

            {actions && <div className="mt-6 flex justify-between">{actions}</div>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
