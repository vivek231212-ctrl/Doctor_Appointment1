
import React, { useState } from 'react';
import { Container } from '../components/Layout';
import { useGlobal } from '../store';

interface LoginProps {
  initialRole: 'PATIENT' | 'DOCTOR';
  onBack: () => void;
}

export const Login: React.FC<LoginProps> = ({ initialRole, onBack }) => {
  const { login } = useGlobal();
  const [phone, setPhone] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [authMode, setAuthMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');

  const handleContinue = () => {
    if (phone.length >= 10) {
      if (!isOtpSent) setIsOtpSent(true);
      else login(phone, initialRole);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center px-6 py-5 border-b border-gray-50">
        <button onClick={onBack} className="p-2 -ml-2 text-gray-900 transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </button>
        <h1 className="flex-1 text-center mr-6 text-xl font-bold text-gray-900">
          {initialRole === 'PATIENT' ? 'Patient Login' : 'Doctor Login'}
        </h1>
      </div>

      <Container className="pt-8 items-center bg-[#F9FAFB]">
        <div className="flex flex-col items-center w-full max-w-sm">
          
          {/* Circular Medical Icon */}
          <div className="w-24 h-24 bg-[#E8F1FF] rounded-full flex items-center justify-center mb-8">
            <div className="w-14 h-14 bg-[#1A73E8] rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8" />
                <path d="M18 12v8a2 2 0 0 1-2 2" />
                <path d="M20 12V8a2 2 0 0 0-2-2h-4V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2H4a2 2 0 0 0-2 2v4" />
                <path d="M12 12v-2" />
                <path d="M12 16v-2" />
                <path d="M10 14h4" />
                <rect x="8" y="6" width="8" height="4" rx="1" />
                <path d="M12 11v6m-3-3h6" stroke="white" strokeWidth="2.5" />
              </svg>
            </div>
          </div>

          <h2 className="text-[28px] font-bold text-gray-900 mb-2 text-center tracking-tight">Your Health, Simplified.</h2>
          <p className="text-[#64748B] text-center mb-10 leading-relaxed px-4 text-base">
            Manage appointments and track tokens in real-time.
          </p>

          {/* Login/Signup Toggle */}
          <div className="w-full bg-[#E5E7EB] p-1 rounded-[14px] flex mb-8">
            <button
              onClick={() => setAuthMode('LOGIN')}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-[12px] transition-all ${authMode === 'LOGIN' ? 'bg-white shadow-sm text-gray-900' : 'text-[#6B7280]'}`}
            >
              Login
            </button>
            <button
              onClick={() => setAuthMode('SIGNUP')}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-[12px] transition-all ${authMode === 'SIGNUP' ? 'bg-white shadow-sm text-gray-900' : 'text-[#6B7280]'}`}
            >
              Sign Up
            </button>
          </div>

          {/* Input Section */}
          <div className="w-full space-y-5 mb-8">
            <div className="flex flex-col gap-2.5">
              <label className="text-sm font-semibold text-gray-900 ml-1">Mobile Number</label>
              <div className="flex gap-3">
                <div className="relative">
                  <select className="appearance-none flex items-center gap-1 border border-[#E5E7EB] bg-white rounded-[16px] pl-4 pr-8 py-4 min-w-[90px] text-gray-900 font-medium focus:outline-none">
                    <option>+91</option>
                    <option>+1</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m6 9 6 6 6-6"/></svg>
                  </div>
                </div>
                <input
                  type="tel"
                  placeholder="555 0123 456"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="flex-1 border border-[#E5E7EB] bg-white rounded-[16px] px-5 py-4 text-gray-900 focus:border-[#1A73E8] focus:ring-1 focus:ring-[#1A73E8] focus:outline-none transition-all placeholder:text-gray-300"
                />
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <button 
            onClick={handleContinue} 
            className="w-full bg-[#1A73E8] text-white py-5 rounded-[20px] font-bold text-lg flex items-center justify-center gap-3 shadow-lg shadow-blue-100 active:scale-[0.98] transition-all mb-8"
          >
            Continue
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </button>

          {/* Security Badge */}
          <div className="flex items-center gap-2 text-[13px] text-[#64748B] font-medium mb-12">
            <div className="w-5 h-5 bg-[#22C55E] rounded-full flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            Secure & Encrypted OTP Verification
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-[#E5E7EB] mb-12" />

          {/* OTP Section */}
          <div className={`w-full transition-opacity duration-300 ${isOtpSent ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
            <p className="text-center text-[#94A3B8] text-[11px] mb-8 uppercase tracking-[0.15em] font-bold">OR ENTER VERIFICATION CODE</p>
            <div className="flex justify-between gap-4 mb-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className={`w-[72px] h-[72px] border-2 rounded-[18px] bg-white flex items-center justify-center text-2xl font-bold text-gray-900 ${i === 1 && isOtpSent ? 'border-[#1A73E8]' : 'border-[#E5E7EB]'}`}>
                  {i === 1 && isOtpSent ? '' : ''}
                </div>
              ))}
            </div>
            <p className="text-center text-[#64748B] text-sm mb-16">
              Didn't receive a code? <button className="text-[#1A73E8] font-bold ml-1">Resend</button>
            </p>
          </div>

          {/* Footer */}
          <p className="text-center text-[11px] text-[#94A3B8] leading-relaxed px-4">
            By continuing, you agree to our <span className="underline text-[#64748B]">Terms of Service</span> and <span className="underline text-[#64748B]">Privacy Policy</span>.
          </p>
        </div>
      </Container>
    </div>
  );
};
