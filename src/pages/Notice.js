import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const NOTICES = [
  { id:1, title:'🎉 이성 친구 만들기 서비스 오픈!', date:'2026.04.30', badge:'공지', body:'경기남부직업능력개발원 이성 친구 만들기 서비스가 정식 오픈했습니다!\n프로필을 완성하고 친구들과 소통해보세요. 많은 참여 부탁드립니다 💕' },
  { id:2, title:'📋 이용 규칙 안내', date:'2026.04.30', badge:'규칙', body:'1. 상대방을 존중하는 언어를 사용해주세요.\n2. 개인정보(전화번호, 주소 등)를 함부로 공유하지 마세요.\n3. 불건전한 내용의 쪽지나 채팅은 신고 대상입니다.\n4. 서로 배려하고 즐거운 만남이 되길 바랍니다 😊' },
  { id:3, title:'💘 5월 매칭 이벤트 예정!', date:'2026.05.01', badge:'이벤트', body:'5월 가정의 달을 맞아 특별 매칭 이벤트를 진행할 예정입니다.\n프로필을 꼼꼼하게 채워두면 더 좋은 매칭 결과를 받을 수 있어요!\n많은 기대 부탁드립니다 🎁' },
  { id:4, title:'🔧 프로필 사진 기능 업데이트', date:'2026.04.30', badge:'업데이트', body:'이제 마이페이지에서 프로필 사진을 등록할 수 있습니다!\n사진을 등록하면 더 많은 친구들이 관심을 가져줄 거예요 📸' },
];

const BADGE_COLORS = { '공지':'#1d4ed8', '규칙':'#7c3aed', '이벤트':'#e8507a', '업데이트':'#15803d' };

export default function Notice() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(null);
  if (!user) { navigate('/login'); return null; }

  return (
    <>
      <Navbar />
      <div className="page-container">
        <h1 className="page-title">📢 공지사항</h1>
        <p className="page-subtitle">직능원 소식과 이벤트를 확인하세요</p>

        <div>
          {NOTICES.map(n => (
            <div key={n.id} className="notice-item" onClick={()=>setOpen(open===n.id?null:n.id)}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div className="notice-title">
                  <span className="notice-badge" style={{ background:BADGE_COLORS[n.badge]||'var(--primary)' }}>{n.badge}</span>
                  {n.title}
                </div>
                <span style={{ color:'var(--muted)', fontSize:16 }}>{open===n.id?'▲':'▼'}</span>
              </div>
              <div className="notice-date">{n.date}</div>
              {open===n.id && (
                <div className="notice-body" style={{ whiteSpace:'pre-line' }}>{n.body}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
