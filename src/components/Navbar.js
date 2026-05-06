import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-brand" style={{ cursor: 'pointer' }} onClick={() => navigate('/main')}>
        💕 이성 친구 만들기
        <div className="navbar-sub">경기남부직업능력개발원</div>
      </div>
      <div className="navbar-right">
        {user ? (
          <>
            <span style={{ fontSize: 14, color: 'var(--muted)' }}>{user.name}님</span>
            <button className="btn-outline" style={{ width: 'auto', padding: '8px 18px', fontSize: 14 }} onClick={() => navigate('/mypage')}>마이페이지</button>
            <button className="btn-outline" style={{ width: 'auto', padding: '8px 18px', fontSize: 14 }} onClick={() => { logout(); navigate('/'); }}>로그아웃</button>
          </>
        ) : (
          <>
            <button className="btn-outline" style={{ width: 'auto', padding: '8px 18px', fontSize: 14 }} onClick={() => navigate('/login')}>로그인</button>
            <button className="btn-primary" style={{ width: 'auto', padding: '8px 18px', fontSize: 14 }} onClick={() => navigate('/register')}>회원가입</button>
          </>
        )}
      </div>
    </nav>
  );
}
