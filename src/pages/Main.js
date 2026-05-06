import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const CLASSES = [
  {
    key: 'ai_data', label: 'AI 데이터분석', icon: '📊',
    bg: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80',
    desc: '빅데이터 · 머신러닝 · 시각화'
  },
  {
    key: 'ai_office', label: 'AI 사무', icon: '🖥️',
    bg: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80',
    desc: '사무자동화 · RPA · AI 활용'
  },
  {
    key: '3d_precision', label: '3D 정밀', icon: '🎨',
    bg: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&q=80',
    desc: '3D 모델링 · 프린팅 · 정밀가공'
  },
  {
    key: 'fire', label: '소방', icon: '🔥',
    bg: 'https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?w=600&q=80',
    desc: '소방안전 · 구조 · 응급처치'
  },
  {
    key: 'dev_special', label: '발달특화', icon: '💚',
    bg: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80',
    desc: '협력 · 성장 · 따뜻한 배움'
  },
];

export default function Main() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <>
        <Navbar />
        <div style={{ textAlign: 'center', padding: '120px 24px' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
          <p style={{ fontSize: 18, color: 'var(--muted)', marginBottom: 24 }}>로그인 후 이용할 수 있습니다.</p>
          <button className="btn-primary" style={{ width: 'auto', padding: '12px 32px' }} onClick={() => navigate('/login')}>로그인 하기</button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="page-container">
        <div style={{ marginBottom: 32 }}>
          <h1 className="page-title">안녕하세요, {user.name}님! 👋</h1>
          <p className="page-subtitle">어떤 반 친구들을 만나볼까요? 반을 선택해서 프로필을 확인해보세요.</p>
        </div>

        <div className="class-grid">
          {CLASSES.map(cls => (
            <div key={cls.key} className="class-card" onClick={() => navigate(`/class/${cls.key}`)}>
              <div className="class-card-bg" style={{ backgroundImage: `url(${cls.bg})` }} />
              <div className="class-card-label">
                <div>{cls.icon} {cls.label}</div>
                <div style={{ fontSize: 12, opacity: 0.85, fontWeight: 400, marginTop: 2 }}>{cls.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: 'linear-gradient(135deg, #fce7f3, #dbeafe)', borderRadius: 16, padding: '28px 32px', marginTop: 12 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>💡 이용 안내</h3>
          <ul style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 2, paddingLeft: 18 }}>
            <li>원하는 반을 클릭해 친구들의 프로필을 확인하세요</li>
            <li>관심 있는 친구에게 하트를 눌러 관심 표시를 해보세요</li>
            <li>쪽지를 보내 친구를 사귀어보세요 ✉️</li>
            <li>마이페이지에서 내 정보를 관리할 수 있어요</li>
          </ul>
        </div>
      </div>
    </>
  );
}
