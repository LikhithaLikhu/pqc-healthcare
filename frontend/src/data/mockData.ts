import { Doctor, Appointment, LabOrder, MedicalReport, UserProfile, MedicalDocument } from '../types';

export const MOCK_USERS: Record<string, UserProfile> = {
  patient: {
    id: 'pat-001',
    name: 'Ananya Sharma',
    email: 'ananya.sharma@example.com',
    role: 'patient',
    pqcPublicKey: 'qP9F2/kK9...xM72Lwe99F',
    pqcDsaPublicKey: 'dV882K...82kLwq0'
  },
  doctor: {
    id: 'doc-101',
    name: 'Dr. Vikramaditya Sen',
    email: 'dr.sen@metrohealth.in',
    role: 'doctor',
    department: 'Cardiology & Internal Medicine',
    licenseNumber: 'MCI-CARDIO-88421',
    pqcPublicKey: 'MLKEM768-PUB-DOC-SEN-9921b64a',
    pqcDsaPublicKey: 'MLDSA65-PUB-DOC-SEN-11a87c'
  },
  lab_technician: {
    id: 'lab-301',
    name: 'Rajesh Verma',
    email: 'r.verma@diagnostics-core.in',
    role: 'lab_technician',
    department: 'Molecular Diagnostics & Pathology',
    licenseNumber: 'NABL-TECH-40912',
    pqcPublicKey: 'MLKEM768-PUB-LAB-VERMA-7740',
    pqcDsaPublicKey: 'MLDSA65-PUB-LAB-VERMA-9921'
  },
  admin: {
    id: 'adm-001',
    name: 'Suresh Menon (Lead CISO)',
    email: 'ciso.menon@metrohealth.in',
    role: 'admin',
    department: 'Hospital Information Security & Quantum Assurance',
    licenseNumber: 'CISSP-CISO-99014',
    pqcPublicKey: 'MLKEM768-PUB-ADMIN-CISO-5512',
    pqcDsaPublicKey: 'MLDSA65-PUB-ADMIN-CISO-8823'
  }
};

export const MOCK_DOCTORS: Doctor[] = [
  {
    id: 'doc-101',
    name: 'Dr. Vikramaditya Sen, MD, DM',
    specialty: 'Senior Cardiologist & Interventionalist',
    department: 'Cardiology',
    experienceYears: 18,
    hospital: 'Apex Quantum Multi-Specialty Hospital',
    rating: 4.9,
    reviewsCount: 342,
    availableDays: ['Mon', 'Wed', 'Fri', 'Sat'],
    consultationFee: '₹1,200',
    pqcKeyFingerprint: 'SHA256:7f4a...9c1e (ML-KEM-768)',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'doc-102',
    name: 'Dr. Priya Nambiar, MD, DNB',
    specialty: 'Endocrinology & Metabolic Disorders',
    department: 'Endocrinology',
    experienceYears: 14,
    hospital: 'National Institute of Medical Sciences',
    rating: 4.8,
    reviewsCount: 289,
    availableDays: ['Tue', 'Thu', 'Sat'],
    consultationFee: '₹1,000',
    pqcKeyFingerprint: 'SHA256:1a82...3f80 (ML-KEM-768)',
    avatar: 'https://images.unsplash.com/photo-1594824813511-55ff358e0a29?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'doc-103',
    name: 'Dr. Arvind Swaminathan, MD, FRCP',
    specialty: 'Clinical Hematology & Oncology',
    department: 'Oncology',
    experienceYears: 22,
    hospital: 'Metro Advanced Research Hospital',
    rating: 5.0,
    reviewsCount: 415,
    availableDays: ['Mon', 'Tue', 'Thu', 'Fri'],
    consultationFee: '₹1,800',
    pqcKeyFingerprint: 'SHA256:d891...44bc (ML-KEM-768)',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'doc-104',
    name: 'Dr. Sunita Kulkarni, MS, MCh',
    specialty: 'Nephrology & Renal Transplantation',
    department: 'Nephrology',
    experienceYears: 16,
    hospital: 'City Life Super Specialty Hospital',
    rating: 4.7,
    reviewsCount: 198,
    availableDays: ['Wed', 'Fri', 'Sun'],
    consultationFee: '₹1,400',
    pqcKeyFingerprint: 'SHA256:e104...77d3 (ML-KEM-768)',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&auto=format&fit=crop&q=80'
  }
];

