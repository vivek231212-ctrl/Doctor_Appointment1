
import React from 'react';
import { useGlobal } from '../../store';
import { TokenStatus } from '../../types';

interface DoctorProfileProps {
  doctorId: string;
  onBack: () => void;
  onBook: () => void;
}

export const DoctorProfile: React.FC<DoctorProfileProps> = ({ doctorId, onBack, onBook }) => {
  const { doctors, tokens } = useGlobal();
  const doc = doctors.find(d => d.id === doctorId);

  if (!doc) return null;

  const docTokens = tokens.filter(t => t.doctorId === doc.id);
  const activeToken = docTokens.find(t => t.status === TokenStatus.IN_CONSULTATION);
  const nextTokenNum = docTokens.length + 1;

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 bg-white shrink-0 sticky top-0 z-50">
        <button onClick={onBack} className="p-1 -ml-1 text-[#111827]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </button>
        <h1 className="text-[20px] font-bold text-[#111827]">Doctor Profile</h1>
        <div className="w-8"></div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Hero Section */}
        <div className="flex flex-col items-center pt-6 pb-8 px-6">
          <div className="relative">
            <div className="w-[144px] h-[144px] rounded-[36px] overflow-hidden border-4 border-white shadow-2xl shadow-blue-50">
              <img src={doc.image} alt={doc.name} className="w-full h-full object-cover" />
            </div>
            <div className="absolute bottom-2 right-2 w-5 h-5 rounded-full border-[3px] border-white bg-[#22C55E]" />
          </div>

          <h2 className="mt-6 text-[28px] font-black text-[#111827] tracking-tight">{doc.name}</h2>
          <div className="flex items-center gap-2 mt-2">
            <span className="bg-[#EFF6FF] text-[#0066FF] px-3.5 py-1.5 rounded-full text-[13px] font-black tracking-tight">
              {doc.specialty}
            </span>
            <span className="text-gray-300 font-medium">•</span>
            <span className="text-[#64748B] text-[14px] font-bold">{doc.hospital}</span>
          </div>
          <p className="mt-3 text-[#64748B] text-[14px] font-semibold italic opacity-80">
            {doc.experience}+ years of clinical excellence
          </p>
        </div>

        {/* Thick Divider */}
        <div className="h-2 w-full bg-[#F8FAFC]" />

        {/* Stats Section */}
        <div className="px-6 py-8 grid grid-cols-3 gap-4">
          <div className="bg-[#F8FAFC] rounded-[24px] p-5 flex flex-col items-start">
            <div className="flex items-center gap-1.5 mb-3">
               <svg width="15" height="15" viewBox="0 0 24 24" fill="#0066FF"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
               <span className="text-[10px] font-black text-[#94A3B8] uppercase tracking-widest">Patients</span>
            </div>
            <p className="text-[20px] font-black text-[#111827]">{doc.patientsCount}</p>
          </div>
          <div className="bg-[#F8FAFC] rounded-[24px] p-5 flex flex-col items-start">
            <div className="flex items-center gap-1.5 mb-3">
               <svg width="15" height="15" viewBox="0 0 24 24" fill="#FACC15"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
               <span className="text-[10px] font-black text-[#94A3B8] uppercase tracking-widest">Rating</span>
            </div>
            <p className="text-[20px] font-black text-[#111827]">{doc.rating}</p>
          </div>
          <div className="bg-[#F8FAFC] rounded-[24px] p-5 flex flex-col items-start">
            <div className="flex items-center gap-1.5 mb-3">
               <svg width="15" height="15" viewBox="0 0 24 24" fill="#0066FF"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
               <span className="text-[10px] font-black text-[#94A3B8] uppercase tracking-widest">Reviews</span>
            </div>
            <p className="text-[20px] font-black text-[#111827]">{doc.reviewsCount}</p>
          </div>
        </div>

        <div className="h-2 w-full bg-[#F8FAFC]" />

        {/* Fee Section */}
        <div className="px-6 py-8">
           <div className="flex justify-between items-center">
             <div>
               <h3 className="text-[18px] font-black text-[#111827]">Consultation Fee</h3>
               <p className="text-[14px] text-[#94A3B8] font-bold mt-1">Includes digital prescription</p>
             </div>
             <div className="text-right">
               <p className="text-[28px] font-black text-[#0066FF]">${doc.consultationFee.toFixed(2)}</p>
               <p className="text-[14px] text-[#94A3B8] font-bold line-through mt-0.5">${doc.originalFee.toFixed(2)}</p>
             </div>
           </div>
        </div>

        <div className="h-2 w-full bg-[#F8FAFC]" />

        {/* About Section */}
        <div className="px-6 py-8">
          <h3 className="text-[18px] font-black text-[#111827] mb-4">About Doctor</h3>
          <p className="text-[#64748B] leading-relaxed text-[15px] font-semibold">
            {doc.about}
          </p>
        </div>

        <div className="h-2 w-full bg-[#F8FAFC]" />

        {/* Book Button Section */}
        <div className="px-6 py-8 flex flex-col items-center">
          <button 
            onClick={onBook}
            className="w-full bg-[#0066FF] text-white py-5 rounded-[22px] font-black text-[18px] flex items-center justify-center gap-3 shadow-xl shadow-blue-100 active:scale-[0.98] transition-all"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M3 4h18a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm2 5v2h4V9H5zm10 0v2h4V9h-4zm-5 0v2h4V9h-4zM5 13v2h4v-2H5zm10 0v2h4v-2h-4zm-5 0v2h4v-2h-4z"/></svg>
            Book Token #{nextTokenNum}
          </button>
          <p className="mt-4 text-[11px] font-black text-[#94A3B8] uppercase tracking-widest text-center">
            Cancelable up to 2 hours before appointment
          </p>
        </div>

        <div className="h-2 w-full bg-[#F8FAFC]" />

        {/* Location Section */}
        <div className="px-6 py-8">
          <div className="flex gap-4 items-center">
            <div className="w-18 h-18 rounded-2xl overflow-hidden shrink-0 shadow-sm">
               <img src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=200&h=200" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <h4 className="text-[15px] font-black text-[#111827]">{doc.locationName}</h4>
              <p className="text-[13px] text-[#64748B] font-bold leading-snug mt-1">
                {doc.address}
              </p>
            </div>
            <button className="w-11 h-11 rounded-full bg-white flex items-center justify-center text-[#0066FF] shadow-[0_2px_12px_-4px_rgba(0,102,255,0.2)] border border-blue-50">
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>
        </div>

        {/* Live Tracking Card */}
        <div className="px-6 pb-12 pt-2">
          <div className="bg-[#F0F7FF] border-2 border-[#DBEAFE] rounded-[36px] p-7 shadow-sm">
             <div className="flex items-center gap-2.5 mb-8 justify-center">
               <div className="w-2.5 h-2.5 rounded-full bg-[#0066FF] shadow-[0_0_10px_rgba(0,102,255,0.5)] animate-pulse" />
               <span className="text-[12px] font-black text-[#0066FF] uppercase tracking-[0.2em]">Live Tracking</span>
             </div>
             
             <div className="flex items-center mb-8">
                <div className="flex-1 text-center">
                  <p className="text-[11px] font-black text-[#94A3B8] uppercase tracking-wider mb-2">Now Serving</p>
                  <p className="text-[36px] font-black text-[#111827] tracking-tight">#{activeToken?.tokenNumber || '08'}</p>
                </div>
                <div className="h-12 w-[1px] bg-[#DBEAFE]" />
                <div className="flex-1 text-center">
                  <p className="text-[11px] font-black text-[#0066FF] uppercase tracking-wider mb-2">Next Available</p>
                  <p className="text-[36px] font-black text-[#0066FF] tracking-tight">#{nextTokenNum}</p>
                </div>
             </div>

             <div className="flex items-center justify-center gap-2.5 pt-5 border-t border-[#DBEAFE]">
               <svg className="text-[#64748B]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
               <p className="text-[14px] font-bold text-[#64748B]">
                 Estimated wait time: <span className="text-[#111827] font-black">45 mins</span>
               </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
