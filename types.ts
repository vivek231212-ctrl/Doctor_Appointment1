
export type Role = 'PATIENT' | 'DOCTOR';

export enum TokenStatus {
  WAITING = 'WAITING',
  IN_CONSULTATION = 'IN_CONSULTATION',
  COMPLETED = 'COMPLETED',
  MISSED = 'MISSED',
  ON_HOLD = 'ON_HOLD'
}

export enum OPDStatus {
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  CLOSED = 'CLOSED'
}

export interface User {
  id: string;
  name: string;
  phone: string;
  role: Role;
}

export interface Doctor extends User {
  specialty: string;
  hospital: string;
  avgConsultationTime: number; // in minutes
  currentOPDStatus: OPDStatus;
  broadcastMessage?: string;
  image: string;
  experience: number;
  rating: number;
  reviews: number;
}

export interface Token {
  id: string;
  doctorId: string;
  patientId: string;
  tokenNumber: number;
  status: TokenStatus;
  bookedAt: number;
  startTime?: number;
  endTime?: number;
  estimatedTime?: number;
}

export interface AppState {
  currentUser: User | null;
  doctors: Doctor[];
  tokens: Token[];
  currentTime: number;
}
