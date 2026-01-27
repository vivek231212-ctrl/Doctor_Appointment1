
import React from 'react';
import { Container } from '../components/Layout';

interface LandingProps {
  onSelectRole: (role: 'PATIENT' | 'DOCTOR') => void;
}

export const Landing: React.FC<LandingProps> = ({ onSelectRole }) => {
  return (
    <Container className="justify-center items-center h-full bg-white">
      <div className="flex flex-col items-center w-full max-w-sm px-4">
        {/* Logo Section */}
        <div className="w-24 h-24 bg-[#E8F1FF] rounded-full flex items-center justify-center mb-10">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 25C10 18 15 12 22 12C26 12 30 15 30 20C30 26 25 30 18 30C15 30 10 28 10 25ZM14 25C14 26 16 27 18 27C23 27 26 24 26 20C26 17 24 15 22 15C17 15 14 19 14 25Z" fill="#1A73E8"/>
            <path d="M18 12C18 10 20 8 22 8C24 8 26 10 26 12" stroke="#1A73E8" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </div>

        {/* Title Section */}
        <h1 className="text-[32px] font-bold text-[#111827] mb-3">MedToken</h1>
        <p className="text-[#64748B] text-center text-lg leading-snug mb-16 px-6">
          Fast, Simple & Secure Appointment Management
        </p>

        {/* Action Buttons */}
        <div className="w-full space-y-4">
          <button
            onClick={() => onSelectRole('PATIENT')}
            className="w-full bg-[#0066FF] text-white py-5 rounded-[20px] font-bold text-lg shadow-lg shadow-blue-200 active:scale-[0.98] transition-all"
          >
            I am a Patient
          </button>
          
          <button
            onClick={() => onSelectRole('DOCTOR')}
            className="w-full border-2 border-[#0066FF] text-[#0066FF] py-5 rounded-[20px] font-bold text-lg active:scale-[0.98] transition-all bg-white"
          >
            I am a Doctor
          </button>
        </div>
      </div>
    </Container>
  );
};
