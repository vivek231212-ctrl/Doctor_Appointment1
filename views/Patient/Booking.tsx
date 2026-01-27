
import React, { useState } from 'react';
import { useGlobal } from '../../store';
import { OPDStatus } from '../../types';

export const Booking: React.FC<{ doctorId: string; onBack: () => void; onBooked: () => void }> = ({ doctorId, onBack, onBooked }) => {
  const { doctors, bookToken } = useGlobal();
  const doctor = doctors.find(d => d.id === doctorId);
  const [selectedDate, setSelectedDate] = useState(0);

  if (!doctor) return null;

  const handleBook = () => {
    const token = bookToken(doctorId);
    if (token) onBooked();
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      <div className="flex items-center justify-between px-6 py-5 bg-white shrink-0 sticky top-0 z-50">
        <button onClick={onBack} className="p-1 -ml-1 text-[#111827]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <h1 className="text-[20px] font-bold text-[#111827]">Confirm Booking</h1>
        <div className="w-8"></div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pt-6 pb-12 hide-scrollbar">
        {/* Mini Profile Card */}
        <div className="bg-[#F8FAFC] p-6 rounded-[36px] flex items-center gap-5 border border-[#F1F5F9] mb-10">
          <div className="w-[84px] h-[84px] rounded-[24px] overflow-hidden border-2 border-white shadow-sm shrink-0">
            <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1">
            <h2 className="text-[19px] font-black text-[#111827] tracking-tight">{doctor.name}</h2>
            <p className="text-[#0066FF] font-black text-[13px] uppercase tracking-wider mt-0.5">{doctor.specialty}</p>
            <p className="text-[#94A3B8] font-bold text-[12px] mt-1.5 leading-snug">{doctor.hospital}</p>
          </div>
        </div>

        {/* Date Selection */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6 px-1">
            <h3 className="text-[18px] font-black text-[#111827]">Appointment Date</h3>
            <span className="text-[13px] font-bold text-[#0066FF]">April 2024</span>
          </div>
          <div className="flex gap-3.5">
            {[0, 1, 2, 3].map(i => {
              const date = new Date();
              date.setDate(date.getDate() + i);
              const isActive = selectedDate === i;
              return (
                <button 
                  key={i} 
                  onClick={() => setSelectedDate(i)}
                  className={`flex-1 py-5 rounded-[24px] flex flex-col items-center border-2 transition-all duration-300 ${isActive ? 'bg-[#0066FF] border-[#0066FF] text-white shadow-xl shadow-blue-100' : 'bg-white border-[#F1F5F9] text-[#111827]'}`}
                >
                  <span className={`text-[10px] uppercase font-black tracking-widest mb-2 ${isActive ? 'text-white/70' : 'text-[#94A3B8]'}`}>
                    {date.toLocaleDateString('en-US', { weekday: 'short' })}
                  </span>
                  <span className="text-[22px] font-black tracking-tight">{date.getDate()}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Token Summary */}
        <div className="mb-10">
          <h3 className="text-[18px] font-black text-[#111827] mb-6 px-1">Token Details</h3>
          <div className="bg-[#F0F7FF] p-7 rounded-[36px] border-2 border-[#DBEAFE] relative overflow-hidden">
             <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-[#0066FF]/5 rounded-full blur-3xl" />
             <div className="flex justify-between items-center relative z-10">
               <div>
                 <p className="text-[#0066FF] font-black text-[15px] tracking-tight">Your Estimated Token</p>
                 <p className="text-[#64748B] text-[13px] font-bold mt-1">Expected wait: ~{doctor.avgConsultationTime} mins</p>
               </div>
               <div className="w-16 h-16 bg-white rounded-[22px] flex items-center justify-center shadow-xl shadow-blue-50">
                 <span className="text-[#0066FF] font-black text-[24px]">#</span>
               </div>
             </div>
          </div>
        </div>

        {/* Fee Information */}
        <div className="mb-12 px-1">
           <div className="flex justify-between items-center py-5 border-y border-[#F1F5F9]">
              <span className="text-[15px] font-bold text-[#64748B]">Consultation Charge</span>
              <span className="text-[18px] font-black text-[#111827]">${doctor.consultationFee.toFixed(2)}</span>
           </div>
        </div>

        {/* Action Button */}
        <div className="mt-auto">
          {doctor.currentOPDStatus === OPDStatus.CLOSED ? (
            <div className="bg-red-50 p-5 rounded-[24px] border border-red-100 mb-6">
               <p className="text-center text-red-600 font-black text-[14px] uppercase tracking-wider">OPD is currently closed</p>
            </div>
          ) : (
            <button 
              onClick={handleBook}
              className="w-full bg-[#0066FF] text-white py-5 rounded-[24px] font-black text-[18px] flex items-center justify-center gap-3 shadow-2xl shadow-blue-100 active:scale-[0.98] transition-all"
            >
              Confirm & Book Token
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
