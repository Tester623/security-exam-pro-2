import { Achievement, DomainInfo, Flashcard, UserData } from './types';

export const DOMAINS: Record<string, DomainInfo> = {
  '1.0': { n: 'General Security Concepts', w: 12 },
  '2.0': { n: 'Threats & Vulnerabilities', w: 22 },
  '3.0': { n: 'Security Architecture', w: 18 },
  '4.0': { n: 'Security Operations', w: 28 },
  '5.0': { n: 'Program Management', w: 20 },
};

export const CATEGORIES: Record<string, string> = {
  all: 'All', general: 'General', cryptography: 'Crypto',
  network_security: 'Network', attacks: 'Attacks', authentication: 'Identity',
  cloud_security: 'Cloud', application_security: 'AppSec',
  incident_response: 'IR', compliance: 'GRC',
  infrastructure: 'Infra', data_protection: 'Data',
};

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'ft', n: 'First Steps', d: 'Complete your first test', icon: '🐣', ck: (s) => s.tt >= 1 },
  { id: 't10', n: 'Getting Serious', d: 'Complete 10 tests', icon: '📝', ck: (s) => s.tt >= 10 },
  { id: 't50', n: 'Exam Veteran', d: 'Complete 50 tests', icon: '🎖️', ck: (s) => s.tt >= 50 },
  { id: 'q5', n: 'Scholar', d: 'Answer 500 questions', icon: '📚', ck: (s) => s.ta >= 500 },
  { id: 'q1', n: 'Walking Encyclopedia', d: '1000 questions answered', icon: '🧠', ck: (s) => s.ta >= 1000 },
  { id: 's3', n: 'On Fire', d: '3-day streak', icon: '🔥', ck: (s) => s.sk >= 3 },
  { id: 's7', n: 'Dedicated', d: '7-day streak', icon: '💪', ck: (s) => s.sk >= 7 },
  { id: 's30', n: 'Unstoppable', d: '30-day streak', icon: '⚡', ck: (s) => s.sk >= 30 },
  { id: 'pf', n: 'Flawless Victory', d: '100% on any test', icon: '💎', ck: (s) => s.pt >= 1 },
  { id: 'p5', n: 'Consistent', d: 'Pass 5 tests', icon: '🏅', ck: (s) => s.ps >= 5 },
  { id: 'p3f', n: 'Hat Trick', d: '3 perfect scores', icon: '🎩', ck: (s) => s.pt >= 3 },
  { id: 'ex90', n: 'Exam Ready', d: '90%+ on full 90q exam', icon: '🎓', ck: (s) => s.hi.some(h => h.questionsCount >= 90 && h.score >= 90) },
  { id: 'exnm', n: 'Flawless Exam', d: 'Perfect 90q exam', icon: '👑', ck: (s) => s.hi.some(h => h.questionsCount >= 90 && h.score === 100) },
  { id: 'ad', n: 'Well-Rounded', d: 'All 5 domains studied', icon: '🌐', ck: (s) => Object.keys(s.dt || {}).length >= 5 },
  { id: 'dm80', n: 'Domain Master', d: '80%+ in all domains', icon: '🏆', ck: (s) => { const ds = ['1.0','2.0','3.0','4.0','5.0']; return ds.every(d => s.ds[d] && s.ds[d].total >= 10 && (s.ds[d].correct/s.ds[d].total) >= 0.8); }},
  { id: 'sp', n: 'Speed Demon', d: '50q under 20 minutes', icon: '⏱️', ck: (s) => s.sr },
  { id: 'fc', n: 'Card Collector', d: 'Review 100 flashcards', icon: '🃏', ck: (s) => s.fr >= 100 },
  { id: 'fc5', n: 'Card Hoarder', d: 'Review 500 flashcards', icon: '📇', ck: (s) => s.fr >= 500 },
  { id: 'cf10', n: 'Self-Improver', d: 'Create 10 custom flashcards', icon: '✍️', ck: (s) => (s.cfc || 0) >= 10 },
  { id: 'nm', n: 'Clean Slate', d: 'Clear all mistakes', icon: '✨', ck: (s) => s.cm },
  { id: 'mr', n: 'Redemption Arc', d: '20 mistakes corrected', icon: '🔄', ck: (s) => (s.mrc || 0) >= 20 },
  { id: 'f5', n: 'Having a Bad Day', d: '5 wrong in a row', icon: '💀', ck: (s) => (s.ws || 0) >= 5 },
  { id: 'f10', n: 'R.I.P. Brain Cells', d: '10 wrong in a row', icon: '🪦', ck: (s) => (s.ws || 0) >= 10 },
  { id: 'f0', n: 'The Floor Is Lava', d: 'Score 0% on a test', icon: '🤡', ck: (s) => s.hi.some(h => h.score === 0 && h.questionsCount >= 5) },
  { id: 'fn', n: 'Night Owl', d: 'Study between 2-5 AM', icon: '🦉', ck: (s) => s.no || false },
  { id: 'feb', n: 'Early Bird', d: 'Study before 6 AM', icon: '🌅', ck: (s) => s.eb || false },
  { id: 'fq1', n: 'One and Done', d: 'Quit after 1 question', icon: '🚪', ck: (s) => s.qo || false },
  { id: 'fm2', n: 'Touch Grass', d: '2+ hours in one session', icon: '📱', ck: (s) => (s.mst || 0) >= 120 },
  { id: 'fmr', n: 'Groundhog Day', d: 'Same mode 10 times', icon: '🔁', ck: (s) => (s.smc || 0) >= 10 },
  { id: 'allq', n: 'Completionist', d: 'Answer every question at least once', icon: '💯', ck: (s) => (s.uqa || 0) >= 784 },
];

