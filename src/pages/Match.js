import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const MBTI_MATCH = {
  INTJ:['ENFP','ENTP'], INTP:['ENTJ','ENFJ'], ENTJ:['INTP','INFP'], ENTP:['INTJ','INFJ'],
  INFJ:['ENTP','ENFP'], INFP:['ENTJ','ENFJ'], ENFJ:['INTP','ISFP'], ENFP:['INTJ','INFJ'],
  ISTJ:['ESFP','ESTP'], ISTP:['ESTJ','ESFJ'], ESTJ:['ISTP','ISFP'], ESTP:['ISTJ','ISFJ'],
  ISFJ:['ESTP','ESFP'], ISFP:['ESTJ','ENFJ'], ESFJ:['ISTP','ISFP'], ESFP:['ISTJ','ISFJ'],
};

function calcScore(me, other) {
  if (!me || !other) return 0;
  let score = 0;
  const mbtiMatches = MBTI_MATCH[me.mbti] || [];
  if (mbtiMatches.includes(other.mbti)) score += 40;
  else if (me.mbti?.slice(1) === other.mbti?.slice(1)) score += 20;

  const myInterests = (me.interest || '').split(/[,，、\s]+/).map(s=>s.trim().toLowerCase()).filter(Boolean);
  const otherInterests = (other.interest || '').split(/[,，、\s]+/).map(s=>s.trim().toLowerCase()).filter(Boolean);
  const commonInterests = myInterests.filter(i => otherInterests.includes(i));
  score += commonInterests.length * 15;

  if (me.drama && other.drama && me.drama === other.drama) score += 10;
  if (me.movie && other.movie && me.movie === other.movie) score += 10;
  if (me.music && other.music && me.music === other.music) score += 10;

  return Math.min(score, 99);
}

function getCommonTags(me, other) {
  const tags = [];
  const mbtiMatches = MBTI_MATCH[me?.mbti] || [];
  if (mbtiMatches.includes(other?.mbti)) tags.push({ label:`MBTI 궁합 (${me?.mbti}↔${other?.mbti})`, hit:true });
  else tags.push({ label:`MBTI (${other?.mbti})`, hit:false });

  const myI = (me?.interest||'').split(/[,，、\s]+/).map(s=>s.trim().toLowerCase()).filter(Boolean);
  const otherI = (other?.interest||'').split(/[,，、\s]+/).map(s=>s.trim().toLowerCase()).filter(Boolean);
  myI.filter(i=>otherI.includes(i)).forEach(i=>tags.push({ label:`공통취미: ${i}`, hit:true }));

  if (me?.drama && other?.drama && me.drama===other.drama) tags.push({ label:`드라마: ${me.drama}`, hit:true });
  if (me?.movie && other?.movie && me.movie===other.movie) tags.push({ label:`영화: ${me.movie}`, hit:true });
  if (me?.music && other?.music && me.music===other.music) tags.push({ label:`음악: ${me.music}`, hit:true });
  return tags;
}

export default function Match() {
  const { user, members, toggleInterest, getLatestUser } = useAuth();
  const navigate = useNavigate();
  if (!user) { navigate('/login'); return null; }

  const me = getLatestUser();
  const blockedIds = me?.blockedIds || [];

  const matches = useMemo(() => {
    return members
      .filter(m => m.id !== user.id && !blockedIds.includes(m.id))
      .map(m => ({ ...m, score: calcScore(me, m), tags: getCommonTags(me, m) }))
      .sort((a,b) => b.score - a.score)
      .slice(0, 10);
  }, [members, me, user.id, blockedIds]);

  const DEPT_LABEL = { ai_data:'AI 데이터분석', ai_office:'AI 사무', '3d_precision':'3D 정밀', fire:'소방', dev_special:'발달특화' };

  return (
    <>
      <Navbar />
      <div className="page-container">
        <h1 className="page-title">💘 매칭 추천</h1>
        <p className="page-subtitle">MBTI 궁합 · 취미 · 취향을 분석해서 잘 맞는 친구를 추천해드려요</p>

        <div style={{ background:'var(--card)', border:'1.5px solid var(--border)', borderRadius:14, padding:'16px 20px', marginBottom:24, fontSize:14, color:'var(--muted)' }}>
          내 MBTI: <strong style={{color:'var(--primary)'}}>{me?.mbti}</strong> · 궁합 MBTI: <strong style={{color:'var(--primary)'}}>{(MBTI_MATCH[me?.mbti]||[]).join(', ') || '없음'}</strong>
        </div>

        {matches.length === 0 ? (
          <div style={{ textAlign:'center', padding:'60px 0', color:'var(--muted)' }}>
            <div style={{ fontSize:40, marginBottom:12 }}>🤷</div>
            <p>추천할 친구가 없어요. 프로필을 더 채워보세요!</p>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            {matches.map((m, idx) => {
              const liked = me?.interests?.includes(m.id);
              return (
                <div key={m.id} className="match-card">
                  <div className="match-score">{m.score}%</div>
                  <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:12 }}>
                    <div style={{ fontSize:20, fontWeight:800, color:'var(--muted)', minWidth:28 }}>#{idx+1}</div>
                    <div style={{ width:48, height:48, borderRadius:'50%', background:m.gender==='남'?'#dbeafe':'#fce7f3', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0, overflow:'hidden' }}>
                      {m.avatar ? <img src={m.avatar} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', borderRadius:'50%' }} /> : (m.gender==='남'?'👦':'👧')}
                    </div>
                    <div>
                      <div style={{ fontWeight:700, fontSize:16 }}>@{m.id}</div>
                      <div style={{ fontSize:13, color:'var(--muted)' }}>{m.namePublic?m.name:m.name.charAt(0)+'**'} · {m.mbti} · {DEPT_LABEL[m.dept]}</div>
                    </div>
                  </div>
                  <p style={{ fontSize:14, color:'var(--text2)', marginBottom:10 }}>{m.intro||'자기소개가 없어요.'}</p>
                  <div className="match-tags">
                    {m.tags.map((t,i) => <span key={i} className={`match-tag ${t.hit?'hit':''}`}>{t.label}</span>)}
                  </div>
                  <button
                    className={`like-btn ${liked?'liked':''}`}
                    style={{ marginTop:14 }}
                    onClick={()=>toggleInterest(m.id)}>
                    {liked?'❤️ 관심중':'🤍 관심 표시'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
