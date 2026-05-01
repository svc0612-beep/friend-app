import React, { useEffect } from 'react';

export default function Toast({ msg, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 2500);
    return () => clearTimeout(t);
  }, [onClose]);
  if (!msg) return null;
  return <div className="toast">{msg}</div>;
}
