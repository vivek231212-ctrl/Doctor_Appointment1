
import React, { useState } from 'react';
import { Header, Container, Button } from '../../components/Layout';
import { useGlobal } from '../../store';
import { OPDStatus } from '../../types';

export const Booking: React.FC<{ doctorId: string; onBack: () => void; onBooked: () => void }> = ({ doctorId, onBack, onBooked }) => {
  const { doctors, bookToken } = useGlobal();
  const doctor = doctors.find(d => d.id === doctorId);
  const [selectedDate, setSelectedDate] = useState(0);

  if (!doctor) return null;

  const handleBook = () => {
    const token = bookToken(doctorId);
    if (token) onBooked();
  };

  return (
    <div className="flex flex-col h-full">
      <Header title="Book Token" onBack={onBack} />
      <Container className="bg-gray-50 gap-6">
        <div className="bg-white p-6 rounded-[32px] shadow-sm flex flex-col items-center">
          <img src={doctor.image} className="w-24 h-24 rounded-[28px] object-cover mb-4 border-4 border-blue-50" />
          <h2 className="text-xl font-bold text-gray-900">{doctor.name}</h2>
          <p className="text-[#1A73E8] font-semibold text-sm mb-2">{doctor.specialty}</p>
          <p className="text-gray-400 text-xs text-center">{doctor.hospital}</p>
        </div>

        <div>
          <h3 className="text-gray-900 font-bold mb-4 ml-1">Select Date</h3>
          <div className="flex gap-3">
            {[0, 1, 2, 3].map(i => {
              const date = new Date();
              date.setDate(date.getDate() + i);
              const isActive = selectedDate === i;
              return (
                <button 
                  key={i} 
                  onClick={() => setSelectedDate(i)}
                  className={`flex-1 p-4 rounded-3xl flex flex-col items-center border-2 transition-all ${isActive ? 'bg-[#1A73E8] border-[#1A73E8] text-white shadow-lg shadow-blue-200' : 'bg-white border-gray-100 text-gray-900'}`}
                >
                  <span className={`text-[10px] uppercase font-bold mb-1 ${isActive ? 'text-blue-100' : 'text-gray-400'}`}>
                    {date.toLocaleDateString('en-US', { weekday: 'short' })}
                  </span>
                  <span className="text-lg font-bold">{date.getDate()}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1">
          <h3 className="text-gray-900 font-bold mb-4 ml-1">Token Status</h3>
          <div className="bg-blue-50 p-6 rounded-[32px] flex items-center justify-between border border-blue-100">
            <div>
              <p className="text-blue-800 font-bold text-lg">Next Available Token</p>
              <p className="text-blue-600 text-xs font-medium mt-1">Estimating wait time: ~{doctor.avgConsultationTime} mins</p>
            </div>
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-bold text-[#1A73E8] text-xl shadow-sm">
              #
            </div>
          </div>
        </div>

        <div className="mt-auto">
          {doctor.currentOPDStatus === OPDStatus.CLOSED ? (
            <p className="text-center text-red-500 font-bold text-sm mb-4">OPD is currently closed</p>
          ) : (
            <Button onClick={handleBook} className="w-full">
              Confirm Booking
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            </Button>
          )}
        </div>
      </Container>
    </div>
  );
};
