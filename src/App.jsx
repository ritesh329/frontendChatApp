// import React, { useState, useRef, useEffect } from 'react';
// import { io } from 'socket.io-client';
// import { api, setAuthToken, SOCKET_URL } from './api.js';
// import { getId, getOtherParticipantId } from './helpers.js';
// import AuthScreen from './components/AuthScreen.jsx';
// import Sidebar from './components/Sidebar.jsx';
// import ChatPanel from './components/ChatPanel.jsx';
// import NewChatModal from './components/NewChatModal.jsx';
// import HamburgerButton from './components/HamburgerButton.jsx';
// import './App.css';

// export default function App() {
//   const [token, setToken] = useState(localStorage.getItem('chat_token') || null);
//   const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
//   const [me, setMe] = useState(JSON.parse(localStorage.getItem('chat_me') || 'null'));
//   const [users, setUsers] = useState([]);
//   const [personalChats, setPersonalChats] = useState([]);
//   const [groups, setGroups] = useState([]);
//   const [activeChat, setActiveChat] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [typingText, setTypingText] = useState('');
//   const [replyTo, setReplyTo] = useState(null);
//   const [authMode, setAuthMode] = useState('login');
//   const [activeTab, setActiveTab] = useState('personal');
//   const [modalType, setModalType] = useState(null);
//   const [onlineUserIds, setOnlineUserIds] = useState(() => new Set());

//   const socketRef = useRef(null);
//   const typingTimeoutRef = useRef(null);
//   const activeChatRef = useRef(activeChat);
//   const meRef = useRef(me);

//   useEffect(() => { activeChatRef.current = activeChat; }, [activeChat]);
//   useEffect(() => { meRef.current = me; }, [me]);

//   const otherUserName = (chat) => {
//     if (!chat.participants) return 'Chat';
//     const other = chat.participants.find((p) => getId(p) !== getId(meRef.current));
//     return other?.username || other?.email || 'Chat';
//   };

//   // Close mobile sidebar when chat is selected on mobile
//   const handleOpenChat = async (type, item) => {
//     await openChat(type, item);
//     setMobileSidebarOpen(false);
//   };

//   const fetchMe = async () => {
//     const { data } = await api.get('/auth/me');
//     const u = data.user || data.data || data;
//     setMe(u);
//     localStorage.setItem('chat_me', JSON.stringify(u));
//   };

//   const fetchUsers = async () => {
//     const { data } = await api.get('/auth/users');
//     setUsers(data.users || data.data || data || []);
//   };

//   const fetchPersonalChats = async () => {
//     const { data } = await api.get('/chat/personal');
//     setPersonalChats(data.chats || data.data || data || []);
//   };

//   const fetchGroups = async () => {
//     const { data } = await api.get('/group');
//     setGroups(data.groups || data.data || data || []);
//   };

//   const fetchMessages = async (chatId) => {
//     const { data } = await api.get(`/chat/${chatId}/messages`);
//     setMessages(data.messages || data.data || data || []);
//   };

//   const createPersonalChat = async (otherUserId) => {
//     const { data } = await api.post('/chat/personal', { userId: otherUserId });
//     const chat = data.chat || data.data || data;
//     await fetchPersonalChats();
//     setModalType(null);
//     openChat('personal', chat);
//   };

//   const createGroup = async (name, memberIds) => {
//     if (!name) return;
//     const { data } = await api.post('/group', { name, members: memberIds });
//     const group = data.group || data.data || data;
//     await fetchGroups();
//     setModalType(null);
//     openChat('group', group);
//   };

//   const toggleAIMode = async () => {
//     const chat = activeChatRef.current;
//     try {
//       await api.put(`/group/${chat.id}/ai-mode`, { mode: !chat.aiMode });
//       setActiveChat((prev) => ({ ...prev, aiMode: !prev.aiMode }));
//       setGroups((prev) => prev.map((g) => (g._id === chat.id ? { ...g, aiMode: !chat.aiMode } : g)));
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   // const editMessage = async (m) => {
//   //   if (m.fileUrl) {
//   //     alert('File messages cannot be edited');
//   //     return;
//   //   }
//   //   const newContent = prompt('Edit message:', m.content);
//   //   if (newContent == null || newContent === m.content) return;
//   //   try {
//   //     await api.put(`/chat/message/${m._id}`, { content: newContent });
//   //     setMessages((prev) =>
//   //       prev.map((x) => (x._id === m._id ? { ...x, content: newContent, isEdited: true } : x))
//   //     );
//   //   } catch (e) {
//   //     console.error(e);
//   //   }
//   // };

  
// const editMessage = async (m) => {
//   if (m.fileUrl) {
//     alert('File messages cannot be edited');
//     return;
//   }

//   const chat = activeChatRef.current;

//   const newContent = prompt(
//     'Edit message:',
//     m.content
//   );

//   if (
//     newContent == null ||
//     !newContent.trim() ||
//     newContent.trim() === m.content
//   ) {
//     return;
//   }

//   try {
//     // GROUP CHAT → SOCKET REALTIME
//     if (chat?.type === 'group') {
//       socketRef.current?.emit(
//         'group-edit-message',
//         {
//           groupId: chat.id,
//           messageId: m._id,
//           content: newContent.trim(),
//         }
//       );

//       return;
//     }

//     // PERSONAL CHAT → EXISTING REST API
//     await api.put(
//       `/chat/message/${m._id}`,
//       {
//         content: newContent.trim(),
//       }
//     );

//     setMessages((prev) =>
//       prev.map((x) =>
//         x._id === m._id
//           ? {
//               ...x,
//               content: newContent.trim(),
//               isEdited: true,
//             }
//           : x
//       )
//     );
//   } catch (error) {
//     console.error(
//       'Edit message error:',
//       error
//     );
//   }
// };

//   // const deleteMessage = async (m) => {
//   //   if (!confirm('Delete this message?')) return;
//   //   try {
//   //     await api.delete(`/chat/message/${m._id}`);
//   //     setMessages((prev) => prev.map((x) => (x._id === m._id ? { ...x, isDeleted: true } : x)));
//   //   } catch (e) {
//   //     console.error(e);
//   //   }
//   // };

  
// const deleteMessage = async (m) => {
//   if (!confirm('Delete this message?')) {
//     return;
//   }

