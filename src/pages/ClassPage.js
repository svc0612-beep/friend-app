import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Toast from '../components/Toast';
import { useAuth } from '../context/AuthContext';

const CLASS_INFO = {
  ai_data: { label:'AI 데이터분석반', icon:'📊', desc:'빅데이터 · 머신러닝 · Python · 시각화', bg:'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80', color:'#1d4ed8' },
  ai_office: { label:'AI 사무반', icon:'🖥️', desc:'사무자동화 · RPA · AI활용 · 문서작성', bg:'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=80', color:'#0e7490' },
  '3d_precision': { label:'3D 정밀반', icon:'🎨', desc:'3D모델링 · 프린팅 · CAD · 정밀가공', bg:'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200&q=80', color:'#7c3aed' },
  fire: { label:'소방반', icon:'🔥', desc:'소방안전 · 구조 · 응급처치 · 소방설비', bg:'https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?w=1200&q=80', color:'#dc2626' },
  dev_special: { label:'발달특화반', icon:'💚', desc:'협력 · 성장 · 따뜻한 배움 · 직업역량', bg:'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&q=80', color:'#15803d' },
};

export default function ClassPage() {
  const { dept } = useParams();
  const { user, members, toggleInterest, toggleBlock, sendMessage, recordVisit, getLatestUser } = useAuth();
  const navigate = useNavigate();
  const [msgTarget, setMsgTarget] = useState(null);
  const [msgText, setMsgText] = useState('');
  const [expanded, setExpanded] = useState(null);
  const [toast, setToast] = useState('');
  const [filter, setFilter] = useState('all');

  const me = getLatestUser();
  const info = CLASS_INFO[dept];

  useEffect(() => {
    members.filter(m => m.dept === dept && m.id !== user?.id).forEach(m => recordVisit(m.id));
  // eslint-disable-next-line
  }, [dept]);

  if (!info) return <div>없는 반입니다.</div>;
  if (!user) { navigate('/login'); return null; }

  const blockedIds = me?.blockedIds || [];
  let classMembers = members.filter(m => m.dept === dept && !blockedIds.includes(m.id));
  if (filter === 'male') classMembers = classMembers.filter(m => m.gender === '남');
  if (filter === 'female') classMembers = classMembers.filter(m => m.gender === '여');

  const handleSend = (toId) => {
    if (!msgText.trim()) return;
    sendMessage(toId, msgText.trim());
    setMsgTarget(null);
    setMsgText('');
    setToast('✉️ 쪽지를 보냈어요!');
  };

  const displayName = (m) => m.namePublic ? m.name : (m.name?.charAt(0) + '**');

  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="page-hero">
          <div className="page-hero-bg" style={{ backgroundImage:`url(${info.bg})` }} />
          <div className="page-hero-content">
            <h1>{info.icon} {info.label}</h1>
            <p>{info.desc}</p>
          </div>
        </div>

        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20, flexWrap:'wrap', gap:10 }}>
          <button style={{ background:'none', border:'none', color:'var(--muted)', fontSize:14, cursor:'pointer', padding:0, width:'auto', fontFamily:'inherit', display:'flex', alignItems:'center', gap:4 }} onClick={()=>navigate('/main')}>
            ← 반 목록으로
          </button>
          <div style={{ display:'flex', gap:8 }}>
            {[['all','전체'],['female','여성만'],['male','남성만']].map(([v,l])=>(
              <button key={v} onClick={()=>setFilter(v)}
                style={{ background:filter===v?'var(--primary)':'var(--bg2)', color:filter===v?'#fff':'var(--text2)', border:'none', borderRadius:20, padding:'6px 14px', fontSize:13, cursor:'pointer', fontFamily:'inherit', fontWeight:filter===v?700:400 }}>
                {l}
              </button>
            ))}
          </div>
        </div>

        <p style={{ fontSize:14, color:'var(--muted)', marginBottom:20 }}>총 {classMembers.length}명의 친구가 있어요</p>

        {classMembers.length === 0 ? (
          <div style={{ textAlign:'center', padding:'60px 0', color:'var(--muted)' }}>
            <div style={{ fontSize:40, marginBottom:12 }}>🙈</div>
            <p>해당 조건의 친구가 없어요.</p>
          </div>
        ) : (
          <div className="member-grid">
            {classMembers.map(m => {
              const isMine = user.id === m.id;
              const liked = me?.interests?.includes(m.id);
              const isBlocked = blockedIds.includes(m.id);
              const likedByList = m.likedBy || [];

              return (
                <div key={m.id} className="member-card">
                  {/* 방문자 수 */}
                  <div className="visitor-badge">👀 {m.visitors || 0}</div>

                  {isMine && (
                    <div style={{ fontSize:11, fontWeight:700, color:'var(--primary)', background:'var(--primary-light)', padding:'2px 10px', borderRadius:20, display:'inline-block', marginBottom:8 }}>
                      나의 프로필
                    </div>
                  )}

                  {/* 아바타 */}
                  <div className={`member-avatar ${m.gender==='남'?'male-avatar':'female-avatar'}`}>
                    {m.avatar
                      ? <img src={m.avatar} alt="avatar" />
                      : (m.gender==='남' ? '👦' : '👧')}
                  </div>

                  <div className="member-id">@{m.id}</div>
                  <div style={{ fontSize:13, color:'var(--muted)', marginBottom:4 }}>
                    {displayName(m)} · {m.gender} {m.age ? `· ${m.age}세` : ''}
                  </div>
                  <div className="member-mbti">{m.mbti}</div>
                  <p className="member-intro" style={{ marginTop:4 }}>{m.intro || '자기소개가 없어요.'}</p>

                  {/* 취향 토글 */}
                  <button
                    onClick={()=>setExpanded(expanded===m.id?null:m.id)}
                    style={{ background:'none', border:'1.5px solid var(--border)', borderRadius:8, fontSize:12, color:'var(--muted)', padding:'4px 12px', marginTop:10, cursor:'pointer', width:'auto', fontFamily:'inherit' }}>
                    {expanded===m.id ? '▲ 접기' : '▼ 취향 보기'}
                  </button>

                  {expanded===m.id && (
                    <div style={{ marginTop:8, fontSize:13, color:'var(--text)', lineHeight:2.1, background:'var(--bg2)', borderRadius:8, padding:'10px 14px' }}>
                      {m.drama && <div>🎭 드라마: {m.drama}</div>}
                      {m.movie && <div>🎬 영화: {m.movie}</div>}
                      {m.music && <div>🎵 음악: {m.music}</div>}
                      {m.interest && <div>✨ 관심사: {m.interest}</div>}
                      {m.ideal && <div>💘 이상형: {m.ideal}</div>}
                    </div>
                  )}

                  {/* 내 프로필: 하트 누른 사람 */}
                  {isMine && likedByList.length > 0 && (
                    <div style={{ marginTop:10, fontSize:12, color:'var(--primary)', background:'var(--primary-light)', borderRadius:8, padding:'6px 12px' }}>
                      ❤️ {likedByList.join(', ')} 님이 관심 표시했어요
                    </div>
                  )}

                  {/* 액션 버튼 (본인 제외) */}
                  {!isMine && (
                    <div className="action-row">
                      <button
                        className={`like-btn ${liked?'liked':''}`}
                        onClick={()=>{toggleInterest(m.id); setToast(liked?'관심을 취소했어요':'❤️ 관심 표시했어요!');}}>
                        {liked ? '❤️' : '🤍'} {liked ? '관심중' : '관심'}
                      </button>
                      <button
                        className="like-btn"
                        onClick={()=>setMsgTarget(msgTarget===m.id?null:m.id)}
                        style={{ borderColor:'var(--secondary)', color:'var(--secondary)' }}>
                        ✉️ 쪽지
                      </button>
                      <button
                        className={`block-btn ${isBlocked?'blocked':''}`}
                        onClick={()=>{toggleBlock(m.id); setToast(isBlocked?'차단을 해제했어요':'🚫 차단했어요');}}>
                        {isBlocked ? '차단됨' : '차단'}
                      </button>
                    </div>
                  )}

                  {msgTarget===m.id && (
                    <div className="send-msg-form">
                      <input
                        placeholder="쪽지 내용"
                        value={msgText}
                        onChange={e=>setMsgText(e.target.value)}
                        onKeyUp={e=>e.key==='Enter'&&handleSend(m.id)}
                      />
                      <button className="btn-primary" style={{ borderRadius:8 }} onClick={()=>handleSend(m.id)}>전송</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Toast msg={toast} onClose={()=>setToast('')} />
    </>
  );
}