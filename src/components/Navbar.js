import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout, theme, toggleTheme, getLatestUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const me = user ? getLatestUser() : null;
  const unread = me?.messages?.length || 0;

  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={() => navigate(user ? '/main' : '/')}>
        💕 이성 친구 만들기
        <div className="navbar-sub">경기남부직업능력개발원</div>
      </div>

      <div className="navbar-right">
        <button className="theme-toggle" onClick={toggleTheme} title="다크모드 전환">
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        {user ? (
          <>
            {[
              { path: '/main', label: '홈' },
              { path: '/match', label: '💘 매칭' },
              { path: '/chat', label: '💬 채팅' },
              { path: '/ranking', label: '🏆 인기' },
              { path: '/notice', label: '📢 공지' },
            ].map(({ path, label }) => (
              <button key={path} className="btn-ghost"
                style={{ background: location.pathname === path ? 'var(--primary-light)' : undefined, color: location.pathname === path ? 'var(--primary)' : undefined }}
                onClick={() => navigate(path)}>
                {label}
              </button>
            ))}
            <button className="btn-outline" style={{ width: 'auto', padding: '8px 16px', fontSize: 14, position: 'relative' }} onClick={() => navigate('/mypage')}>
              마이페이지
              {unread > 0 && <span style={{ position: 'absolute', top: -4, right: -4, background: 'var(--primary)', color: '#fff', borderRadius: '50%', width: 18, height: 18, fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{unread > 9 ? '9+' : unread}</span>}
            </button>
            <button className="btn-ghost" onClick={() => { logout(); navigate('/'); }}>로그아웃</button>
          </>
        ) : (
          <>
            <button className="btn-ghost" onClick={() => navigate('/login')}>로그인</button>
            <button className="btn-primary" style={{ width: 'auto', padding: '9px 20px', fontSize: 14 }} onClick={() => navigate('/register')}>회원가입</button>
          </>
        )}
      </div>
    </nav>
  );
}