//   const chat = activeChatRef.current;

//   try {
//     // GROUP CHAT → SOCKET REALTIME
//     if (chat?.type === 'group') {
//       socketRef.current?.emit(
//         'group-delete-message',
//         {
//           groupId: chat.id,
//           messageId: m._id,
//         }
//       );

//       return;
//     }

//     // PERSONAL CHAT → EXISTING REST API
//     await api.delete(
//       `/chat/message/${m._id}`
//     );

//     setMessages((prev) =>
//       prev.map((x) =>
//         x._id === m._id
//           ? {
//               ...x,
//               isDeleted: true,
//             }
//           : x
//       )
//     );
//   } catch (error) {
//     console.error(
//       'Delete message error:',
//       error
//     );
//   }
// };


//   const markRead = (messageId) => {
//     socketRef.current?.emit('mark-read', { messageId, chatId: activeChatRef.current.id });
//   };

//   const connectSocket = (tok) => {
//     if (socketRef.current) socketRef.current.disconnect();
//     const socket = io(SOCKET_URL, { auth: { token: tok } });
//     socketRef.current = socket;

//     socket.on('connect', () => console.log('✅ Socket connected'));
//     socket.on('error', (e) => console.error('Socket error', e));

//     socket.on('receive-message', (payload) => {
//       const { message, chatId, groupId } = payload;
//       const current = activeChatRef.current;

//       if (current && (chatId === current.id || groupId === current.id)) {
//         setMessages((prev) => {
//           if (!message) return prev;

//           const rawFileData = message.fileData || {};
//           const socketFileUrl =
//             message.fileUrl ||
//             rawFileData.url ||
//             (
//               typeof message.content === 'string' &&
//               /^https?:\/\/.+/i.test(message.content.trim())
//                 ? message.content.trim()
//                 : null
//             );

//           const socketFileType =
//             message.type ||
//             rawFileData.type ||
//             rawFileData.fileType ||
//             (
//               typeof socketFileUrl === 'string'
//                 ? (
//                     /\.(jpe?g|png|gif|webp|bmp|svg)(\?.*)?$/i.test(socketFileUrl)
//                       ? 'image'
//                       : /\.(mp4|webm|mov|avi|mkv)(\?.*)?$/i.test(socketFileUrl)
//                         ? 'video'
//                         : /\.(mp3|wav|ogg|m4a|aac|flac)(\?.*)?$/i.test(socketFileUrl)
//                           ? 'audio'
//                           : socketFileUrl
//                             ? 'file'
//                             : null
//                   )
//                 : null
//             );

//           const normalizedMessage = socketFileUrl
//             ? {
//                 ...message,
//                 fileUrl: socketFileUrl,
//                 type: socketFileType || 'file',
//                 fileName:
//                   message.fileName ||
//                   rawFileData.name ||
//                   rawFileData.fileName ||
//                   'File',
//                 fileSize:
//                   message.fileSize ||
//                   rawFileData.size ||
//                   rawFileData.fileSize ||
//                   undefined,
//                 content: '',
//               }
//             : message;

//           const incomingId = normalizedMessage._id
//             ? String(normalizedMessage._id)
//             : null;

//           const incomingClientId = normalizedMessage.clientMessageId
//             ? String(normalizedMessage.clientMessageId)
//             : null;

//           const incomingFileUrl = normalizedMessage.fileUrl || null;

//           const isDuplicate = prev.some((x) => {
//             if (!x) return false;

//             if (
//               incomingId &&
//               x._id &&
//               String(x._id) === incomingId
//             ) {
//               return true;
//             }

//             if (
//               incomingClientId &&
//               x.clientMessageId &&
//               String(x.clientMessageId) === incomingClientId
//             ) {
//               return true;
//             }

//             if (
//               incomingFileUrl &&
//               x.fileUrl &&
//               x.fileUrl === incomingFileUrl
//             ) {
//               return true;
//             }

//             return false;
//           });

//           if (isDuplicate) {
//             const existingIndex = prev.findIndex((x) => {
//               if (!x) return false;

//               if (
//                 incomingId &&
//                 x._id &&
//                 String(x._id) === incomingId
//               ) {
//                 return true;
//               }

//               if (
//                 incomingFileUrl &&
//                 x.fileUrl &&
//                 x.fileUrl === incomingFileUrl
//               ) {
//                 return true;
//               }

//               return false;
//             });

//             if (existingIndex === -1) {
//               return prev;
//             }

//             const next = [...prev];
//             next[existingIndex] = {
//               ...next[existingIndex],
//               ...normalizedMessage,
//               uploading: false,
//               localPreviewUrl: next[existingIndex].localPreviewUrl || null,
//             };

//             return next;
//           }

//           return [...prev, normalizedMessage];
//         });
//       }

//       if (current?.type === 'personal') {
//         fetchPersonalChats();
//       } else {
//         fetchGroups();
//       }
//     });

//     socket.on('message-edited', ({ message, chatId }) => {
//       if (activeChatRef.current?.id === chatId) {
//         setMessages((prev) => prev.map((x) => (x._id === message._id ? message : x)));
//       }
//     });

//     socket.on('message-deleted', ({ messageId, chatId }) => {
//       if (activeChatRef.current?.id === chatId) {
//         setMessages((prev) => prev.map((x) => (x._id === messageId ? { ...x, isDeleted: true } : x)));
//       }
//     });

//     socket.on('message-read', ({ messageId, userId, chatId }) => {
//       if (activeChatRef.current?.id === chatId) {
//         setMessages((prev) =>
//           prev.map((x) => {
//             if (x._id !== messageId) return x;
//             const readBy = x.readBy || [];
//             return readBy.includes(userId) ? x : { ...x, readBy: [...readBy, userId] };
//           })
//         );
//       }
//     });

//     socket.on('typing-indicator', ({ userId, isTyping }) => {
//       if (userId === getId(meRef.current)) return;
//       setTypingText(isTyping ? 'typing...' : '');
//     });

