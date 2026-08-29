export function useChatApi({
  api,
  meRef,
  activeChatRef,
  setMe,
  setUsers,
  setPersonalChats,
  setGroups,
  setMessages,
  setModalType,
  setActiveChat,
  setReplyTo,
  setAuthToken,
  setToken,
}) {
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
    return chat;
  };

  const createGroup = async (name, memberIds) => {
    if (!name) return;
    const { data } = await api.post('/group', { name, members: memberIds });
    const group = data.group || data.data || data;
    await fetchGroups();
    setModalType(null);
    return group;
  };

  const editMessage = async (m) => {
    if (m.fileUrl) {
      alert('File messages cannot be edited');
      return;
    }

    const newContent = prompt('Edit message:', m.content);
    if (newContent == null || newContent === m.content) return;

    try {
      await api.put(`/chat/message/${m._id}`, { content: newContent });
      setMessages((prev) =>
        prev.map((x) =>
          x._id === m._id
            ? { ...x, content: newContent, isEdited: true }
            : x
        )
      );
    } catch (e) {
      console.error(e);
    }
  };

  const deleteMessage = async (m) => {
    if (!confirm('Delete this message?')) return;

    try {
      await api.delete(`/chat/message/${m._id}`);
      setMessages((prev) =>
        prev.map((x) =>
          x._id === m._id ? { ...x, isDeleted: true } : x
        )
      );
    } catch (e) {
      console.error(e);
    }
  };

  const bootMain = async (tok, existingMe) => {
    try {
      if (!existingMe) await fetchMe();
      await Promise.all([fetchUsers(), fetchPersonalChats(), fetchGroups()]);
    } catch (e) {
      console.error('Boot failed', e);
      throw e;
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

    return { tok, user };
  };

  return {
    fetchMe,
    fetchUsers,
    fetchPersonalChats,
    fetchGroups,
    fetchMessages,
    createPersonalChat,
    createGroup,
    editMessage,
    deleteMessage,
    bootMain,
    handleAuthSubmit,
  };
}
