import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function Home() {
  const navigate = useNavigate();
  return (
    <>
      <Navbar />
      <div style={{ background: 'linear-gradient(135deg, #fce7f3 0%, #fff8f9 60%, #dbeafe 100%)', minHeight: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '60px 24px' }}>
        <div style={{ fontSize: 64, marginBottom: 20 }}>💕</div>
        <h1 style={{ fontFamily: "'Nanum Myeongjo', serif", fontSize: 42, fontWeight: 800, color: 'var(--primary)', marginBottom: 12 }}>이성 친구 만들기</h1>
        <p style={{ fontSize: 18, color: 'var(--secondary)', fontWeight: 600, marginBottom: 8 }}>경기남부직업능력개발원</p>
        <p style={{ fontSize: 16, color: 'var(--muted)', maxWidth: 480, lineHeight: 1.7, marginBottom: 44 }}>
          같은 직능원에서 공부하는 친구들과 소통하고, 새로운 인연을 만들어 보세요. ✨
        </p>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
          <button className="btn-primary" style={{ width: 'auto', padding: '14px 40px', fontSize: 17, borderRadius: 50 }} onClick={() => navigate('/register')}>
            지금 시작하기 →
          </button>
          <button className="btn-outline" style={{ width: 'auto', padding: '14px 40px', fontSize: 17, borderRadius: 50 }} onClick={() => navigate('/login')}>
            로그인
          </button>
        </div>
        <div style={{ display: 'flex', gap: 32, marginTop: 64, flexWrap: 'wrap', justifyContent: 'center' }}>
          {[['📊','AI 데이터분석'],['🖥️','AI 사무'],['🎨','3D 정밀'],['🔥','소방'],['💚','발달특화']].map(([icon, label]) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 32 }}>{icon}</div>
              <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 6, fontWeight: 600 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
