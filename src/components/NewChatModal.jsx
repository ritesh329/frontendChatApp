import React, { useState } from 'react';
import Avatar from './Avatar.jsx';
import { getId } from '../helpers.js';

export default function NewChatModal({ type, users, me, onCancel, onCreatePersonal, onCreateGroup }) {
  const [groupName, setGroupName] = useState('');
  const [selected, setSelected] = useState(new Set());

  const toggleSelect = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="modal-bg">
      <div className="modal">
        <h3>{type === 'personal' ? 'Start a new chat' : 'Create a group'}</h3>

        {type === 'group' && (
          <input
            type="text"
            placeholder="Group name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
        )}

        <div style={{ overflowY: 'auto', flex: 1 }}>
          {users
            .filter((u) => getId(u) !== getId(me))
            .map((u) => {
              const id = getId(u);
              const isSelected = selected.has(id);
              return (
                <div
                  key={id}
                  className={'user-pick' + (isSelected ? ' selected' : '')}
                  onClick={() => {
                    if (type === 'personal') {
                      onCreatePersonal(id);
                      return;
                    }
                    toggleSelect(id);
                  }}
                >
                  <Avatar name={u.username || u.email} />
                  <span>{u.username || u.email}</span>
                </div>
              );
            })}
        </div>

        <div className="modal-actions">
          <button className="cancel" onClick={onCancel}>
            Cancel
          </button>
          {type === 'group' && (
            <button className="confirm" onClick={() => onCreateGroup(groupName, Array.from(selected))}>
              Create
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
