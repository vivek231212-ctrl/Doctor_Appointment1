
import React from 'react';
import { Header, Container } from '../../components/Layout';
import { useGlobal } from '../../store';
import { OPDStatus } from '../../types';

export const DoctorList: React.FC<{ onSelect: (id: string) => void }> = ({ onSelect }) => {
  const { doctors, logout } = useGlobal();

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <Header 
        title="Find a Doctor" 
        rightAction={
          <button onClick={logout} className="p-2 text-gray-500 hover:text-red-500">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          </button>
        }
      />
      <div className="px-6 py-4">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search doctors, specialty..." 
            className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-12 pr-6 shadow-sm focus:outline-none focus:border-blue-400"
          />
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </div>
      </div>
      <Container className="pt-0">
        <h3 className="text-gray-900 font-bold text-lg mb-4">Nearby Specialists</h3>
        <div className="space-y-4">
          {doctors.map(doc => (
            <div 
              key={doc.id} 
              onClick={() => onSelect(doc.id)}
              className="bg-white p-4 rounded-3xl shadow-sm border border-gray-50 flex items-center gap-4 active:scale-[0.98] transition-all"
            >
              <img src={doc.image} alt={doc.name} className="w-16 h-16 rounded-2xl object-cover bg-gray-100" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-0.5">
                  <h4 className="font-bold text-gray-900">{doc.name}</h4>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${doc.currentOPDStatus === OPDStatus.ACTIVE ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {doc.currentOPDStatus === OPDStatus.ACTIVE ? 'Live' : 'Offline'}
                  </span>
                </div>
                <p className="text-xs text-[#1A73E8] font-semibold mb-1">{doc.specialty}</p>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-gray-500 flex items-center gap-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    {doc.avgConsultationTime}m avg.
                  </span>
                  <span className="text-[11px] text-gray-500 flex items-center gap-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    0.8km away
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
};
