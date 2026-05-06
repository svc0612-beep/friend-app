import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const DEPTS = [
  { value: 'ai_data', label: 'AI 데이터분석' },
  { value: 'ai_office', label: 'AI 사무' },
  { value: '3d_precision', label: '3D 정밀' },
  { value: 'fire', label: '소방' },
  { value: 'dev_special', label: '발달특화' },
];
const MBTIS = ['INTJ','INTP','ENTJ','ENTP','INFJ','INFP','ENFJ','ENFP','ISTJ','ISTP','ESTJ','ESTP','ISFJ','ISFP','ESFJ','ESFP'];

export default function MyPage() {
  const { user, members, updateProfile, deleteAccount, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('messages');
  const [editForm, setEditForm] = useState(null);
  const [editDone, setEditDone] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!user) {
    return (
      <>
        <Navbar />
        <div style={{ textAlign: 'center', padding: '120px 24px' }}>
          <p style={{ color: 'var(--muted)', marginBottom: 20 }}>로그인이 필요합니다.</p>
          <button className="btn-primary" style={{ width: 'auto', padding: '12px 32px' }} onClick={() => navigate('/login')}>로그인</button>
        </div>
      </>
    );
  }

  const myMessages = user.messages || [];
  const myInterests = (user.interests || []).map(id => members.find(m => m.id === id)).filter(Boolean);

  const startEdit = () => setEditForm({ name: user.name, gender: user.gender, dept: user.dept, mbti: user.mbti, intro: user.intro, phone: user.phone });
  const setE = (k, v) => setEditForm(f => ({ ...f, [k]: v }));

  const saveEdit = () => {
    updateProfile(editForm);
    setEditForm(null);
    setEditDone(true);
    setTimeout(() => setEditDone(false), 2000);
  };

  const handleDelete = () => {
    deleteAccount();
    logout();
    navigate('/');
  };

  const DEPT_LABEL = { ai_data: 'AI 데이터분석', ai_office: 'AI 사무', '3d_precision': '3D 정밀', fire: '소방', dev_special: '발달특화' };

  return (
    <>
      <Navbar />
      <div className="page-container">
        {/* Profile header */}
        <div style={{ background: 'linear-gradient(135deg, #fce7f3, #dbeafe)', borderRadius: 16, padding: '28px 32px', marginBottom: 32, display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: user.gender === '여' ? '#fce7f3' : '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>
            {user.gender === '여' ? '👧' : '👦'}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 20 }}>{user.name}</div>
            <div style={{ fontSize: 14, color: 'var(--muted)' }}>@{user.id} · {DEPT_LABEL[user.dept]} · {user.mbti}</div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>{user.intro || '자기소개를 추가해보세요.'}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mypage-tabs">
          {[['messages','📩 받은 쪽지'],['interests','❤️ 관심 아이디'],['edit','✏️ 개인정보 수정'],['delete','🗑️ 회원 탈퇴']].map(([key, label]) => (
            <button key={key} className={`mypage-tab ${tab === key ? 'active' : ''}`} onClick={() => setTab(key)}>{label}</button>
          ))}
        </div>

        {/* Messages */}
        {tab === 'messages' && (
          <div>
            <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 16 }}>받은 쪽지 ({myMessages.length})</h3>
            {myMessages.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--muted)' }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>📭</div>
                <p>아직 받은 쪽지가 없어요.</p>
              </div>
            ) : (
              myMessages.map((msg, i) => (
                <div key={i} className="message-item">
                  <div className="message-from">@{msg.from}</div>
                  <div className="message-body">{msg.body}</div>
                  <div className="message-date">{msg.date}</div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Interests */}
        {tab === 'interests' && (
          <div>
            <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 16 }}>관심 있는 친구 ({myInterests.length})</h3>
            {myInterests.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--muted)' }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>🤍</div>
                <p>아직 관심 표시한 친구가 없어요.<br />친구 프로필에서 하트를 눌러보세요!</p>
              </div>
            ) : (
              <div className="member-grid">
                {myInterests.map(m => (
                  <div key={m.id} className="member-card">
                    <div className={`member-avatar ${m.gender === '남' ? 'male-avatar' : 'female-avatar'}`}>{m.gender === '남' ? '👦' : '👧'}</div>
                    <div className="member-id">{m.id}</div>
                    <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 6 }}>{m.name} · {m.gender}</div>
                    <div className="member-mbti">{m.mbti}</div>
                    <p className="member-intro">{m.intro || '자기소개가 없어요.'}</p>
                    <p className="member-job">{DEPT_LABEL[m.dept]}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Edit */}
        {tab === 'edit' && (
          <div style={{ maxWidth: 520 }}>
            <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 20 }}>개인정보 수정</h3>
            {editDone && <div className="success-msg" style={{ marginBottom: 16 }}>✅ 정보가 수정되었습니다!</div>}
            {!editForm ? (
              <button className="btn-outline" style={{ width: 'auto', padding: '12px 28px' }} onClick={startEdit}>수정하기</button>
            ) : (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
                  <div className="form-group">
                    <label>이름</label>
                    <input value={editForm.name} onChange={e => setE('name', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>성별</label>
                    <select value={editForm.gender} onChange={e => setE('gender', e.target.value)}>
                      <option value="남">남</option>
                      <option value="여">여</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
                  <div className="form-group">
                    <label>해당 직군</label>
                    <select value={editForm.dept} onChange={e => setE('dept', e.target.value)}>
                      {DEPTS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>MBTI</label>
                    <select value={editForm.mbti} onChange={e => setE('mbti', e.target.value)}>
                      {MBTIS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>자기소개</label>
                  <textarea value={editForm.intro} onChange={e => setE('intro', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>휴대폰 번호</label>
                  <input value={editForm.phone} onChange={e => setE('phone', e.target.value)} />
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button className="btn-primary" onClick={saveEdit}>저장</button>
                  <button className="btn-outline" onClick={() => setEditForm(null)}>취소</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Delete */}
        {tab === 'delete' && (
          <div style={{ maxWidth: 420 }}>
            <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 12 }}>회원 탈퇴</h3>
            <div style={{ background: '#FCEBEB', border: '1.5px solid #F09595', borderRadius: 12, padding: '20px 24px', marginBottom: 24 }}>
              <p style={{ fontWeight: 600, color: '#A32D2D', marginBottom: 8 }}>⚠️ 탈퇴 전 확인해주세요</p>
              <ul style={{ fontSize: 14, color: '#791F1F', lineHeight: 1.8, paddingLeft: 16 }}>
                <li>모든 개인정보가 삭제됩니다</li>
                <li>받은 쪽지와 관심 목록이 사라집니다</li>
                <li>같은 아이디로 재가입이 불가합니다</li>
                <li>탈퇴 후에는 복구가 불가능합니다</li>
              </ul>
            </div>
            {!confirmDelete ? (
              <button style={{ background: '#e24b4a', color: '#fff', padding: '13px 28px', borderRadius: 10, width: 'auto', border: 'none', fontFamily: 'inherit', fontSize: 15, fontWeight: 600, cursor: 'pointer' }} onClick={() => setConfirmDelete(true)}>
                회원 탈퇴하기
              </button>
            ) : (
              <div>
                <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 16, color: '#A32D2D' }}>정말로 탈퇴하시겠습니까?</p>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button style={{ background: '#e24b4a', color: '#fff', padding: '12px 28px', borderRadius: 10, border: 'none', fontFamily: 'inherit', fontSize: 15, fontWeight: 600, cursor: 'pointer', width: 'auto' }} onClick={handleDelete}>
                    네, 탈퇴합니다
                  </button>
                  <button className="btn-outline" style={{ width: 'auto', padding: '12px 28px' }} onClick={() => setConfirmDelete(false)}>
                    취소
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