//     socket.on('group-typing-indicator', ({ userId, isTyping }) => {
//       if (userId === getId(meRef.current)) return;
//       setTypingText(isTyping ? 'someone is typing...' : '');
//     });

//     socket.on('ai-response', ({ message }) => {
//       if (activeChatRef.current?.isAI) {
//         const aiMsg = {
//           _id: 'ai-' + Date.now(),
//           content: message.content || "I'm here to help!",
//           sender: 'ai',
//           isAI: true,
//           createdAt: Date.now(),
//         };
//         setMessages((prev) => [...prev, aiMsg]);
//         setTypingText('');
//       }
//     });

//     socket.on('online-users', (userIds) => {
//       setOnlineUserIds(new Set((userIds || []).map((id) => getId(id) ?? id)));
//     });
//     socket.on('user-online', ({ userId }) => {
//       setOnlineUserIds((prev) => new Set(prev).add(userId));
//     });
//     socket.on('user-offline', ({ userId }) => {
//       setOnlineUserIds((prev) => {
//         const next = new Set(prev);
//         next.delete(userId);
//         return next;
//       });
//     });

//     socket.emit('user-connected', { userId: getId(meRef.current) });
//   };

//   const emitTyping = (isTyping) => {
//     const chat = activeChatRef.current;
//     if (!chat || !socketRef.current || chat.isAI) return;
//     clearTimeout(typingTimeoutRef.current);
//     if (isTyping) {
//       if (chat.type === 'group') {
//         socketRef.current.emit('group-typing', { groupId: chat.id, isTyping: true });
//       } else {
//         socketRef.current.emit('typing-start', { chatId: chat.id });
//       }
//       typingTimeoutRef.current = setTimeout(() => emitTyping(false), 2000);
//     } else {
//       if (chat.type === 'group') {
//         socketRef.current.emit('group-typing', { groupId: chat.id, isTyping: false });
//       } else {
//         socketRef.current.emit('typing-stop', { chatId: chat.id });
//       }
//     }
//   };

//   const openChat = async (type, item) => {
//     const chat = {
//       type,
//       id: item._id,
//       title: type === 'personal' ? otherUserName(item) : item.name,
//       aiMode: item.aiMode,
//       isAI: false,
//       otherUserId: type === 'personal' ? getOtherParticipantId(item, getId(meRef.current)) : null,
//     };
//     setActiveChat(chat);
//     setMessages([]);
//     setReplyTo(null);
//     setTypingText('');
//     if (type === 'group') socketRef.current?.emit('join-group', { groupId: item._id });
//     await fetchMessages(item._id);
//   };

//   const openAIChat = () => {
//     setActiveChat({ id: 'ai-chat', title: 'Nova AI', type: 'personal', isAI: true });
//     setMessages([
//       {
//         _id: 'welcome',
//         content: "Hello! I'm Nova AI. How can I help you today? 🚀",
//         sender: 'ai',
//         isAI: true,
//         createdAt: Date.now(),
//       },
//     ]);
//     setReplyTo(null);
//     setMobileSidebarOpen(false);
//   };

//   const sendAIMessage = async (content) => {
//     const userMsg = {
//       _id: 'user-' + Date.now(),
//       content,
//       sender: getId(meRef.current),
//       isAI: false,
//       createdAt: Date.now(),
//     };
//     setMessages((prev) => [...prev, userMsg]);
//     setTypingText('AI is thinking...');

//     try {
//       const { data } = await api.post('/ai/personal', { message: content });
//       if (data.success) {
//         const aiMsg = {
//           _id: 'ai-' + Date.now(),
//           content: data.response,
//           sender: 'ai',
//           isAI: true,
//           createdAt: Date.now(),
//         };
//         setMessages((prev) => [...prev, aiMsg]);
//         setTypingText('');
//       }
//     } catch (error) {
//       console.error('AI error:', error);
//       setTypingText('');
//       setMessages((prev) => [
//         ...prev,
//         {
//           _id: 'ai-' + Date.now(),
//           content: "Sorry, I'm having trouble right now. Please try again! 😅",
//           sender: 'ai',
//           isAI: true,
//           createdAt: Date.now(),
//         },
//       ]);
//     }
//   };

//   const handleSend = (content) => {
//     emitTyping(false);
//     const chat = activeChatRef.current;

//     if (chat.isAI) {
//       sendAIMessage(content);
//       return;
//     }

//     if (chat.type === 'personal') {
//       socketRef.current.emit('personal-message', {
//         chatId: chat.id,
//         content,
//         replyToId: replyTo?._id || null,
//       });
//     } else {
//       socketRef.current.emit('group-message', {
//         groupId: chat.id,
//         content,
//         replyToId: replyTo?._id || null,
//       });
//     }
//     setReplyTo(null);
//   };

//   const handleFileUpload = async (file) => {
//     if (!file) return;

//     const chat = activeChatRef.current;

//     if (!chat || chat.isAI) {
//       alert('Please select a chat first');
//       return;
//     }

//     if (file.size > 50 * 1024 * 1024) {
//       alert('File too large! Maximum 50MB allowed.');
//       return;
//     }

//     const tempId = 'uploading-' + Date.now();
//     const clientMessageId = crypto.randomUUID();

//     const fileKind = file.type.startsWith('image/')
//       ? 'image'
//       : file.type.startsWith('video/')
//         ? 'video'
//         : file.type.startsWith('audio/')
//           ? 'audio'
//           : 'file';

//     const localPreviewUrl =
//       fileKind === 'image' || fileKind === 'video'
//         ? URL.createObjectURL(file)
//         : null;

//     const tempMsg = {
//       _id: tempId,
//       clientMessageId,
//       sender: getId(meRef.current),
//       type: fileKind,
//       fileName: file.name,
//       fileSize: file.size,
//       localPreviewUrl,
//       uploading: true,
//       uploadProgress: 0,
//       createdAt: Date.now(),
//     };

//     setMessages((prev) => [...prev, tempMsg]);

//     const formData = new FormData();
//     formData.append('file', file);
//     formData.append('chatId', chat.id);
//     formData.append('chatType', chat.type || 'personal');