export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-501',
    patientId: 'pat-001',
    patientName: 'Ananya Sharma',
    doctorId: 'doc-101',
    doctorName: 'Dr. Vikramaditya Sen',
    department: 'Cardiology',
    scheduledFor: '2026-10-30T10:30:00Z',
    status: 'confirmed',
    reason: 'Follow-up on cardiac stress markers and post-quantum lipid panel'
  },
  {
    id: 'apt-502',
    patientId: 'pat-001',
    patientName: 'Ananya Sharma',
    doctorId: 'doc-102',
    doctorName: 'Dr. Priya Nambiar',
    department: 'Endocrinology',
    scheduledFor: '2026-11-04T15:00:00Z',
    status: 'requested',
    reason: 'Consultation for endocrine biomarker stability evaluation'
  }
];

export const MOCK_LAB_ORDERS: LabOrder[] = [
  {
    id: 'ord-8801',
    patientId: 'pat-001',
    patientName: 'Ananya Sharma',
    doctorId: 'doc-101',
    doctorName: 'Dr. Vikramaditya Sen',
    labTechnicianId: 'lab-301',
    labTechnicianName: 'Rajesh Verma',
    testType: 'Cardiac Troponin I & High-Sensitivity CRP Panel',
    priority: 'urgent',
    clinicalNotes: 'Evaluate subtle micro-ischemic changes with post-quantum confidentiality protection for genomic markers.',
    status: 'completed',
    createdAt: '2026-10-27T08:15:00Z'
  },
  {
    id: 'ord-8802',
    patientId: 'pat-001',
    patientName: 'Ananya Sharma',
    doctorId: 'doc-102',
    doctorName: 'Dr. Priya Nambiar',
    labTechnicianId: 'lab-301',
    labTechnicianName: 'Rajesh Verma',
    testType: 'Next-Gen Endocrine & Thyroid Molecular Profiling',
    priority: 'routine',
    clinicalNotes: 'Screening for antibody-mediated resistance. Encrypt report with doctor and patient ML-KEM public keys.',
    status: 'in_analysis',
    createdAt: '2026-10-28T09:40:00Z'
  },
  {
    id: 'ord-8803',
    patientId: 'pat-002',
    patientName: 'Kavita Menon',
    doctorId: 'doc-101',
    doctorName: 'Dr. Vikramaditya Sen',
    labTechnicianId: undefined,
    testType: 'Complete Blood Count & Coagulation Profiling',
    priority: 'stat_emergency',
    clinicalNotes: 'Emergency pre-operative evaluation. Stat turnaround required.',
    status: 'pending',
    createdAt: '2026-10-28T13:10:00Z'
  }
];

export const MOCK_REPORTS: MedicalReport[] = [
  {
    id: 'rep-9901',
    orderId: 'ord-8801',
    patientId: 'pat-001',
    patientName: 'Ananya Sharma',
    doctorId: 'doc-101',
    doctorName: 'Dr. Vikramaditya Sen',
    technicianId: 'lab-301',
    technicianName: 'Rajesh Verma (NABL Certified)',
    testTitle: 'Cardiac Troponin I & High-Sensitivity CRP Panel',
    specimenType: 'Venous Whole Blood (Serum separator)',
    createdAt: '2026-10-27T16:45:20Z',
    decryptedData: {
      summary: 'Troponin-I within normal baseline (<0.01 ng/mL). hs-CRP slightly elevated at 2.4 mg/L indicating mild systemic inflammatory response.',
      biomarkers: [
        { name: 'High-Sensitivity Troponin I', value: '0.008', unit: 'ng/mL', referenceRange: '0.000 - 0.040', flag: 'normal' },
        { name: 'hs-CRP (Cardiac Risk)', value: '2.40', unit: 'mg/L', referenceRange: '< 1.00 (Low Risk)', flag: 'high' },
        { name: 'BNP (B-Type Natriuretic)', value: '45.2', unit: 'pg/mL', referenceRange: '< 100.0', flag: 'normal' },
        { name: 'Serum Creatinine', value: '0.85', unit: 'mg/dL', referenceRange: '0.60 - 1.20', flag: 'normal' },
        { name: 'eGFR', value: '98', unit: 'mL/min/1.73m²', referenceRange: '> 90', flag: 'normal' }
      ],
      clinicalImpression: 'No evidence of acute myocardial injury. Recommend lifestyle interventions for mild inflammatory elevation.',
      recommendations: 'Repeat hs-CRP test in 6 weeks. Maintain balanced diet and 150 mins weekly cardiovascular activity.'
    },
    cryptoEnvelope: {
      algorithmKem: 'ML-KEM-768 (NIST FIPS 203)',
      algorithmSymmetric: 'AES-256-GCM (NIST SP 800-38D)',
      algorithmSignature: 'ML-DSA-65 (NIST FIPS 204)',
      ciphertext: '4jK8W1...x9LqZ7==[AES-256-GCM 1.4KB Encrypted Biomarkers]',
      iv: 't9B4+z1O/qQd7VlA',
      authTag: '8u11LmZ+77/KaZ10W+L1Q==',
      kemCiphertextDoctor: 'KEM768_CT_DOC_SEN_88120fa49b8109',
      kemCiphertextPatient: 'KEM768_CT_PAT_SHARMA_2209bb710f',
      pqcSignature: 'MLDSA65_SIG_VERMA_890bc41...77ae20',
      signerPublicKey: 'MLDSA65_PUB_VERMA_011029ba',
      verified: true
    }
  }
];

