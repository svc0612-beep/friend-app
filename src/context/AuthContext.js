import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const INITIAL_MEMBERS = [
  { id: 'jungmin92', name: '정지민', gender: '남', dept: 'ai_data', mbti: 'ENFP', intro: '데이터 분석으로 세상을 읽고 싶어요! 커피 좋아하고 야구 즐겨봐요.', phone: '010-1111-2222', password: '1234', interests: [], messages: [] },
  { id: 'suzy_data', name: '박수지', gender: '여', dept: 'ai_data', mbti: 'ISTJ', intro: '꼼꼼하게 데이터 다루는 걸 좋아해요. 같이 공부해요!', phone: '010-3333-4444', password: '1234', interests: [], messages: [] },
  { id: 'kim_office', name: '김태현', gender: '남', dept: 'ai_office', mbti: 'INTJ', intro: 'AI 사무 자동화에 관심 많아요. 효율을 사랑합니다.', phone: '010-5555-6666', password: '1234', interests: [], messages: [] },
  { id: 'hana_3d', name: '이하나', gender: '여', dept: '3d_precision', mbti: 'ESFP', intro: '3D 모델링 배우는 중! 만들기를 너무 좋아해요 😊', phone: '010-7777-8888', password: '1234', interests: [], messages: [] },
  { id: 'fire_choi', name: '최동욱', gender: '남', dept: 'fire', mbti: 'ESTP', intro: '소방 안전 전문가가 목표! 강인한 체력이 자랑이에요.', phone: '010-9999-0000', password: '1234', interests: [], messages: [] },
  { id: 'special_lee', name: '이민지', gender: '여', dept: 'dev_special', mbti: 'INFJ', intro: '따뜻한 마음으로 함께 성장해요. 차 좋아해요 ☕', phone: '010-2222-3333', password: '1234', interests: [], messages: [] },
];

function loadMembers() {
  try {
    const saved = localStorage.getItem('fa_members');
    if (saved) return JSON.parse(saved);
  } catch {}
  return INITIAL_MEMBERS;
}

function loadUser() {
  try {
    const saved = localStorage.getItem('fa_user');
    if (saved) return JSON.parse(saved);
  } catch {}
  return null;
}

export function AuthProvider({ children }) {
  const [members, setMembers] = useState(loadMembers);
  const [user, setUser] = useState(loadUser);

  useEffect(() => {
    localStorage.setItem('fa_members', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    if (user) localStorage.setItem('fa_user', JSON.stringify(user));
    else localStorage.removeItem('fa_user');
  }, [user]);

  const register = (data) => {
    if (members.find(m => m.id === data.id)) {
      return { ok: false, msg: '이미 사용 중인 아이디입니다.' };
    }
    const newMember = { ...data, interests: [], messages: [] };
    setMembers(prev => [...prev, newMember]);
    return { ok: true };
  };

  const login = (id, password) => {
    const found = members.find(m => m.id === id && m.password === password);
    if (found) { setUser(found); return { ok: true }; }
    return { ok: false, msg: '아이디 또는 비밀번호가 일치하지 않습니다.' };
  };

  const logout = () => setUser(null);

  const toggleInterest = (targetId) => {
    if (!user) return;
    setMembers(prev => prev.map(m => {
      if (m.id !== user.id) return m;
      const has = m.interests.includes(targetId);
      const updated = { ...m, interests: has ? m.interests.filter(i => i !== targetId) : [...m.interests, targetId] };
      setUser(updated);
      return updated;
    }));
  };

  const sendMessage = (toId, body) => {
    if (!user) return;
    setMembers(prev => prev.map(m => {
      if (m.id !== toId) return m;
      return { ...m, messages: [...m.messages, { from: user.id, body, date: new Date().toLocaleDateString('ko-KR') }] };
    }));
  };

  const updateProfile = (data) => {
    setMembers(prev => prev.map(m => {
      if (m.id !== user.id) return m;
      const updated = { ...m, ...data };
      setUser(updated);
      return updated;
    }));
  };

  const deleteAccount = () => {
    setMembers(prev => prev.filter(m => m.id !== user.id));
    setUser(null);
  };

  const getUser = (id) => members.find(m => m.id === id);

  return (
    <AuthContext.Provider value={{ user, members, register, login, logout, toggleInterest, sendMessage, updateProfile, deleteAccount, getUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
