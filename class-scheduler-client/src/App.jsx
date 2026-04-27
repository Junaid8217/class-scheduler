import { useState } from 'react';
import TeacherDashboard from './components/TeacherDashboard';
import StudentView from './components/StudentView';

export default function App() {
  const [role, setRole] = useState(null);

  if (role === 'teacher') return <TeacherDashboard teacherName="Mr. Rahman" onBack={() => setRole(null)} />;
  if (role === 'student') return <StudentView studentName="Rahim" onBack={() => setRole(null)} />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: '16px' }}>
      <h1>Class Scheduler</h1>
      <p>Please select your role to continue</p>
      <div style={{ display: 'flex', gap: '16px' }}>
        <button
          onClick={() => setRole('teacher')}
          style={{ background: '#6366f1', color: 'white', padding: '12px 28px', fontSize: '16px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
        >
          Login as Teacher
        </button>
        <button
          onClick={() => setRole('student')}
          style={{ background: '#10b981', color: 'white', padding: '12px 28px', fontSize: '16px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
        >
          Login as Student
        </button>
      </div>
    </div>
  );
}
