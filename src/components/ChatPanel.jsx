import React, {
  useEffect,
  useMemo,
  useRef,
} from 'react';

import MessageItem from './MessageItem.jsx';
import { truncate } from '../helpers.js';

export default function ChatPanel({
  activeChat,
  messages,
  typingText,
  replyTo,
  setReplyTo,
  onSend,
  onFileUpload,
  me,
  onEdit,
  onDelete,
  onMarkRead,
  onToggleAIMode,
  onTyping,
  isOnline,
}) {
  const messagesBoxRef = useRef(null);
  const composerInputRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (messagesBoxRef.current) {
      messagesBoxRef.current.scrollTop = messagesBoxRef.current.scrollHeight;
    }
  }, [messages, activeChat, typingText]);

  useEffect(() => {
    composerInputRef.current?.focus();
  }, [activeChat]);

  const uniqueMessages = useMemo(() => {
    if (!Array.isArray(messages)) return [];
    const seenIds = new Set();
    const seenClientIds = new Set();

    return messages.filter((message) => {
      if (!message) return false;
      if (message._id) {
        if (seenIds.has(String(message._id))) return false;
        seenIds.add(String(message._id));
      }
      if (message.clientMessageId) {
        if (seenClientIds.has(String(message.clientMessageId))) return false;
        seenClientIds.add(String(message.clientMessageId));
      }
      return true;
    });
  }, [messages]);

  if (!activeChat) {
    return (
      <div className="chat-panel">
        <div className="chat-empty">
          Select a chat to start messaging
        </div>
      </div>
    );
  }

  const handleSend = () => {
    const input = composerInputRef.current;
    if (!input) return;
    const content = input.value.trim();
    if (!content) return;
    input.value = '';
    onSend(content);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (typeof onFileUpload === 'function') {
      onFileUpload(file);
    }
    e.target.value = '';
  };

  const titleText = activeChat.isAI ? '🤖 Nova AI' : activeChat.title;
  const showsPresence = activeChat.type === 'personal' && !activeChat.isAI && isOnline !== null && isOnline !== undefined;
  const statusText = typingText ? typingText : showsPresence ? (isOnline ? 'Online' : 'Offline') : '';
  const statusClass = 'status' + (!typingText && showsPresence ? (isOnline ? ' status-online' : ' status-offline') : '');

  return (
    <div className="chat-panel">
      <div className="chat-header">
        <div>
          <div className="title">{titleText}</div>
          <div className={statusClass}>{statusText || ' '}</div>
        </div>
        {activeChat.type === 'group' && !activeChat.isAI && (
          <button
            className={'ai-toggle' + (activeChat.aiMode ? ' on' : '')}
            onClick={onToggleAIMode}
            type="button"
          >
            {activeChat.aiMode ? 'AI Mode: ON' : 'AI Mode: OFF'}
          </button>
        )}
      </div>

      <div className="messages" id="messages-box" ref={messagesBoxRef}>
        {uniqueMessages.map((m, index) => (
          <MessageItem
            key={m._id || m.clientMessageId || `message-${index}`}
            m={m}
            me={me}
            onEdit={onEdit}
            onDelete={onDelete}
            onReply={setReplyTo}
            onMarkRead={onMarkRead}
          />
        ))}
        {typingText && (
          <div className="msg-row them">
            <div className="bubble typing-bubble">
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
          </div>
        )}
      </div>

      <div className="typing-indicator" />

      {replyTo && (
        <div className="reply-preview">
          <span>Replying to: {truncate(replyTo.content || '', 50)}</span>
          <span className="close" onClick={() => setReplyTo(null)}>✕</span>
        </div>
      )}

      <div className="composer">
        <input
          type="text"
          id="composer-input"
          ref={composerInputRef}
          autoComplete="off"
          placeholder={activeChat.isAI ? 'Ask AI anything...' : 'Type a message...'}
          onInput={() => onTyping(true)}
          onBlur={() => onTyping(false)}
          onKeyDown={handleKeyDown}
        />
        <button className="file-upload-btn" title="Attach file (max 50MB)" onClick={handleFileClick} type="button">
          📎
        </button>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.zip,.rar"
          onChange={handleFileChange}
        />
        <button onClick={handleSend} type="button">Send</button>
      </div>
    </div>
  );
}