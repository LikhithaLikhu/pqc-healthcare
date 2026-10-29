import React, { useState } from 'react';
import { X, Calendar, Clock, Stethoscope, Shield, CheckCircle } from 'lucide-react';
import { Doctor, Appointment } from '../types';

interface AppointmentModalProps {
  doctor: Doctor | null;
  onClose: () => void;
  onConfirm: (appointmentData: Partial<Appointment>) => void;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  doctor,
  onClose,
  onConfirm
}) => {
  const [selectedDate, setSelectedDate] = useState('2026-10-30');
  const [selectedTime, setSelectedTime] = useState('10:00 AM');
  const [reason, setReason] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!doctor) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      onConfirm({
        doctorId: doctor.id,
        doctorName: doctor.name,
        department: doctor.department,
        scheduledFor: `${selectedDate}T${selectedTime === '10:00 AM' ? '10:00:00Z' : '15:00:00Z'}`,
        reason: reason || 'Routine clinical consultation and biomarker review'
      });
      onClose();
    }, 1200);
  };

  const timeSlots = ['09:30 AM', '10:00 AM', '11:15 AM', '02:00 PM', '03:30 PM', '05:00 PM'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-slate-100 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-10 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Appointment Confirmed!</h3>
            <p className="text-sm text-slate-600 max-w-sm mx-auto">
              Your appointment request with <strong>{doctor.name}</strong> has been secured with ML-KEM-768 channel authorization.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="flex items-center space-x-2 text-teal-600 text-xs font-semibold uppercase tracking-wider mb-1">
                <Shield className="w-4 h-4" />
                <span>Encrypted Patient Booking</span>
              </div>
              <h3 className="text-2xl font-bold text-[#0A192F]">Schedule Consultation</h3>
              <p className="text-sm text-slate-600">
                Booking with <strong>{doctor.name}</strong> ({doctor.specialty})
              </p>
            </div>

            {/* Doctor Summary Pill */}
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center space-x-3">
              <img
                src={doctor.avatar}
                alt={doctor.name}
                className="w-12 h-12 rounded-xl object-cover"
              />
              <div className="text-xs">
                <p className="font-bold text-slate-900">{doctor.hospital}</p>
                <p className="text-slate-500">Fee: {doctor.consultationFee} • Key ID: {doctor.pqcKeyFingerprint.slice(0, 16)}...</p>
              </div>
            </div>

            {/* Date Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Preferred Date
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min="2026-10-28"
                  max="2026-11-30"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 text-sm text-slate-800 outline-none"
                  required
                />
              </div>
            </div>

            {/* Time Slot Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Available Time Slot
              </label>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((slot) => (
                  <button
                    type="button"
                    key={slot}
                    onClick={() => setSelectedTime(slot)}
                    className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                      selectedTime === slot
                        ? 'bg-[#0A192F] text-teal-300 border-[#0A192F] shadow-sm'
                        : 'border-slate-200 text-slate-600 hover:border-teal-500/40 hover:bg-slate-50'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* Clinical Symptoms / Reason */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Consultation Reason / Symptoms
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Briefly describe symptoms, follow-up purpose, or required diagnostic investigations..."
                rows={3}
                className="w-full p-3 rounded-xl border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 text-sm text-slate-800 outline-none placeholder-slate-400"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-teal-400 hover:from-teal-400 hover:to-teal-300 text-slate-950 font-bold text-sm shadow-md shadow-teal-500/20 transition-all cursor-pointer"
            >
              Confirm Appointment Booking
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
