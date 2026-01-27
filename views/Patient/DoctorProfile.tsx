
import React from 'react';
import { Header, Container } from '../../components/Layout';
import { useGlobal } from '../../store';
import { TokenStatus, OPDStatus } from '../../types';

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
      {/* Custom Header to match design */}
      <div className="flex items-center justify-between px-6 py-5 bg-white shrink-0 sticky top-0 z-50">
        <button onClick={onBack} className="p-2 -ml-2 text-gray-900 transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </button>
        <h1 className="text-xl font-bold text-gray-900">Doctor Profile</h1>
        <div className="w-10"></div> {/* Spacer for alignment */}
      </div>

      <div className="flex-1 overflow-y-auto pb-10">
        {/* Hero Section */}
        <div className="flex flex-col items-center pt-4 pb-6 px-6">
          <div className="relative">
            <div className="w-[140px] h-[140px] rounded-[32px] overflow-hidden border-4 border-white shadow-xl">
              <img src={doc.image} alt={doc.name} className="w-full h-full object-cover" />
            </div>
            {/* Status Indicator */}
            <div className="absolute bottom-1 right-1 w-6 h-6 rounded-full border-4 border-white bg-[#22C55E]" />
          </div>

          <h2 className="mt-6 text-[26px] font-black text-gray-900 tracking-tight">{doc.name}</h2>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="bg-[#EFF6FF] text-[#1A73E8] px-3 py-1 rounded-full text-[13px] font-bold">
              {doc.specialty}
            </span>
            <span className="text-gray-400 font-medium">•</span>
            <span className="text-[#64748B] text-[13px] font-semibold">{doc.hospital}</span>
          </div>
          <p className="mt-2.5 text-[#64748B] text-[14px] font-medium italic">
            {doc.experience}+ years of clinical excellence
          </p>
        </div>

        {/* Stats Section */}
        <div className="px-6 grid grid-cols-3 gap-3.5 mb-8">
          <div className="bg-[#F8FAFC] rounded-[24px] p-4 flex flex-col items-center">
            <div className="flex items-center gap-1.5 mb-1.5">
               <svg width="14" height="14" viewBox="0 0 24 24" fill="#1A73E8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
               <span className="text-[10px] font-black text-[#94A3B8] uppercase tracking-wider">Patients</span>
            </div>
            <p className="text-[18px] font-black text-[#1E293B]">{doc.patientsCount}</p>
          </div>
          <div className="bg-[#F8FAFC] rounded-[24px] p-4 flex flex-col items-center">
            <div className="flex items-center gap-1.5 mb-1.5">
               <svg width="14" height="14" viewBox="0 0 24 24" fill="#FACC15"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
               <span className="text-[10px] font-black text-[#94A3B8] uppercase tracking-wider">Rating</span>
            </div>
            <p className="text-[18px] font-black text-[#1E293B]">{doc.rating}</p>
          </div>
          <div className="bg-[#F8FAFC] rounded-[24px] p-4 flex flex-col items-center">
            <div className="flex items-center gap-1.5 mb-1.5">
               <svg width="14" height="14" viewBox="0 0 24 24" fill="#1A73E8"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
               <span className="text-[10px] font-black text-[#94A3B8] uppercase tracking-wider">Reviews</span>
            </div>
            <p className="text-[18px] font-black text-[#1E293B]">{doc.reviewsCount}</p>
          </div>
        </div>

        {/* Fee Section */}
        <div className="px-6 py-6 border-y border-[#F1F5F9] mb-8">
           <div className="flex justify-between items-center">
             <div>
               <h3 className="text-[17px] font-black text-[#1E293B]">Consultation Fee</h3>
               <p className="text-[13px] text-[#94A3B8] font-medium mt-0.5">Includes digital prescription</p>
             </div>
             <div className="text-right">
               <p className="text-[26px] font-black text-[#1A73E8]">${doc.consultationFee.toFixed(2)}</p>
               <p className="text-[13px] text-[#94A3B8] font-bold line-through">${doc.originalFee.toFixed(2)}</p>
             </div>
           </div>
        </div>

        {/* About Section */}
        <div className="px-6 mb-8">
          <h3 className="text-[18px] font-black text-[#1E293B] mb-3">About Doctor</h3>
          <p className="text-[#64748B] leading-relaxed text-[15px] font-medium">
            {doc.about}
          </p>
        </div>

        {/* Book Button Section */}
        <div className="px-6 mb-8">
          <button 
            onClick={onBook}
            className="w-full bg-[#1A73E8] text-white py-4.5 rounded-[22px] font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-blue-100 active:scale-[0.98] transition-all"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M3 4h18a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm2 5v2h4V9H5zm10 0v2h4V9h-4zm-5 0v2h4V9h-4zM5 13v2h4v-2H5zm10 0v2h4v-2h-4zm-5 0v2h4v-2h-4z"/></svg>
            Book Token #{nextTokenNum}
          </button>
          <p className="text-center mt-3 text-[10px] font-black text-[#94A3B8] uppercase tracking-wider">
            Cancelable up to 2 hours before appointment
          </p>
        </div>

        {/* Location Section */}
        <div className="px-6 mb-8">
          <div className="bg-[#F8FAFC] p-4 rounded-[28px] border border-[#F1F5F9] flex gap-4 items-center">
            <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0">
               <img src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=200&h=200" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <h4 className="text-[14px] font-black text-[#1E293B]">{doc.locationName}</h4>
              <p className="text-[12px] text-[#64748B] font-medium leading-tight mt-0.5">
                {doc.address}
              </p>
            </div>
            <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#1A73E8] shadow-sm border border-[#F1F5F9]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>
        </div>

        {/* Live Tracking Card */}
        <div className="px-6 mb-10">
          <div className="bg-[#F0F7FF] border border-[#BFDBFE] rounded-[32px] p-6 shadow-sm">
             <div className="flex items-center gap-2 mb-6 justify-center">
               <div className="w-2 h-2 rounded-full bg-[#1A73E8] animate-pulse" />
               <span className="text-[11px] font-black text-[#1A73E8] uppercase tracking-[0.15em]">Live Tracking</span>
             </div>
             
             <div className="flex items-center mb-6">
                <div className="flex-1 text-center">
                  <p className="text-[11px] font-black text-[#94A3B8] uppercase tracking-wider mb-1.5">Now Serving</p>
                  <p className="text-[32px] font-black text-[#1E293B]">#{activeToken?.tokenNumber || '08'}</p>
                </div>
                <div className="h-10 w-[1px] bg-[#BFDBFE]" />
                <div className="flex-1 text-center">
                  <p className="text-[11px] font-black text-[#1A73E8] uppercase tracking-wider mb-1.5">Next Available</p>
                  <p className="text-[32px] font-black text-[#1A73E8]">#{nextTokenNum}</p>
                </div>
             </div>

             <div className="flex items-center justify-center gap-2 pt-4 border-t border-[#BFDBFE]/30">
               <svg className="text-[#64748B]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
               <p className="text-[13px] font-bold text-[#64748B]">
                 Estimated wait time: <span className="text-[#1E293B] font-black">45 mins</span>
               </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
