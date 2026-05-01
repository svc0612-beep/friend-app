import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Toast from '../components/Toast';
import { useAuth } from '../context/AuthContext';

const DEPTS = [
  { value:'ai_data', label:'AI 데이터분석' },
  { value:'ai_office', label:'AI 사무' },
  { value:'3d_precision', label:'3D 정밀' },
  { value:'fire', label:'소방' },
  { value:'dev_special', label:'발달특화' },
];
const MBTIS = ['INTJ','INTP','ENTJ','ENTP','INFJ','INFP','ENFJ','ENFP','ISTJ','ISTP','ESTJ','ESTP','ISFJ','ISFP','ESFJ','ESFP'];
const DEPT_LABEL = { ai_data:'AI 데이터분석', ai_office:'AI 사무', '3d_precision':'3D 정밀', fire:'소방', dev_special:'발달특화' };

export default function MyPage() {
  const { user, members, updateProfile, updateAvatar, deleteAccount, logout, getLatestUser, toggleBlock } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('messages');
  const [editForm, setEditForm] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [toast, setToast] = useState('');
  const fileRef = useRef();

  if (!user) { navigate('/login'); return null; }

  const me = getLatestUser();
  const myMessages = [...(me?.messages || [])].reverse();
  const myInterests = (me?.interests || []).map(id => members.find(m => m.id === id)).filter(Boolean);
  const likedByList = (me?.likedBy || []).map(id => members.find(m => m.id === id)).filter(Boolean);
  const blockedList = (me?.blockedIds || []).map(id => members.find(m => m.id === id)).filter(Boolean);

  const startEdit = () => setEditForm({
    name:me.name, namePublic:me.namePublic??true, gender:me.gender,
    dept:me.dept, mbti:me.mbti, intro:me.intro||'',
    phone:me.phone, email:me.email||'',
    drama:me.drama||'', movie:me.movie||'',
    music:me.music||'', interest:me.interest||'', ideal:me.ideal||''
  });
  const setE = (k,v) => setEditForm(f=>({...f,[k]:v}));
  const saveEdit = () => { updateProfile(editForm); setEditForm(null); setToast('✅ 정보가 수정되었습니다!'); };

  const handleAvatar = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2*1024*1024) { setToast('⚠️ 파일 크기는 2MB 이하만 가능해요'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => { updateAvatar(ev.target.result); setToast('📸 프로필 사진이 변경되었어요!'); };
    reader.readAsDataURL(file);
  };

  const handleDelete = () => { deleteAccount(); logout(); navigate('/'); };

  const Row2 = ({children}) => <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0 16px'}}>{children}</div>;
  const F = ({label,children}) => <div className="form-group"><label>{label}</label>{children}</div>;

  return (
    <>
      <Navbar />
      <div className="page-container">
        {/* 프로필 헤더 */}
        <div style={{ background:'linear-gradient(135deg, var(--primary-light), var(--bg2))', borderRadius:16, padding:'24px 28px', marginBottom:28, display:'flex', alignItems:'center', gap:20, flexWrap:'wrap' }}>
          {/* 아바타 + 업로드 */}
          <div style={{ position:'relative', cursor:'pointer' }} onClick={()=>fileRef.current?.click()}>
            <div style={{ width:72, height:72, borderRadius:'50%', background:me.gender==='여'?'#fce7f3':'#dbeafe', display:'flex', alignItems:'center', justifyContent:'center', fontSize:32, overflow:'hidden', border:'3px solid var(--primary)' }}>
              {me.avatar ? <img src={me.avatar} alt="avatar" style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : (me.gender==='여'?'👧':'👦')}
            </div>
            <div style={{ position:'absolute', bottom:0, right:0, background:'var(--primary)', borderRadius:'50%', width:22, height:22, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, color:'#fff' }}>📷</div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }} onChange={handleAvatar} />
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:700, fontSize:20 }}>
              {me.namePublic ? me.name : me.name.charAt(0)+'**'}
              <span style={{ fontSize:12, color:'var(--muted)', fontWeight:400, marginLeft:8 }}>({me.namePublic?'이름 공개':'비공개'})</span>
            </div>
            <div style={{ fontSize:14, color:'var(--muted)', marginTop:2 }}>@{me.id} · {DEPT_LABEL[me.dept]} · {me.mbti}</div>
            <div style={{ fontSize:13, color:'var(--muted)', marginTop:4 }}>{me.intro || '자기소개를 추가해보세요.'}</div>
          </div>
          <div style={{ fontSize:13, color:'var(--muted)', lineHeight:1.8 }}>
            <div>📱 {me.phone}</div>
            <div>📧 {me.email}</div>
            <div>👀 방문자 {me.visitors||0}명</div>
            <div>❤️ 하트 {me.likedBy?.length||0}개</div>
          </div>
        </div>

        {/* 탭 */}
        <div className="mypage-tabs">
          {[
            ['messages', `📩 받은 쪽지 (${myMessages.length})`],
            ['interests', `❤️ 관심 친구 (${myInterests.length})`],
            ['likedby', `💘 나를 좋아하는 (${likedByList.length})`],
            ['blocked', `🚫 차단 목록 (${blockedList.length})`],
            ['edit', '✏️ 정보 수정'],
            ['delete', '🗑️ 회원 탈퇴'],
          ].map(([key, label]) => (
            <button key={key} className={`mypage-tab ${tab===key?'active':''}`} onClick={()=>setTab(key)}>{label}</button>
          ))}
        </div>

        {/* 받은 쪽지 */}
        {tab==='messages' && (
          <div>
            <h3 style={{fontSize:17,fontWeight:700,marginBottom:16}}>받은 쪽지</h3>
            {myMessages.length===0 ? (
              <div style={{textAlign:'center',padding:'48px 0',color:'var(--muted)'}}>
                <div style={{fontSize:36,marginBottom:12}}>📭</div>
                <p>아직 받은 쪽지가 없어요.</p>
              </div>
            ) : myMessages.map((msg,i)=>(
              <div key={i} className="message-item">
                <div className="message-from">✉️ @{msg.from}</div>
                <div className="message-body">{msg.body}</div>
                <div className="message-date">{msg.date}</div>
              </div>
            ))}
          </div>
        )}

        {/* 관심 친구 */}
        {tab==='interests' && (
          <div>
            <h3 style={{fontSize:17,fontWeight:700,marginBottom:16}}>관심 표시한 친구</h3>
            {myInterests.length===0 ? (
              <div style={{textAlign:'center',padding:'48px 0',color:'var(--muted)'}}>
                <div style={{fontSize:36,marginBottom:12}}>🤍</div>
                <p>아직 관심 표시한 친구가 없어요.</p>
              </div>
            ) : (
              <div className="member-grid">
                {myInterests.map(m=>(
                  <div key={m.id} className="member-card">
                    <div className={`member-avatar ${m.gender==='남'?'male-avatar':'female-avatar'}`}>
                      {m.avatar?<img src={m.avatar} alt="" style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:'50%'}}/>:(m.gender==='남'?'👦':'👧')}
                    </div>
                    <div className="member-id">@{m.id}</div>
                    <div style={{fontSize:13,color:'var(--muted)',marginBottom:6}}>{m.namePublic?m.name:m.name.charAt(0)+'**'} · {m.gender}</div>
                    <div className="member-mbti">{m.mbti}</div>
                    <p className="member-intro">{m.intro||'자기소개 없음'}</p>
                    <p style={{fontSize:12,color:'var(--muted)',marginTop:6}}>{DEPT_LABEL[m.dept]}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 나를 좋아하는 */}
        {tab==='likedby' && (
          <div>
            <h3 style={{fontSize:17,fontWeight:700,marginBottom:16}}>💘 나에게 관심 표시한 사람</h3>
            {likedByList.length===0 ? (
              <div style={{textAlign:'center',padding:'48px 0',color:'var(--muted)'}}>
                <div style={{fontSize:36,marginBottom:12}}>💔</div>
                <p>아직 관심 표시한 사람이 없어요.<br/>프로필을 더 채워보세요!</p>
              </div>
            ) : (
              <div className="member-grid">
                {likedByList.map(m=>(
                  <div key={m.id} className="member-card">
                    <div className={`member-avatar ${m.gender==='남'?'male-avatar':'female-avatar'}`}>
                      {m.avatar?<img src={m.avatar} alt="" style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:'50%'}}/>:(m.gender==='남'?'👦':'👧')}
                    </div>
                    <div className="member-id">@{m.id}</div>
                    <div style={{fontSize:13,color:'var(--muted)',marginBottom:6}}>{m.namePublic?m.name:m.name.charAt(0)+'**'} · {m.gender}</div>
                    <div className="member-mbti">{m.mbti}</div>
                    <p className="member-intro">{m.intro||'자기소개 없음'}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 차단 목록 */}
        {tab==='blocked' && (
          <div>
            <h3 style={{fontSize:17,fontWeight:700,marginBottom:16}}>🚫 차단 목록</h3>
            {blockedList.length===0 ? (
              <div style={{textAlign:'center',padding:'48px 0',color:'var(--muted)'}}>
                <div style={{fontSize:36,marginBottom:12}}>✅</div>
                <p>차단한 사용자가 없어요.</p>
              </div>
            ) : (
              <div style={{display:'flex',flexDirection:'column',gap:10}}>
                {blockedList.map(m=>(
                  <div key={m.id} style={{background:'var(--card)',border:'1.5px solid var(--border)',borderRadius:12,padding:'14px 18px',display:'flex',alignItems:'center',gap:14}}>
                    <div style={{fontSize:20}}>{m.gender==='남'?'👦':'👧'}</div>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:600}}>@{m.id}</div>
                      <div style={{fontSize:13,color:'var(--muted)'}}>{DEPT_LABEL[m.dept]}</div>
                    </div>
                    <button className="btn-outline" style={{width:'auto',padding:'7px 16px',fontSize:13}} onClick={()=>{toggleBlock(m.id);setToast('차단을 해제했어요');}}>차단 해제</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 정보 수정 */}
        {tab==='edit' && (
          <div style={{maxWidth:560}}>
            <h3 style={{fontSize:17,fontWeight:700,marginBottom:20}}>개인정보 수정</h3>
            {!editForm ? (
              <button className="btn-outline" style={{width:'auto',padding:'12px 28px'}} onClick={startEdit}>수정하기</button>
            ) : (
              <div>
                <div className="form-section-title">📋 기본 정보</div>
                <Row2>
                  <F label="이름"><input value={editForm.name} onChange={e=>setE('name',e.target.value)}/></F>
                  <F label="이름 공개">
                    <select value={editForm.namePublic} onChange={e=>setE('namePublic',e.target.value==='true')}>
                      <option value="true">공개</option><option value="false">비공개</option>
                    </select>
                  </F>
                </Row2>
                <Row2>
                  <F label="성별"><select value={editForm.gender} onChange={e=>setE('gender',e.target.value)}><option value="남">남</option><option value="여">여</option></select></F>
                  <F label="MBTI"><select value={editForm.mbti} onChange={e=>setE('mbti',e.target.value)}>{MBTIS.map(m=><option key={m}>{m}</option>)}</select></F>
                </Row2>
                <Row2>
                  <F label="직군"><select value={editForm.dept} onChange={e=>setE('dept',e.target.value)}>{DEPTS.map(d=><option key={d.value} value={d.value}>{d.label}</option>)}</select></F>
                  <F label="휴대폰"><input value={editForm.phone} onChange={e=>setE('phone',e.target.value)}/></F>
                </Row2>
                <F label="이메일"><input type="email" value={editForm.email} onChange={e=>setE('email',e.target.value)}/></F>
                <F label="자기소개"><textarea value={editForm.intro} onChange={e=>setE('intro',e.target.value)}/></F>
                <div className="form-section-title">🎬 취향 & 관심사</div>
                <Row2>
                  <F label="드라마"><input value={editForm.drama} onChange={e=>setE('drama',e.target.value)}/></F>
                  <F label="영화"><input value={editForm.movie} onChange={e=>setE('movie',e.target.value)}/></F>
                </Row2>
                <Row2>
                  <F label="음악/가수"><input value={editForm.music} onChange={e=>setE('music',e.target.value)}/></F>
                  <F label="관심사/취미"><input value={editForm.interest} onChange={e=>setE('interest',e.target.value)}/></F>
                </Row2>
                <F label="이상형"><input value={editForm.ideal} onChange={e=>setE('ideal',e.target.value)}/></F>
                <div style={{display:'flex',gap:10,marginTop:8}}>
                  <button className="btn-primary" onClick={saveEdit}>저장</button>
                  <button className="btn-outline" onClick={()=>setEditForm(null)}>취소</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 회원 탈퇴 */}
        {tab==='delete' && (
          <div style={{maxWidth:420}}>
            <h3 style={{fontSize:17,fontWeight:700,marginBottom:12}}>회원 탈퇴</h3>
            <div style={{background:'#FCEBEB',border:'1.5px solid #F09595',borderRadius:12,padding:'20px 24px',marginBottom:24}}>
              <p style={{fontWeight:600,color:'#A32D2D',marginBottom:8}}>⚠️ 탈퇴 전 확인해주세요</p>
              <ul style={{fontSize:14,color:'#791F1F',lineHeight:1.9,paddingLeft:16}}>
                <li>모든 개인정보가 삭제됩니다</li>
                <li>받은 쪽지와 관심 목록이 사라집니다</li>
                <li>같은 아이디로 재가입이 불가합니다</li>
                <li>탈퇴 후에는 복구가 불가능합니다</li>
              </ul>
            </div>
            {!confirmDelete ? (
              <button style={{background:'#e24b4a',color:'#fff',padding:'13px 28px',borderRadius:10,width:'auto',border:'none',fontFamily:'inherit',fontSize:15,fontWeight:600,cursor:'pointer'}} onClick={()=>setConfirmDelete(true)}>회원 탈퇴하기</button>
            ) : (
              <div>
                <p style={{fontSize:15,fontWeight:600,marginBottom:16,color:'#A32D2D'}}>정말로 탈퇴하시겠습니까?</p>
                <div style={{display:'flex',gap:10}}>
                  <button style={{background:'#e24b4a',color:'#fff',padding:'12px 28px',borderRadius:10,border:'none',fontFamily:'inherit',fontSize:15,fontWeight:600,cursor:'pointer',width:'auto'}} onClick={handleDelete}>네, 탈퇴합니다</button>
                  <button className="btn-outline" style={{width:'auto',padding:'12px 28px'}} onClick={()=>setConfirmDelete(false)}>취소</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <Toast msg={toast} onClose={()=>setToast('')} />
    </>
  );
}