//     try {
//       const { data } = await api.post('/upload/single', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//         onUploadProgress: (evt) => {
//           if (!evt.total) return;

//           const percent = Math.round(
//             (evt.loaded * 100) / evt.total
//           );

//           setMessages((prev) =>
//             prev.map((x) =>
//               x._id === tempId
//                 ? {
//                     ...x,
//                     uploadProgress: percent,
//                   }
//                 : x
//             )
//           );
//         },
//       });

//       if (!data.success) {
//         throw new Error(
//           data.message || 'File upload failed'
//         );
//       }

//       const uploaded = data.message || data.data || data;

//       const fileUrl =
//         uploaded.fileUrl ||
//         uploaded.url ||
//         uploaded.secure_url;

//       if (!fileUrl) {
//         throw new Error(
//           'Upload succeeded but no file URL was returned'
//         );
//       }

//       const finalFileName =
//         uploaded.fileName ||
//         uploaded.name ||
//         file.name;

//       const finalFileSize =
//         uploaded.fileSize ||
//         uploaded.size ||
//         file.size;

//       const finalFileType =
//         uploaded.type ||
//         fileKind;

//       const optimisticFileMessage = {
//         ...tempMsg,
//         _id: uploaded._id || tempId,
//         clientMessageId,
//         type: finalFileType,
//         fileUrl,
//         fileName: finalFileName,
//         fileSize: finalFileSize,
//         uploading: false,
//         uploadProgress: 100,
//         localPreviewUrl,
//       };

//       setMessages((prev) =>
//         prev.map((x) =>
//           x._id === tempId
//             ? optimisticFileMessage
//             : x
//         )
//       );

//       // const filePayload = {
//       //   clientMessageId,
//       //   content: '',
//       //   fileData: {
//       //     url: fileUrl,
//       //     name: finalFileName,
//       //     size: finalFileSize,
//       //     type: finalFileType,
//       //     fileType:
//       //       uploaded.fileType ||
//       //       file.type ||
//       //       finalFileType,
//       //   },
//       //   replyToId: replyTo?._id || null,
//       // };

//       const filePayload = {
//   clientMessageId,
//   fileMessageId: uploaded._id,
//   replyToId: replyTo?._id || null,
// };

//       if (chat.type === 'group') {
//         socketRef.current?.emit('group-message', {
//           groupId: chat.id,
//           ...filePayload,
//         });
//       } else {
//         socketRef.current?.emit('personal-message', {
//           chatId: chat.id,
//           ...filePayload,
//         });
//       }

//       setReplyTo(null);

//       setTimeout(() => {
//         if (localPreviewUrl) {
//           URL.revokeObjectURL(localPreviewUrl);
//         }
//       }, 5000);
//     } catch (error) {
//       console.error('Upload error:', error);

//       if (localPreviewUrl) {
//         URL.revokeObjectURL(localPreviewUrl);
//       }

//       setMessages((prev) => prev.filter((x) => x._id !== tempId));

//       alert(
//         'File upload failed: ' +
//         (
//           error.response?.data?.message ||
//           error.message
//         )
//       );
//     }
//   };

//   const doLogout = () => {
//     api.post('/auth/logout').catch(() => {});
//     socketRef.current?.disconnect();
//     localStorage.removeItem('chat_token');
//     localStorage.removeItem('chat_me');
//     setAuthToken(null);
//     setToken(null);
//     setMe(null);
//     socketRef.current = null;
//     setUsers([]);
//     setPersonalChats([]);
//     setGroups([]);
//     setActiveChat(null);
//     setMessages([]);
//   };

//   const bootMain = async (tok, existingMe) => {
//     try {
//       if (!existingMe) await fetchMe();
//       await Promise.all([fetchUsers(), fetchPersonalChats(), fetchGroups()]);
//       connectSocket(tok);
//     } catch (e) {
//       console.error('Boot failed', e);
//       doLogout();
//     }
//   };

//   const handleAuthSubmit = async (payload, isLogin) => {
//     const path = isLogin ? '/auth/login' : '/auth/register';
//     const { data } = await api.post(path, payload);
//     const tok = data.token || data.accessToken || data.data?.token;
//     const user = data.user || data.data?.user || data.data;
//     if (!tok) throw new Error('No token in response');

//     setAuthToken(tok);
//     setToken(tok);
//     setMe(user);
//     localStorage.setItem('chat_token', tok);
//     localStorage.setItem('chat_me', JSON.stringify(user));

//     await bootMain(tok, user);
//   };

//   useEffect(() => {
//     if (token) {
//       bootMain(token, me);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   if (!token) {
//     return <AuthScreen authMode={authMode} setAuthMode={setAuthMode} onSubmit={handleAuthSubmit} />;
//   }

//   return (
//     <div className="relative flex h-screen w-full overflow-hidden bg-[#0a0a0a]">
//       <HamburgerButton
//         isOpen={mobileSidebarOpen}
//         onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
//       />

//       <Sidebar
//         me={me}
//         activeTab={activeTab}
//         setActiveTab={setActiveTab}
//         personalChats={personalChats}
//         groups={groups}
//         activeChat={activeChat}
//         onOpenChat={handleOpenChat}
//         onOpenAIChat={openAIChat}
//         onLogout={doLogout}
//         onNewChat={(type) => setModalType(type)}
//         otherUserName={otherUserName}
//         onlineUserIds={onlineUserIds}
//         mobileOpen={mobileSidebarOpen}
//         onCloseMobile={() => setMobileSidebarOpen(false)}
//       />

//       <div className="flex h-screen flex-1 flex-col overflow-hidden">
//         {!activeChat && (
//           <div className="flex flex-1 items-center justify-center bg-[#0f0f13]">
//             <div className="px-10 text-center">
//               <div className="mb-4 text-6xl opacity-40">💬</div>
//               <h3 className="mb-2 text-lg font-normal text-[#ccc]">Select a chat</h3>
//               <p className="text-sm text-[#888]">Tap the menu ☰ to open your chats</p>
//             </div>
//           </div>
//         )}
//         {activeChat && (
//           <ChatPanel
//             activeChat={activeChat}
//             messages={messages}
//             typingText={typingText}
//             replyTo={replyTo}
//             setReplyTo={setReplyTo}
//             onSend={handleSend}
//             onFileUpload={handleFileUpload}
//             me={me}
//             onEdit={editMessage}
//             onDelete={deleteMessage}
//             onMarkRead={markRead}
//             onToggleAIMode={toggleAIMode}
//             onTyping={emitTyping}
//             isOnline={activeChat?.otherUserId ? onlineUserIds.has(activeChat.otherUserId) : null}
//           />
//         )}
//       </div>

