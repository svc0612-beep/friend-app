import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const CLASS_INFO = {
  ai_data: {
    label: 'AI 데이터분석반', icon: '📊',
    desc: '빅데이터 · 머신러닝 · Python · 시각화',
    bg: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
    color: '#1d4ed8',
  },
  ai_office: {
    label: 'AI 사무반', icon: '🖥️',
    desc: '사무자동화 · RPA · AI 활용 · 문서작성',
    bg: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=80',
    color: '#0e7490',
  },
  '3d_precision': {
    label: '3D 정밀반', icon: '🎨',
    desc: '3D 모델링 · 프린팅 · CAD · 정밀가공',
    bg: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200&q=80',
    color: '#7c3aed',
  },
  fire: {
    label: '소방반', icon: '🔥',
    desc: '소방안전 · 구조 · 응급처치 · 소방설비',
    bg: 'https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?w=1200&q=80',
    color: '#dc2626',
  },
  dev_special: {
    label: '발달특화반', icon: '💚',
    desc: '협력 · 성장 · 따뜻한 배움 · 직업역량',
    bg: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&q=80',
    color: '#15803d',
  },
};

export default function ClassPage() {
  const { dept } = useParams();
  const { user, members, toggleInterest, sendMessage } = useAuth();
  const navigate = useNavigate();
  const [msgTarget, setMsgTarget] = useState(null);
  const [msgText, setMsgText] = useState('');
  const [sentTo, setSentTo] = useState(null);

  const info = CLASS_INFO[dept];
  if (!info) return <div>없는 반입니다.</div>;

  const classMembers = members.filter(m => m.dept === dept);

  const handleSend = (toId) => {
    if (!msgText.trim()) return;
    sendMessage(toId, msgText.trim());
    setSentTo(toId);
    setMsgText('');
    setTimeout(() => setSentTo(null), 2000);
    setMsgTarget(null);
  };

  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="page-hero">
          <div className="page-hero-bg" style={{ backgroundImage: `url(${info.bg})` }} />
          <div className="page-hero-content">
            <h1>{info.icon} {info.label}</h1>
            <p>{info.desc}</p>
          </div>
        </div>

        <button style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: 14, cursor: 'pointer', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 4, padding: 0, width: 'auto', fontFamily: 'inherit' }} onClick={() => navigate('/main')}>
          ← 반 목록으로
        </button>

        {classMembers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--muted)' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🙈</div>
            <p>아직 이 반에 등록된 친구가 없어요.</p>
          </div>
        ) : (
          <>
            <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 20 }}>총 {classMembers.length}명의 친구가 있어요</p>
            <div className="member-grid">
              {classMembers.map(m => {
                const liked = user?.interests?.includes(m.id);
                return (
                  <div key={m.id} className="member-card">
                    <div className={`member-avatar ${m.gender === '남' ? 'male-avatar' : 'female-avatar'}`}>
                      {m.gender === '남' ? '👦' : '👧'}
                    </div>
                    <div className="member-id">{m.id}</div>
                    <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 6 }}>{m.name} · {m.gender}</div>
                    <div className="member-mbti">{m.mbti}</div>
                    <p className="member-intro">{m.intro || '자기소개가 없어요.'}</p>
                    <div className="member-job" style={{ color: info.color, fontWeight: 600 }}>{info.label}</div>

                    {user && user.id !== m.id && (
                      <div style={{ marginTop: 14, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        <button
                          className={`like-btn ${liked ? 'liked' : ''}`}
                          onClick={() => toggleInterest(m.id)}
                        >
                          {liked ? '❤️' : '🤍'} {liked ? '관심중' : '관심'}
                        </button>
                        <button
                          className="like-btn"
                          onClick={() => setMsgTarget(msgTarget === m.id ? null : m.id)}
                          style={{ borderColor: 'var(--secondary)', color: 'var(--secondary)' }}
                        >
                          ✉️ 쪽지
                        </button>
                      </div>
                    )}

                    {msgTarget === m.id && (
                      <div className="send-msg-form" style={{ marginTop: 12 }}>
                        <input
                          placeholder="쪽지 내용을 입력하세요"
                          value={msgText}
                          onChange={e => setMsgText(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && handleSend(m.id)}
                        />
                        <button className="btn-primary" style={{ borderRadius: 8 }} onClick={() => handleSend(m.id)}>전송</button>
                      </div>
                    )}
                    {sentTo === m.id && <div className="success-msg" style={{ marginTop: 8, fontSize: 13 }}>✅ 쪽지를 보냈어요!</div>}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </>
  );
}
