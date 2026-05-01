import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const DEPT_LABEL = { ai_data:'AI 데이터분석', ai_office:'AI 사무', '3d_precision':'3D 정밀', fire:'소방', dev_special:'발달특화' };

export default function Ranking() {
  const { members, user, toggleInterest, getLatestUser } = useAuth();
  const navigate = useNavigate();
  if (!user) { navigate('/login'); return null; }
  const me = getLatestUser();

  const ranked = [...members]
    .sort((a, b) => (b.likedBy?.length || 0) - (a.likedBy?.length || 0))
    .slice(0, 10);

  const medals = ['🥇','🥈','🥉'];

  return (
    <>
      <Navbar />
      <div className="page-container">
        <h1 className="page-title">🏆 인기 랭킹</h1>
        <p className="page-subtitle">하트를 가장 많이 받은 회원 TOP 10이에요</p>

        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {ranked.map((m, idx) => {
            const liked = me?.interests?.includes(m.id);
            const isMine = m.id === user.id;
            return (
              <div key={m.id} className="rank-item">
                <div className="rank-num">{medals[idx] || `#${idx+1}`}</div>
                <div style={{ width:44, height:44, borderRadius:'50%', background:m.gender==='남'?'#dbeafe':'#fce7f3', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0, overflow:'hidden' }}>
                  {m.avatar ? <img src={m.avatar} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', borderRadius:'50%' }} /> : (m.gender==='남'?'👦':'👧')}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, fontSize:15 }}>
                    @{m.id} {isMine && <span style={{ fontSize:11, color:'var(--primary)', background:'var(--primary-light)', padding:'1px 7px', borderRadius:10, marginLeft:6 }}>나</span>}
                  </div>
                  <div style={{ fontSize:12, color:'var(--muted)' }}>{m.namePublic?m.name:m.name.charAt(0)+'**'} · {m.mbti} · {DEPT_LABEL[m.dept]}</div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontWeight:800, fontSize:18, color:'var(--primary)' }}>❤️ {m.likedBy?.length || 0}</div>
                  <div style={{ fontSize:11, color:'var(--muted)' }}>하트</div>
                </div>
                {!isMine && (
                  <button className={`like-btn ${liked?'liked':''}`} style={{ marginLeft:8, flexShrink:0 }} onClick={()=>toggleInterest(m.id)}>
                    {liked?'❤️':'🤍'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
