import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const submit = () => {
    if (!id || !password) { setError('아이디와 비밀번호를 입력해주세요.'); return; }
    const result = login(id, password);
    if (!result.ok) { setError(result.msg); return; }
    setSuccess(true);
    setTimeout(() => navigate('/main'), 1500);
  };

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 420, margin: '80px auto', padding: '0 20px' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 52, marginBottom: 12 }}>💕</div>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>로그인</h2>
          <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 28 }}>이성 친구 찾기에 오신 걸 환영해요!</p>

          <div className="form-group" style={{ textAlign: 'left' }}>
            <label>아이디</label>
            <input placeholder="아이디를 입력하세요" value={id} onChange={e => setId(e.target.value)} onKeyDown={e => e.key === 'Enter' && submit()} />
          </div>
          <div className="form-group" style={{ textAlign: 'left' }}>
            <label>비밀번호</label>
            <input type="password" placeholder="비밀번호를 입력하세요" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && submit()} />
          </div>

          {error && <div className="error-msg" style={{ marginBottom: 12 }}>{error}</div>}
          {success && <div className="success-msg">✅ 로그인 성공! 메인 페이지로 이동합니다...</div>}

          {!success && <button className="btn-primary" onClick={submit} style={{ marginTop: 4 }}>로그인</button>}

          <p style={{ marginTop: 20, fontSize: 14, color: 'var(--muted)' }}>
            아직 회원이 아니신가요?{' '}
            <span style={{ color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }} onClick={() => navigate('/register')}>회원가입</span>
          </p>
        </div>
      </div>
    </>
  );
}
