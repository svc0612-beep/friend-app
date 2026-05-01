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

export default function Register() {
  const { register, members } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name:'', namePublic:true, gender:'남', dept:'ai_data', mbti:'ENFP',
    intro:'', id:'', password:'', password2:'', phone:'', email:'',
    drama:'', movie:'', music:'', interest:'', ideal:''
  });
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [idChecked, setIdChecked] = useState(false);
  const [idMsg, setIdMsg] = useState('');

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    if (k === 'id') { setIdChecked(false); setIdMsg(''); }
  };

  // 필수 항목 모두 입력됐는지 + 아이디 중복체크 완료됐는지 확인
  const allFilled =
    form.name.trim() && form.id.trim() && form.password.trim() &&
    form.password2.trim() && form.phone.trim() && form.email.trim() &&
    form.drama.trim() && form.movie.trim() && form.music.trim() &&
    form.interest.trim() && form.ideal.trim() && idChecked;

  const checkId = () => {
    if (!form.id.trim()) { setIdMsg('아이디를 먼저 입력해주세요.'); return; }
    const dup = members.find(m => m.id === form.id.trim());
    if (dup) {
      setIdMsg('❌ 이미 사용 중인 아이디입니다.');
      setIdChecked(false);
    } else {
      setIdMsg('✅ 사용 가능한 아이디입니다.');
      setIdChecked(true);
    }
  };

  const submit = () => {
    if (!idChecked) { setError('아이디 중복체크를 해주세요.'); return; }
    if (form.password !== form.password2) { setError('비밀번호가 일치하지 않습니다.'); return; }
    if (form.password.length < 4) { setError('비밀번호는 4자 이상이어야 합니다.'); return; }
    if (!/^\d{3}-\d{3,4}-\d{4}$/.test(form.phone)) { setError('휴대폰 번호 형식을 확인해주세요. (예: 010-0000-0000)'); return; }
    const res = register({
      name:form.name, namePublic:form.namePublic, gender:form.gender,
      dept:form.dept, mbti:form.mbti, intro:form.intro,
      id:form.id, password:form.password, phone:form.phone, email:form.email,
      drama:form.drama, movie:form.movie, music:form.music,
      interest:form.interest, ideal:form.ideal
    });
    if (!res.ok) { setError(res.msg); return; }
    setDone(true);
    setTimeout(() => navigate('/login'), 2000);
  };

  const Row2 = ({ children }) => (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 16px' }}>{children}</div>
  );
  const F = ({ label, req, children }) => (
    <div className="form-group">
      <label>{label}{req && <span style={{color:'var(--primary)'}}> *</span>}</label>
      {children}
    </div>
  );

  return (
    <>
      <Navbar />
      <div style={{ maxWidth:560, margin:'36px auto', padding:'0 20px 60px' }}>
        <div className="card">
          <h2 style={{ fontSize:24, fontWeight:700, marginBottom:4 }}>회원가입</h2>
          <p style={{ color:'var(--muted)', fontSize:14, marginBottom:24 }}>
            경기남부직능원 이성 친구 찾기에 오신 걸 환영해요 💕<br/>
            <span style={{fontSize:12}}>* 표시 항목은 필수입니다 / 모든 항목을 입력해야 가입 버튼이 활성화돼요</span>
          </p>

          <div className="form-section-title">📋 계정 정보</div>

          {/* 아이디 + 중복체크 */}
          <div className="form-group">
            <label>아이디 <span style={{color:'var(--primary)'}}>*</span></label>
            <div style={{ display:'flex', gap:8 }}>
              <input
                placeholder="영문/숫자 조합"
                value={form.id}
                onChange={e => set('id', e.target.value)}
                lang="en"
                inputMode="text"
                autoComplete="off"
                style={{ flex:1 }}
              />
              <button
                onClick={checkId}
                style={{ width:'auto', padding:'0 16px', background:'var(--secondary)', color:'#fff', border:'none', borderRadius:10, fontSize:13, fontWeight:600, cursor:'pointer', whiteSpace:'nowrap', fontFamily:'inherit' }}>
                중복체크
              </button>
            </div>
            {idMsg && (
              <span style={{ fontSize:13, color: idChecked ? '#15803d' : '#e24b4a', marginTop:4 }}>{idMsg}</span>
            )}
          </div>

          <Row2>
            <F label="비밀번호" req>
              <input
                type="password"
                placeholder="4자 이상"
                value={form.password}
                onChange={e => set('password', e.target.value)}
                autoComplete="new-password"
              />
            </F>
            <F label="비밀번호 확인" req>
              <input
                type="password"
                placeholder="다시 입력"
                value={form.password2}
                onChange={e => set('password2', e.target.value)}
                autoComplete="new-password"
              />
            </F>
          </Row2>

          <div className="form-section-title">👤 기본 정보</div>
          <Row2>
            <F label="이름" req>
              <input
                placeholder="실명"
                value={form.name}
                onChange={e => set('name', e.target.value)}
              />
            </F>
            <F label="이름 공개 여부">
              <select value={form.namePublic} onChange={e => set('namePublic', e.target.value === 'true')}>
                <option value="true">공개</option>
                <option value="false">비공개</option>
              </select>
            </F>
          </Row2>
          <Row2>
            <F label="성별" req>
              <select value={form.gender} onChange={e => set('gender', e.target.value)}>
                <option value="남">남</option>
                <option value="여">여</option>
              </select>
            </F>
            <F label="MBTI">
              <select value={form.mbti} onChange={e => set('mbti', e.target.value)}>
                {MBTIS.map(m => <option key={m}>{m}</option>)}
              </select>
            </F>
          </Row2>
          <F label="해당 직군" req>
            <select value={form.dept} onChange={e => set('dept', e.target.value)}>
              {DEPTS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
            </select>
          </F>
          <Row2>
            <F label="휴대폰 번호" req>
              <input
                placeholder="010-0000-0000"
                value={form.phone}
                onChange={e => set('phone', e.target.value)}
                inputMode="tel"
              />
            </F>
            <F label="이메일" req>
              <input
                type="email"
                placeholder="example@email.com"
                value={form.email}
                onChange={e => set('email', e.target.value)}
                inputMode="email"
                lang="en"
              />
            </F>
          </Row2>
          <F label="자기소개">
            <textarea
              placeholder="자유롭게 소개해주세요 😊"
              value={form.intro}
              onChange={e => set('intro', e.target.value)}
            />
          </F>

          <div className="form-section-title">🎬 취향 & 관심사 <span style={{color:'var(--primary)'}}>*</span></div>
          <Row2>
            <F label="좋아하는 드라마" req>
              <input placeholder="예: 도깨비" value={form.drama} onChange={e => set('drama', e.target.value)} />
            </F>
            <F label="좋아하는 영화" req>
              <input placeholder="예: 인터스텔라" value={form.movie} onChange={e => set('movie', e.target.value)} />
            </F>
          </Row2>
          <Row2>
            <F label="좋아하는 음악/가수" req>
              <input placeholder="예: 아이유, BTS" value={form.music} onChange={e => set('music', e.target.value)} />
            </F>
            <F label="관심사/취미" req>
              <input placeholder="예: 독서, 운동" value={form.interest} onChange={e => set('interest', e.target.value)} />
            </F>
          </Row2>
          <F label="이상형 (연예인/가수 등)" req>
            <input placeholder="예: 아이유, 차은우" value={form.ideal} onChange={e => set('ideal', e.target.value)} />
          </F>

          {error && <p className="error-msg" style={{marginBottom:10}}>{error}</p>}
          {done && <div className="success-msg">🎉 회원가입 완료! 로그인 페이지로 이동합니다...</div>}

          {!done && (
            <button
              className="btn-primary"
              onClick={submit}
              style={{ marginTop:12, opacity: allFilled ? 1 : 0.4, cursor: allFilled ? 'pointer' : 'not-allowed' }}
              disabled={!allFilled}
            >
              가입하기
            </button>
          )}

          {!allFilled && !done && (
            <p style={{ textAlign:'center', fontSize:12, color:'var(--muted)', marginTop:8 }}>
              모든 항목을 입력하고 아이디 중복체크를 해야 가입 버튼이 활성화돼요
            </p>
          )}

          <p style={{ textAlign:'center', marginTop:20, fontSize:14, color:'var(--muted)' }}>
            이미 계정이 있으신가요?{' '}
            <span style={{ color:'var(--primary)', fontWeight:600, cursor:'pointer' }} onClick={() => navigate('/login')}>로그인</span>
          </p>
        </div>
      </div>
    </>
  );
}
