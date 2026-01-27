
import React, { useState, useEffect } from 'react';
import { Header, Container, Button } from '../../components/Layout';
import { useGlobal } from '../../store';
import { Doctor, OPDStatus, TokenStatus } from '../../types';

export const DoctorDashboard: React.FC = () => {
  const { currentUser, updateDoctorOPD, tokens, advanceQueue, skipToken, holdToken, setAvgTime, logout } = useGlobal();
  const doc = currentUser as Doctor;
  const [consultationTime, setConsultationTime] = useState(doc.avgConsultationTime);
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [timer, setTimer] = useState(0);

  const docTokens = tokens.filter(t => t.doctorId === doc.id);
  const activeToken = docTokens.find(t => t.status === TokenStatus.IN_CONSULTATION);
  const queue = docTokens.filter(t => t.status === TokenStatus.WAITING).sort((a, b) => a.tokenNumber - b.tokenNumber);
  const completed = docTokens.filter(t => t.status === TokenStatus.COMPLETED).length;

  useEffect(() => {
    let interval: any;
    if (activeToken) {
      interval = setInterval(() => {
        setTimer(Math.floor((Date.now() - (activeToken.startTime || Date.now())) / 1000));
      }, 1000);
    } else {
      setTimer(0);
    }
    return () => clearInterval(interval);
  }, [activeToken]);

  const handleStatusChange = (status: OPDStatus) => {
    updateDoctorOPD(doc.id, status, broadcastMsg);
  };

  const handleUpdateBroadcast = () => {
    updateDoctorOPD(doc.id, doc.currentOPDStatus, broadcastMsg);
    alert("Broadcast updated!");
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <Header 
        title="Doctor Console" 
        rightAction={<button onClick={logout} className="p-2 text-red-500 font-bold text-sm">Logout</button>}
      />
      <Container className="p-0 gap-0">
        <div className="bg-white px-6 py-6 shadow-sm border-b border-gray-100">
          <div className="flex items-center gap-4 mb-6">
            <img src={doc.image} className="w-16 h-16 rounded-[24px] object-cover" />
            <div className="flex-1">
              <h2 className="text-xl font-black text-gray-900">{doc.name}</h2>
              <div className="flex items-center gap-2">
                 <span className={`w-2 h-2 rounded-full ${doc.currentOPDStatus === OPDStatus.ACTIVE ? 'bg-green-500' : 'bg-gray-300'}`} />
                 <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{doc.currentOPDStatus}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-2">
            <div className="bg-blue-50 p-5 rounded-[28px] border border-blue-100">
              <p className="text-blue-800 text-[10px] font-black uppercase mb-1 tracking-wider">Queue Length</p>
              <p className="text-3xl font-black text-blue-900">{queue.length}</p>
            </div>
            <div className="bg-green-50 p-5 rounded-[28px] border border-green-100">
              <p className="text-green-800 text-[10px] font-black uppercase mb-1 tracking-wider">Completed</p>
              <p className="text-3xl font-black text-green-900">{completed}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-8">
          {activeToken ? (
            <div className="bg-white rounded-[36px] p-8 shadow-xl shadow-gray-200 border border-gray-50 mb-8 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4">
                <span className="flex items-center gap-2 bg-red-50 text-red-600 px-3 py-1 rounded-full text-[10px] font-black uppercase animate-pulse">
                  Live Counter
                </span>
              </div>
              <p className="text-gray-400 text-xs font-bold uppercase mb-2 tracking-widest">Ongoing Consultation</p>
              <h3 className="text-6xl font-black text-gray-900 mb-6">#{activeToken.tokenNumber}</h3>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase mb-1">Time Elapsed</p>
                  <p className="text-2xl font-mono font-bold text-[#1A73E8]">{formatTime(timer)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400 font-bold uppercase mb-1">Avg Limit</p>
                  <p className="text-2xl font-mono font-bold text-gray-400">{doc.avgConsultationTime}:00</p>
                </div>
              </div>
              <Button onClick={() => advanceQueue(doc.id)} className="w-full">Next Patient</Button>
            </div>
          ) : (
             <div className="bg-[#1A73E8] rounded-[36px] p-8 shadow-xl shadow-blue-100 mb-8 text-center">
              <p className="text-blue-100 text-sm font-bold mb-4">No active consultation</p>
              <Button variant="secondary" className="w-full bg-white text-[#1A73E8]" onClick={() => advanceQueue(doc.id)}>
                Start Next Token
              </Button>
            </div>
          )}

          <div className="space-y-6">
            <h4 className="text-gray-900 font-black text-lg ml-1">OPD Controls</h4>
            
            <div className="bg-white p-6 rounded-[32px] border border-gray-100 space-y-4">
              <div className="flex gap-2">
                <Button variant={doc.currentOPDStatus === OPDStatus.ACTIVE ? 'primary' : 'outline'} className="flex-1 text-xs py-3 rounded-2xl" onClick={() => handleStatusChange(OPDStatus.ACTIVE)}>Start/Resume</Button>
                <Button variant={doc.currentOPDStatus === OPDStatus.PAUSED ? 'danger' : 'outline'} className="flex-1 text-xs py-3 rounded-2xl" onClick={() => handleStatusChange(OPDStatus.PAUSED)}>Pause (Break)</Button>
                <Button variant={doc.currentOPDStatus === OPDStatus.CLOSED ? 'secondary' : 'outline'} className="flex-1 text-xs py-3 rounded-2xl" onClick={() => handleStatusChange(OPDStatus.CLOSED)}>End Day</Button>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2 block">Set Average Time (min)</label>
                <div className="flex items-center gap-4">
                  <input 
                    type="range" min="5" max="30" step="5" 
                    value={consultationTime} 
                    onChange={(e) => {
                      const v = parseInt(e.target.value);
                      setConsultationTime(v);
                      setAvgTime(doc.id, v);
                    }}
                    className="flex-1 accent-[#1A73E8]"
                  />
                  <span className="font-black text-[#1A73E8] w-8">{consultationTime}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2 block">Broadcast Message</label>
                 <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="e.g. 15 min delay due to surgery"
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none"
                    value={broadcastMsg}
                    onChange={(e) => setBroadcastMsg(e.target.value)}
                  />
                  <button onClick={handleUpdateBroadcast} className="bg-gray-900 text-white px-4 rounded-xl text-xs font-bold">Update</button>
                 </div>
              </div>
            </div>

            <h4 className="text-gray-900 font-black text-lg ml-1">Upcoming Queue</h4>
            <div className="space-y-3">
              {queue.length === 0 ? (
                <p className="text-gray-400 text-center text-sm py-4 italic">The waiting list is empty</p>
              ) : queue.map(t => (
                <div key={t.id} className="bg-white p-4 rounded-2xl border border-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center font-black text-gray-600">#{t.tokenNumber}</span>
                    <span className="font-bold text-gray-900">Patient {t.id.slice(-4)}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => holdToken(t.id)} className="p-2 text-orange-500 hover:bg-orange-50 rounded-lg"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></button>
                    <button onClick={() => skipToken(t.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};
