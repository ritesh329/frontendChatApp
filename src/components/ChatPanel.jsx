// import React, {
//   useEffect,
//   useMemo,
//   useRef,
// } from 'react';

// import MessageItem from './MessageItem.jsx';
// import { truncate } from '../helpers.js';

// export default function ChatPanel({
//   activeChat,
//   messages,
//   typingText,
//   replyTo,
//   setReplyTo,
//   onSend,
//   onFileUpload,
//   me,
//   onEdit,
//   onDelete,
//   onMarkRead,
//   onToggleAIMode,
//   onTyping,
//   isOnline,
// }) {
//   const messagesBoxRef = useRef(null);
//   const composerInputRef = useRef(null);
//   const fileInputRef = useRef(null);

//   useEffect(() => {
//     if (messagesBoxRef.current) {
//       messagesBoxRef.current.scrollTop = messagesBoxRef.current.scrollHeight;
//     }
//   }, [messages, activeChat, typingText]);

//   useEffect(() => {
//     composerInputRef.current?.focus();
//   }, [activeChat]);

//   const uniqueMessages = useMemo(() => {
//     if (!Array.isArray(messages)) return [];
//     const seenIds = new Set();
//     const seenClientIds = new Set();

//     return messages.filter((message) => {
//       if (!message) return false;
//       if (message._id) {
//         if (seenIds.has(String(message._id))) return false;
//         seenIds.add(String(message._id));
//       }
//       if (message.clientMessageId) {
//         if (seenClientIds.has(String(message.clientMessageId))) return false;
//         seenClientIds.add(String(message.clientMessageId));
//       }
//       return true;
//     });
//   }, [messages]);

//   if (!activeChat) {
//     return (
//       <div className="flex h-screen flex-1 flex-col bg-[#0f0f13]">
//         <div className="flex flex-1 items-center justify-center text-sm text-[#888]">
//           Select a chat to start messaging
//         </div>
//       </div>
//     );
//   }

