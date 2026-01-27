
import React, { useState } from 'react';
import { useGlobal } from '../../store';
import { OPDStatus } from '../../types';

export const Booking: React.FC<{ doctorId: string; onBack: () => void; onBooked: () => void }> = ({ doctorId, onBack, onBooked }) => {
  const { doctors, bookToken, tokens } = useGlobal();
  const doctor = doctors.find(d => d.id === doctorId);
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<string | null>('10');

  if (!doctor) return null;

  const docTokens = tokens.filter(t => t.doctorId === doctorId);
  const nextTokenNum = docTokens.length + 1;

  const handleBook = () => {
    const token = bookToken(doctorId);
    if (token) onBooked();
  };

  const dates = [
    { day: 'TODAY', date: 21 },
    { day: 'MON', date: 22 },
    { day: 'TUE', date: 23 },
    { day: 'WED', date: 24 },
    { day: 'THU', date: 25 },
    { day: 'FRI', date: 26 },
  ];

  const morningSlots = [
    { token: '10', time: '09:30 AM' },
    { token: '11', time: '09:45 AM' },
    { token: '12', time: '10:00 AM' },
    { token: '13', time: '10:15 AM' },
    { token: '14', time: '10:30 AM', unavailable: true },
    { token: '15', time: '10:45 AM' },
  ];

  const afternoonSlots = [
    { token: '16', time: '02:00 PM' },
    { token: '17', time: '02:15 PM' },
    { token: '18', time: '02:30 PM' },
  ];

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Header */}
      <div className="flex items-center px-6 py-5 bg-white shrink-0 sticky top-0 z-50">
        <button onClick={onBack} className="p-1 -ml-1 text-[#111827]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <h1 className="flex-1 text-center mr-8 text-[20px] font-black text-[#111827]">Select Booking Time</h1>
      </div>

      <div className="flex-1 overflow-y-auto hide-scrollbar pb-32">
        {/* Doctor Card */}
        <div className="px-6 py-4">
          <div className="bg-white rounded-[28px] border border-gray-100 p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center gap-5">
            <div className="w-[100px] h-[100px] rounded-[24px] overflow-hidden shrink-0">
              <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-[20px] font-black text-[#111827] leading-tight">{doctor.name}</h2>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#0066FF">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <p className="text-[#64748B] text-[15px] font-bold mt-1">
                {doctor.specialty} • {doctor.experience} years exp.
              </p>
              <div className="flex items-center gap-4 mt-3">
                <div className="bg-[#EFF6FF] px-3 py-1 rounded-lg">
                  <span className="text-[#0066FF] text-[11px] font-black tracking-widest">LIVE</span>
                </div>
                <span className="text-[#0066FF] text-[14px] font-black">Next Token: #{nextTokenNum}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Select Date Section */}
        <div className="px-6 pt-6 pb-4">
          <h3 className="text-[20px] font-black text-[#111827] mb-5">Select Date</h3>
          <div className="flex gap-3.5 overflow-x-auto hide-scrollbar pb-2">
            {dates.map((d, i) => (
              <button 
                key={i}
                onClick={() => setSelectedDate(i)}
                className={`min-w-[72px] h-[92px] rounded-[18px] flex flex-col items-center justify-center transition-all border ${selectedDate === i ? 'bg-[#0066FF] border-[#0066FF] text-white shadow-xl shadow-blue-100' : 'bg-white border-gray-100 text-[#111827]'}`}
              >
                <span className={`text-[11px] font-black tracking-widest mb-2 ${selectedDate === i ? 'text-white/80' : 'text-[#94A3B8]'}`}>{d.day}</span>
                <span className="text-[22px] font-black">{d.date}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Available Slots Section */}
        <div className="px-6 pt-6">
          <h3 className="text-[20px] font-black text-[#111827]">Available Slots</h3>
          <p className="text-[#94A3B8] text-[14px] font-bold mt-1">Tokens available for morning session</p>

          {/* Morning Slots */}
          <div className="mt-8">
            <div className="flex items-center gap-2 mb-6">
              <svg className="text-[#0066FF]" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
              <h4 className="text-[#0066FF] text-[15px] font-black uppercase tracking-wider">Morning (09:00 AM - 12:00 PM)</h4>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {morningSlots.map(slot => (
                <button
                  key={slot.token}
                  disabled={slot.unavailable}
                  onClick={() => setSelectedSlot(slot.token)}
                  className={`py-4 rounded-[16px] border flex flex-col items-center justify-center transition-all ${selectedSlot === slot.token ? 'border-[#0066FF] bg-blue-50/20' : slot.unavailable ? 'bg-gray-50 border-gray-50 opacity-40 cursor-not-allowed' : 'border-gray-100 bg-white'}`}
                >
                  <span className={`text-[16px] font-black ${selectedSlot === slot.token ? 'text-[#0066FF]' : 'text-[#111827]'}`}>#{slot.token}</span>
                  <span className={`text-[11px] font-bold mt-1 ${selectedSlot === slot.token ? 'text-[#0066FF]/70' : 'text-[#94A3B8]'}`}>{slot.time}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Afternoon Slots */}
          <div className="mt-10 mb-10">
            <div className="flex items-center gap-2 mb-6">
               <svg className="text-[#64748B]" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17 18a5 5 0 0 0-10 0"/><line x1="12" y1="2" x2="12" y2="9"/><line x1="4.22" y1="10.22" x2="5.64" y2="11.64"/><line x1="1" y1="18" x2="3" y2="18"/><line x1="21" y1="18" x2="23" y2="18"/><line x1="18.36" y1="11.64" x2="19.78" y2="10.22"/><line x1="23" y1="22" x2="1" y2="22"/><path d="M8 6l4-4 4 4"/></svg>
               <h4 className="text-[#64748B] text-[15px] font-black uppercase tracking-wider">Afternoon (02:00 PM - 05:00 PM)</h4>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {afternoonSlots.map(slot => (
                <button
                  key={slot.token}
                  onClick={() => setSelectedSlot(slot.token)}
                  className={`py-4 rounded-[16px] border flex flex-col items-center justify-center transition-all ${selectedSlot === slot.token ? 'border-[#0066FF] bg-blue-50/20' : 'border-gray-100 bg-white'}`}
                >
                  <span className={`text-[16px] font-black ${selectedSlot === slot.token ? 'text-[#0066FF]' : 'text-[#111827]'}`}>#{slot.token}</span>
                  <span className={`text-[11px] font-bold mt-1 ${selectedSlot === slot.token ? 'text-[#0066FF]/70' : 'text-[#94A3B8]'}`}>{slot.time}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-6 rounded-b-[44px] z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-[#94A3B8] text-[10px] font-black uppercase tracking-widest mb-1">Total Fee</p>
            <p className="text-[26px] font-black text-[#111827]">${doctor.consultationFee.toFixed(2)}</p>
          </div>
          <div className="text-right">
            <p className="text-[#94A3B8] text-[10px] font-black uppercase tracking-widest mb-1">Booking For</p>
            <p className="text-[15px] font-black text-[#111827]">Today, 09:30 AM</p>
          </div>
        </div>
        <button 
          onClick={handleBook}
          className="w-full bg-[#0066FF] text-white py-5 rounded-[22px] font-black text-[18px] flex items-center justify-center gap-3 shadow-xl shadow-blue-100 active:scale-[0.98] transition-all"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
          </svg>
          Instant Token
        </button>
      </div>
    </div>
  );
};
