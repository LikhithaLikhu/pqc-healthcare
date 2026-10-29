import React, { useState } from 'react';
import { Search, Star, Clock, Calendar, ShieldCheck, Stethoscope, Building, Award, CheckCircle } from 'lucide-react';
import { Doctor } from '../types';

interface DoctorDirectoryProps {
  doctors: Doctor[];
  onBookDoctor: (doctor: Doctor) => void;
}

export const DoctorDirectory: React.FC<DoctorDirectoryProps> = ({ doctors, onBookDoctor }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');

  const departments = ['All', 'Cardiology', 'Endocrinology', 'Oncology', 'Nephrology'];

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch = 
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.hospital.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDepartment === 'All' || doc.department === selectedDepartment;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-8">
      {/* Directory Header */}
      <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-semibold mb-2">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>PQC Key Certified Practitioners</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#0A192F]">Medical Specialist Directory</h2>
          <p className="text-slate-600 text-sm mt-1">
            Book appointments with authorized hospital physicians whose records are bound to ML-KEM-768 public keys.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search physician, specialty, hospital..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all"
          />
        </div>
      </div>

      {/* Department Filter Chips */}
      <div className="flex flex-wrap gap-2">
        {departments.map((dept) => (
          <button
            key={dept}
            onClick={() => setSelectedDepartment(dept)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              selectedDepartment === dept
                ? 'bg-[#0A192F] text-teal-300 shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-teal-500/40 hover:text-teal-700'
            }`}
          >
            {dept} {dept !== 'All' ? 'Department' : ''}
          </button>
        ))}
      </div>

      {/* Doctor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredDoctors.map((doc) => (
          <div
            key={doc.id}
            className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-teal-500/50 hover:shadow-lg transition-all flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <img
                  src={doc.avatar}
                  alt={doc.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-500/30 shadow-sm"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 text-lg truncate">{doc.name}</h3>
                    <div className="flex items-center space-x-1 text-amber-500 text-xs font-bold bg-amber-50 px-2 py-0.5 rounded">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{doc.rating}</span>
                      <span className="text-slate-400 font-normal">({doc.reviewsCount})</span>
                    </div>
                  </div>
                  <p className="text-xs font-medium text-teal-600 flex items-center space-x-1 mt-0.5">
                    <Stethoscope className="w-3.5 h-3.5" />
                    <span>{doc.specialty}</span>
                  </p>
                  <p className="text-xs text-slate-500 flex items-center space-x-1 mt-1">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{doc.hospital}</span>
                  </p>
                </div>
              </div>

              {/* Badges / Experience / PQC Key */}
              <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-50 p-2.5 rounded-xl">
                  <span className="text-slate-400 block text-[11px]">Experience</span>
                  <span className="font-bold text-slate-800">{doc.experienceYears}+ Years Clinical</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl">
                  <span className="text-slate-400 block text-[11px]">Consultation Fee</span>
                  <span className="font-bold text-teal-700">{doc.consultationFee}</span>
                </div>
              </div>

              {/* PQC Fingerprint */}
              <div className="bg-teal-50/60 p-2.5 rounded-xl border border-teal-100 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center space-x-1.5 text-teal-800">
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  <span>PQC Key ID:</span>
                </div>
                <span className="text-teal-900 font-semibold">{doc.pqcKeyFingerprint}</span>
              </div>

              <div className="flex items-center space-x-1 text-xs text-slate-500">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Available: {doc.availableDays.join(', ')}</span>
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-6 pt-4 border-t border-slate-100">
              <button
                onClick={() => onBookDoctor(doc)}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#0A192F] to-[#0F2A4A] hover:from-teal-800 hover:to-teal-700 text-teal-200 hover:text-white font-semibold text-sm transition-all shadow-sm flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Clinical Consultation</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
