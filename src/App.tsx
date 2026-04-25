/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Clock, MapPin, Star, ChevronRight, User, Phone, CheckCircle2, ChevronLeft } from 'lucide-react';

// --- Data Models ---
type ViewState = 'home' | 'date-time' | 'patient-form' | 'success';

interface AppState {
  view: ViewState;
  date: string | null;
  time: string | null;
  patientName: string;
  patientPhone: string;
}

// Generate Next 7 Days in Arabic
const generateDays = () => {
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    days.push({
      date: d,
      dayName: new Intl.DateTimeFormat('ar-EG', { weekday: 'long' }).format(d),
      dayNumber: d.getDate(),
      monthName: new Intl.DateTimeFormat('ar-EG', { month: 'short' }).format(d),
      fullString: d.toISOString().split('T')[0],
    });
  }
  return days;
};

const TIME_SLOTS = [
  '09:00 صباحاً', '09:30 صباحاً', '10:00 صباحاً', '10:30 صباحاً',
  '11:00 صباحاً', '11:30 صباحاً', '04:00 مساءً', '04:30 مساءً',
  '05:00 مساءً', '05:30 مساءً', '06:00 مساءً', '06:30 مساءً',
];

export default function App() {
  const [state, setState] = useState<AppState>({
    view: 'home',
    date: null,
    time: null,
    patientName: '',
    patientPhone: '',
  });

  const updateState = (updates: Partial<AppState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const iOSBlue = '#007AFF';

  // --- Screens ---

  const HomeScreen = () => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex flex-col h-full bg-white"
    >
      {/* Header */}
      <div className="pt-14 pb-2 px-6 bg-white">
        <h1 className="text-3xl font-bold text-gray-900">عيادتي</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        {/* Doctor Card */}
        <div className="flex items-start mb-8 bg-blue-50 p-4 rounded-2xl border border-blue-100">
          <div className="w-20 h-20 bg-blue-200 rounded-2xl overflow-hidden flex-shrink-0 flex items-center justify-center ml-4">
            <img src="https://ui-avatars.com/api/?name=أحمد+عبدالله&background=007AFF&color=fff&size=150" alt="Doctor" className="w-full h-full object-cover" />
          </div>
          <div className="text-right flex-grow">
            <h2 className="text-xl font-bold text-gray-900">د. أحمد عبد الله</h2>
            <p className="text-sm text-gray-500 mt-1">استشاري أمراض القلب والأوعية الدموية</p>
            <div className="flex items-center justify-end mt-2 text-amber-500 space-x-reverse space-x-1">
              <span className="text-xs text-gray-400 ml-1">(120 تقييم)</span>
              <span className="text-sm font-bold">4.9</span>
              <Star size={14} className="fill-current" />
            </div>
          </div>
        </div>

        {/* Info List */}
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 mb-6">
          <div className="flex items-center p-4 border-b border-gray-50">
            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-700 ml-3 shrink-0">
              <MapPin size={20} />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">الموقع</p>
              <p className="text-gray-500 text-xs mt-0.5">الرياض، مركز العناية الطبي</p>
            </div>
          </div>
          <div className="flex items-center p-4">
            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-700 ml-3 shrink-0">
              <Clock size={20} />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">ساعات العمل</p>
              <p className="text-gray-500 text-xs mt-0.5">من 09:00 ص إلى 07:00 م</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Sticky Action */}
      <div className="p-4 bg-white border-t border-gray-100 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
        <button
          onClick={() => updateState({ view: 'date-time' })}
          className="w-full bg-[#007AFF] text-white py-4 rounded-[18px] font-bold text-lg shadow-xl shadow-blue-200 active:scale-95 transition-transform"
        >
          حجز موعد جديد
        </button>
      </div>
    </motion.div>
  );

  const DateTimeScreen = () => {
    const days = generateDays();

    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        className="flex flex-col h-full bg-white"
      >
        {/* Navigation Bar */}
        <div className="pt-12 pb-4 px-6 bg-white flex items-center justify-between sticky top-0 z-10 mb-2 border-b border-gray-50">
          <button onClick={() => updateState({ view: 'home' })} className="h-10 px-4 rounded-full bg-[#F2F2F7] flex items-center justify-center text-gray-800 font-bold active:scale-95 transition-transform">
            <ChevronRight size={20} />
            <span className="mr-1 text-sm">رجوع</span>
          </button>
          <h2 className="text-lg font-bold">الموعد</h2>
          <div className="w-20"></div> {/* Placeholder for centering */}
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Date Selection */}
          <div className="mt-6 px-4">
            <h3 className="font-bold text-gray-900 text-lg mb-3">التاريخ</h3>
            <div className="flex gap-3 overflow-x-auto pb-4 hide-scrollbar">
              {days.map((d) => {
                const isSelected = state.date === d.fullString;
                return (
                  <button
                    key={d.fullString}
                    onClick={() => updateState({ date: d.fullString })}
                    className={`min-w-[70px] rounded-xl p-3 flex flex-col items-center justify-center transition-all ${
                      isSelected ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-200' : 'bg-[#F2F2F7] text-gray-800 font-medium'
                    }`}
                  >
                    <span className={`text-[10px] uppercase font-bold mb-1 ${isSelected ? 'text-blue-100' : 'text-gray-400'}`}>{d.monthName}</span>
                    <span className={`text-xl font-bold mb-1 ${isSelected ? 'text-white' : 'text-gray-900'}`}>{d.dayNumber}</span>
                    <span className={`text-xs block transform -translate-y-1 ${isSelected ? 'text-blue-100' : 'text-gray-500'}`}>{d.dayName}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Selection */}
          <div className="mt-4 px-4 pb-10">
            <h3 className="font-bold text-gray-900 text-lg mb-3">الوقت المتاح</h3>
            <div className="grid grid-cols-3 gap-3">
              {TIME_SLOTS.map((t) => {
                const isSelected = state.time === t;
                return (
                  <button
                    key={t}
                    onClick={() => updateState({ time: t })}
                    className={`py-3 rounded-xl text-sm transition-all ${
                      isSelected ? 'bg-blue-50 border border-blue-200 font-bold text-blue-700 shadow-sm' : 'border border-gray-100 font-medium text-gray-800'
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Sticky Action */}
        <div className="p-4 bg-white border-t border-gray-100 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
          <button
            onClick={() => updateState({ view: 'patient-form' })}
            disabled={!state.date || !state.time}
            className={`w-full font-bold text-lg py-4 rounded-[18px] transition-all ${
              state.date && state.time ? 'bg-[#007AFF] text-white shadow-xl shadow-blue-200 active:scale-95' : 'bg-gray-200 text-gray-400'
            }`}
          >
            متابعة
          </button>
        </div>
      </motion.div>
    );
  };

  const PatientFormScreen = () => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex flex-col h-full bg-white"
    >
      <div className="pt-12 pb-4 px-6 bg-white flex items-center justify-between sticky top-0 z-10 mb-2 border-b border-gray-50">
        <button onClick={() => updateState({ view: 'date-time' })} className="h-10 px-4 rounded-full bg-[#F2F2F7] flex items-center justify-center text-gray-800 font-bold active:scale-95 transition-transform">
          <ChevronRight size={20} />
          <span className="mr-1 text-sm">الموعد</span>
        </button>
        <h2 className="text-lg font-bold">بيانات المريض</h2>
        <div className="w-20"></div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        {/* Grouped Form List */}
        <h3 className="uppercase text-[11px] font-bold text-gray-400 mb-2 mr-4 tracking-wider">المعلومات الشخصية</h3>
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-8 text-sm shadow-sm">
          <div className="flex items-center px-4 py-4 border-b border-gray-50">
            <User size={20} className="text-gray-400 ml-3" />
            <input
              type="text"
              placeholder="الاسم الكامل"
              value={state.patientName}
              onChange={(e) => updateState({ patientName: e.target.value })}
              className="flex-1 bg-transparent border-none outline-none font-medium text-gray-900 placeholder:text-gray-400 placeholder:font-normal"
            />
          </div>
          <div className="flex items-center px-4 py-4">
            <Phone size={20} className="text-gray-400 ml-3" />
            <input
              type="tel"
              placeholder="رقم الهاتف (مثال: 05...)"
              value={state.patientPhone}
              onChange={(e) => updateState({ patientPhone: e.target.value })}
              className="flex-1 bg-transparent border-none outline-none font-medium text-gray-900 text-left placeholder:text-right placeholder:text-gray-400 placeholder:font-normal"
              dir="ltr"
            />
          </div>
        </div>

        {/* Summary Card */}
        <h3 className="uppercase text-[11px] font-bold text-gray-400 mb-2 mr-4 tracking-wider">ملخص الحجز</h3>
        <div className="bg-blue-50 rounded-2xl border border-blue-100 p-5 text-sm text-gray-800">
          <div className="flex justify-between mb-3 border-b border-blue-100 pb-3">
            <span className="text-blue-600 font-medium">التاريخ:</span>
            <span className="font-bold text-gray-900" dir="ltr">{state.date}</span>
          </div>
          <div className="flex justify-between mt-3">
            <span className="text-blue-600 font-medium">الوقت:</span>
            <span className="font-bold text-gray-900">{state.time}</span>
          </div>
        </div>
      </div>

      <div className="p-4 bg-white border-t border-gray-100 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
        <button
          onClick={() => updateState({ view: 'success' })}
          disabled={!state.patientName || !state.patientPhone}
          className={`w-full font-bold text-lg py-4 rounded-[18px] transition-all ${
            state.patientName && state.patientPhone ? 'bg-[#007AFF] text-white shadow-xl shadow-blue-200 active:scale-95' : 'bg-gray-200 text-gray-400'
          }`}
        >
          تأكيد الحجز
        </button>
      </div>
    </motion.div>
  );

  const SuccessScreen = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center h-full bg-white px-6 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.1 }}
      >
        <CheckCircle2 size={100} className="text-[#34C759] mx-auto mb-6" />
      </motion.div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">تم الحجز بنجاح!</h2>
      <p className="text-gray-500 mb-8">
        شكراً لك يا {state.patientName.split(' ')[0]}، تم تأكيد موعدك يوم {state.date} الساعة {state.time}.
      </p>
      
      <button
        onClick={() => {
          updateState({
            view: 'home',
            date: null,
            time: null,
            patientName: '',
            patientPhone: '',
          });
        }}
        className="w-full bg-blue-50 text-blue-700 font-bold text-lg py-4 rounded-[18px] active:scale-95 transition-transform"
      >
        العودة للرئيسية
      </button>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-0 sm:p-4 font-sans" dir="rtl">
      {/* Mobile App Container Simulator */}
      <div className="w-full max-w-[428px] h-[100dvh] sm:h-[850px] bg-black relative sm:rounded-[48px] sm:shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col sm:border-[10px] sm:border-black">
        
        {/* Fake iOS Notch for desktop preview */}
        <div className="hidden sm:block absolute top-0 inset-x-0 h-7 w-[40%] bg-black mx-auto rounded-b-3xl z-50"></div>
        
        {/* Fake iOS Status Bar items for desktop preview */}
        <div className="hidden sm:flex absolute top-1 inset-x-0 h-6 z-40 px-6 justify-between items-center text-xs font-semibold text-black mix-blend-difference pointer-events-none">
          <span>9:41</span>
          <div className="flex space-x-reverse space-x-1 border border-black/10 rounded-sm px-1">
            <div className="w-4 h-2 bg-black rounded-sm"></div>
          </div>
        </div>

        {/* Dynamic Screen Area */}
        <div className="flex-1 bg-[#f2f2f7] relative overflow-hidden">
          <AnimatePresence mode="popLayout" initial={false}>
            {state.view === 'home' && <HomeScreen key="home" />}
            {state.view === 'date-time' && <DateTimeScreen key="date-time" />}
            {state.view === 'patient-form' && <PatientFormScreen key="patient-form" />}
            {state.view === 'success' && <SuccessScreen key="success" />}
          </AnimatePresence>
        </div>

        {/* Fake iOS Home Indicator */}
        <div className="hidden sm:block absolute bottom-2 inset-x-0 h-1.5 w-1/3 bg-gray-900/20 mx-auto rounded-full z-50"></div>
      </div>
    </div>
  );
}