//   const handleSend = () => {
//     const input = composerInputRef.current;
//     if (!input) return;
//     const content = input.value.trim();
//     if (!content) return;
//     input.value = '';
//     onSend(content);
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === 'Enter') {
//       e.preventDefault();
//       handleSend();
//     }
//   };

//   const handleFileClick = () => {
//     fileInputRef.current?.click();
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     if (typeof onFileUpload === 'function') {
//       onFileUpload(file);
//     }
//     e.target.value = '';
//   };

//   const titleText = activeChat.isAI ? '🤖 Nova AI' : activeChat.title;
//   const showsPresence = activeChat.type === 'personal' && !activeChat.isAI && isOnline !== null && isOnline !== undefined;
//   const statusText = typingText ? typingText : showsPresence ? (isOnline ? 'Online' : 'Offline') : '';
//   const statusColor = typingText
//     ? 'text-[#a29bfe]'
//     : showsPresence
//       ? isOnline
//         ? 'text-[#00d26a]'
//         : 'text-[#888]'
//       : 'text-[#888]';

//   return (
//     <div className="flex h-screen flex-1 flex-col bg-[#0f0f13]">
//       {/* Header */}
//       <div className="flex min-h-[64px] items-center justify-between border-b border-white/[0.06] bg-[#141418] px-5 py-3 pl-[68px] md:pl-5">
//         <div className="min-w-0">
//           <div className="truncate text-[16px] font-semibold text-white sm:text-[18px]">{titleText}</div>
//           <div className={`truncate text-xs ${statusColor}`}>{statusText || '\u00A0'}</div>
//         </div>
//         {activeChat.type === 'group' && !activeChat.isAI && (
//           <button
//             type="button"
//             onClick={onToggleAIMode}
//             className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
//               activeChat.aiMode
//                 ? 'bg-[#7C6FF0]/20 text-[#a29bfe]'
//                 : 'bg-white/[0.06] text-[#aaa] hover:bg-white/10 hover:text-white'
//             }`}
//           >
//             {activeChat.aiMode ? 'AI Mode: ON' : 'AI Mode: OFF'}
//           </button>
//         )}
//       </div>

//       {/* Messages */}
//       <div
//         ref={messagesBoxRef}
//         className="flex flex-1 flex-col gap-1.5 overflow-y-auto px-4 py-4 sm:px-5"
//       >
//         {uniqueMessages.map((m, index) => (
//           <MessageItem
//             key={m._id || m.clientMessageId || `message-${index}`}
//             m={m}
//             me={me}
//             onEdit={onEdit}
//             onDelete={onDelete}
//             onReply={setReplyTo}
//             onMarkRead={onMarkRead}
//           />
//         ))}

//         {typingText && (
//           <div className="flex max-w-[75%] flex-col items-start">
//             <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-[#1c1c24] px-4 py-3">
//               <span className="h-2 w-2 animate-bounce rounded-full bg-[#999] [animation-delay:0s]" />
//               <span className="h-2 w-2 animate-bounce rounded-full bg-[#999] [animation-delay:0.15s]" />
//               <span className="h-2 w-2 animate-bounce rounded-full bg-[#999] [animation-delay:0.3s]" />
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Reply preview */}
//       {replyTo && (
//         <div className="flex items-center justify-between border-t border-white/[0.06] bg-[#141418] px-4 py-2 text-xs text-[#aaa] sm:px-5">
//           <span className="truncate">Replying to: {truncate(replyTo.content || '', 50)}</span>
//           <span
//             onClick={() => setReplyTo(null)}
//             className="ml-3 shrink-0 cursor-pointer rounded px-2 py-1 text-[#999] transition-colors hover:bg-white/5 hover:text-white"
//           >
//             ✕
//           </span>
//         </div>
//       )}

//       {/* Composer */}
//       <div className="flex items-center gap-2 border-t border-white/[0.06] bg-[#141418] px-3 py-3 sm:gap-2.5 sm:px-4">
//         <input
//           type="text"
//           id="composer-input"
//           ref={composerInputRef}
//           autoComplete="off"
//           placeholder={activeChat.isAI ? 'Ask AI anything...' : 'Type a message...'}
//           onInput={() => onTyping(true)}
//           onBlur={() => onTyping(false)}
//           onKeyDown={handleKeyDown}
//           className="min-w-0 flex-1 rounded-full border border-white/[0.08] bg-[#1a1a20] px-4 py-2.5 text-sm text-white placeholder-[#888] outline-none transition-colors focus:border-[#7C6FF0]/50"
//         />
//         <button
//           type="button"
//           title="Attach file (max 50MB)"
//           onClick={handleFileClick}
//           className="h-10 shrink-0 rounded-full bg-white/[0.06] px-3.5 text-base text-white transition-colors hover:bg-white/10"
//         >
//           📎
//         </button>
//         <input
//           type="file"
//           ref={fileInputRef}
//           className="hidden"
//           accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.zip,.rar"
//           onChange={handleFileChange}
//         />
//         <button
//           type="button"
//           onClick={handleSend}
//           className="h-10 shrink-0 rounded-full bg-gradient-to-r from-[#7C6FF0] to-[#6355D6] px-5 text-sm font-medium text-white shadow-md shadow-[#7C6FF0]/20 transition-transform active:scale-[0.97]"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }


import React, {
  useEffect,
  useMemo,
  useRef,
} from 'react';

import MessageItem from './MessageItem.jsx';
import { truncate, getId } from '../helpers.js';

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
  // ============ NEW PROPS ============
  onVotePoll,
  onRequestIcebreaker,
  onReactAI,
  suggestedEmoji,
  onTypingForEmoji,
  onClearSuggestedEmoji,
}) {
  const messagesBoxRef = useRef(null);
  const composerInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const emojiDebounceRef = useRef(null);

  useEffect(() => {
    if (messagesBoxRef.current) {
      messagesBoxRef.current.scrollTop = messagesBoxRef.current.scrollHeight;
    }
  }, [messages, activeChat, typingText]);

  useEffect(() => {
    composerInputRef.current?.focus();
  }, [activeChat]);

  // Clear stale emoji suggestion whenever chat changes
  useEffect(() => {
    onClearSuggestedEmoji?.();
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
      <div className="flex h-screen flex-1 flex-col bg-[#0f0f13]">
        <div className="flex flex-1 items-center justify-center text-sm text-[#888]">
          Select a chat to start messaging
        </div>
      </div>
    );
  }

  const isGroupChat = activeChat.type === 'group' && !activeChat.isAI;

  const handleSend = () => {
    const input = composerInputRef.current;
    if (!input) return;
    const content = input.value.trim();
    if (!content) return;
    input.value = '';
    onClearSuggestedEmoji?.();
    onSend(content);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  // NEW: also triggers debounced emoji suggestion while typing (group chats only)
  const handleComposerInput = () => {
    onTyping(true);

    if (!isGroupChat || typeof onTypingForEmoji !== 'function') return;

    const value = composerInputRef.current?.value || '';
    clearTimeout(emojiDebounceRef.current);
    emojiDebounceRef.current = setTimeout(() => {
      onTypingForEmoji(value);
    }, 600);
  };

  const handleAddSuggestedEmoji = () => {
    if (!suggestedEmoji || !composerInputRef.current) return;
    composerInputRef.current.value += suggestedEmoji;
    composerInputRef.current.focus();
    onClearSuggestedEmoji?.();
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
  const statusColor = typingText
    ? 'text-[#a29bfe]'
    : showsPresence
      ? isOnline
        ? 'text-[#00d26a]'
        : 'text-[#888]'
      : 'text-[#888]';

  return (
    <div className="flex h-screen flex-1 flex-col bg-[#0f0f13]">
      {/* Header */}
      <div className="flex min-h-[64px] items-center justify-between border-b border-white/[0.06] bg-[#141418] px-5 py-3 pl-[68px] md:pl-5">
        <div className="min-w-0">
          <div className="truncate text-[16px] font-semibold text-white sm:text-[18px]">{titleText}</div>
          <div className={`truncate text-xs ${statusColor}`}>{statusText || '\u00A0'}</div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {isGroupChat && (
            <button
              type="button"
              onClick={onRequestIcebreaker}
              title="Get a fun icebreaker question"
              className="rounded-lg bg-white/[0.06] px-3 py-1.5 text-xs font-medium text-[#aaa] transition-colors hover:bg-white/10 hover:text-white"
            >
              🧊 Icebreaker
            </button>
          )}
          {isGroupChat && (
            <button
              type="button"
              onClick={onToggleAIMode}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                activeChat.aiMode
                  ? 'bg-[#7C6FF0]/20 text-[#a29bfe]'
                  : 'bg-white/[0.06] text-[#aaa] hover:bg-white/10 hover:text-white'
              }`}
            >
              {activeChat.aiMode ? 'AI Mode: ON' : 'AI Mode: OFF'}
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div
        ref={messagesBoxRef}
        className="flex flex-1 flex-col gap-1.5 overflow-y-auto px-4 py-4 sm:px-5"
      >
        {uniqueMessages.map((m, index) => {
          const key = m._id || m.clientMessageId || `message-${index}`;

          // ============ POLL MESSAGE ============
          if (m.type === 'poll' && m.poll) {
            return (
              <PollMessage
                key={key}
                m={m}
                me={me}
                onVote={onVotePoll}
              />
            );
          }

          // ============ NORMAL MESSAGE ============
          const isOwnMessage = getId(m.sender) === getId(me) || m.sender === getId(me);
          const canRoast = isGroupChat && !m.isAI && !m.isDeleted && !isOwnMessage;

          return (
            <div key={key} className="group/msg">
              <MessageItem
                m={m}
                me={me}
                onEdit={onEdit}
                onDelete={onDelete}
                onReply={setReplyTo}
                onMarkRead={onMarkRead}
              />
              {canRoast && (
                <div className="mt-1 flex gap-3 opacity-0 transition-opacity group-hover/msg:opacity-100">
                  <button
                    type="button"
                    onClick={() => onReactAI?.(m._id, 'roast')}
                    className="text-[11px] text-[#888] hover:text-[#ff7675]"
                  >
                    🔥 Roast
                  </button>
                  <button
                    type="button"
                    onClick={() => onReactAI?.(m._id, 'compliment')}
                    className="text-[11px] text-[#888] hover:text-[#55efc4]"
                  >
                    💚 Compliment
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {typingText && (
          <div className="flex max-w-[75%] flex-col items-start">
            <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-[#1c1c24] px-4 py-3">
              <span className="h-2 w-2 animate-bounce rounded-full bg-[#999] [animation-delay:0s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-[#999] [animation-delay:0.15s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-[#999] [animation-delay:0.3s]" />
            </div>
          </div>
        )}
      </div>

      {/* Reply preview */}
      {replyTo && (
        <div className="flex items-center justify-between border-t border-white/[0.06] bg-[#141418] px-4 py-2 text-xs text-[#aaa] sm:px-5">
          <span className="truncate">Replying to: {truncate(replyTo.content || '', 50)}</span>
          <span
            onClick={() => setReplyTo(null)}
            className="ml-3 shrink-0 cursor-pointer rounded px-2 py-1 text-[#999] transition-colors hover:bg-white/5 hover:text-white"
          >
            ✕
          </span>
        </div>
      )}

      {/* Emoji suggestion chip */}
      {isGroupChat && suggestedEmoji && (
        <div className="flex items-center gap-2 border-t border-white/[0.06] bg-[#141418] px-4 py-1.5 sm:px-5">
          <span className="text-[11px] text-[#888]">Suggested:</span>
          <button
            type="button"
            onClick={handleAddSuggestedEmoji}
            className="rounded-full bg-white/[0.06] px-2.5 py-0.5 text-base transition-colors hover:bg-white/10"
            title="Add to message"
          >
            {suggestedEmoji}
          </button>
          <span
            onClick={() => onClearSuggestedEmoji?.()}
            className="ml-auto cursor-pointer text-[11px] text-[#666] hover:text-[#999]"
          >
            dismiss
          </span>
        </div>
      )}

      {/* Composer */}
      <div className="flex items-center gap-2 border-t border-white/[0.06] bg-[#141418] px-3 py-3 sm:gap-2.5 sm:px-4">
        <input
          type="text"
          id="composer-input"
          ref={composerInputRef}
          autoComplete="off"
          placeholder={
            activeChat.isAI
              ? 'Ask AI anything...'
              : isGroupChat
                ? 'Type a message... (/poll, /icebreaker)'
                : 'Type a message...'
          }
          onInput={handleComposerInput}
          onBlur={() => onTyping(false)}
          onKeyDown={handleKeyDown}
          className="min-w-0 flex-1 rounded-full border border-white/[0.08] bg-[#1a1a20] px-4 py-2.5 text-sm text-white placeholder-[#888] outline-none transition-colors focus:border-[#7C6FF0]/50"
        />
        <button
          type="button"
          title="Attach file (max 50MB)"
          onClick={handleFileClick}
          className="h-10 shrink-0 rounded-full bg-white/[0.06] px-3.5 text-base text-white transition-colors hover:bg-white/10"
        >
          📎
        </button>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.zip,.rar"
          onChange={handleFileChange}
        />
        <button
          type="button"
          onClick={handleSend}
          className="h-10 shrink-0 rounded-full bg-gradient-to-r from-[#7C6FF0] to-[#6355D6] px-5 text-sm font-medium text-white shadow-md shadow-[#7C6FF0]/20 transition-transform active:scale-[0.97]"
        >
          Send
        </button>
      </div>
    </div>
  );
}

// ================================================================
// POLL MESSAGE COMPONENT
// ================================================================
function PollMessage({ m, me, onVote }) {
  const options = m.poll?.options || [];
  const totalVotes = options.reduce((sum, o) => sum + (o.votes?.length || 0), 0);
  const myId = getId(me);

  return (
    <div className="flex max-w-[85%] flex-col items-start sm:max-w-[75%]">
      <div className="w-full min-w-[240px] rounded-2xl rounded-bl-sm bg-[#1c1c24] p-4">
        <div className="mb-3 flex items-center gap-2 text-sm font-medium text-white">
          <span>📊</span>
          <span>{m.poll.question}</span>
        </div>

        <div className="flex flex-col gap-2">
          {options.map((opt, idx) => {
            const voteCount = opt.votes?.length || 0;
            const percent = totalVotes ? Math.round((voteCount / totalVotes) * 100) : 0;
            const hasVoted = (opt.votes || []).some((uid) => String(uid) === String(myId));

            return (
              <button
                key={idx}
                type="button"
                onClick={() => onVote?.(m._id, idx)}
                className={`relative overflow-hidden rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                  hasVoted
                    ? 'border-[#7C6FF0]/60 text-white'
                    : 'border-white/10 text-[#ccc] hover:border-white/20'
                }`}
              >
                <div
                  className="absolute inset-0 bg-[#7C6FF0]/20 transition-all"
                  style={{ width: `${percent}%` }}
                />
                <span className="relative z-10 flex items-center justify-between gap-2">
                  <span className="truncate">{hasVoted ? '✓ ' : ''}{opt.text}</span>
                  <span className="shrink-0 text-xs text-[#999]">{percent}% ({voteCount})</span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-2 text-[11px] text-[#666]">{totalVotes} vote{totalVotes !== 1 ? 's' : ''}</div>
      </div>
    </div>
  );
}