export const FLASHCARDS: Record<string, Flashcard[]> = {
  ports: [
    { f: 'HTTP', b: '80' }, { f: 'HTTPS', b: '443' }, { f: 'SSH', b: '22' },
    { f: 'FTP Data', b: '20' }, { f: 'FTP Control', b: '21' }, { f: 'DNS', b: '53' },
    { f: 'SMTP', b: '25' }, { f: 'SMTP TLS', b: '587' }, { f: 'POP3', b: '110' },
    { f: 'POP3S', b: '995' }, { f: 'IMAP', b: '143' }, { f: 'IMAPS', b: '993' },
    { f: 'Telnet', b: '23' }, { f: 'RDP', b: '3389' }, { f: 'SNMP', b: '161/162' },
    { f: 'LDAP', b: '389' }, { f: 'LDAPS', b: '636' }, { f: 'Kerberos', b: '88' },
    { f: 'RADIUS', b: '1812/1813' }, { f: 'TACACS+', b: '49' }, { f: 'Syslog', b: '514' },
    { f: 'NTP', b: '123' }, { f: 'TFTP', b: '69' }, { f: 'MySQL', b: '3306' },
    { f: 'MSSQL', b: '1433' }, { f: 'SMB', b: '445' }, { f: 'NetBIOS', b: '137-139' },
    { f: 'SIP', b: '5060/5061' },
  ],
  acronyms: [
    { f: 'CIA', b: 'Confidentiality, Integrity, Availability' },
    { f: 'AAA', b: 'Authentication, Authorization, Accounting' },
    { f: 'AES', b: 'Advanced Encryption Standard' },
    { f: 'DLP', b: 'Data Loss Prevention' },
    { f: 'SIEM', b: 'Security Information & Event Management' },
    { f: 'IDS/IPS', b: 'Intrusion Detection/Prevention System' },
    { f: 'PKI', b: 'Public Key Infrastructure' },
    { f: 'MFA', b: 'Multi-Factor Authentication' },
    { f: 'RBAC', b: 'Role-Based Access Control' },
    { f: 'SOC', b: 'Security Operations Center' },
    { f: 'SOAR', b: 'Security Orchestration, Automation & Response' },
    { f: 'EDR', b: 'Endpoint Detection & Response' },
    { f: 'XDR', b: 'Extended Detection & Response' },
    { f: 'CASB', b: 'Cloud Access Security Broker' },
    { f: 'WAF', b: 'Web Application Firewall' },
    { f: 'APT', b: 'Advanced Persistent Threat' },
    { f: 'CVE', b: 'Common Vulnerabilities & Exposures' },
    { f: 'CVSS', b: 'Common Vulnerability Scoring System' },
    { f: 'MTBF', b: 'Mean Time Between Failures' },
    { f: 'MTTR', b: 'Mean Time To Repair' },
    { f: 'RPO', b: 'Recovery Point Objective' },
    { f: 'RTO', b: 'Recovery Time Objective' },
    { f: 'BIA', b: 'Business Impact Analysis' },
    { f: 'ZTNA', b: 'Zero Trust Network Access' },
    { f: 'SASE', b: 'Secure Access Service Edge' },
    { f: 'NAC', b: 'Network Access Control' },
    { f: 'PAM', b: 'Privileged Access Management' },
    { f: 'HSM', b: 'Hardware Security Module' },
  ],
};

export const THEME = {
  dark: {
    bg: '#0a0a12', card: '#12121f', cardHover: '#18182d',
    text: '#d0d0e4', textSub: '#6b6b8d', border: 'rgba(255,255,255,0.04)',
    accent: '#818cf8', accentMuted: '#6366f1', accentBg: 'rgba(129,140,248,0.08)',
    success: '#34d399', successBg: 'rgba(52,211,153,0.08)',
    error: '#fb7185', errorBg: 'rgba(251,113,133,0.08)',
    warning: '#fbbf24', warningBg: 'rgba(251,191,36,0.08)',
    neon: '#22d3ee', neonBg: 'rgba(34,211,238,0.08)',
    gradientHeader: ['#0f0f1e', '#1a1040'],
    gradientAccent: ['#6366f1', '#8b5cf6'],
  },
  light: {
    bg: '#f5f5fa', card: '#ffffff', cardHover: '#f0f0f8',
    text: '#1a1a2e', textSub: '#6b6b8d', border: 'rgba(0,0,0,0.06)',
    accent: '#6366f1', accentMuted: '#4f46e5', accentBg: 'rgba(99,102,241,0.06)',
    success: '#059669', successBg: 'rgba(5,150,105,0.06)',
    error: '#e11d48', errorBg: 'rgba(225,29,72,0.06)',
    warning: '#d97706', warningBg: 'rgba(217,119,6,0.06)',
    neon: '#0891b2', neonBg: 'rgba(8,145,178,0.06)',
    gradientHeader: ['#1e1b4b', '#312e81'],
    gradientAccent: ['#4f46e5', '#7c3aed'],
  },
};

export const XP_PER_LEVEL = 200;
export const MAX_LEVEL = 15;
export const XP_CORRECT = 10;
export const XP_WRONG = 3;
export const XP_PASS_TEST = 25;
export const XP_FAIL_TEST = 5;
export const PASS_THRESHOLD = 75;
export const EXAM_QUESTION_COUNT = 90;
export const EXAM_TIMER_MINUTES = 90;
