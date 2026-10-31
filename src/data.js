export const notices = [
  { id: 'n1', title: 'Clinical posting roster for November is available', category: 'Academics', urgency: 'Important', pinned: true, source: 'College Academic Office', time: '35 min ago', tags: ['MBBS', 'Clinical'], body: 'Final-year students should confirm their unit, supervisor, and resumption date before Friday.' },
  { id: 'n2', title: 'Community medicine CBT: venue update', category: 'Exams', urgency: 'Urgent', pinned: true, source: 'Department of Community Health', time: '1 hr ago', tags: ['400L', 'CBT'], body: 'The CBT will now hold at the ICT Centre. Your assigned session remains unchanged.' },
  { id: 'n3', title: 'Red Cross campus blood drive volunteers', category: 'Clubs', urgency: 'New', pinned: false, source: 'LASUCOM Red Cross', time: '2 hrs ago', tags: ['Volunteer', 'Health'], body: 'Join the planning team for the annual campus blood drive. Orientation is on Wednesday.' },
  { id: 'n4', title: 'NiMSA national public-health essay call', category: 'Associations', urgency: 'New', pinned: false, source: 'NiMSA LASUCOM', time: 'Yesterday', tags: ['NiMSA', 'Opportunity'], body: 'Submit a 750-word essay on campus health equity before the stated deadline.' },
  { id: 'n5', title: 'Library extended hours during revision week', category: 'Campus', urgency: 'Info', pinned: false, source: 'College Library', time: 'Yesterday', tags: ['Library', 'Revision'], body: 'The library will remain open until 9 PM on weekdays throughout the revision period.' },
  { id: 'n6', title: 'Medical outreach registration is open', category: 'Events', urgency: 'New', pinned: false, source: 'Student Affairs', time: '2 days ago', tags: ['Outreach', 'Community'], body: 'Register to volunteer or attend the upcoming community medical outreach.' },
];

export const exams = [
  { course: 'Community Medicine CBT', date: 'Nov 07', countdown: '7 days', level: '400L', department: 'Medicine', type: 'CBT' },
  { course: 'Head & Neck Anatomy', date: 'Nov 11', countdown: '11 days', level: '200L', department: 'Basic Med. Sci.', type: 'Theory' },
  { course: 'Clinical Pharmacology OSCE', date: 'Nov 14', countdown: '14 days', level: '500L', department: 'Pharmacy', type: 'OSCE' },
  { course: 'General Surgery SAQ', date: 'Nov 19', countdown: '19 days', level: '500L', department: 'Surgery', type: 'Theory' },
];

const named = (category, type, names) => names.map((name) => ({ name, category, type, contact: 'Contact information to be confirmed' }));

export const organizations = [
  ...named('Administration', 'College office', ['Provost’s Office', 'College Registry', 'Student Affairs Unit', 'College Bursary', 'College Library', 'ICT & e-Learning Unit', 'Medical Centre', 'Quality Assurance Unit', 'Security Unit', 'Admissions & Records']),
  ...named('Faculties & Departments', 'Academic department', ['Faculty of Basic Medical Sciences', 'Department of Anatomy', 'Department of Physiology', 'Department of Biochemistry', 'Faculty of Clinical Sciences', 'Department of Medicine', 'Department of Surgery', 'Department of Obstetrics & Gynaecology', 'Department of Paediatrics', 'Department of Psychiatry', 'Department of Radiology', 'Faculty of Dentistry', 'Department of Oral & Maxillofacial Surgery', 'Department of Restorative Dentistry', 'Department of Child Dental Health', 'Faculty of Pharmacy', 'Department of Pharmaceutics', 'Department of Pharmacology', 'Department of Clinical Pharmacy', 'Faculty of Allied Health Sciences', 'Department of Medical Laboratory Science', 'Department of Nursing Science', 'Department of Physiotherapy', 'Department of Radiography']),
  ...named('Professional Staff Associations', 'Professional association', ['MDCAN LASUCOM', 'Association of Resident Doctors', 'Nigerian Medical Association', 'JOHESU LASUCOM', 'NASU LASUCOM', 'SSANU LASUCOM']),
  ...named('Student Associations', 'Student association', ['LASUMSA', 'LASUDENSA', 'PANS LASUCOM', 'NIMELSSA LASUCOM', 'NAPS LASUCOM', 'MLSSA LASUCOM', 'Nursing Students Association', 'Physiotherapy Students Association', 'Radiography Students Association', 'Medical Laboratory Science Students Association', 'Dental Students Academic Committee', 'Pharmacy Students Welfare Committee']),
  ...named('NiMSA & IFMSA', 'Standing committee', ['NiMSA LASUCOM', 'IFMSA LASUCOM', 'SCOME LASUCOM', 'SCOPH LASUCOM', 'SCORA LASUCOM', 'SCORP LASUCOM', 'SCOPE LASUCOM', 'SCORE LASUCOM']),
  ...named('Clubs, NGOs & Fellowships', 'Club / NGO / fellowship', ['LASUCOM Red Cross', 'CMDA LASUCOM', 'MSSN LASUCOM', 'JCCF LASUCOM', 'SDG Campus Club', 'Rotaract Club LASUCOM', 'Lagos Medical Outreach Initiative', 'Debate & Literary Society', 'Tech & Innovation Club', 'LASUCOM Press Club', 'Environmental Health Club', 'Mental Health Advocacy Network', 'Women in Medicine Network', 'Faith & Medicine Fellowship']),
];

export const categories = ['All', 'Academics', 'Exams', 'Associations', 'Clubs', 'Events', 'Campus'];
