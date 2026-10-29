import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Shield, 
  Activity, 
  Stethoscope, 
  FileText, 
  Lock, 
  LogIn, 
  LogOut, 
  Database,
  User,
  ShieldCheck,
  Radio,
  ShieldAlert,
  Globe
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AuthModal } from './AuthModal';
import { UserRole } from '../types';

interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  backendOnline: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  backendOnline
}) => {
  const { t, i18n } = useTranslation();
  const { user, profile, currentRole, switchMockRole, signOut, dbConnected, isConfigured } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const handleLanguageChange = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#0A192F] text-white border-b border-[#1E293B] shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo & Hackathon Tag */}
            <div 
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={() => onTabChange('landing')}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-teal-300 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform">
                <Shield className="w-6 h-6 text-[#0A192F]" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-lg tracking-tight text-white">{t('nav.title')}</span>
                  <span className="text-xs bg-teal-500/20 text-teal-300 font-mono px-2 py-0.5 rounded border border-teal-500/30">
                    {t('nav.tag')}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium tracking-wide">
                  {t('nav.subtitle')}
                </p>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1 text-sm font-medium">
              <button
                onClick={() => onTabChange('landing')}
                className={`px-2.5 py-1.5 rounded-lg transition-colors ${
                  activeTab === 'landing' ? 'bg-teal-500/10 text-teal-300 border border-teal-500/30' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {t('nav.overview')}
              </button>
              <button
                onClick={() => onTabChange('doctors')}
                className={`px-2.5 py-1.5 rounded-lg transition-colors flex items-center space-x-1 ${
                  activeTab === 'doctors' ? 'bg-teal-500/10 text-teal-300 border border-teal-500/30' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Stethoscope className="w-3.5 h-3.5" />
                <span>{t('nav.doctors')}</span>
              </button>
              <button
                onClick={() => onTabChange('dashboard')}
                className={`px-2.5 py-1.5 rounded-lg transition-colors flex items-center space-x-1 ${
                  activeTab === 'dashboard' ? 'bg-teal-500/10 text-teal-300 border border-teal-500/30' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>{t('nav.portal')}</span>
              </button>
              <button
                onClick={() => onTabChange('reports')}
                className={`px-2.5 py-1.5 rounded-lg transition-colors flex items-center space-x-1 ${
                  activeTab === 'reports' ? 'bg-teal-500/10 text-teal-300 border border-teal-500/30' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{t('nav.reports')}</span>
              </button>
              <button
                onClick={() => onTabChange('visualizer')}
                className={`px-2.5 py-1.5 rounded-lg transition-colors flex items-center space-x-1 ${
                  activeTab === 'visualizer' ? 'bg-teal-500/10 text-teal-300 border border-teal-500/30' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
                title="Cryptographic Transmission Path Visualizer"
              >
                <Radio className="w-3.5 h-3.5 text-teal-400" />
                <span>{t('nav.visualizer')}</span>
              </button>
              <button
                onClick={() => onTabChange('security')}
                className={`px-2.5 py-1.5 rounded-lg transition-colors flex items-center space-x-1 ${
                  activeTab === 'security' ? 'bg-teal-500/10 text-teal-300 border border-teal-500/30' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Lock className="w-3.5 h-3.5 text-teal-400" />
                <span>{t('nav.security')}</span>
              </button>
              <button
                onClick={() => onTabChange('admin')}
                className={`px-2.5 py-1.5 rounded-lg transition-colors flex items-center space-x-1 ${
                  activeTab === 'admin' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'text-rose-300/80 hover:text-rose-200 hover:bg-rose-950/40'
                }`}
                title="Defensive Threat Detection & Admin Console"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                <span>{t('nav.admin')}</span>
              </button>
            </nav>

            {/* Right Controls: Language Selector, Role switcher, Database status, Auth */}
            <div className="flex items-center space-x-2 sm:space-x-3">

              {/* Language Selector (English, Kannada, Hindi) */}
              <div className="flex items-center bg-slate-900 px-2 py-1 rounded-lg border border-slate-700">
                <Globe className="w-3.5 h-3.5 text-teal-400 mr-1.5 shrink-0" />
                <select
                  aria-label="Language selector"
                  value={i18n.language}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="bg-[#0A192F] text-xs text-teal-300 font-semibold py-0.5 px-1.5 rounded border border-teal-500/40 focus:outline-none cursor-pointer"
                >
                  <option value="en">English</option>
                  <option value="kn">ಕನ್ನಡ (Kannada)</option>
                  <option value="hi">हिन्दी (Hindi)</option>
                </select>
              </div>

              {/* Role Quick Switcher (Patient, Doctor, Lab Tech, Admin) */}
              <div className="flex items-center bg-slate-900 p-1 rounded-lg border border-slate-700">
                <span className="text-xs text-slate-400 px-1.5 flex items-center space-x-1">
                  <User className="w-3.5 h-3.5" />
                  <span className="hidden xl:inline">{t('nav.role')}</span>
                </span>
                <select
                  aria-label="Select user role"
                  value={currentRole}
                  onChange={(e) => switchMockRole(e.target.value as UserRole)}
                  className="bg-[#0A192F] text-xs text-teal-300 font-semibold py-0.5 px-2 rounded border border-teal-500/40 focus:outline-none focus:ring-1 focus:ring-teal-400 cursor-pointer"
                >
                  <option value="patient">{t('nav.patient')} (Ananya)</option>
                  <option value="doctor">{t('nav.doctor')} (Dr. Sen)</option>
                  <option value="lab_technician">{t('nav.labTechnician')} (Rajesh)</option>
                  <option value="admin">{t('nav.adminRole')} (CISO Menon)</option>
                </select>
              </div>

              {/* Database Live Status Indicator */}
              <div 
                onClick={() => setAuthModalOpen(true)}
                className="hidden xl:flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-mono bg-slate-900 border border-slate-700 cursor-pointer hover:border-teal-500/50 transition-all"
                title={dbConnected ? "PostgreSQL & RLS Active" : "Click to view database connection status"}
              >
                <Database className={`w-3.5 h-3.5 ${dbConnected ? 'text-emerald-400' : 'text-amber-400'}`} />
                <span className="text-slate-300">{dbConnected ? t('nav.dbConnected') : t('nav.dbPending')}</span>
              </div>

              {/* User Authentication Status Button */}
              {user ? (
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-slate-300 font-medium hidden sm:inline truncate max-w-[120px]">
                    {profile?.name || user.email}
                  </span>
                  <button
                    onClick={() => signOut()}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-teal-500 to-teal-400 hover:from-teal-400 hover:to-teal-300 text-slate-950 font-bold text-xs shadow-sm flex items-center space-x-1.5 cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
              )}

            </div>

          </div>
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </>
  );
};
