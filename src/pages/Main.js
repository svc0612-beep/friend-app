import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const CLASSES = [
  { key:'ai_data', label:'AI 데이터분석', icon:'📊', bg:'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80', desc:'빅데이터 · 머신러닝 · 시각화' },
  { key:'ai_office', label:'AI 사무', icon:'🖥️', bg:'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80', desc:'사무자동화 · RPA · AI활용' },
  { key:'3d_precision', label:'3D 정밀', icon:'🎨', bg:'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&q=80', desc:'3D모델링 · 프린팅 · CAD' },
  { key:'fire', label:'소방', icon:'🔥', bg:'https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?w=600&q=80', desc:'소방안전 · 구조 · 응급처치' },
  { key:'dev_special', label:'발달특화', icon:'💚', bg:'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80', desc:'협력 · 성장 · 따뜻한 배움' },
];

export default function Main() {
  const { user, members, getLatestUser } = useAuth();
  const navigate = useNavigate();
  if (!user) { navigate('/'); return null; }
  const me = getLatestUser();
  const totalMembers = members.length;

  return (
    <>
      <Navbar />
      <div className="page-container">
        {/* 인사 */}
        <div style={{ background:'linear-gradient(135deg, var(--primary-light), var(--bg2))', borderRadius:16, padding:'24px 28px', marginBottom:28, display:'flex', alignItems:'center', gap:16, flexWrap:'wrap' }}>
          <div style={{ fontSize:40 }}>{me?.gender==='여'?'👧':'👦'}</div>
          <div>
            <h2 style={{ fontSize:20, fontWeight:700 }}>안녕하세요, {me?.name || me?.id}님! 👋</h2>
            <p style={{ fontSize:14, color:'var(--muted)', marginTop:2 }}>현재 <strong style={{color:'var(--primary)'}}>{totalMembers}명</strong>이 함께하고 있어요</p>
          </div>
        </div>

        <h3 className="page-title">반을 선택하세요</h3>
        <p className="page-subtitle">원하는 반을 클릭해서 친구들 프로필을 확인해보세요</p>

        <div className="class-grid">
          {CLASSES.map(cls => {
            const cnt = members.filter(m => m.dept === cls.key).length;
            return (
              <div key={cls.key} className="class-card" onClick={() => navigate(`/class/${cls.key}`)}>
                <div className="class-card-bg" style={{ backgroundImage:`url(${cls.bg})` }} />
                <div className="class-card-label">
                  <div>{cls.icon} {cls.label}</div>
                  <div style={{ fontSize:11, opacity:0.85, fontWeight:400, marginTop:2 }}>{cls.desc}</div>
                  <div style={{ fontSize:11, opacity:0.75, marginTop:2 }}>👥 {cnt}명</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 빠른 메뉴 */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(160px,1fr))', gap:14, marginTop:28 }}>
          {[
            { icon:'💘', label:'매칭 추천', desc:'취향 기반 추천', path:'/match' },
            { icon:'💬', label:'채팅방', desc:'반별 실시간 채팅', path:'/chat' },
            { icon:'🏆', label:'인기 랭킹', desc:'하트 많은 친구', path:'/ranking' },
            { icon:'📢', label:'공지사항', desc:'이벤트 & 소식', path:'/notice' },
          ].map(({ icon, label, desc, path }) => (
            <div key={path} onClick={() => navigate(path)}
              style={{ background:'var(--card)', border:'1.5px solid var(--border)', borderRadius:14, padding:'18px 16px', cursor:'pointer', transition:'all 0.2s', textAlign:'center' }}
              onMouseEnter={e => e.currentTarget.style.boxShadow='var(--shadow-lg)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow=''}>
              <div style={{ fontSize:28, marginBottom:6 }}>{icon}</div>
              <div style={{ fontWeight:700, fontSize:14 }}>{label}</div>
              <div style={{ fontSize:12, color:'var(--muted)', marginTop:2 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
