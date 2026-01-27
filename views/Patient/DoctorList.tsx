
import React, { useState } from 'react';
import { Container } from '../../components/Layout';
import { useGlobal } from '../../store';
import { OPDStatus, TokenStatus } from '../../types';

export const DoctorList: React.FC<{ onSelect: (id: string) => void }> = ({ onSelect }) => {
  const { doctors, tokens, logout } = useGlobal();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Pediatrician', 'Cardiologist', 'Dermatologist', 'Orthopedic'];

  const filteredDoctors = doctors.filter(doc => {
    const matchesCategory = selectedCategory === 'All' || doc.specialty === selectedCategory;
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          doc.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-6 bg-white shrink-0">
        <button onClick={logout} className="p-2 -ml-2 text-gray-900 transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </button>
        <h1 className="text-xl font-bold text-gray-900">Find a Doctor</h1>
        <button className="p-2 -mr-2 text-gray-900">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="21" y1="4" x2="14" y2="4"/><line x1="10" y1="4" x2="3" y2="4"/><circle cx="12" cy="4" r="2"/><line x1="21" y1="12" x2="16" y2="12"/><line x1="12" y1="12" x2="3" y2="12"/><circle cx="14" cy="12" r="2"/><line x1="21" y1="20" x2="12" y2="20"/><line x1="8" y1="20" x2="3" y2="20"/><circle cx="10" cy="20" r="2"/>
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pb-24">
        {/* Search Bar */}
        <div className="px-6 py-2">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search by name or specialty" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#E2E8F0] rounded-[20px] py-4 pl-12 pr-6 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-100 placeholder:text-[#94A3B8] text-gray-900"
            />
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1A73E8]" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </div>
        </div>

        {/* Categories */}
        <div className="px-6 py-4 overflow-x-auto whitespace-nowrap scrollbar-hide flex gap-3">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-3 rounded-[16px] font-semibold text-sm transition-all ${selectedCategory === cat ? 'bg-[#1A73E8] text-white' : 'bg-white text-[#64748B] border border-[#E2E8F0]'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Doctor Cards */}
        <div className="px-6 space-y-4 pt-2">
          {filteredDoctors.map(doc => {
            const docTokens = tokens.filter(t => t.doctorId === doc.id);
            const activeToken = docTokens.find(t => t.status === TokenStatus.IN_CONSULTATION);
            
            return (
              <div 
                key={doc.id}
                className="bg-white p-5 rounded-[28px] shadow-sm border border-[#F1F5F9] relative overflow-hidden"
              >
                <div className="flex gap-4">
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <div className="w-[84px] h-[84px] rounded-full overflow-hidden border-2 border-white shadow-md">
                      <img src={doc.image} alt={doc.name} className="w-full h-full object-cover" />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-[#1E293B] text-[17px]">{doc.name}</h4>
                      {/* Status Badge */}
                      <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${doc.currentOPDStatus === OPDStatus.ACTIVE ? 'bg-[#F0FDF4] text-[#22C55E]' : 'bg-[#FFF7ED] text-[#F97316]'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${doc.currentOPDStatus === OPDStatus.ACTIVE ? 'bg-[#22C55E]' : 'bg-[#F97316]'}`} />
                        {doc.currentOPDStatus === OPDStatus.ACTIVE ? 'Open' : 'On Break'}
                      </span>
                    </div>
                    <p className="text-[#64748B] text-sm font-medium mb-1.5">
                      {doc.specialty} • {doc.experience} years exp.
                    </p>
                    <div className="flex items-center gap-1">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="#FACC15" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                      <span className="text-[13px] font-bold text-[#1E293B]">{doc.rating}</span>
                      <span className="text-[13px] text-[#94A3B8]">({doc.reviews} reviews)</span>
                    </div>
                  </div>
                </div>

                {/* Footer Section of Card */}
                <div className="mt-6 flex items-center justify-between border-t border-[#F1F5F9] pt-4">
                  <div>
                    {doc.currentOPDStatus === OPDStatus.ACTIVE ? (
                      <>
                        <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-0.5">Current Token</p>
                        <p className="text-[#1A73E8] font-black text-xl">#{activeToken?.tokenNumber || '08'}</p>
                      </>
                    ) : (
                      <>
                        <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-0.5">Est. Wait</p>
                        <p className="text-[#F97316] font-black text-xl">45 mins</p>
                      </>
                    )}
                  </div>
                  <button 
                    onClick={() => onSelect(doc.id)}
                    className={`px-8 py-3.5 rounded-[18px] font-bold text-sm transition-all active:scale-[0.98] ${doc.currentOPDStatus === OPDStatus.ACTIVE ? 'bg-[#1A73E8] text-white shadow-lg shadow-blue-100' : 'bg-[#F1F5F9] text-[#94A3B8]'}`}
                  >
                    Book Token
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating WhatsApp Button */}
      <button className="fixed bottom-24 right-6 w-14 h-14 bg-[#22C55E] rounded-full shadow-lg shadow-green-100 flex items-center justify-center text-white active:scale-95 transition-all z-20">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-11.7 8.5 8.5 0 0 1 7.6 4.9L22 12l-1-.5z"/></svg>
      </button>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#F1F5F9] h-[84px] px-6 flex items-center justify-between z-30">
        <button className="flex flex-col items-center gap-1.5 px-3">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#1A73E8" stroke="none"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          <span className="text-[10px] font-bold text-[#1A73E8]">Home</span>
        </button>
        <button className="flex flex-col items-center gap-1.5 px-3">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="11" rx="2" ry="2"/><path d="M7 20h10"/><path d="M9 15v5"/><path d="M15 15v5"/></svg>
          <span className="text-[10px] font-bold text-[#94A3B8]">Tokens</span>
        </button>
        <button className="flex flex-col items-center gap-1.5 px-3">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          <span className="text-[10px] font-bold text-[#94A3B8]">History</span>
        </button>
        <button className="flex flex-col items-center gap-1.5 px-3">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <span className="text-[10px] font-bold text-[#94A3B8]">Profile</span>
        </button>
      </div>
    </div>
  );
};
