import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [members, setMembers] = useState([]);
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('fa_user')); } catch { return null; }
  });
  const [chatMessages, setChatMessages] = useState({});
  const [theme, setTheme] = useState(() => localStorage.getItem('fa_theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('fa_theme', theme);
  }, [theme]);

  useEffect(() => {
    if (user) localStorage.setItem('fa_user', JSON.stringify(user));
    else localStorage.removeItem('fa_user');
  }, [user]);

  // 회원 목록 로드
  useEffect(() => {
    loadMembers();
  }, []);

  // 채팅 실시간 구독
  useEffect(() => {
    loadChats();
    const sub = supabase
      .channel('chats')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chats' }, payload => {
        const msg = payload.new;
        setChatMessages(prev => ({
          ...prev,
          [msg.room_id]: [...(prev[msg.room_id] || []), {
            id: msg.id,
            from: msg.from_id,
            text: msg.text,
            time: new Date(msg.created_at).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
          }]
        }));
      })
      .subscribe();
    return () => supabase.removeChannel(sub);
  }, []);

  const loadMembers = async () => {
    const { data } = await supabase.from('members').select('*');
    if (data) {
      const formatted = await Promise.all(data.map(async m => {
        const { data: liked } = await supabase.from('interests').select('from_id').eq('to_id', m.id);
        const { data: interests } = await supabase.from('interests').select('to_id').eq('from_id', m.id);
        const { data: msgs } = await supabase.from('messages').select('*').eq('to_id', m.id).order('created_at');
        return {
          ...m,
          namePublic: m.name_public,
          likedBy: (liked || []).map(l => l.from_id),
          interests: (interests || []).map(i => i.to_id),
          messages: (msgs || []).map(msg => ({ id: msg.id, from: msg.from_id, body: msg.body, date: new Date(msg.created_at).toLocaleDateString('ko-KR') })),
          blockedIds: [],
        };
      }));
      setMembers(formatted);
      if (user) {
        const fresh = formatted.find(m => m.id === user.id);
        if (fresh) setUser(fresh);
      }
    }
  };

  const loadChats = async () => {
    const { data } = await supabase.from('chats').select('*').order('created_at');
    if (data) {
      const grouped = {};
      data.forEach(msg => {
        if (!grouped[msg.room_id]) grouped[msg.room_id] = [];
        grouped[msg.room_id].push({
          id: msg.id,
          from: msg.from_id,
          text: msg.text,
          time: new Date(msg.created_at).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
        });
      });
      setChatMessages(grouped);
    }
  };

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');

  const register = async (data) => {
    const { data: existing } = await supabase.from('members').select('id').eq('id', data.id);
    if (existing?.length > 0) return { ok: false, msg: '이미 사용 중인 아이디입니다.' };
    const { data: phoneCheck } = await supabase.from('members').select('id').eq('phone', data.phone);
    if (phoneCheck?.length > 0) return { ok: false, msg: '이미 등록된 휴대폰 번호입니다.' };
    const { error } = await supabase.from('members').insert([{
      id: data.id, name: data.name, name_public: data.namePublic,
      gender: data.gender, dept: data.dept, mbti: data.mbti,
      intro: data.intro, phone: data.phone, email: data.email,
      password: data.password, drama: data.drama, movie: data.movie,
      music: data.music, interest: data.interest, ideal: data.ideal,
      avatar: null, visitors: 0
    }]);
    if (error) return { ok: false, msg: '가입 중 오류가 발생했습니다.' };
    await loadMembers();
    return { ok: true };
  };

  const login = async (id, password) => {
    const { data } = await supabase.from('members').select('*').eq('id', id).eq('password', password);
    if (data?.length > 0) {
      const found = members.find(m => m.id === id) || data[0];
      setUser(found);
      return { ok: true };
    }
    return { ok: false, msg: '아이디 또는 비밀번호가 일치하지 않습니다.' };
  };

  const logout = () => setUser(null);

  const recordVisit = async (targetId) => {
    if (!user || user.id === targetId) return;
    await supabase.from('members').update({ visitors: (members.find(m => m.id === targetId)?.visitors || 0) + 1 }).eq('id', targetId);
    await loadMembers();
  };

  const toggleInterest = async (targetId) => {
    if (!user) return;
    const me = members.find(m => m.id === user.id);
    const liked = me?.interests?.includes(targetId);
    if (liked) {
      await supabase.from('interests').delete().eq('from_id', user.id).eq('to_id', targetId);
    } else {
      await supabase.from('interests').insert([{ from_id: user.id, to_id: targetId }]);
    }
    await loadMembers();
  };

  const toggleBlock = (targetId) => {
    setMembers(prev => prev.map(m => {
      if (m.id !== user.id) return m;
      const blocked = m.blockedIds || [];
      const has = blocked.includes(targetId);
      const updated = { ...m, blockedIds: has ? blocked.filter(i => i !== targetId) : [...blocked, targetId] };
      setUser(updated);
      return updated;
    }));
  };

  const sendMessage = async (toId, body) => {
    if (!user) return;
    await supabase.from('messages').insert([{ from_id: user.id, to_id: toId, body }]);
    await loadMembers();
  };

  const sendChatMessage = async (roomId, text) => {
    if (!user || !text.trim()) return;
    await supabase.from('chats').insert([{ room_id: roomId, from_id: user.id, text: text.trim() }]);
  };

  const updateProfile = async (data) => {
    await supabase.from('members').update({
      name: data.name, name_public: data.namePublic, gender: data.gender,
      dept: data.dept, mbti: data.mbti, intro: data.intro,
      phone: data.phone, email: data.email, drama: data.drama,
      movie: data.movie, music: data.music, interest: data.interest, ideal: data.ideal
    }).eq('id', user.id);
    await loadMembers();
  };

  const updateAvatar = async (dataUrl) => {
    await supabase.from('members').update({ avatar: dataUrl }).eq('id', user.id);
    await loadMembers();
  };

  const deleteAccount = async () => {
    await supabase.from('members').delete().eq('id', user.id);
    await supabase.from('interests').delete().eq('from_id', user.id);
    await supabase.from('messages').delete().eq('from_id', user.id);
    setUser(null);
    await loadMembers();
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
      getLatestUser, getMember, loadMembers,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);