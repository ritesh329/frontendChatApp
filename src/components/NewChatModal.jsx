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
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-5 backdrop-blur-sm">
      <div className="flex max-h-[85vh] w-full max-w-[400px] flex-col rounded-2xl border border-white/[0.06] bg-[#1a1a20] p-6">
        <h3 className="mb-4 text-lg font-semibold text-white">
          {type === 'personal' ? 'Start a new chat' : 'Create a group'}
        </h3>

        {type === 'group' && (
          <input
            type="text"
            placeholder="Group name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="mb-3 w-full rounded-xl border border-white/[0.08] bg-[#0f0f13] px-4 py-2.5 text-sm text-white placeholder-[#666] outline-none focus:border-[#7C6FF0]/50"
          />
        )}

        <div className="flex-1 space-y-1 overflow-y-auto">
          {users
            .filter((u) => getId(u) !== getId(me))
            .map((u) => {
              const id = getId(u);
              const isSelected = selected.has(id);
              return (
                <div
                  key={id}
                  onClick={() => {
                    if (type === 'personal') {
                      onCreatePersonal(id);
                      return;
                    }
                    toggleSelect(id);
                  }}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#e8e8e8] transition-colors ${
                    isSelected ? 'bg-[#7C6FF0]/15' : 'hover:bg-white/[0.04]'
                  }`}
                >
                  <Avatar name={u.username || u.email} size="sm" />
                  <span className="truncate">{u.username || u.email}</span>
                  {type === 'group' && isSelected && <span className="ml-auto text-[#a29bfe]">✓</span>}
                </div>
              );
            })}

          {users.filter((u) => getId(u) !== getId(me)).length === 0 && (
            <div className="py-8 text-center text-xs text-[#666]">No users found.</div>
          )}
        </div>

        <div className="mt-4 flex justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl bg-white/[0.06] px-5 py-2.5 text-sm font-medium text-[#aaa] transition-colors hover:bg-white/10 hover:text-white"
          >
            Cancel
          </button>
          {type === 'group' && (
            <button
              type="button"
              onClick={() => onCreateGroup(groupName, Array.from(selected))}
              disabled={!groupName || selected.size === 0}
              className="rounded-xl bg-gradient-to-r from-[#7C6FF0] to-[#6355D6] px-5 py-2.5 text-sm font-medium text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
            >
              Create
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
