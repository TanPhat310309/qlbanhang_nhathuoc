import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './ChatBubble.css';

const ChatBubble = () => {
  return (
    <div
      className="global-chat-bubble"
      onClick={() => alert('Chưa làm chat đâu nha')}
    >
      <i className="fas fa-comment-dots"></i>
    </div>
  );
};

export default ChatBubble;
