export function useChatSocket({
  SOCKET_URL,
  io,
  activeChatRef,
  meRef,
  socketRef,
  setMessages,
  setTypingText,
  setOnlineUserIds,
  fetchPersonalChats,
  fetchGroups,
}) {
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
              localPreviewUrl:
                next[existingIndex].localPreviewUrl || null,
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
        setMessages((prev) =>
          prev.map((x) =>
            x._id === message._id ? message : x
          )
        );
      }
    });

    socket.on('message-deleted', ({ messageId, chatId }) => {
      if (activeChatRef.current?.id === chatId) {
        setMessages((prev) =>
          prev.map((x) =>
            x._id === messageId
              ? { ...x, isDeleted: true }
              : x
          )
        );
      }
    });

    socket.on('message-read', ({ messageId, userId, chatId }) => {
      if (activeChatRef.current?.id === chatId) {
        setMessages((prev) =>
          prev.map((x) => {
            if (x._id !== messageId) return x;
            const readBy = x.readBy || [];
            return readBy.includes(userId)
              ? x
              : { ...x, readBy: [...readBy, userId] };
          })
        );
      }
    });

    socket.on('typing-indicator', ({ userId, isTyping }) => {
      if (userId === meRef.current?._id || userId === meRef.current?.id) return;
      setTypingText(isTyping ? 'typing...' : '');
    });

    socket.on('group-typing-indicator', ({ userId, isTyping }) => {
      if (userId === meRef.current?._id || userId === meRef.current?.id) return;
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

    socket.on('online-users', (userIds) => {
      setOnlineUserIds(
        new Set((userIds || []).map((id) => id?._id ?? id?.id ?? id))
      );
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

    socket.emit('user-connected', {
      userId: meRef.current?._id ?? meRef.current?.id,
    });

    return socket;
  };

  return connectSocket;
}
