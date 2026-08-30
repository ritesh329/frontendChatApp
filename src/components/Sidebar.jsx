import React from 'react';
import Avatar from './Avatar.jsx';
import { truncate, getOtherParticipantId, getId } from '../helpers.js';

export default function Sidebar({
  me,
  activeTab,
  setActiveTab,
  personalChats,
  groups,
  activeChat,
  onOpenChat,
  onOpenAIChat,
  onLogout,
  onNewChat,
  otherUserName,
  onlineUserIds,
  mobileOpen,
  onCloseMobile,
}) {
  const tabs = [
    { key: 'personal', label: 'Chats' },
    { key: 'group', label: 'Groups' },
    { key: 'ai', label: '🤖 AI' },
  ];

  return (
    <>
      {/* Mobile overlay */}
      <div
        onClick={onCloseMobile}
        className={`fixed inset-0 z-[99] bg-black/60 transition-opacity duration-300 md:hidden ${
          mobileOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <div
        className={`fixed z-[100] flex h-screen w-[85%] max-w-[320px] flex-col border-r border-white/[0.06] bg-[#121218] transition-transform duration-300 ease-out md:static md:z-0 md:w-[320px] md:min-w-[320px] md:translate-x-0 ${
          mobileOpen ? 'translate-x-0 shadow-2xl shadow-black/50' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <Avatar name={me?.username || me?.email || 'Me'} size="sm" />
            <span className="truncate text-[15px] font-semibold text-white">
              {me?.username || me?.email || 'Me'}
            </span>
          </div>
          <button
            onClick={onLogout}
            type="button"
            className="shrink-0 rounded-lg bg-white/5 px-3 py-1.5 text-xs text-[#aaa] transition-colors hover:bg-[#f87171]/15 hover:text-[#ff6b6b]"
          >
            Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/[0.06] px-1">
          {tabs.map((t) => (
            <div
              key={t.key}
              onClick={() => {
                setActiveTab(t.key);
                if (t.key === 'ai') onOpenAIChat();
              }}
              className={`flex-1 cursor-pointer border-b-2 px-4 py-3 text-center text-[13px] font-medium transition-colors ${
                activeTab === t.key
                  ? 'border-[#7C6FF0] bg-[#7C6FF0]/10 text-[#a29bfe]'
                  : 'border-transparent text-[#999] hover:bg-white/[0.03] hover:text-white'
              }`}
            >
              {t.label}
            </div>
          ))}
        </div>

        {activeTab !== 'ai' && (
          <button
            type="button"
            onClick={() => onNewChat(activeTab)}
            className="mx-4 mt-3 rounded-xl border border-[#7C6FF0]/25 bg-[#7C6FF0]/10 py-2.5 text-[13px] font-medium text-[#a29bfe] transition-colors hover:bg-[#7C6FF0]/20"
          >
            {activeTab === 'personal' ? '+ New chat' : '+ New group'}
          </button>
        )}

        {/* List */}
        <div className="mt-2 flex-1 space-y-1 overflow-y-auto px-2 pb-3">
          {activeTab === 'ai' && (
            <div
              onClick={onOpenAIChat}
              className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 transition-colors ${
                activeChat?.id === 'ai-chat' ? 'bg-[#7C6FF0]/15' : 'hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#22D3C8]/30 to-[#0EA5A3]/30 text-lg">
                🤖
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[14px] font-medium text-white">Nova AI</div>
                <div className="truncate text-xs text-[#999]">Your AI assistant</div>
              </div>
            </div>
          )}

          {activeTab === 'personal' &&
            personalChats.map((item) => {
              const isActive = activeChat && activeChat.id === item._id;
              const title = otherUserName(item);
              const otherId = getOtherParticipantId(item, getId(me));
              const online = otherId && onlineUserIds?.has(otherId);
              return (
                <div
                  key={item._id}
                  onClick={() => onOpenChat('personal', item)}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 transition-colors ${
                    isActive ? 'bg-[#7C6FF0]/15' : 'hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="relative shrink-0">
                    <Avatar name={title} />
                    {online && (
                      <span className="absolute -bottom-0 -right-0 h-3 w-3 rounded-full border-2 border-[#121218] bg-[#00d26a]" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[14px] font-medium text-white">{title}</div>
                    <div className="truncate text-xs text-[#999]">
                      {truncate(item.lastMessage?.content || 'No messages yet', 30)}
                    </div>
                  </div>
                </div>
              );
            })}

          {activeTab === 'group' &&
            groups.map((item) => {
              const isActive = activeChat && activeChat.id === item._id;
              const title = item.name;
              return (
                <div
                  key={item._id}
                  onClick={() => onOpenChat('group', item)}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 transition-colors ${
                    isActive ? 'bg-[#7C6FF0]/15' : 'hover:bg-white/[0.04]'
                  }`}
                >
                  <Avatar name={title} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[14px] font-medium text-white">{title}</div>
                    <div className="truncate text-xs text-[#999]">
                      {truncate(item.lastMessage?.content || 'No messages yet', 30)}
                    </div>
                  </div>
                </div>
              );
            })}

          {activeTab === 'personal' && personalChats.length === 0 && (
            <div className="px-3 py-8 text-center text-xs text-[#666]">
              No chats yet — start one above.
            </div>
          )}
          {activeTab === 'group' && groups.length === 0 && (
            <div className="px-3 py-8 text-center text-xs text-[#666]">
              No groups yet — create one above.
            </div>
          )}
        </div>
      </div>
    </>
  );
}
