
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Doctor, Token, TokenStatus, OPDStatus } from './types';

interface GlobalContextType {
  currentUser: User | null;
  doctors: Doctor[];
  tokens: Token[];
  login: (phone: string, role: 'PATIENT' | 'DOCTOR') => void;
  logout: () => void;
  bookToken: (doctorId: string) => Token | null;
  updateDoctorOPD: (doctorId: string, status: OPDStatus, broadcast?: string) => void;
  advanceQueue: (doctorId: string) => void;
  skipToken: (tokenId: string) => void;
  holdToken: (tokenId: string) => void;
  setAvgTime: (doctorId: string, time: number) => void;
  getETA: (token: Token) => number;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

const INITIAL_DOCTORS: Doctor[] = [
  {
    id: 'doc1',
    name: 'Dr. Sarah Johnson',
    phone: '9999999991',
    role: 'DOCTOR',
    specialty: 'Pediatrician',
    hospital: 'City Children Hospital',
    avgConsultationTime: 10,
    currentOPDStatus: OPDStatus.ACTIVE,
    image: 'https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80&w=400&h=400',
    experience: 10,
    rating: 4.9,
    reviews: 124,
    cabinNo: '04',
    about: 'Dr. Sarah Johnson is a dedicated pediatrician with over 10 years of experience in child healthcare. She is known for her compassionate approach and specialized expertise in neonatal care.',
    patientsCount: '3.2K+',
    reviewsCount: '124',
    consultationFee: 50.00,
    originalFee: 75.00,
    address: '456 Pediatric Lane, Suite 101, IL 60612',
    locationName: 'City Children Hospital, East Wing'
  },
  {
    id: 'doc4',
    name: 'Dr. Alexander Bennett',
    phone: '9999999994',
    role: 'DOCTOR',
    specialty: 'Cardiologist',
    hospital: 'City Medical Center',
    avgConsultationTime: 15,
    currentOPDStatus: OPDStatus.ACTIVE,
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400&h=400',
    experience: 15,
    rating: 4.9,
    reviews: 1800,
    cabinNo: '04',
    about: 'Dr. Alexander Bennett is a senior cardiologist specializing in interventional cardiology and heart failure management. He is committed to providing evidence-based, compassionate care for complex cardiac conditions with a focus on patient wellness.',
    patientsCount: '4.5K+',
    reviewsCount: '1.8K',
    consultationFee: 75.00,
    originalFee: 100.00,
    address: '122 Medical Plaza, Suite 405, IL 60611',
    locationName: 'City Medical Center, North Wing'
  },
  {
    id: 'doc3',
    name: 'Dr. Emily White',
    phone: '9999999993',
    role: 'DOCTOR',
    specialty: 'General Physician',
    hospital: 'Downtown Medical',
    avgConsultationTime: 12,
    currentOPDStatus: OPDStatus.ACTIVE,
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=400&h=400',
    experience: 8,
    rating: 4.7,
    reviews: 210,
    cabinNo: '07',
    about: 'Dr. Emily White offers comprehensive primary care services. She focuses on preventative medicine and wellness programs for patients of all ages.',
    patientsCount: '2.1K+',
    reviewsCount: '210',
    consultationFee: 40.00,
    originalFee: 60.00,
    address: '789 Downtown Way, IL 60610',
    locationName: 'Downtown Medical Plaza'
  }
];

export const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>(INITIAL_DOCTORS);
  const [tokens, setTokens] = useState<Token[]>([]);