export const MOCK_DOCUMENTS: MedicalDocument[] = [
  {
    id: 'doc-scan-001',
    patientId: 'pat-001',
    patientName: 'Ananya Sharma',
    uploadedBy: 'doc-101',
    uploaderName: 'Dr. Vikramaditya Sen',
    uploaderRole: 'doctor',
    appointmentId: 'apt-001',
    title: 'High-Resolution Cardiac Echo & Doppler Scan',
    description: 'Transthoracic echocardiogram imaging showing normal ventricular ejection fraction (64%) and clear pericardium.',
    category: 'Medical Scan',
    storagePath: 'patients/pat-001/doc-scan-001.webp',
    mimeType: 'image/webp',
    fileSize: 428010,
    fileHashSha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    pqcSignature: 'MLDSA65_SIG_DOC_SEN_88120fa49b8109337ba12c',
    signerPublicKey: 'MLDSA65_PUB_DOC_SEN_11a87c',
    isVerified: true,
    createdAt: '2026-10-27T10:15:00Z',
    signedUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'doc-rx-002',
    patientId: 'pat-001',
    patientName: 'Ananya Sharma',
    uploadedBy: 'doc-101',
    uploaderName: 'Dr. Vikramaditya Sen',
    uploaderRole: 'doctor',
    appointmentId: 'apt-001',
    title: 'Digital Post-Consultation Prescription & Regimen',
    description: 'Signed digital prescription for cardioprotective therapy: Atorvastatin 20mg & Ramipril 2.5mg OD.',
    category: 'Prescription',
    storagePath: 'patients/pat-001/doc-rx-002.webp',
    mimeType: 'image/webp',
    fileSize: 312450,
    fileHashSha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    pqcSignature: 'MLDSA65_SIG_DOC_SEN_772091bbcd331002aa90',
    signerPublicKey: 'MLDSA65_PUB_DOC_SEN_11a87c',
    isVerified: true,
    createdAt: '2026-10-27T11:30:00Z',
    signedUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'doc-lab-003',
    patientId: 'pat-001',
    patientName: 'Ananya Sharma',
    uploadedBy: 'lab-301',
    uploaderName: 'Rajesh Verma (NABL Certified)',
    uploaderRole: 'lab_technician',
    orderId: 'ord-8801',
    title: 'Pathology Blood Chemistry & Biomarker Assay Sheet',
    description: 'NABL-accredited laboratory bench readout for Cardiac Troponin-I and serum electrolytes with calibrated control run.',
    category: 'Blood Test',
    storagePath: 'patients/pat-001/doc-lab-003.webp',
    mimeType: 'image/webp',
    fileSize: 512800,
    fileHashSha256: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    pqcSignature: 'MLDSA65_SIG_LAB_VERMA_9921b7782100ae',
    signerPublicKey: 'MLDSA65_PUB_LAB_VERMA_9921',
    isVerified: true,
    createdAt: '2026-10-28T14:20:00Z',
    signedUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1200&q=80'
  }
];
