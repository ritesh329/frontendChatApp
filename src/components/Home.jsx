import React from 'react';
import Avatar from './Avatar.jsx';
import { getId } from '../helpers.js';

export default function Home({
  me,
  users = [],
  onlineUserIds = new Set(),
  onOpenPersonalChat,
}) {
  const myId = String(getId(me));

  const members = users.filter(
    (user) =>
      user?._id &&
      String(user._id) !== myId
  );

  const handleMemberClick = (user) => {
    if (typeof onOpenPersonalChat === 'function') {
      onOpenPersonalChat(user);
    }
  };

  return (
    <div className="home-screen">
      <div className="home-screen-header">
        <h2>Home</h2>
        <p>All members</p>
      </div>

      <div className="home-members">
        {members.length === 0 ? (
          <div className="home-empty">
            No members found
          </div>
        ) : (
          members.map((user) => {
            const userId = String(user._id);
            const online = onlineUserIds.has(userId);
            const name =
              user.username ||
              user.email ||
              'User';

            return (
              <div
                key={user._id}
                className="home-member-card"
                onClick={() => handleMemberClick(user)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (
                    e.key === 'Enter' ||
                    e.key === ' '
                  ) {
                    e.preventDefault();
                    handleMemberClick(user);
                  }
                }}
              >
                <div className="home-member-avatar">
                  <Avatar name={name} />
                  {online && (
                    <span className="online-dot" />
                  )}
                </div>

                <div className="home-member-info">
                  <div className="home-member-name">
                    {name}
                  </div>

                  <div
                    className={
                      online
                        ? 'home-member-status online'
                        : 'home-member-status'
                    }
                  >
                    {online ? 'Online' : 'Offline'}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
