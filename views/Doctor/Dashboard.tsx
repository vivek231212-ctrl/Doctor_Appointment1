
import React, { useState, useEffect } from 'react';
import { Container } from '../../components/Layout';
import { useGlobal } from '../../store';
import { Doctor, OPDStatus, TokenStatus } from '../../types';

export const DoctorDashboard: React.FC = () => {
  const { currentUser, updateDoctorOPD, tokens, advanceQueue, logout } = useGlobal();
  const doc = currentUser as Doctor;
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const docTokens = tokens.filter(t => t.doctorId === doc.id);
  const activeToken = docTokens.find(t => t.status === TokenStatus.IN_CONSULTATION);
  const queue = docTokens.filter(t => t.status === TokenStatus.WAITING).sort((a, b) => a.tokenNumber - b.tokenNumber);
  const completedCount = docTokens.filter(t => t.status === TokenStatus.COMPLETED).length;
  const totalCount = docTokens.length;
  const leftCount = queue.length + (activeToken ? 1 : 0);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0">
            <img src={doc.image} alt={doc.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="text-[17px] font-bold text-[#1E293B] leading-tight">{doc.name}</h1>
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${doc.currentOPDStatus === OPDStatus.ACTIVE ? 'bg-[#22C55E]' : 'bg-[#F97316]'}`} />
              <span className="text-[13px] text-[#64748B] font-medium">{doc.specialty} • {doc.currentOPDStatus === OPDStatus.ACTIVE ? 'Active' : 'On Break'}</span>
            </div>
          </div>
        </div>
        <button className="w-10 h-10 rounded-full bg-[#F1F5F9] flex items-center justify-center text-[#1E293B]">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-32">
        {/* Live OPD Session Card */}
        <div className="mt-4 bg-[#EBF5FF] border border-[#BFDBFE] rounded-[24px] p-6 shadow-sm mb-8">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[#1D4ED8] text-[11px] font-black uppercase tracking-widest mb-1.5">Live OPD Session</p>
              <h2 className="text-[22px] font-black text-[#1E293B]">Cabin No. {doc.cabinNo || '04'}</h2>
            </div>
            <div className="bg-white px-3 py-2 rounded-xl flex items-center gap-2 shadow-sm border border-[#DBEAFE]">
              <svg className="text-[#1A73E8]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span className="text-[13px] font-black text-[#1A73E8] uppercase">{formatTime(currentTime)}</span>
            </div>
          </div>
        </div>

        {/* Today's Overview */}
        <div className="mb-8">
          <h3 className="text-[19px] font-black text-[#1E293B] mb-5">Today's Overview</h3>
          <div className="flex gap-4">
            <div className="flex-1 bg-[#F1F5F9] rounded-[20px] p-4 border border-[#E2E8F0]">
              <p className="text-[#64748B] text-[10px] font-black uppercase tracking-wider mb-1">Total</p>
              <p className="text-[28px] font-black text-[#1E293B]">{totalCount || 45}</p>
            </div>
            <div className="flex-1 bg-[#F0FDF4] rounded-[20px] p-4 border border-[#DCFCE7]">
              <p className="text-[#166534] text-[10px] font-black uppercase tracking-wider mb-1">Done</p>
              <p className="text-[28px] font-black text-[#166534]">{completedCount || 28}</p>
            </div>
            <div className="flex-1 bg-[#FFF7ED] rounded-[20px] p-4 border border-[#FFEDD5]">
              <p className="text-[#9A3412] text-[10px] font-black uppercase tracking-wider mb-1">Left</p>
              <p className="text-[28px] font-black text-[#9A3412]">{leftCount || 17}</p>
            </div>
          </div>
        </div>

        {/* OPD Controls */}
        <div className="mb-8">
          <h3 className="text-[19px] font-black text-[#1E293B] mb-5">OPD Controls</h3>
          <div className="space-y-4">
            <button 
              onClick={() => updateDoctorOPD(doc.id, OPDStatus.ACTIVE)}
              className="w-full bg-[#1A73E8] text-white py-4.5 rounded-[20px] font-black text-lg flex items-center justify-center gap-3 shadow-lg shadow-blue-100 active:scale-[0.98] transition-all"
            >
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              </div>
              Start OPD Session
            </button>
            <button 
              onClick={() => updateDoctorOPD(doc.id, OPDStatus.PAUSED)}
              className="w-full bg-[#F1F5F9] text-[#1E293B] py-4.5 rounded-[20px] font-black text-lg flex items-center justify-center gap-3 border border-[#E2E8F0] active:scale-[0.98] transition-all"
            >
              <div className="w-6 h-6 rounded-full bg-[#1E293B]/10 flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
              </div>
              Take a Break
            </button>
          </div>
        </div>

        {/* Current Patient */}
        <div className="mb-8">
          <h3 className="text-[19px] font-black text-[#1E293B] mb-5">Current Patient</h3>
          <div className="bg-white border-2 border-[#1A73E8] rounded-[28px] p-6 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="w-[64px] h-[64px] bg-[#1A73E8] rounded-full flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-100">
                #{activeToken?.tokenNumber || '29'}
              </div>
              <div>
                <p className="text-[#64748B] text-[13px] font-medium mb-0.5">Inside Cabin</p>
                <h4 className="text-[20px] font-black text-[#1E293B]">Robert Fox</h4>
              </div>
            </div>
            <button className="w-10 h-10 rounded-full bg-[#EFF6FF] flex items-center justify-center text-[#1A73E8]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            </button>
          </div>
        </div>

        {/* Upcoming Queue */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-[19px] font-black text-[#1E293B]">Upcoming Queue</h3>
            <button className="text-[14px] font-bold text-[#1A73E8]">View All</button>
          </div>
          <div className="space-y-3">
            {queue.length > 0 ? queue.map((t, idx) => (
              <div key={t.id} className="bg-[#F8FAFC] rounded-[20px] p-4 flex items-center justify-between border border-[#F1F5F9]">
                <div className="flex items-center gap-4">
                  <span className="text-[16px] font-black text-[#94A3B8]">#{t.tokenNumber}</span>
                  <span className="text-[16px] font-bold text-[#1E293B]">Sarah Jenkins</span>
                </div>
                {idx === 0 ? (
                  <button 
                    onClick={() => advanceQueue(doc.id)}
                    className="bg-[#DBEAFE] text-[#1A73E8] px-5 py-2 rounded-xl font-black text-[13px] active:scale-95 transition-all"
                  >
                    Call Next
                  </button>
                ) : (
                  <span className="text-[13px] text-[#94A3B8] font-bold">In {15 * idx} mins</span>
                )}
              </div>
            )) : (
              <div className="bg-[#F8FAFC] rounded-[20px] p-4 flex items-center justify-between border border-[#F1F5F9]">
                <div className="flex items-center gap-4">
                  <span className="text-[16px] font-black text-[#94A3B8]">#30</span>
                  <span className="text-[16px] font-bold text-[#1E293B]">Sarah Jenkins</span>
                </div>
                <button 
                  onClick={() => advanceQueue(doc.id)}
                  className="bg-[#DBEAFE] text-[#1A73E8] px-5 py-2 rounded-xl font-black text-[13px]"
                >
                  Call Next
                </button>
              </div>
            )}
            {/* Fallback items to match design image exactly */}
            {queue.length < 2 && (
              <>
                <div className="bg-[#F8FAFC] rounded-[20px] p-4 flex items-center justify-between border border-[#F1F5F9]">
                  <div className="flex items-center gap-4">
                    <span className="text-[16px] font-black text-[#94A3B8]">#31</span>
                    <span className="text-[16px] font-bold text-[#1E293B]">Michael Chen</span>
                  </div>
                  <span className="text-[13px] text-[#94A3B8] font-bold">In 15 mins</span>
                </div>
                <div className="bg-[#F8FAFC] rounded-[20px] p-4 flex items-center justify-between border border-[#F1F5F9]">
                  <div className="flex items-center gap-4">
                    <span className="text-[16px] font-black text-[#94A3B8]">#32</span>
                    <span className="text-[16px] font-bold text-[#1E293B]">Elena Rodriguez</span>
                  </div>
                  <span className="text-[13px] text-[#94A3B8] font-bold">In 25 mins</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#F1F5F9] h-[84px] px-8 flex items-center justify-between z-30">
        <button className="flex flex-col items-center gap-1">
          <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="#1A73E8"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8h5z"/></svg>
          </div>
          <span className="text-[10px] font-black text-[#1A73E8] uppercase tracking-wider">Home</span>
        </button>
        <button className="flex flex-col items-center gap-1 opacity-40">
          <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          </div>
          <span className="text-[10px] font-black text-[#64748B] uppercase tracking-wider">Schedule</span>
        </button>
        <button className="flex flex-col items-center gap-1 opacity-40">
          <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <span className="text-[10px] font-black text-[#64748B] uppercase tracking-wider">History</span>
        </button>
        <button onClick={logout} className="flex flex-col items-center gap-1 opacity-40">
          <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="7" r="4"/><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/></svg>
          </div>
          <span className="text-[10px] font-black text-[#64748B] uppercase tracking-wider">Profile</span>
        </button>
      </div>
    </div>
  );
};
