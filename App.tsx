
import React, { useState } from 'react';
import { GlobalProvider, useGlobal } from './store';
import { Landing } from './views/Landing';
import { Login } from './views/Login';
import { DoctorList } from './views/Patient/DoctorList';
import { DoctorProfile } from './views/Patient/DoctorProfile';
import { Booking } from './views/Patient/Booking';
import { LiveTracker } from './views/Patient/LiveTracker';
import { DoctorDashboard } from './views/Doctor/Dashboard';

const Main: React.FC = () => {
  const { currentUser } = useGlobal();
  const [view, setView] = useState<'LANDING' | 'LOGIN' | 'LIST' | 'PROFILE' | 'BOOKING' | 'TRACKER'>('LANDING');
  const [selectedRole, setSelectedRole] = useState<'PATIENT' | 'DOCTOR'>('PATIENT');
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);

  const renderContent = () => {
    if (!currentUser) {
      if (view === 'LANDING') {
        return (
          <Landing 
            onSelectRole={(role) => {
              setSelectedRole(role);
              setView('LOGIN');
            }} 
          />
        );
      }
      return <Login initialRole={selectedRole} onBack={() => setView('LANDING')} />;
    }

    if (currentUser.role === 'DOCTOR') {
      return <DoctorDashboard />;
    }

    // Patient Views navigation normalization
    const currentPatientView = view === 'LANDING' || view === 'LOGIN' ? 'LIST' : view;

    switch (currentPatientView) {
      case 'LIST':
        return (
          <DoctorList 
            onSelect={(id) => {
              setSelectedDocId(id);
              setView('PROFILE');
            }}
            onBook={(id) => {
              setSelectedDocId(id);
              setView('BOOKING');
            }}
          />
        );
      case 'PROFILE':
        return (
          <DoctorProfile
            doctorId={selectedDocId!}
            onBack={() => setView('LIST')}
            onBook={() => setView('BOOKING')}
          />
        );
      case 'BOOKING':
        return (
          <Booking 
            doctorId={selectedDocId!} 
            onBack={() => setView('LIST')} 
            onBooked={() => setView('TRACKER')} 
          />
        );
      case 'TRACKER':
        return <LiveTracker onBack={() => setView('LIST')} />;
      default:
        return <DoctorList onSelect={() => {}} onBook={() => {}} />;
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      {renderContent()}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <GlobalProvider>
      <Main />
    </GlobalProvider>
  );
};

export default App;
