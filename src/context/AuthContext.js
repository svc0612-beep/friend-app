import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

// ──────────────────────────────────────────────
// 📌 배포 시 이 부분을 Supabase 호출로 교체하면 됨
// import { supabase } from '../lib/supabase';
// ──────────────────────────────────────────────

const SAMPLE_MEMBERS = [
  { id: 'jungmin92', name: '정지민', namePublic: true, gender: '남', dept: 'ai_data', mbti: 'ENFP', intro: '데이터 분석으로 세상을 읽고 싶어요! 커피 좋아하고 야구 즐겨봐요.', phone: '010-1111-2222', email: 'jungmin@email.com', password: '1234', drama: '이상한 변호사 우영우', movie: '인터스텔라', music: '아이유', interest: '독서, 등산', ideal: '수지', avatar: null, interests: [], messages: [], likedBy: [], blockedIds: [], visitors: 12 },
  { id: 'suzy_data', name: '박수지', namePublic: true, gender: '여', dept: 'ai_data', mbti: 'ISTJ', intro: '꼼꼼하게 데이터 다루는 걸 좋아해요. 같이 공부해요!', phone: '010-3333-4444', email: 'suzy@email.com', password: '1234', drama: '도깨비', movie: '라라랜드', music: 'BTS', interest: '요리, 여행', ideal: '공유', avatar: null, interests: [], messages: [], likedBy: [], blockedIds: [], visitors: 8 },
  { id: 'kim_office', name: '김태현', namePublic: false, gender: '남', dept: 'ai_office', mbti: 'INTJ', intro: 'AI 사무 자동화에 관심 많아요. 효율을 사랑합니다.', phone: '010-5555-6666', email: 'kim@email.com', password: '1234', drama: '미생', movie: '매트릭스', music: '검정치마', interest: '게임, 독서', ideal: '김태리', avatar: null, interests: [], messages: [], likedBy: [], blockedIds: [], visitors: 5 },
  { id: 'hana_3d', name: '이하나', namePublic: true, gender: '여', dept: '3d_precision', mbti: 'ESFP', intro: '3D 모델링 배우는 중! 만들기를 너무 좋아해요 😊', phone: '010-7777-8888', email: 'hana@email.com', password: '1234', drama: '슬기로운 의사생활', movie: '겨울왕국', music: '뉴진스', interest: '그림, 공예', ideal: '차은우', avatar: null, interests: [], messages: [], likedBy: [], blockedIds: [], visitors: 20 },
  { id: 'fire_choi', name: '최동욱', namePublic: true, gender: '남', dept: 'fire', mbti: 'ESTP', intro: '소방 안전 전문가가 목표! 강인한 체력이 자랑이에요.', phone: '010-9999-0000', email: 'fire@email.com', password: '1234', drama: '펜트하우스', movie: '탑건', music: '싸이', interest: '운동, 격투기', ideal: '아이린', avatar: null, interests: [], messages: [], likedBy: [], blockedIds: [], visitors: 7 },
  { id: 'special_lee', name: '이민지', namePublic: false, gender: '여', dept: 'dev_special', mbti: 'INFJ', intro: '따뜻한 마음으로 함께 성장해요. 차 좋아해요 ☕', phone: '010-2222-3333', email: 'special@email.com', password: '1234', drama: '나의 아저씨', movie: '리틀 포레스트', music: '이적', interest: '독서, 카페', ideal: '정해인', avatar: null, interests: [], messages: [], likedBy: [], blockedIds: [], visitors: 15 },
];

const SAMPLE_CHAT_MESSAGES = {
  global: [
    { id: 1, from: 'jungmin92', text: '안녕하세요 다들! 잘 부탁드려요 😊', time: '10:00' },
    { id: 2, from: 'suzy_data', text: '반가워요~ 저도 잘 부탁해요!', time: '10:02' },
    { id: 3, from: 'hana_3d', text: '여기 분위기 좋네요 ㅎㅎ', time: '10:05' },
  ],
  ai_data: [{ id: 1, from: 'jungmin92', text: '데이터분석반 파이팅! 📊', time: '09:30' }],
  ai_office: [{ id: 1, from: 'kim_office', text: '사무반 모두 화이팅!', time: '09:00' }],
  '3d_precision': [{ id: 1, from: 'hana_3d', text: '3D 모델링 재밌어요!', time: '08:50' }],
  fire: [{ id: 1, from: 'fire_choi', text: '소방반 안전제일! 🔥', time: '08:40' }],
  dev_special: [{ id: 1, from: 'special_lee', text: '함께 성장해요 💚', time: '08:30' }],
};

