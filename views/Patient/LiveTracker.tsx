
import React, { useEffect, useState } from 'react';
import { useGlobal } from '../../store';
import { TokenStatus, OPDStatus } from '../../types';

export const LiveTracker: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { tokens, currentUser, doctors, getETA } = useGlobal();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTick(t => t + 1), 10000);
    return () => clearInterval(timer);
  }, []);

  const myToken = tokens.find(t => t.patientId === currentUser?.id && t.status !== TokenStatus.COMPLETED);
  const doctor = myToken ? doctors.find(d => d.id === myToken.doctorId) : null;
  const docTokens = myToken ? tokens.filter(t => t.doctorId === myToken.doctorId) : [];
  const activeToken = docTokens.find(t => t.status === TokenStatus.IN_CONSULTATION);
  const ahead = myToken ? docTokens.filter(t => t.status === TokenStatus.WAITING && t.tokenNumber < myToken.tokenNumber).length : 0;
  
  if (!myToken || !doctor) return (
    <div className="h-full flex flex-col bg-[#F8FAFC] relative">
      <div className="flex items-center px-6 py-5 bg-white shrink-0 border-b border-gray-100">
        <button onClick={onBack} className="p-1 -ml-1 text-[#111827]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <h1 className="flex-1 text-center mr-8 text-[20px] font-bold text-[#111827]">Live Tracking</h1>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center p-10">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-8">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        </div>
        <p className="text-[#64748B] font-bold text-lg mb-2">No active tokens found</p>
        <button onClick={onBack} className="text-[#0066FF] font-black uppercase text-[13px] tracking-widest mt-2">Book an Appointment</button>
      </div>
    </div>
  );

  const eta = getETA(myToken);
  const progress = Math.max(0, 100 - (ahead * 10));

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Header */}
      <div className="flex items-center px-6 py-5 bg-white shrink-0 sticky top-0 z-50">
        <button onClick={onBack} className="p-1 -ml-1 text-[#111827]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <h1 className="flex-1 text-center mr-8 text-[20px] font-bold text-[#111827]">Live Tracking</h1>
      </div>

      <div className="flex-1 overflow-y-auto pb-12 hide-scrollbar">
        {/* Animated Banner */}
        <div className="bg-gradient-to-b from-[#F0F7FF] to-white px-6 pt-10 pb-12 flex flex-col items-center">
          <div className="text-center mb-12">
            <h2 className="text-[#94A3B8] font-black text-[11px] uppercase tracking-[0.3em] mb-4">Now Serving</h2>
            <div className="relative">
               <div className="w-52 h-52 rounded-full border-[12px] border-white shadow-2xl shadow-blue-100 flex items-center justify-center bg-white">
                <span className="text-8xl font-black text-[#111827] tracking-tight tabular-nums">
                  {activeToken ? activeToken.tokenNumber : '--'}
                </span>
              </div>
              <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-[#0066FF] text-white px-6 py-2.5 rounded-full font-black text-[13px] shadow-xl shadow-blue-200 uppercase tracking-wider whitespace-nowrap">
                In Consultation
              </div>
            </div>
          </div>

          <div className="w-full bg-white rounded-[40px] p-8 shadow-2xl shadow-blue-50 border border-blue-50">
            <div className="flex justify-between items-end mb-8">
              <div>
                <p className="text-[#94A3B8] text-[11px] font-black uppercase tracking-widest mb-2">Your Token</p>
                <p className="text-[40px] font-black text-[#111827] leading-none tracking-tight">#{myToken.tokenNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-[#94A3B8] text-[11px] font-black uppercase tracking-widest mb-2">Est. Wait</p>
                <p className={`text-[32px] font-black ${eta === -1 ? 'text-[#F97316]' : 'text-[#0066FF]'} leading-none tracking-tight`}>
                  {eta === -1 ? 'Paused' : `${eta}m`}
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="h-3.5 w-full bg-[#F1F5F9] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#0066FF] rounded-full transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(0,102,255,0.4)]" 
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between text-[13px] font-black">
                <span className="flex items-center gap-2 text-[#64748B]">
                  <span className="w-2.5 h-2.5 bg-[#0066FF] rounded-full animate-pulse" />
                  {ahead} patients ahead
                </span>
                <span className="text-[#0066FF] uppercase tracking-wider">{progress}% done</span>
              </div>
            </div>
          </div>
        </div>

        {/* Doctor Context */}
        <div className="px-6 py-4">
          <h3 className="text-[19px] font-black text-[#111827] mb-6">Doctor Information</h3>
          <div className="bg-[#F8FAFC] p-6 rounded-[32px] border border-[#F1F5F9]">
            <div className="flex items-center gap-5 mb-8 pb-8 border-b border-[#E2E8F0]">
              <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-md">
                <img src={doctor.image} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <h4 className="font-black text-[#111827] text-[17px]">{doctor.name}</h4>
                <p className="text-[13px] text-[#0066FF] font-black uppercase tracking-wider mt-0.5">{doctor.specialty}</p>
              </div>
              <div className="flex flex-col items-end">
                 <span className={`w-3 h-3 rounded-full ${doctor.currentOPDStatus === OPDStatus.ACTIVE ? 'bg-[#22C55E]' : 'bg-[#F97316]'} shadow-sm animate-pulse`} />
                 <span className="text-[10px] font-black uppercase text-[#94A3B8] tracking-widest mt-2">{doctor.currentOPDStatus}</span>
              </div>
            </div>
            
            <div className="bg-white p-5 rounded-[24px] border-l-[6px] border-[#0066FF] shadow-sm">
              <p className="text-[11px] text-[#94A3B8] font-black uppercase tracking-widest mb-2">Latest Broadcast</p>
              <p className="text-[14px] font-bold text-[#334155] leading-relaxed italic">
                "{doctor.broadcastMessage || "OPD is running smoothly. Please arrive 10 minutes before your turn."}"
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
