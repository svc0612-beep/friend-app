import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function Home() {
  const navigate = useNavigate();
  return (
    <>
      <Navbar />
      <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '60px 24px', background: 'linear-gradient(135deg, var(--primary-light) 0%, var(--bg) 60%)' }}>
        <div style={{ fontSize: 72, marginBottom: 20 }}>💕</div>
        <h1 style={{ fontFamily: "'Nanum Myeongjo', serif", fontSize: 44, fontWeight: 800, color: 'var(--primary)', marginBottom: 12 }}>이성 친구 만들기</h1>
        <p style={{ fontSize: 18, color: 'var(--secondary)', fontWeight: 600, marginBottom: 8 }}>경기남부직업능력개발원</p>
        <p style={{ fontSize: 16, color: 'var(--muted)', maxWidth: 480, lineHeight: 1.8, marginBottom: 48 }}>
          같은 직능원에서 공부하는 친구들과 소통하고<br />새로운 인연을 만들어 보세요 ✨
        </p>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 64 }}>
          <button className="btn-primary" style={{ width: 'auto', padding: '15px 44px', fontSize: 17, borderRadius: 50 }} onClick={() => navigate('/register')}>
            회원가입하기 →
          </button>
          <button className="btn-outline" style={{ width: 'auto', padding: '14px 40px', fontSize: 17, borderRadius: 50 }} onClick={() => navigate('/login')}>
            로그인
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 20, maxWidth: 700, width: '100%' }}>
          {[
            ['💘', '매칭 추천', 'MBTI·취향 기반으로 잘 맞는 친구 추천'],
            ['💬', '실시간 채팅', '반별 채팅방에서 자유롭게 소통'],
            ['🏆', '인기 랭킹', '하트 많이 받은 인기 회원 확인'],
            ['📢', '공지사항', '직능원 소식과 이벤트 확인'],
          ].map(([icon, title, desc]) => (
            <div key={title} style={{ background: 'var(--card)', borderRadius: 14, padding: '20px 16px', border: '1.5px solid var(--border)', textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>{icon}</div>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{title}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.6 }}>{desc}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 24, marginTop: 48, flexWrap: 'wrap', justifyContent: 'center' }}>
          {[['📊','AI 데이터분석'],['🖥️','AI 사무'],['🎨','3D 정밀'],['🔥','소방'],['💚','발달특화']].map(([icon, label]) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 30 }}>{icon}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 5, fontWeight: 600 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