function load(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
}
function save(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

export function AuthProvider({ children }) {
  const [members, setMembers] = useState(() => load('fa_members', SAMPLE_MEMBERS));
  const [user, setUser] = useState(() => load('fa_user', null));
  const [chatMessages, setChatMessages] = useState(() => load('fa_chats', SAMPLE_CHAT_MESSAGES));
  const [theme, setTheme] = useState(() => load('fa_theme', 'light'));

  useEffect(() => { save('fa_members', members); }, [members]);
  useEffect(() => { if (user) save('fa_user', user); else localStorage.removeItem('fa_user'); }, [user]);
  useEffect(() => { save('fa_chats', chatMessages); }, [chatMessages]);
  useEffect(() => {
    save('fa_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');

  const updateMemberState = useCallback((updater) => {
    setMembers(prev => {
      const next = updater(prev);
      const fresh = next.find(m => m.id === user?.id);
      if (fresh) setUser(fresh);
      return next;
    });
  }, [user]);

  const register = (data) => {
    if (members.find(m => m.id === data.id)) return { ok: false, msg: '이미 사용 중인 아이디입니다.' };
    if (members.find(m => m.phone === data.phone)) return { ok: false, msg: '이미 등록된 휴대폰 번호입니다.' };
    const newMember = { ...data, avatar: null, interests: [], messages: [], likedBy: [], blockedIds: [], visitors: 0 };
    setMembers(prev => [...prev, newMember]);
    return { ok: true };
  };

  const login = (id, password) => {
    const found = members.find(m => m.id === id && m.password === password);
    if (found) { setUser(found); return { ok: true }; }
    return { ok: false, msg: '아이디 또는 비밀번호가 일치하지 않습니다.' };
  };

  const logout = () => setUser(null);

  const recordVisit = (targetId) => {
    if (!user || user.id === targetId) return;
    setMembers(prev => prev.map(m => m.id === targetId ? { ...m, visitors: (m.visitors || 0) + 1 } : m));
  };

  const toggleInterest = (targetId) => {
    if (!user) return;
    updateMemberState(prev => prev.map(m => {
      if (m.id === user.id) {
        const has = m.interests.includes(targetId);
        return { ...m, interests: has ? m.interests.filter(i => i !== targetId) : [...m.interests, targetId] };
      }
      if (m.id === targetId) {
        const has = (m.likedBy || []).includes(user.id);
        return { ...m, likedBy: has ? m.likedBy.filter(i => i !== user.id) : [...(m.likedBy || []), user.id] };
      }
      return m;
    }));
  };

  const toggleBlock = (targetId) => {
    if (!user) return;
    updateMemberState(prev => prev.map(m => {
      if (m.id !== user.id) return m;
      const blocked = m.blockedIds || [];
      const has = blocked.includes(targetId);
      return { ...m, blockedIds: has ? blocked.filter(i => i !== targetId) : [...blocked, targetId] };
    }));
  };

  const sendMessage = (toId, body) => {
    if (!user) return;
    setMembers(prev => prev.map(m => {
      if (m.id !== toId) return m;
      return { ...m, messages: [...(m.messages || []), { id: Date.now(), from: user.id, body, date: new Date().toLocaleString('ko-KR') }] };
    }));
  };

  const sendChatMessage = (roomId, text) => {
    if (!user || !text.trim()) return;
    const msg = { id: Date.now(), from: user.id, text: text.trim(), time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) };
    setChatMessages(prev => ({ ...prev, [roomId]: [...(prev[roomId] || []), msg] }));
  };

  const updateProfile = (data) => {
    updateMemberState(prev => prev.map(m => m.id === user.id ? { ...m, ...data } : m));
  };

  const updateAvatar = (dataUrl) => {
    updateMemberState(prev => prev.map(m => m.id === user.id ? { ...m, avatar: dataUrl } : m));
  };

  const deleteAccount = () => {
    setMembers(prev => prev.filter(m => m.id !== user.id));
    setUser(null);
  };

  const getLatestUser = () => members.find(m => m.id === user?.id) || user;
  const getMember = (id) => members.find(m => m.id === id);

  return (
    <AuthContext.Provider value={{
      user, members, chatMessages, theme,
      register, login, logout, toggleTheme,
      recordVisit, toggleInterest, toggleBlock,
      sendMessage, sendChatMessage,
      updateProfile, updateAvatar, deleteAccount,
      getLatestUser, getMember,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
