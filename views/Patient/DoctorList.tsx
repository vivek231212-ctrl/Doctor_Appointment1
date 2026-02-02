
import React, { useState } from 'react';
import { useGlobal } from '../../store';
import { OPDStatus, TokenStatus } from '../../types';

export const DoctorList: React.FC<{ onSelect: (id: string) => void; onBook: (id: string) => void }> = ({ onSelect, onBook }) => {
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
    <div className="flex flex-col h-full bg-[#F8FAFC] relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-6 bg-white shrink-0">
        <button onClick={logout} className="p-1 text-gray-900">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </button>
        <h1 className="text-xl font-black text-[#111827]">Find a Doctor</h1>
        <button className="p-1 text-gray-900">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="21" y1="4" x2="14" y2="4"/><line x1="10" y1="4" x2="3" y2="4"/><circle cx="12" cy="4" r="2"/><line x1="21" y1="12" x2="16" y2="12"/><line x1="12" y1="12" x2="3" y2="12"/><circle cx="14" cy="12" r="2"/><line x1="21" y1="20" x2="12" y2="20"/><line x1="8" y1="20" x2="3" y2="20"/><circle cx="10" cy="20" r="2"/>
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pb-32 hide-scrollbar">
        {/* Search Bar */}
        <div className="px-6 py-2">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search by name or specialty" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-gray-100 rounded-[20px] py-4.5 pl-12 pr-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] focus:outline-none placeholder:text-[#94A3B8] text-gray-900 text-[15px]"
            />
            <svg className="absolute left-4.5 top-1/2 -translate-y-1/2 text-[#0066FF]" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </div>
        </div>

        {/* Categories */}
        <div className="px-6 py-4 overflow-x-auto whitespace-nowrap hide-scrollbar flex gap-3">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-7 py-3 rounded-full font-bold text-[15px] transition-all border ${selectedCategory === cat ? 'bg-[#0066FF] text-white border-[#0066FF]' : 'bg-white text-[#64748B] border-gray-100 shadow-sm'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Doctor Cards */}
        <div className="px-6 space-y-5 pt-2">
          {filteredDoctors.map(doc => {
            const docTokens = tokens.filter(t => t.doctorId === doc.id);
            const activeToken = docTokens.find(t => t.status === TokenStatus.IN_CONSULTATION);
            const isOpen = doc.currentOPDStatus === OPDStatus.ACTIVE;
            
            return (
              <div 
                key={doc.id}
                className="bg-white p-5 rounded-[28px] shadow-sm border border-gray-50 relative"
              >
                {/* Clickable Header Section (Avatar + Info) */}
                <div 
                  className="flex gap-4 cursor-pointer active:opacity-70 transition-opacity"
                  onClick={() => onSelect(doc.id)}
                >
                  {/* Avatar */}
                  <div className="shrink-0">
                    <div className="w-[86px] h-[86px] rounded-full overflow-hidden border-2 border-blue-50/50">
                      <img src={doc.image} alt={doc.name} className="w-full h-full object-cover" />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 pr-2">
                        <h4 className="font-black text-[#111827] text-[18px] leading-tight">{doc.name}</h4>
                        <p className="text-[#64748B] text-[14px] mt-1 font-bold">
                          {doc.specialty} • {doc.experience} years exp.
                        </p>
                      </div>
                      {/* Status Badge */}
                      <span className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[10px] font-black tracking-wider ${isOpen ? 'bg-[#F0FDF4] text-[#22C55E]' : 'bg-[#FFF7ED] text-[#F97316]'}`}>
                        <span className={`w-2 h-2 rounded-full ${isOpen ? 'bg-[#22C55E]' : 'bg-[#F97316]'}`} />
                        {isOpen ? 'OPEN' : 'BREAK'}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1.5 mt-2">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="#FACC15">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                      </svg>
                      <span className="text-[14px] font-black text-[#111827]">{doc.rating}</span>
                      <span className="text-[14px] text-[#94A3B8] font-bold">({doc.reviews} reviews)</span>
                    </div>
                  </div>
                </div>

                {/* Footer Section of Card */}
                <div className="mt-7 flex items-end justify-between">
                  <div className="flex flex-col">
                    {isOpen ? (
                      <>
                        <p className="text-[10px] font-black text-[#94A3B8] uppercase tracking-[0.1em] mb-1">SERVING</p>
                        <p className="text-[#0066FF] font-black text-[22px] leading-none">#{activeToken?.tokenNumber || (doc.id === 'doc1' ? '14' : '08')}</p>
                      </>
                    ) : (
                      <>
                        <p className="text-[10px] font-black text-[#94A3B8] uppercase tracking-[0.1em] mb-1">WAIT</p>
                        <p className="text-[#F97316] font-black text-[22px] leading-none">45m</p>
                      </>
                    )}
                  </div>
                  <button 
                    onClick={() => onBook(doc.id)}
                    className={`px-8 py-4 rounded-[16px] font-black text-[15px] transition-all active:scale-[0.98] ${isOpen ? 'bg-[#0066FF] text-white shadow-[0_6px_15px_-4px_rgba(0,102,255,0.4)]' : 'bg-[#F1F5F9] text-[#94A3B8]'}`}
                  >
                    Book Token
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating WhatsApp Button - Absolute to parent */}
      <button className="absolute bottom-[110px] right-6 w-16 h-16 bg-[#25D366] rounded-full shadow-xl shadow-green-100 flex items-center justify-center text-white active:scale-95 transition-all z-20">
        <svg width="34" height="34" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.634 1.437h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </button>

      {/* Bottom Navigation - Absolute to parent */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-50 h-[88px] px-10 flex items-center justify-between z-30 rounded-b-[48px]">
        <button className="flex flex-col items-center gap-1.5">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#0066FF">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8h5z"/>
          </svg>
          <span className="text-[11px] font-black text-[#0066FF]">Home</span>
        </button>
        <button className="flex flex-col items-center gap-1.5 opacity-40">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 20h10"/><path d="M9 15v5"/><path d="M15 15v5"/>
          </svg>
          <span className="text-[11px] font-black text-[#64748B]">Tokens</span>
        </button>
        <button className="flex flex-col items-center gap-1.5 opacity-40">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          <span className="text-[11px] font-black text-[#64748B]">History</span>
        </button>
        <button className="flex flex-col items-center gap-1.5 opacity-40">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
          <span className="text-[11px] font-black text-[#64748B]">Profile</span>
        </button>
      </div>
    </div>
  );
};