//       {modalType && (
//         <NewChatModal
//           type={modalType}
//           users={users}
//           me={me}
//           onCancel={() => setModalType(null)}
//           onCreatePersonal={createPersonalChat}
//           onCreateGroup={createGroup}
//         />
//       )}
//     </div>
//   );
// }




import React, { useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';
import { api, setAuthToken, SOCKET_URL } from './api.js';
import { getId, getOtherParticipantId } from './helpers.js';
import AuthScreen from './components/AuthScreen.jsx';
import Sidebar from './components/Sidebar.jsx';
import ChatPanel from './components/ChatPanel.jsx';
import NewChatModal from './components/NewChatModal.jsx';
import HamburgerButton from './components/HamburgerButton.jsx';
import './App.css';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('chat_token') || null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [me, setMe] = useState(JSON.parse(localStorage.getItem('chat_me') || 'null'));
  const [users, setUsers] = useState([]);
  const [personalChats, setPersonalChats] = useState([]);
  const [groups, setGroups] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [typingText, setTypingText] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [authMode, setAuthMode] = useState('login');
  const [activeTab, setActiveTab] = useState('personal');
  const [modalType, setModalType] = useState(null);
  const [onlineUserIds, setOnlineUserIds] = useState(() => new Set());
  const [suggestedEmoji, setSuggestedEmoji] = useState(null);

  const socketRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const activeChatRef = useRef(activeChat);
  const meRef = useRef(me);

  useEffect(() => { activeChatRef.current = activeChat; }, [activeChat]);
  useEffect(() => { meRef.current = me; }, [me]);

  const otherUserName = (chat) => {
    if (!chat.participants) return 'Chat';
    const other = chat.participants.find((p) => getId(p) !== getId(meRef.current));
    return other?.username || other?.email || 'Chat';
  };

  // Close mobile sidebar when chat is selected on mobile
  const handleOpenChat = async (type, item) => {
    await openChat(type, item);
    setMobileSidebarOpen(false);
  };

  const fetchMe = async () => {
    const { data } = await api.get('/auth/me');
    const u = data.user || data.data || data;
    setMe(u);
    localStorage.setItem('chat_me', JSON.stringify(u));
  };

  const fetchUsers = async () => {
    const { data } = await api.get('/auth/users');
    setUsers(data.users || data.data || data || []);
  };

  const fetchPersonalChats = async () => {
    const { data } = await api.get('/chat/personal');
    setPersonalChats(data.chats || data.data || data || []);
  };

  const fetchGroups = async () => {
    const { data } = await api.get('/group');
    setGroups(data.groups || data.data || data || []);
  };

  const fetchMessages = async (chatId) => {
    const { data } = await api.get(`/chat/${chatId}/messages`);
    setMessages(data.messages || data.data || data || []);
  };

  const createPersonalChat = async (otherUserId) => {
    const { data } = await api.post('/chat/personal', { userId: otherUserId });
    const chat = data.chat || data.data || data;
    await fetchPersonalChats();
    setModalType(null);
    openChat('personal', chat);
  };

  const createGroup = async (name, memberIds) => {
    if (!name) return;
    const { data } = await api.post('/group', { name, members: memberIds });
    const group = data.group || data.data || data;
    await fetchGroups();
    setModalType(null);
    openChat('group', group);
  };

  const toggleAIMode = async () => {
    const chat = activeChatRef.current;
    try {
      await api.put(`/group/${chat.id}/ai-mode`, { mode: !chat.aiMode });
      setActiveChat((prev) => ({ ...prev, aiMode: !prev.aiMode }));
      setGroups((prev) => prev.map((g) => (g._id === chat.id ? { ...g, aiMode: !chat.aiMode } : g)));
    } catch (e) {
      console.error(e);
    }
  };

  const editMessage = async (m) => {
    if (m.fileUrl) {
      alert('File messages cannot be edited');
      return;
    }

    const chat = activeChatRef.current;

    const newContent = prompt(
      'Edit message:',
      m.content
    );

    if (
      newContent == null ||
      !newContent.trim() ||
      newContent.trim() === m.content
    ) {
      return;
    }

    try {
      if (chat?.type === 'group') {
        socketRef.current?.emit(
          'group-edit-message',
          {
            groupId: chat.id,
            messageId: m._id,
            content: newContent.trim(),
          }
        );

        return;
      }

      await api.put(
        `/chat/message/${m._id}`,
        {
          content: newContent.trim(),
        }
      );

      setMessages((prev) =>
        prev.map((x) =>
          x._id === m._id
            ? {
                ...x,
                content: newContent.trim(),
                isEdited: true,
              }
            : x
        )
      );
    } catch (error) {
      console.error(
        'Edit message error:',
        error
      );
    }
  };

  const deleteMessage = async (m) => {
    if (!confirm('Delete this message?')) {
      return;
    }

    const chat = activeChatRef.current;

    try {
      if (chat?.type === 'group') {
        socketRef.current?.emit(
          'group-delete-message',
          {
            groupId: chat.id,
            messageId: m._id,
          }
        );

        return;
      }

      await api.delete(
        `/chat/message/${m._id}`
      );

      setMessages((prev) =>
        prev.map((x) =>
          x._id === m._id
            ? {
                ...x,
                isDeleted: true,
              }
            : x
        )
      );
    } catch (error) {
      console.error(
        'Delete message error:',
        error
      );
    }
  };

  const markRead = (messageId) => {
    socketRef.current?.emit('mark-read', { messageId, chatId: activeChatRef.current.id });
  };

  // ============================================================
  // NEW: POLL / EMOJI / ROAST-COMPLIMENT / ICEBREAKER HANDLERS
  // ============================================================
  const sendPoll = (text) => {
    const chat = activeChatRef.current;
    if (!chat || chat.type !== 'group' || chat.isAI) return;
    socketRef.current?.emit('create-poll', { groupId: chat.id, text });
  };

  const votePoll = (messageId, optionIndex) => {
    const chat = activeChatRef.current;
    if (!chat || chat.type !== 'group') return;
    socketRef.current?.emit('vote-poll', {
      groupId: chat.id,
      messageId,
      optionIndex,
    });
  };

  const requestIcebreaker = () => {
    const chat = activeChatRef.current;
    if (!chat || chat.type !== 'group' || chat.isAI) return;
    socketRef.current?.emit('request-icebreaker', { groupId: chat.id });
  };

  const reactWithAI = (messageId, mode) => {
    const chat = activeChatRef.current;
    if (!chat || chat.type !== 'group' || chat.isAI) return;
    socketRef.current?.emit('react-ai', {
      groupId: chat.id,
      messageId,
      mode, // 'roast' | 'compliment'
    });
  };

  const emitEmojiTyping = (text) => {
    const chat = activeChatRef.current;
    if (!chat || chat.type !== 'group' || chat.isAI) return;
    socketRef.current?.emit('suggest-emoji', { text, groupId: chat.id });
  };

  const clearSuggestedEmoji = () => setSuggestedEmoji(null);

  const connectSocket = (tok) => {
    if (socketRef.current) socketRef.current.disconnect();
    const socket = io(SOCKET_URL, { auth: { token: tok } });
    socketRef.current = socket;

    socket.on('connect', () => console.log('✅ Socket connected'));
    socket.on('error', (e) => console.error('Socket error', e));

    socket.on('receive-message', (payload) => {
      const { message, chatId, groupId } = payload;
      const current = activeChatRef.current;

      if (current && (chatId === current.id || groupId === current.id)) {
        setMessages((prev) => {
          if (!message) return prev;

          const rawFileData = message.fileData || {};
          const socketFileUrl =
            message.fileUrl ||
            rawFileData.url ||
            (
              typeof message.content === 'string' &&
              /^https?:\/\/.+/i.test(message.content.trim())
                ? message.content.trim()
                : null
            );

          const socketFileType =
            message.type ||
            rawFileData.type ||
            rawFileData.fileType ||
            (
              typeof socketFileUrl === 'string'
                ? (
                    /\.(jpe?g|png|gif|webp|bmp|svg)(\?.*)?$/i.test(socketFileUrl)
                      ? 'image'
                      : /\.(mp4|webm|mov|avi|mkv)(\?.*)?$/i.test(socketFileUrl)
                        ? 'video'
                        : /\.(mp3|wav|ogg|m4a|aac|flac)(\?.*)?$/i.test(socketFileUrl)
                          ? 'audio'
                          : socketFileUrl
                            ? 'file'
                            : null
                  )
                : null
            );

          const normalizedMessage = socketFileUrl
            ? {
                ...message,
                fileUrl: socketFileUrl,
                type: socketFileType || 'file',
                fileName:
                  message.fileName ||
                  rawFileData.name ||
                  rawFileData.fileName ||
                  'File',
                fileSize:
                  message.fileSize ||
                  rawFileData.size ||
                  rawFileData.fileSize ||
                  undefined,
                content: '',
              }
            : message;

          const incomingId = normalizedMessage._id
            ? String(normalizedMessage._id)
            : null;

          const incomingClientId = normalizedMessage.clientMessageId
            ? String(normalizedMessage.clientMessageId)
            : null;

          const incomingFileUrl = normalizedMessage.fileUrl || null;

          const isDuplicate = prev.some((x) => {
            if (!x) return false;

            if (
              incomingId &&
              x._id &&
              String(x._id) === incomingId
            ) {
              return true;
            }

            if (
              incomingClientId &&
              x.clientMessageId &&
              String(x.clientMessageId) === incomingClientId
            ) {
              return true;
            }

            if (
              incomingFileUrl &&
              x.fileUrl &&
              x.fileUrl === incomingFileUrl
            ) {
              return true;
            }

            return false;
          });

          if (isDuplicate) {
            const existingIndex = prev.findIndex((x) => {
              if (!x) return false;

              if (
                incomingId &&
                x._id &&
                String(x._id) === incomingId
              ) {
                return true;
              }

              if (
                incomingFileUrl &&
                x.fileUrl &&
                x.fileUrl === incomingFileUrl
              ) {
                return true;
              }

              return false;
            });

            if (existingIndex === -1) {
              return prev;
            }

            const next = [...prev];
            next[existingIndex] = {
              ...next[existingIndex],
              ...normalizedMessage,
              uploading: false,
              localPreviewUrl: next[existingIndex].localPreviewUrl || null,
            };

            return next;
          }

          return [...prev, normalizedMessage];
        });
      }

      if (current?.type === 'personal') {
        fetchPersonalChats();
      } else {
        fetchGroups();
      }
    });

    socket.on('message-edited', ({ message, chatId }) => {
      if (activeChatRef.current?.id === chatId) {
        setMessages((prev) => prev.map((x) => (x._id === message._id ? message : x)));
      }
    });

    socket.on('message-deleted', ({ messageId, chatId }) => {
      if (activeChatRef.current?.id === chatId) {
        setMessages((prev) => prev.map((x) => (x._id === messageId ? { ...x, isDeleted: true } : x)));
      }
    });

    socket.on('message-read', ({ messageId, userId, chatId }) => {
      if (activeChatRef.current?.id === chatId) {
        setMessages((prev) =>
          prev.map((x) => {
            if (x._id !== messageId) return x;
            const readBy = x.readBy || [];
            return readBy.includes(userId) ? x : { ...x, readBy: [...readBy, userId] };
          })
        );
      }
    });

    socket.on('typing-indicator', ({ userId, isTyping }) => {
      if (userId === getId(meRef.current)) return;
      setTypingText(isTyping ? 'typing...' : '');
    });

    socket.on('group-typing-indicator', ({ userId, isTyping }) => {
      if (userId === getId(meRef.current)) return;
      setTypingText(isTyping ? 'someone is typing...' : '');
    });

    socket.on('ai-response', ({ message }) => {
      if (activeChatRef.current?.isAI) {
        const aiMsg = {
          _id: 'ai-' + Date.now(),
          content: message.content || "I'm here to help!",
          sender: 'ai',
          isAI: true,
          createdAt: Date.now(),
        };
        setMessages((prev) => [...prev, aiMsg]);
        setTypingText('');
      }
    });

    // NEW: poll updated in realtime (votes changed)
    socket.on('poll-updated', ({ messageId, poll, groupId }) => {
      if (activeChatRef.current?.id === groupId) {
        setMessages((prev) =>
          prev.map((x) => (x._id === messageId ? { ...x, poll } : x))
        );
      }
    });

    // NEW: live emoji suggestion while typing
    socket.on('emoji-suggestion', ({ emoji, groupId }) => {
      if (activeChatRef.current?.id === groupId) {
        setSuggestedEmoji(emoji);
      }
    });

    socket.on('online-users', (userIds) => {
      setOnlineUserIds(new Set((userIds || []).map((id) => getId(id) ?? id)));
    });
    socket.on('user-online', ({ userId }) => {
      setOnlineUserIds((prev) => new Set(prev).add(userId));
    });
    socket.on('user-offline', ({ userId }) => {
      setOnlineUserIds((prev) => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    });

    socket.emit('user-connected', { userId: getId(meRef.current) });
  };

  const emitTyping = (isTyping) => {
    const chat = activeChatRef.current;
    if (!chat || !socketRef.current || chat.isAI) return;
    clearTimeout(typingTimeoutRef.current);
    if (isTyping) {
      if (chat.type === 'group') {
        socketRef.current.emit('group-typing', { groupId: chat.id, isTyping: true });
      } else {
        socketRef.current.emit('typing-start', { chatId: chat.id });
      }
      typingTimeoutRef.current = setTimeout(() => emitTyping(false), 2000);
    } else {
      if (chat.type === 'group') {
        socketRef.current.emit('group-typing', { groupId: chat.id, isTyping: false });
      } else {
        socketRef.current.emit('typing-stop', { chatId: chat.id });
      }
    }
  };

  const openChat = async (type, item) => {
    const chat = {
      type,
      id: item._id,
      title: type === 'personal' ? otherUserName(item) : item.name,
      aiMode: item.aiMode,
      isAI: false,
      otherUserId: type === 'personal' ? getOtherParticipantId(item, getId(meRef.current)) : null,
    };
    setActiveChat(chat);
    setMessages([]);
    setReplyTo(null);
    setTypingText('');
    setSuggestedEmoji(null);
    if (type === 'group') socketRef.current?.emit('join-group', { groupId: item._id });
    await fetchMessages(item._id);
  };

  const openAIChat = () => {
    setActiveChat({ id: 'ai-chat', title: 'Nova AI', type: 'personal', isAI: true });
    setMessages([
      {
        _id: 'welcome',
        content: "Hello! I'm Nova AI. How can I help you today? 🚀",
        sender: 'ai',
        isAI: true,
        createdAt: Date.now(),
      },
    ]);
    setReplyTo(null);
    setMobileSidebarOpen(false);
  };

  const sendAIMessage = async (content) => {
    const userMsg = {
      _id: 'user-' + Date.now(),
      content,
      sender: getId(meRef.current),
      isAI: false,
      createdAt: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setTypingText('AI is thinking...');

    try {
      const { data } = await api.post('/ai/personal', { message: content });
      if (data.success) {
        const aiMsg = {
          _id: 'ai-' + Date.now(),
          content: data.response,
          sender: 'ai',
          isAI: true,
          createdAt: Date.now(),
        };
        setMessages((prev) => [...prev, aiMsg]);
        setTypingText('');
      }
    } catch (error) {
      console.error('AI error:', error);
      setTypingText('');
      setMessages((prev) => [
        ...prev,
        {
          _id: 'ai-' + Date.now(),
          content: "Sorry, I'm having trouble right now. Please try again! 😅",
          sender: 'ai',
          isAI: true,
          createdAt: Date.now(),
        },
      ]);
    }
  };

  const handleSend = (content) => {
    emitTyping(false);
    setSuggestedEmoji(null);
    const chat = activeChatRef.current;

    if (chat.isAI) {
      sendAIMessage(content);
      return;
    }

    // NEW: /poll command detection
    if (chat.type === 'group' && content.trim().toLowerCase().startsWith('/poll ')) {
      const pollText = content.trim().slice(6).trim();
      if (pollText) sendPoll(pollText);
      return;
    }

    // NEW: /icebreaker command detection
    if (chat.type === 'group' && content.trim().toLowerCase() === '/icebreaker') {
      requestIcebreaker();
      return;
    }

    if (chat.type === 'personal') {
      socketRef.current.emit('personal-message', {
        chatId: chat.id,
        content,
        replyToId: replyTo?._id || null,
      });
    } else {
      socketRef.current.emit('group-message', {
        groupId: chat.id,
        content,
        replyToId: replyTo?._id || null,
      });
    }
    setReplyTo(null);
  };

  const handleFileUpload = async (file) => {
    if (!file) return;

    const chat = activeChatRef.current;

    if (!chat || chat.isAI) {
      alert('Please select a chat first');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      alert('File too large! Maximum 50MB allowed.');
      return;
    }

    const tempId = 'uploading-' + Date.now();
    const clientMessageId = crypto.randomUUID();

    const fileKind = file.type.startsWith('image/')
      ? 'image'
      : file.type.startsWith('video/')
        ? 'video'
        : file.type.startsWith('audio/')
          ? 'audio'
          : 'file';

    const localPreviewUrl =
      fileKind === 'image' || fileKind === 'video'
        ? URL.createObjectURL(file)
        : null;

    const tempMsg = {
      _id: tempId,
      clientMessageId,
      sender: getId(meRef.current),
      type: fileKind,
      fileName: file.name,
      fileSize: file.size,
      localPreviewUrl,
      uploading: true,
      uploadProgress: 0,
      createdAt: Date.now(),
    };

    setMessages((prev) => [...prev, tempMsg]);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('chatId', chat.id);
    formData.append('chatType', chat.type || 'personal');

    try {
      const { data } = await api.post('/upload/single', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (evt) => {
          if (!evt.total) return;

          const percent = Math.round(
            (evt.loaded * 100) / evt.total
          );

          setMessages((prev) =>
            prev.map((x) =>
              x._id === tempId
                ? {
                    ...x,
                    uploadProgress: percent,
                  }
                : x
            )
          );
        },
      });

      if (!data.success) {
        throw new Error(
          data.message || 'File upload failed'
        );
      }

      const uploaded = data.message || data.data || data;

      const fileUrl =
        uploaded.fileUrl ||
        uploaded.url ||
        uploaded.secure_url;

      if (!fileUrl) {
        throw new Error(
          'Upload succeeded but no file URL was returned'
        );
      }

      const finalFileName =
        uploaded.fileName ||
        uploaded.name ||
        file.name;

      const finalFileSize =
        uploaded.fileSize ||
        uploaded.size ||
        file.size;

      const finalFileType =
        uploaded.type ||
        fileKind;

      const optimisticFileMessage = {
        ...tempMsg,
        _id: uploaded._id || tempId,
        clientMessageId,
        type: finalFileType,
        fileUrl,
        fileName: finalFileName,
        fileSize: finalFileSize,
        uploading: false,
        uploadProgress: 100,
        localPreviewUrl,
      };

      setMessages((prev) =>
        prev.map((x) =>
          x._id === tempId
            ? optimisticFileMessage
            : x
        )
      );

      const filePayload = {
        clientMessageId,
        fileMessageId: uploaded._id,
        replyToId: replyTo?._id || null,
      };

      if (chat.type === 'group') {
        socketRef.current?.emit('group-message', {
          groupId: chat.id,
          ...filePayload,
        });
      } else {
        socketRef.current?.emit('personal-message', {
          chatId: chat.id,
          ...filePayload,
        });
      }

      setReplyTo(null);

      setTimeout(() => {
        if (localPreviewUrl) {
          URL.revokeObjectURL(localPreviewUrl);
        }
      }, 5000);
    } catch (error) {
      console.error('Upload error:', error);

      if (localPreviewUrl) {
        URL.revokeObjectURL(localPreviewUrl);
      }

      setMessages((prev) => prev.filter((x) => x._id !== tempId));

      alert(
        'File upload failed: ' +
        (
          error.response?.data?.message ||
          error.message
        )
      );
    }
  };

  const doLogout = () => {
    api.post('/auth/logout').catch(() => {});
    socketRef.current?.disconnect();
    localStorage.removeItem('chat_token');
    localStorage.removeItem('chat_me');
    setAuthToken(null);
    setToken(null);
    setMe(null);
    socketRef.current = null;
    setUsers([]);
    setPersonalChats([]);
    setGroups([]);
    setActiveChat(null);
    setMessages([]);
  };

  const bootMain = async (tok, existingMe) => {
    try {
      if (!existingMe) await fetchMe();
      await Promise.all([fetchUsers(), fetchPersonalChats(), fetchGroups()]);
      connectSocket(tok);
    } catch (e) {
      console.error('Boot failed', e);
      doLogout();
    }
  };

  const handleAuthSubmit = async (payload, isLogin) => {
    const path = isLogin ? '/auth/login' : '/auth/register';
    const { data } = await api.post(path, payload);
    const tok = data.token || data.accessToken || data.data?.token;
    const user = data.user || data.data?.user || data.data;
    if (!tok) throw new Error('No token in response');

    setAuthToken(tok);
    setToken(tok);
    setMe(user);
    localStorage.setItem('chat_token', tok);
    localStorage.setItem('chat_me', JSON.stringify(user));

    await bootMain(tok, user);
  };

  useEffect(() => {
    if (token) {
      bootMain(token, me);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!token) {
    return <AuthScreen authMode={authMode} setAuthMode={setAuthMode} onSubmit={handleAuthSubmit} />;
  }

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-[#0a0a0a]">
      <HamburgerButton
        isOpen={mobileSidebarOpen}
        onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
      />

      <Sidebar
        me={me}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        personalChats={personalChats}
        groups={groups}
        activeChat={activeChat}
        onOpenChat={handleOpenChat}
        onOpenAIChat={openAIChat}
        onLogout={doLogout}
        onNewChat={(type) => setModalType(type)}
        otherUserName={otherUserName}
        onlineUserIds={onlineUserIds}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      <div className="flex h-screen flex-1 flex-col overflow-hidden">
        {!activeChat && (
          <div className="flex flex-1 items-center justify-center bg-[#0f0f13]">
            <div className="px-10 text-center">
              <div className="mb-4 text-6xl opacity-40">💬</div>
              <h3 className="mb-2 text-lg font-normal text-[#ccc]">Select a chat</h3>
              <p className="text-sm text-[#888]">Tap the menu ☰ to open your chats</p>
            </div>
          </div>
        )}
        {activeChat && (
          <ChatPanel
            activeChat={activeChat}
            messages={messages}
            typingText={typingText}
            replyTo={replyTo}
            setReplyTo={setReplyTo}
            onSend={handleSend}
            onFileUpload={handleFileUpload}
            me={me}
            onEdit={editMessage}
            onDelete={deleteMessage}
            onMarkRead={markRead}
            onToggleAIMode={toggleAIMode}
            onTyping={emitTyping}
            isOnline={activeChat?.otherUserId ? onlineUserIds.has(activeChat.otherUserId) : null}
            onVotePoll={votePoll}
            onRequestIcebreaker={requestIcebreaker}
            onReactAI={reactWithAI}
            suggestedEmoji={suggestedEmoji}
            onTypingForEmoji={emitEmojiTyping}
            onClearSuggestedEmoji={clearSuggestedEmoji}
          />
        )}
      </div>

      {modalType && (
        <NewChatModal
          type={modalType}
          users={users}
          me={me}
          onCancel={() => setModalType(null)}
          onCreatePersonal={createPersonalChat}
          onCreateGroup={createGroup}
        />
      )}
    </div>
  );
}

