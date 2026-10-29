-- =====================================================================
-- Migration 003: Certified Doctor Directory Seed Data
-- Populates the public certified specialists directory for consultation booking
-- =====================================================================

INSERT INTO public.doctors (
    full_name,
    specialty,
    qualification,
    department,
    hospital,
    consultation_fee,
    availability_schedule,
    rating,
    reviews_count,
    pqc_key_fingerprint,
    avatar_url
) VALUES
(
    'Dr. Vikramaditya Sen',
    'Senior Cardiologist & Interventionalist',
    'MD (Medicine), DM (Cardiology), FACC',
    'Cardiology',
    'Apex Quantum Multi-Specialty Hospital',
    1200.00,
    '["Mon", "Wed", "Fri", "Sat"]'::jsonb,
    4.90,
    342,
    'SHA256:7f4a9b1...9c1e (ML-KEM-768 Certified)',
    'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80'
),
(
    'Dr. Priya Nambiar',
    'Endocrinology & Metabolic Disorders Specialist',
    'MD, DNB (Endocrinology), FRCP',
    'Endocrinology',
    'National Institute of Medical Sciences',
    1000.00,
    '["Tue", "Thu", "Sat"]'::jsonb,
    4.85,
    289,
    'SHA256:1a82e90...3f80 (ML-KEM-768 Certified)',
    'https://images.unsplash.com/photo-1594824813511-55ff358e0a29?w=300&auto=format&fit=crop&q=80'
),
(
    'Dr. Arvind Swaminathan',
    'Clinical Hematology & Molecular Oncology',
    'MD, DM (Clinical Hematology), PhD',
    'Oncology',
    'Metro Advanced Research Hospital',
    1800.00,
    '["Mon", "Tue", "Thu", "Fri"]'::jsonb,
    5.00,
    415,
    'SHA256:d891c22...44bc (ML-KEM-768 Certified)',
    'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=300&auto=format&fit=crop&q=80'
),
(
    'Dr. Sunita Kulkarni',
    'Nephrology & Renal Transplantation Specialist',
    'MBBS, MS, MCh (Nephrology)',
    'Nephrology',
    'City Life Super Specialty Hospital',
    1400.00,
    '["Wed", "Fri", "Sun"]'::jsonb,
    4.75,
    198,
    'SHA256:e104f71...77d3 (ML-KEM-768 Certified)',
    'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&auto=format&fit=crop&q=80'
)
ON CONFLICT DO NOTHING;
