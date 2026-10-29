import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { DoctorDirectory } from './components/DoctorDirectory';
import { AppointmentModal } from './components/AppointmentModal';
import { PatientDashboard } from './components/PatientDashboard';
import { DoctorDashboard } from './components/DoctorDashboard';
import { LabAssistantDashboard } from './components/LabAssistantDashboard';
import { MedicalReportsView } from './components/MedicalReportsView';
import { QuantumSecurityDashboard } from './components/QuantumSecurityDashboard';
import { SecureTransmissionVisualizer } from './components/SecureTransmissionVisualizer';
import { AdministratorDashboard } from './components/AdministratorDashboard';

import { Doctor, Appointment, LabOrder, MedicalReport, MedicalDocument } from './types';
import { dbService } from './lib/dbService';

function MainApp() {
  const { currentRole, profile, switchMockRole } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState<Doctor | null>(null);

  // Application Data States
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [labOrders, setLabOrders] = useState<LabOrder[]>([]);
  const [reports, setReports] = useState<MedicalReport[]>([]);
  const [documents, setDocuments] = useState<MedicalDocument[]>([]);
  const [backendOnline, setBackendOnline] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Load initial data
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [docs, apts, orders, reps, medDocs] = await Promise.all([
        dbService.getDoctors(),
        dbService.getAppointments(currentRole, profile?.id || 'pat-001'),
        dbService.getTestOrders(currentRole, profile?.id || 'pat-001'),
        dbService.getLabResults(currentRole, profile?.id || 'pat-001'),
        dbService.getDocuments(currentRole, profile?.id || 'pat-001')
      ]);

      setDoctors(docs);
      setAppointments(apts);
      setLabOrders(orders);
      setReports(reps);
      setDocuments(medDocs);
      setLoading(false);
    }
    loadData();
  }, [currentRole, profile?.id]);

  // Periodic health check for Python backend
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/health', { method: 'GET' });
        setBackendOnline(res.ok);
      } catch {
        setBackendOnline(false);
      }
    };
    checkBackend();
    const interval = setInterval(checkBackend, 15000);
    return () => clearInterval(interval);
  }, []);

  // Handlers
  const handleBookDoctor = (doc: Doctor) => {
    setSelectedDoctorForBooking(doc);
  };

  const handleConfirmAppointment = async (aptData: Partial<Appointment>) => {
    const result = await dbService.bookAppointment({
      ...aptData,
      patientId: profile?.id || 'pat-001',
      patientName: profile?.name || 'Ananya Sharma'
    });

    if (result.success && result.data) {
      setAppointments([result.data, ...appointments]);
    }
    setActiveTab('dashboard');
  };

  const handleCreateLabOrder = async (orderData: Partial<LabOrder>) => {
    const result = await dbService.createTestOrder({
      ...orderData,
      doctorId: profile?.id || 'doc-101',
      doctorName: profile?.name || 'Dr. Vikramaditya Sen'
    });

    if (result.success && result.data) {
      setLabOrders([result.data, ...labOrders]);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: LabOrder['status']) => {
    await dbService.updateOrderStatus(orderId, status);
    setLabOrders(
      labOrders.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
  };

  const handleSubmitReport = async (newReport: MedicalReport) => {
    await dbService.submitLabResult(newReport);
    setReports([newReport, ...reports]);
  };

  const currentUser = profile || {
    id: 'pat-001',
    name: 'Ananya Sharma',
    email: 'ananya.sharma@example.com',
    role: currentRole
  };

  return (
    <div className="min-h-screen animated-gradient-mesh flex flex-col font-sans text-slate-900 relative overflow-x-hidden">
      
      {/* Decorative Ambient Background Orbs */}
      <div className="fixed top-12 left-10 w-96 h-96 rounded-full bg-cyan-400/15 blur-3xl pointer-events-none animate-float" />
      <div className="fixed top-1/3 right-10 w-[28rem] h-[28rem] rounded-full bg-purple-400/15 blur-3xl pointer-events-none animate-float-reverse" />
      <div className="fixed bottom-10 left-1/4 w-80 h-80 rounded-full bg-teal-400/15 blur-3xl pointer-events-none animate-float" />
      <div className="fixed bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-rose-400/10 blur-3xl pointer-events-none animate-float-reverse" />

      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        backendOnline={backendOnline}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        
        {/* Landing Page */}
        {activeTab === 'landing' && (
          <LandingPage
            onSelectRole={(role) => switchMockRole(role)}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        )}

        {/* Doctor Directory */}
        {activeTab === 'doctors' && (
          <DoctorDirectory
            doctors={doctors}
            onBookDoctor={handleBookDoctor}
          />
        )}

        {/* Role-Specific Dashboards */}
        {activeTab === 'dashboard' && (
          <>
            {currentRole === 'patient' && (
              <PatientDashboard
                user={currentUser}
                appointments={appointments.filter((a) => a.patientId === currentUser.id)}
                labOrders={labOrders.filter((o) => o.patientId === currentUser.id)}
                reports={reports.filter((r) => r.patientId === currentUser.id)}
                documents={documents.filter((d) => d.patientId === currentUser.id)}
                onBookAppointment={() => setActiveTab('doctors')}
                onViewReport={() => setActiveTab('reports')}
              />
            )}

            {currentRole === 'doctor' && (
              <DoctorDashboard
                user={currentUser}
                appointments={appointments.filter((a) => a.doctorId === currentUser.id)}
                labOrders={labOrders.filter((o) => o.doctorId === currentUser.id)}
                reports={reports.filter((r) => r.doctorId === currentUser.id)}
                documents={documents}
                onCreateLabOrder={handleCreateLabOrder}
                onViewReport={() => setActiveTab('reports')}
              />
            )}

            {currentRole === 'lab_technician' && (
              <LabAssistantDashboard
                user={currentUser}
                labOrders={labOrders}
                reports={reports}
                documents={documents}
                onSubmitReport={handleSubmitReport}
                onUpdateOrderStatus={handleUpdateOrderStatus}
              />
            )}

            {currentRole === 'admin' && (
              <AdministratorDashboard />
            )}
          </>
        )}

        {/* PQC Reports View */}
        {activeTab === 'reports' && (
          <MedicalReportsView reports={reports} />
        )}

        {/* Secure Transmission Path Visualizer */}
        {activeTab === 'visualizer' && (
          <SecureTransmissionVisualizer
            currentRole={currentRole}
            patientId={currentUser.id}
          />
        )}

        {/* Quantum Security Dashboard */}
        {activeTab === 'security' && (
          <QuantumSecurityDashboard backendOnline={backendOnline} />
        )}

        {/* Administrator Defensive Security Intel Console */}
        {activeTab === 'admin' && (
          <AdministratorDashboard />
        )}

      </main>

      {/* Appointment Booking Modal */}
      {selectedDoctorForBooking && (
        <AppointmentModal
          doctor={selectedDoctorForBooking}
          onClose={() => setSelectedDoctorForBooking(null)}
          onConfirm={handleConfirmAppointment}
        />
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 PQC-HEALTH • Smart India Hackathon Problem Statement PQC-04</p>
          <div className="flex items-center space-x-4 text-xs font-mono">
            <span className="text-teal-700 font-bold">NIST FIPS 203 (ML-KEM-768)</span>
            <span>•</span>
            <span className="text-teal-700 font-bold">NIST FIPS 204 (ML-DSA-65)</span>
            <span>•</span>
            <span className="text-slate-600 font-semibold">QpiAI SDK v0.7.5</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

export default App;
