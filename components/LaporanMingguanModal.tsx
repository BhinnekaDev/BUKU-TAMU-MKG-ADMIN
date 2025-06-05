"use client";

import React from "react";
import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import Button from "./Button";
import { Fragment } from "react";

interface LaporanMingguanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LaporanMingguanModal: React.FC<LaporanMingguanModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog
          open={isOpen}
          onClose={onClose}
          className="fixed inset-0 z-50 overflow-y-auto"
          as="div"
        >
          <div className="min-h-screen px-4 text-center">
            <div className="fixed inset-0 bg-opacity-30" />

            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="inline-block w-full max-w-3xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl"
            >
              <div className="flex justify-between items-start">
                <Dialog.Title
                  as="h3"
                  className="text-xl font-semibold text-gray-900"
                >
                  Laporan Mingguan
                </Dialog.Title>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              <div className="mt-4 text-sm text-gray-600 space-y-4">
                <p>
                  Laporan mingguan memberikan rangkuman data pengunjung selama
                  seminggu terakhir, tren kunjungan, dan perbandingan dengan
                  minggu sebelumnya untuk analisis lebih mendalam.
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    Total pengunjung minggu ini: <strong>354</strong>
                  </li>
                  <li>
                    Total pengunjung minggu lalu: <strong>298</strong>
                  </li>
                  <li>
                    Persentase peningkatan: <strong>+18.8%</strong>
                  </li>
                  <li>
                    Hari terpadat: <strong>Rabu</strong>
                  </li>
                  <li>
                    Hari paling sepi: <strong>Minggu</strong>
                  </li>
                </ul>
                <div className="mt-6">
                  {/* Placeholder untuk grafik tren mingguan */}
                  <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                    Grafik Tren Mingguan (placeholder)
                  </div>
                </div>
              </div>
              <div className="mt-6 text-right">
                <Button
                  onClick={onClose}
                  className="bg-blue-100 text-blue-700 hover:bg-blue-200"
                >
                  Tutup
                </Button>
              </div>
            </motion.div>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default LaporanMingguanModal;
