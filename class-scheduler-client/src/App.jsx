import { useState } from 'react';
import TeacherDashboard from './components/TeacherDashboard';
import StudentView from './components/StudentView';

const CREDENTIALS = {
  teacher: { username: 'mr.rahman', password: 'teacher123', displayName: 'Mr. Rahman' },
  student: { username: 'rahim',     password: 'student123', displayName: 'Rahim' },
};

/* ── shared design tokens (inline since we can't import CSS modules) ── */
const c = {
  indigo:    '#4f3ff0',
  indigoDk:  '#3628c8',
  indigoLt:  '#ede9ff',
  emerald:   '#059669',
  emeraldLt: '#d1fae5',
  ink:       '#0d0d12',
  inkSoft:   '#5a5772',
  inkMuted:  '#9895a8',
  surface:   '#ffffff',
  surface2:  '#f7f6fb',
  surface3:  '#f0eefa',
  border:    '#e8e6f0',
  border2:   '#d4d0e8',
  rose:      '#e11d48',
  roseLt:    '#ffe4e6',
};

const roleConfig = {
  teacher: { color: c.indigo,  light: c.indigoLt,  label: 'Teacher',  icon: '🎓' },
  student: { color: c.emerald, light: c.emeraldLt, label: 'Student',  icon: '📚' },
};

