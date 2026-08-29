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
  return (
    <>
      {/* Mobile overlay */}
      <div 
        className={`sidebar-overlay ${mobileOpen ? 'open' : ''}`}
        onClick={onCloseMobile}
      />
      
      <div className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="me">{me?.username || me?.email || 'Me'}</div>
          <div className="logout" onClick={onLogout}>
            Logout
          </div>
        </div>

        <div className="tabs">
          <div
            className={'tab' + (activeTab === 'personal' ? ' active' : '')}
            onClick={() => setActiveTab('personal')}
          >
            Personal
          </div>
          <div
            className={'tab' + (activeTab === 'group' ? ' active' : '')}
            onClick={() => setActiveTab('group')}
          >
            Groups
          </div>
          <div
            className={'tab' + (activeTab === 'ai' ? ' active' : '')}
            onClick={() => {
              setActiveTab('ai');
              onOpenAIChat();
            }}
          >
            🤖 AI
          </div>
        </div>

        {activeTab !== 'ai' && (
          <button className="new-btn" onClick={() => onNewChat(activeTab)}>
            {activeTab === 'personal' ? '+ New chat' : '+ New group'}
          </button>
        )}

        <div className="list">
          {activeTab === 'ai' && (
            <div
              className={'list-item' + (activeChat?.id === 'ai-chat' ? ' active' : '')}
              onClick={onOpenAIChat}
            >
              <div className="avatar">🤖</div>
              <div className="meta">
                <div className="name">Nova AI</div>
                <div className="sub">Your AI assistant</div>
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
                  className={'list-item' + (isActive ? ' active' : '')}
                  onClick={() => onOpenChat('personal', item)}
                >
                  <div className="avatar-wrap">
                    <Avatar name={title} />
                    {online && <span className="online-dot" title="Online" />}
                  </div>
                  <div className="meta">
                    <div className="name">{title}</div>
                    <div className="sub">{truncate(item.lastMessage?.content || 'No messages yet', 30)}</div>
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
                  className={'list-item' + (isActive ? ' active' : '')}
                  onClick={() => onOpenChat('group', item)}
                >
                  <Avatar name={title} />
                  <div className="meta">
                    <div className="name">{title}</div>
                    <div className="sub">{truncate(item.lastMessage?.content || 'No messages yet', 30)}</div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
}