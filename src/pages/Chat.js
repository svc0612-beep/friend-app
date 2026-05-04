import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const ROOMS = [
  { id: 'global', name: '전체 채팅', icon: '🌐', desc: '모든 회원 참여', open: true },
  { id: 'ai_data', name: 'AI 데이터분석', icon: '📊', desc: '데이터분석반 전용' },
  { id: 'ai_office', name: 'AI 사무', icon: '🖥️', desc: 'AI사무반 전용' },
  { id: '3d_precision', name: '3D 정밀', icon: '🎨', desc: '3D정밀반 전용' },
  { id: 'fire', name: '소방', icon: '🔥', desc: '소방반 전용' },
  { id: 'dev_special', name: '발달특화', icon: '💚', desc: '발달특화반 전용' },
];

export default function Chat() {
  const { user, chatMessages, sendChatMessage, getMember, getLatestUser } = useAuth();
  const navigate = useNavigate();
  const [room, setRoom] = useState('global');
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  if (!user) { navigate('/login'); return null; }

  const me = getLatestUser();
  const messages = chatMessages[room] || [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, room]);

  const send = () => {
    if (!input.trim()) return;
    sendChatMessage(room, input);
    setInput('');
  };

  const currentRoom = ROOMS.find(r => r.id === room);

  // 내가 입장 가능한 방인지 확인
  const canEnter = (r) => r.id === 'global' || r.id === me?.dept;

  // DM 방 (1:1 채팅)
  const dmRooms = Object.keys(chatMessages).filter(k => k.startsWith('dm_') && k.includes(user.id));

  return (
    <>
      <Navbar />
      <div className="page-container" style={{ paddingTop: 20 }}>
        <div className="chat-layout">

          {/* 사이드바 */}
          <div className="chat-sidebar">
            <div className="chat-sidebar-header">💬 채팅방</div>
            <div className="chat-rooms">
              {/* 일반 채팅방 */}
              {ROOMS.map(r => {
                const locked = !canEnter(r);
                return (
                  <div key={r.id}
                    className={`chat-room-item ${room === r.id ? 'active' : ''} ${locked ? '' : ''}`}
                    onClick={() => { if (!locked) setRoom(r.id); }}
                    style={{ opacity: locked ? 0.45 : 1, cursor: locked ? 'not-allowed' : 'pointer' }}
                  >
                    <div className="chat-room-icon">{r.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div className="chat-room-name">{r.name}</div>
                      <div className="chat-room-desc">{r.desc}</div>
                    </div>
                    {locked && <div style={{ fontSize: 14 }}>🔒</div>}
                  </div>
                );
              })}

              {/* 1:1 DM 채팅방 */}
              {dmRooms.length > 0 && (
                <>
                  <div style={{ padding: '10px 16px 4px', fontSize: 11, fontWeight: 700, color: 'var(--muted)', borderTop: '1px solid var(--border)', marginTop: 4 }}>💌 1:1 채팅</div>
                  {dmRooms.map(dmKey => {
                    const otherId = dmKey.replace('dm_', '').replace(user.id, '').replace('_', '');
                    const other = getMember(otherId);
                    return (
                      <div key={dmKey} className={`chat-room-item ${room === dmKey ? 'active' : ''}`} onClick={() => setRoom(dmKey)}>
                        <div className="chat-room-icon">{other?.gender === '남' ? '👦' : '👧'}</div>
                        <div>
                          <div className="chat-room-name">@{otherId}</div>
                          <div className="chat-room-desc">{other?.namePublic ? other?.name : other?.name?.charAt(0) + '**'}</div>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </div>

          {/* 채팅 메인 */}
          <div className="chat-main">
            <div className="chat-header">
              {currentRoom?.icon || '💌'} {currentRoom?.name || room.replace('dm_', 'DM: ')}
              <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 400, marginLeft: 8 }}>{currentRoom?.desc || '1:1 채팅'}</span>
            </div>

            <div className="chat-messages">
              {messages.length === 0 && (
                <div style={{ textAlign: 'center', color: 'var(--muted)', marginTop: 40, fontSize: 14 }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>💬</div>
                  첫 메시지를 남겨보세요!
                </div>
              )}
              {messages.map((msg, i) => {
                const isMine = msg.from === user.id;
                const sender = getMember(msg.from);
                const prev = messages[i - 1];
                const showSender = !prev || prev.from !== msg.from;
                return (
                  <div key={msg.id || i} className={`chat-bubble-wrap ${isMine ? 'mine' : ''}`}>
                    {isMine && (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, flexShrink: 0 }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#fce7f3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, overflow: 'hidden' }}>
                          {me?.avatar ? <img src={me.avatar} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> : (me?.gender === '여' ? '👧' : '👦')}
                        </div>
                        <div style={{ fontSize: 10, color: 'var(--muted)', whiteSpace: 'nowrap' }}>나</div>
                      </div>
                    )}
                    {!isMine && (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, flexShrink: 0 }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--bg2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, overflow: 'hidden' }}>
                          {sender?.avatar ? <img src={sender.avatar} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> : (sender?.gender === '남' ? '👦' : '👧')}
                        </div>
                        <div style={{ fontSize: 10, color: 'var(--muted)', whiteSpace: 'nowrap' }}>@{msg.from}</div>
                      </div>
                    )}
                    <div>
                      {!isMine && showSender && <div className="chat-sender">@{msg.from}</div>}
                      <div className={`chat-bubble ${isMine ? 'mine' : ''}`} style={{ minWidth: 60, maxWidth: '100%', wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
                        {msg.text}
                      </div>
                    </div>
                    <div className="chat-time">{msg.time}</div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            <div className="chat-input-row">
              <input
                placeholder={`${currentRoom?.name || ''}에 메시지 보내기...`}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyUp={e => e.key === 'Enter' && send()}
              />
              <button className="btn-primary" style={{ borderRadius: 10 }} onClick={send}>전송</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}