/* ─────────────────────────────── LoginForm ─────────────────────────────── */
function LoginForm({ role, onSuccess, onCancel }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const cfg = roleConfig[role];

  const handleLogin = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 350)); // subtle feel
    const creds = CREDENTIALS[role];
    if (username === creds.username && password === creds.password) {
      onSuccess(creds.displayName);
    } else {
      setError('Incorrect username or password.');
    }
    setLoading(false);
  };

  const pill = {
    display: 'inline-flex', alignItems: 'center', gap: '6px',
    background: cfg.light, color: cfg.color,
    padding: '5px 14px', borderRadius: '99px',
    fontSize: '13px', fontWeight: '600', marginBottom: '20px',
  };

  const label = { fontSize: '12px', fontWeight: '600', color: c.inkMuted, letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: '8px' };

  const input = {
    width: '100%', padding: '11px 14px', fontSize: '15px', fontFamily: 'inherit',
    border: `1.5px solid ${c.border}`, borderRadius: '10px', outline: 'none',
    color: c.ink, background: c.surface, transition: 'border-color .15s',
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `linear-gradient(135deg, ${c.surface2} 0%, #eceaff 100%)`, padding: '24px' }}>
      {/* Decorative blob */}
      <div style={{ position: 'fixed', top: '-120px', right: '-120px', width: '400px', height: '400px', borderRadius: '50%', background: `radial-gradient(circle, ${cfg.light} 0%, transparent 70%)`, pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '-80px', left: '-80px', width: '300px', height: '300px', borderRadius: '50%', background: `radial-gradient(circle, #ede9ff 0%, transparent 70%)`, pointerEvents: 'none' }} />

      <div style={{ background: c.surface, borderRadius: '24px', padding: '40px 36px', width: '100%', maxWidth: '400px', boxShadow: '0 20px 60px rgba(13,13,18,.13)', position: 'relative' }}>
        <button onClick={onCancel} style={{ position: 'absolute', top: '16px', left: '16px', background: 'none', border: 'none', cursor: 'pointer', color: c.inkMuted, fontSize: '13px', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 10px', borderRadius: '8px' }}>
          ← Back
        </button>

        <div style={{ textAlign: 'center', marginBottom: '28px', marginTop: '12px' }}>
          <div style={{ fontSize: '36px', marginBottom: '12px' }}>{cfg.icon}</div>
          <div style={pill}>{cfg.label} Portal</div>
          <h2 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: '26px', fontWeight: '400', color: c.ink, margin: '0 0 6px' }}>Welcome back</h2>
          <p style={{ color: c.inkMuted, fontSize: '14px' }}>Sign in to access your dashboard</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={label}>Username</label>
            <input style={input} value={username}
              placeholder={CREDENTIALS[role].username}
              onChange={e => { setUsername(e.target.value); setError(''); }}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              onFocus={e => e.target.style.borderColor = cfg.color}
              onBlur={e => e.target.style.borderColor = c.border}
            />
          </div>
          <div>
            <label style={label}>Password</label>
            <input style={input} type="password" value={password}
              placeholder="••••••••"
              onChange={e => { setPassword(e.target.value); setError(''); }}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              onFocus={e => e.target.style.borderColor = cfg.color}
              onBlur={e => e.target.style.borderColor = c.border}
            />
          </div>

          {error && (
            <div style={{ background: '#fff1f3', border: `1.5px solid #fecdd3`, borderRadius: '10px', padding: '10px 14px', color: c.rose, fontSize: '13px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>⚠️</span> {error}
            </div>
          )}

          <button onClick={handleLogin} disabled={loading} style={{
            background: loading ? c.border2 : `linear-gradient(135deg, ${cfg.color} 0%, ${role === 'teacher' ? c.indigoDk : '#047857'} 100%)`,
            color: loading ? c.inkMuted : 'white', border: 'none', borderRadius: '12px',
            padding: '13px', fontSize: '15px', fontWeight: '600', fontFamily: 'inherit',
            cursor: loading ? 'not-allowed' : 'pointer', transition: 'all .2s', marginTop: '4px',
            boxShadow: loading ? 'none' : `0 4px 16px ${cfg.color}44`,
          }}>
            {loading ? 'Signing in…' : `Sign in as ${cfg.label}`}
          </button>
        </div>

        <p style={{ textAlign: 'center', color: c.inkMuted, fontSize: '12px', marginTop: '20px' }}>
          Hint: <span style={{ fontFamily: 'monospace', color: c.inkSoft }}>{CREDENTIALS[role].username}</span> / <span style={{ fontFamily: 'monospace', color: c.inkSoft }}>{CREDENTIALS[role].password}</span>
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────── Home ─────────────────────────────── */
function Home({ onSelect }) {
  const [hovered, setHovered] = useState(null);

  const card = (role) => {
    const cfg = roleConfig[role];
    const isHov = hovered === role;
    return (
      <button key={role} onClick={() => onSelect(`login-${role}`)}
        onMouseEnter={() => setHovered(role)}
        onMouseLeave={() => setHovered(null)}
        style={{
          background: isHov ? cfg.color : c.surface,
          border: `2px solid ${isHov ? cfg.color : c.border}`,
          borderRadius: '20px', padding: '36px 32px', cursor: 'pointer',
          textAlign: 'left', transition: 'all .22s cubic-bezier(.4,0,.2,1)',
          boxShadow: isHov ? `0 12px 40px ${cfg.color}33` : '0 2px 12px rgba(13,13,18,.06)',
          transform: isHov ? 'translateY(-4px)' : 'none', flex: 1, minWidth: '220px',
        }}>
        <div style={{ fontSize: '40px', marginBottom: '16px' }}>{cfg.icon}</div>
        <div style={{ fontSize: '18px', fontWeight: '600', color: isHov ? 'white' : c.ink, marginBottom: '8px' }}>{cfg.label}</div>
        <div style={{ fontSize: '13px', color: isHov ? 'rgba(255,255,255,.75)' : c.inkMuted, lineHeight: '1.5' }}>
          {role === 'teacher' ? 'Create and manage your class time slots' : 'Browse and book available sessions'}
        </div>
        <div style={{ marginTop: '20px', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '600', color: isHov ? 'white' : cfg.color }}>
          Continue <span>→</span>
        </div>
      </button>
    );
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: `linear-gradient(135deg, ${c.surface2} 0%, #eceaff 100%)`, padding: '40px 24px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'fixed', top: '-100px', right: '-100px', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, #ede9ff 0%, transparent 65%)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '-100px', left: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, #d1fae5 0%, transparent 65%)', pointerEvents: 'none' }} />

      <div style={{ textAlign: 'center', marginBottom: '48px', position: 'relative' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: c.surface, border: `1.5px solid ${c.border}`, borderRadius: '99px', padding: '6px 16px 6px 10px', fontSize: '13px', fontWeight: '500', color: c.inkSoft, marginBottom: '24px', boxShadow: '0 2px 8px rgba(13,13,18,.06)' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block', boxShadow: '0 0 0 3px #d1fae5' }} />
          System Online
        </div>
        <h1 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 'clamp(36px, 6vw, 56px)', fontWeight: '400', color: c.ink, lineHeight: '1.1', letterSpacing: '-1px', margin: '0 0 16px' }}>
          Class Scheduler
        </h1>
        <p style={{ color: c.inkSoft, fontSize: '17px', maxWidth: '380px', margin: '0 auto', lineHeight: '1.6' }}>
          A seamless scheduling experience for teachers and students.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center', position: 'relative', width: '100%', maxWidth: '540px' }}>
        {card('teacher')}
        {card('student')}
      </div>
    </div>
  );
}

/* ─────────────────────────────── App ─────────────────────────────── */
export default function App() {
  const [screen, setScreen]           = useState(() => sessionStorage.getItem('cs_screen') || 'home');
  const [displayName, setDisplayName] = useState(() => sessionStorage.getItem('cs_name')   || '');

  const handleLoginSuccess = (role, name) => {
    sessionStorage.setItem('cs_screen', role);
    sessionStorage.setItem('cs_name', name);
    setDisplayName(name);
    setScreen(role);
  };

  const handleBack = () => {
    sessionStorage.removeItem('cs_screen');
    sessionStorage.removeItem('cs_name');
    setScreen('home');
  };

  if (screen === 'teacher') return <TeacherDashboard teacherName={displayName} onBack={handleBack} />;
  if (screen === 'student') return <StudentView studentName={displayName} onBack={handleBack} />;
  if (screen === 'login-teacher') return <LoginForm role="teacher" onSuccess={(n) => handleLoginSuccess('teacher', n)} onCancel={handleBack} />;
  if (screen === 'login-student') return <LoginForm role="student" onSuccess={(n) => handleLoginSuccess('student', n)} onCancel={handleBack} />;
  return <Home onSelect={setScreen} />;
}