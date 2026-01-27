
import React, { useEffect, useState } from 'react';
import { Header, Container } from '../../components/Layout';
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
    <div className="h-full flex flex-col">
      <Header title="My Tokens" onBack={onBack} />
      <Container className="items-center justify-center">
        <div className="bg-gray-100 p-8 rounded-full mb-6">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        </div>
        <p className="text-gray-500 font-medium">No active tokens found.</p>
        <button onClick={onBack} className="mt-4 text-[#1A73E8] font-bold">Book an Appointment</button>
      </Container>
    </div>
  );

  const eta = getETA(myToken);
  const progress = Math.max(0, 100 - (ahead * 10));

  return (
    <div className="flex flex-col h-full bg-white">
      <Header title="Live Tracking" onBack={onBack} />
      <Container className="p-0">
        <div className="bg-gradient-to-b from-blue-50 to-white px-6 pt-8 pb-12 flex flex-col items-center">
          <div className="text-center mb-10">
            <h2 className="text-gray-400 font-bold text-xs uppercase tracking-[0.2em] mb-2">Current Token</h2>
            <div className="relative">
               <div className="w-48 h-48 rounded-full border-[10px] border-white shadow-2xl shadow-blue-100 flex items-center justify-center bg-white">
                <span className="text-7xl font-black text-gray-900 tabular-nums">
                  {activeToken ? activeToken.tokenNumber : '--'}
                </span>
              </div>
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-[#1A73E8] text-white px-5 py-2 rounded-full font-bold text-sm shadow-lg">
                In Consultation
              </div>
            </div>
          </div>

          <div className="w-full bg-white rounded-[32px] p-6 shadow-xl shadow-gray-100 border border-gray-50">
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-gray-400 text-xs font-bold uppercase mb-1">Your Token</p>
                <p className="text-3xl font-black text-gray-900">#{myToken.tokenNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-xs font-bold uppercase mb-1">Estimated Wait</p>
                <p className={`text-3xl font-black ${eta === -1 ? 'text-orange-500' : 'text-[#1A73E8]'}`}>
                  {eta === -1 ? 'Paused' : `${eta}m`}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between text-xs font-bold text-gray-500">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-blue-500 rounded-full" />
                  {ahead} patients ahead
                </span>
                <span>{progress}% towards your turn</span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-6 bg-white flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Doctor Status</h3>
          <div className="bg-gray-50 p-6 rounded-[28px] border border-gray-100">
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
              <img src={doctor.image} className="w-14 h-14 rounded-2xl object-cover" />
              <div>
                <h4 className="font-bold text-gray-900">{doctor.name}</h4>
                <p className="text-xs text-[#1A73E8] font-bold">{doctor.specialty}</p>
              </div>
              <div className="ml-auto flex flex-col items-end">
                 <span className={`w-3 h-3 rounded-full ${doctor.currentOPDStatus === OPDStatus.ACTIVE ? 'bg-green-500' : 'bg-orange-500'} animate-pulse`} />
                 <span className="text-[10px] font-bold uppercase text-gray-400 mt-1">{doctor.currentOPDStatus}</span>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-2xl border-l-4 border-blue-500">
              <p className="text-xs text-gray-400 font-bold uppercase mb-1">Latest Update</p>
              <p className="text-sm font-medium text-gray-700 italic">
                {doctor.broadcastMessage || "OPD is running on time. Please reach 5 mins before your turn."}
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};