  useEffect(() => {
    try {
      const savedTokens = localStorage.getItem('app_tokens');
      if (savedTokens && savedTokens !== 'undefined') setTokens(JSON.parse(savedTokens));
      
      const savedDocs = localStorage.getItem('app_doctors');
      if (savedDocs && savedDocs !== 'undefined') setDoctors(JSON.parse(savedDocs));
      
      const savedUser = localStorage.getItem('app_user');
      if (savedUser && savedUser !== 'undefined') setCurrentUser(JSON.parse(savedUser));
    } catch (e) {
      console.error("Failed to load state from localStorage", e);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('app_tokens', JSON.stringify(tokens));
    localStorage.setItem('app_doctors', JSON.stringify(doctors));
    localStorage.setItem('app_user', JSON.stringify(currentUser));
  }, [tokens, doctors, currentUser]);

  const login = (phone: string, role: 'PATIENT' | 'DOCTOR') => {
    if (role === 'DOCTOR') {
      const doc = doctors.find(d => d.phone === phone || d.phone === "9999999994");
      if (doc) setCurrentUser(doc);
      else alert("Doctor not found!");
    } else {
      setCurrentUser({ id: `p${Date.now()}`, name: 'John Doe', phone, role: 'PATIENT' });
    }
  };

  const logout = () => setCurrentUser(null);

  const bookToken = (doctorId: string) => {
    if (!currentUser) return null;
    
    const existing = tokens.find(t => t.doctorId === doctorId && t.patientId === currentUser.id && t.status !== TokenStatus.COMPLETED);
    if (existing) {
      alert("You already have an active token for this doctor!");
      return null;
    }

    const docTokens = tokens.filter(t => t.doctorId === doctorId);
    const newToken: Token = {
      id: `t${Date.now()}`,
      doctorId,
      patientId: currentUser.id,
      tokenNumber: docTokens.length + 1,
      status: TokenStatus.WAITING,
      bookedAt: Date.now()
    };
    setTokens(prev => [...prev, newToken]);
    return newToken;
  };

  const updateDoctorOPD = (doctorId: string, status: OPDStatus, broadcast?: string) => {
    setDoctors(prev => prev.map(d => d.id === doctorId ? { ...d, currentOPDStatus: status, broadcastMessage: broadcast } : d));
  };

  const advanceQueue = (doctorId: string) => {
    setTokens(prev => {
      const docTokens = prev.filter(t => t.doctorId === doctorId);
      const activeToken = docTokens.find(t => t.status === TokenStatus.IN_CONSULTATION);
      const nextToken = docTokens.find(t => t.status === TokenStatus.WAITING);

      return prev.map(t => {
        if (activeToken && t.id === activeToken.id) return { ...t, status: TokenStatus.COMPLETED, endTime: Date.now() };
        if (nextToken && t.id === nextToken.id) return { ...t, status: TokenStatus.IN_CONSULTATION, startTime: Date.now() };
        return t;
      });
    });
  };

  const skipToken = (tokenId: string) => {
    setTokens(prev => prev.map(t => t.id === tokenId ? { ...t, status: TokenStatus.MISSED } : t));
  };

  const holdToken = (tokenId: string) => {
    setTokens(prev => prev.map(t => t.id === tokenId ? { ...t, status: TokenStatus.ON_HOLD } : t));
  };

  const setAvgTime = (doctorId: string, time: number) => {
    setDoctors(prev => prev.map(d => d.id === doctorId ? { ...d, avgConsultationTime: time } : d));
  };

  const getETA = useCallback((targetToken: Token) => {
    const doc = doctors.find(d => d.id === targetToken.doctorId);
    if (!doc || doc.currentOPDStatus === OPDStatus.CLOSED) return 0;
    
    const docTokens = tokens.filter(t => t.doctorId === targetToken.doctorId);
    const ahead = docTokens.filter(t => t.status === TokenStatus.WAITING && t.tokenNumber < targetToken.tokenNumber).length;
    const currentActive = docTokens.find(t => t.status === TokenStatus.IN_CONSULTATION);
    
    let baseTime = ahead * doc.avgConsultationTime;
    if (currentActive && currentActive.startTime) {
      const elapsed = (Date.now() - currentActive.startTime) / 60000;
      const remaining = Math.max(0, doc.avgConsultationTime - elapsed);
      baseTime += remaining;
    }

    if (doc.currentOPDStatus === OPDStatus.PAUSED) {
      return -1; 
    }

    return Math.round(baseTime);
  }, [doctors, tokens]);

  return (
    <GlobalContext.Provider value={{
      currentUser, doctors, tokens, login, logout, bookToken, 
      updateDoctorOPD, advanceQueue, skipToken, holdToken, setAvgTime, getETA
    }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => {
  const context = useContext(GlobalContext);
  if (!context) throw new Error("useGlobal must be used within GlobalProvider");
  return context;
};
