import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const submit = () => {
    if (!id || !pw) { setError('아이디와 비밀번호를 입력해주세요.'); return; }
    const res = login(id, pw);
    if (!res.ok) { setError(res.msg); return; }
    setSuccess(true);
    setTimeout(() => navigate('/main'), 1200);
  };

  return (
    <>
      <Navbar />
      <div style={{ maxWidth:420, margin:'80px auto', padding:'0 20px' }}>
        <div className="card" style={{ textAlign:'center' }}>
          <div style={{ fontSize:56, marginBottom:12 }}>💕</div>
          <h2 style={{ fontSize:24, fontWeight:700, marginBottom:4 }}>로그인</h2>
          <p style={{ color:'var(--muted)', fontSize:14, marginBottom:28 }}>이성 친구 찾기에 오신 걸 환영해요!</p>

          <div className="form-group" style={{ textAlign:'left' }}>
            <label>아이디</label>
            <input placeholder="아이디 입력" value={id} onChange={e=>setId(e.target.value)} onKeyDown={e=>e.key==='Enter'&&submit()} />
          </div>
          <div className="form-group" style={{ textAlign:'left' }}>
            <label>비밀번호</label>
            <input type="password" placeholder="비밀번호 입력" value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==='Enter'&&submit()} />
          </div>

          {error && <p className="error-msg" style={{marginBottom:10}}>{error}</p>}
          {success && <div className="success-msg">✅ 로그인 성공! 메인으로 이동합니다...</div>}
          {!success && <button className="btn-primary" onClick={submit} style={{marginTop:6}}>로그인</button>}

          <div style={{ marginTop:16, fontSize:13, color:'var(--muted)' }}>
            <p>테스트 계정: <strong>jungmin92</strong> / <strong>1234</strong></p>
          </div>
          <p style={{ marginTop:16, fontSize:14, color:'var(--muted)' }}>
            아직 회원이 아니신가요?{' '}
            <span style={{ color:'var(--primary)', fontWeight:600, cursor:'pointer' }} onClick={()=>navigate('/register')}>회원가입</span>
          </p>
        </div>
      </div>
    </>
  );
}
