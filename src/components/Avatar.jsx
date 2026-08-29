import React from 'react';

export default function Avatar({ name }) {
  return <div className="avatar">{(name || '?').charAt(0).toUpperCase()}</div>;
}
