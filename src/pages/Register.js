import React, { useState, useCallback } from 'react';
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
const MBTIS = ['INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP', 'ISTJ', 'ISTP', 'ESTJ', 'ESTP', 'ISFJ', 'ISFP', 'ESFJ', 'ESFP'];

// ✅ 컴포넌트 밖에 정의해야 포커스 안 풀림
const FormGroup = ({ label, req, children }) => (
  <div className="form-group">
    <label>{label}{req && <span style={{ color: 'var(--primary)' }}> *</span>}</label>
    {children}
  </div>
);

const Row2 = ({ children }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>{children}</div>
);

export default function Register() {
  const { register, members } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [namePublic, setNamePublic] = useState(true);
  const [gender, setGender] = useState('남');
  const [dept, setDept] = useState('ai_data');
  const [mbti, setMbti] = useState('ENFP');
  const [intro, setIntro] = useState('');
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [drama, setDrama] = useState('');
  const [movie, setMovie] = useState('');
  const [music, setMusic] = useState('');
  const [interest, setInterest] = useState('');
  const [ideal, setIdeal] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [idChecked, setIdChecked] = useState(false);
  const [idMsg, setIdMsg] = useState('');

  const allFilled = name && id && password && password2 && phone && email && drama && movie && music && interest && ideal && idChecked;

  const checkId = useCallback(() => {
    if (!id.trim()) { setIdMsg('아이디를 먼저 입력해주세요.'); return; }
    const dup = members.find(m => m.id === id.trim());
    if (dup) { setIdMsg('❌ 이미 사용 중인 아이디입니다.'); setIdChecked(false); }
    else { setIdMsg('✅ 사용 가능한 아이디입니다.'); setIdChecked(true); }
  }, [id, members]);

  const submit = () => {
    if (!idChecked) { setError('아이디 중복체크를 해주세요.'); return; }
    if (password !== password2) { setError('비밀번호가 일치하지 않습니다.'); return; }
    if (password.length < 4) { setError('비밀번호는 4자 이상이어야 합니다.'); return; }
    if (!/^\d{3}-\d{3,4}-\d{4}$/.test(phone)) { setError('휴대폰 번호 형식을 확인해주세요. (예: 010-0000-0000)'); return; }
    const res = register({ name, namePublic, gender, dept, mbti, intro, id, password, phone, email, drama, movie, music, interest, ideal });
    if (!res.ok) { setError(res.msg); return; }
    setDone(true);
    setTimeout(() => navigate('/login'), 2000);
  };

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 560, margin: '36px auto', padding: '0 20px 60px' }}>
        <div className="card">
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>회원가입</h2>
          <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 24 }}>
            경기남부직능원 이성 친구 찾기에 오신 걸 환영해요 💕<br />
            <span style={{ fontSize: 12 }}>* 모든 항목을 입력해야 가입 버튼이 활성화돼요</span>
          </p>

          <div className="form-section-title">📋 계정 정보</div>

          <div className="form-group">
            <label>아이디 <span style={{ color: 'var(--primary)' }}>*</span></label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input placeholder="영문/숫자 조합" value={id} onChange={e => { setId(e.target.value); setIdChecked(false); setIdMsg(''); }} autoComplete="off" style={{ flex: 1 }} />
              <button onClick={checkId} style={{ width: 'auto', padding: '0 16px', background: 'var(--secondary)', color: '#fff', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit' }}>
                중복체크
              </button>
            </div>
            {idMsg && <span style={{ fontSize: 13, color: idChecked ? '#15803d' : '#e24b4a', marginTop: 4 }}>{idMsg}</span>}
          </div>

          <Row2>
            <FormGroup label="비밀번호" req>
              <input type="password" placeholder="4자 이상" value={password} onChange={e => setPassword(e.target.value)} autoComplete="new-password" />
            </FormGroup>
            <FormGroup label="비밀번호 확인" req>
              <input type="password" placeholder="다시 입력" value={password2} onChange={e => setPassword2(e.target.value)} autoComplete="new-password" />
            </FormGroup>
          </Row2>

          <div className="form-section-title">👤 기본 정보</div>
          <Row2>
            <FormGroup label="이름" req>
              <input placeholder="실명" value={name} onChange={e => setName(e.target.value)} />
            </FormGroup>
            <FormGroup label="이름 공개 여부">
              <select value={namePublic} onChange={e => setNamePublic(e.target.value === 'true')}>
                <option value="true">공개</option>
                <option value="false">비공개</option>
              </select>
            </FormGroup>
          </Row2>
          <Row2>
            <FormGroup label="성별" req>
              <select value={gender} onChange={e => setGender(e.target.value)}>
                <option value="남">남</option>
                <option value="여">여</option>
              </select>
            </FormGroup>
            <FormGroup label="MBTI">
              <select value={mbti} onChange={e => setMbti(e.target.value)}>
                {MBTIS.map(m => <option key={m}>{m}</option>)}
              </select>
            </FormGroup>
          </Row2>
          <FormGroup label="해당 직군" req>
            <select value={dept} onChange={e => setDept(e.target.value)}>
              {DEPTS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
            </select>
          </FormGroup>
          <Row2>
            <FormGroup label="휴대폰 번호" req>
              <input placeholder="010-0000-0000" value={phone} onChange={e => setPhone(e.target.value)} inputMode="tel" />
            </FormGroup>
            <FormGroup label="이메일" req>
              <input type="email" placeholder="example@email.com" value={email} onChange={e => setEmail(e.target.value)} />
            </FormGroup>
          </Row2>
          <FormGroup label="자기소개">
            <textarea placeholder="자유롭게 소개해주세요 😊" value={intro} onChange={e => setIntro(e.target.value)} />
          </FormGroup>

          <div className="form-section-title">🎬 취향 & 관심사 <span style={{ color: 'var(--primary)' }}>*</span></div>
          <Row2>
            <FormGroup label="좋아하는 드라마" req>
              <input placeholder="예: 도깨비" value={drama} onChange={e => setDrama(e.target.value)} />
            </FormGroup>
            <FormGroup label="좋아하는 영화" req>
              <input placeholder="예: 인터스텔라" value={movie} onChange={e => setMovie(e.target.value)} />
            </FormGroup>
          </Row2>
          <Row2>
            <FormGroup label="좋아하는 음악/가수" req>
              <input placeholder="예: 아이유, BTS" value={music} onChange={e => setMusic(e.target.value)} />
            </FormGroup>
            <FormGroup label="관심사/취미" req>
              <input placeholder="예: 독서, 운동" value={interest} onChange={e => setInterest(e.target.value)} />
            </FormGroup>
          </Row2>
          <FormGroup label="이상형 (연예인/가수 등)" req>
            <input placeholder="예: 아이유, 차은우" value={ideal} onChange={e => setIdeal(e.target.value)} />
          </FormGroup>

          {error && <p className="error-msg" style={{ marginBottom: 10 }}>{error}</p>}
          {done && <div className="success-msg">🎉 회원가입 완료! 로그인 페이지로 이동합니다...</div>}

          {!done && (
            <button className="btn-primary" onClick={submit} style={{ marginTop: 12, opacity: allFilled ? 1 : 0.4, cursor: allFilled ? 'pointer' : 'not-allowed' }} disabled={!allFilled}>
              가입하기
            </button>
          )}

          {!allFilled && !done && (
            <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--muted)', marginTop: 8 }}>모든 항목을 입력하고 아이디 중복체크를 해야 가입 버튼이 활성화돼요</p>
          )}

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--muted)' }}>
            이미 계정이 있으신가요?{' '}
            <span style={{ color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }} onClick={() => navigate('/login')}>로그인</span>
          </p>
        </div>
      </div>
    </>
  );
}