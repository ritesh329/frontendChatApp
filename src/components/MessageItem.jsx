import React, { useEffect } from 'react';
import { formatTime, formatFileSize, truncate, getId, guessMediaKindFromUrl } from '../helpers.js';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
/* WhatsApp-style circular upload progress ring */
function CircularProgress({ percent = 0, small = false }) {
  const size = small ? 34 : 52;
  const radius = small ? 13 : 22;
  const strokeWidth = small ? 3 : 4;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, Math.max(0, percent)) / 100) * circumference;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="upload-progress-ring">
      <circle cx={center} cy={center} r={radius} fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth={strokeWidth} />
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke="#fff"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${center} ${center})`}
      />
      {!small && (
        <text x={center} y={center + 4} textAnchor="middle" fontSize="11" fill="#fff">
          {percent}%
        </text>
      )}
    </svg>
  );
}

function FileContent({ type, url, fileName, uploading, uploadProgress, localPreviewUrl }) {
  const isUploading = !!uploading;
  const previewSrc = isUploading ? localPreviewUrl : url;

  if (type === 'image') {
    return (
      <div className="file-attachment">
        <div className={'media-wrap' + (isUploading ? ' uploading' : '')}>
          <img
            src={previewSrc}
            className="file-preview"
            alt={fileName || 'Image'}
            onClick={() => !isUploading && window.open(url, '_blank')}
          />
          {isUploading && (
            <div className="upload-overlay">
              <CircularProgress percent={uploadProgress || 0} />
            </div>
          )}
        </div>
        {fileName && <span className="file-name">{fileName}</span>}
      </div>
    );
  }
  if (type === 'video') {
    return (
      <div className="file-attachment">
        <div className={'media-wrap' + (isUploading ? ' uploading' : '')}>
          <video src={previewSrc} className="file-preview" controls={!isUploading} muted={isUploading} />
          {isUploading && (
            <div className="upload-overlay">
              <CircularProgress percent={uploadProgress || 0} />
            </div>
          )}
        </div>
        {fileName && <span className="file-name">{fileName}</span>}
      </div>
    );
  }
  if (type === 'audio') {
    return (
      <div className="file-attachment">
        {isUploading ? (
          <div className="file-uploading-row">
            <CircularProgress percent={uploadProgress || 0} small />
            <span className="file-name">{fileName}</span>
          </div>
        ) : (
          <audio src={url} controls />
        )}
      </div>
    );
  }
  // File / Document
  return (
    <div className="file-attachment">
      {isUploading ? (
        <div className="file-uploading-row">
          <CircularProgress percent={uploadProgress || 0} small />
          <span className="file-name">{fileName || 'File'}</span>
        </div>
      ) : (
        <>
          <a href={url} target="_blank" rel="noreferrer">
            📄 {fileName || 'File'}
          </a>
          {fileName && <span className="file-name">{fileName}</span>}
        </>
      )}
    </div>
  );
}

export default function MessageItem({ m, me, onEdit, onDelete, onReply, onMarkRead }) {
  const senderId = getId(m.sender);
  const mine = senderId !== null && senderId === getId(me);
  const isAI = m.isAI || m.sender === 'ai';

  // Normalize file detection: some messages only carry a bare URL in
  // `content` (e.g. a socket echo without full file metadata) — in that
  // case we still want to render it as media, not as a raw URL string.
  const inferredKind = !m.fileUrl && !m.uploading ? guessMediaKindFromUrl(m.content) : null;
  const effectiveType = m.type || inferredKind;
  const effectiveUrl = m.fileUrl || (inferredKind ? m.content : null);
  const isFileMsg =
    m.uploading ||
    (!!effectiveUrl && (effectiveType === 'image' || effectiveType === 'video' || effectiveType === 'file' || effectiveType === 'audio'));

  // Mark as read once rendered (fire and forget) - mirrors original behaviour
  useEffect(() => {
    if (!mine && !isAI && m._id) {
      const alreadyRead = m.readBy?.includes(getId(me));
      if (!alreadyRead) {
        onMarkRead(m._id);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [m._id, m.readBy]);

  return (
    <div className={'msg-row ' + (isAI ? 'ai' : mine ? 'me' : 'them')}>
      {!mine && !isAI && <div className="msg-sender">{m.sender?.username || 'User'}</div>}
      {isAI && <div className="msg-sender">🤖 Nova AI</div>}

      <div className="bubble">
        {m.replyTo && m.replyTo.content && (
          <div className="msg-reply">{truncate(m.replyTo.content, 60)}</div>
        )}
        {m.isDeleted ? (
          <span className="deleted">This message was deleted</span>
        ) : isFileMsg ? (
          <FileContent
            type={effectiveType}
            url={effectiveUrl}
            fileName={m.fileName}
            uploading={m.uploading}
            uploadProgress={m.uploadProgress}
            localPreviewUrl={m.localPreviewUrl}
          />
        ) : (
          <ReactMarkdown
  remarkPlugins={[remarkGfm]}
  components={{
    a: ({ node, ...props }) => (
      <a
        {...props}
        target="_blank"
        rel="noopener noreferrer"
      />
    ),

    code({ inline, children, ...props }) {
      if (inline) {
        return (
          <code {...props}>
            {children}
          </code>
        );
      }

      return (
        <pre className="code-block">
          <code {...props}>
            {children}
          </code>
        </pre>
      );
    },
  }}
>
  {m.content || ''}
</ReactMarkdown>
        )}
      </div>

      <div className="msg-meta">
        {m.uploading ? (
          <span>Sending…</span>
        ) : (
          <>
            <span>{formatTime(m.createdAt || m.timestamp)}</span>
            {m.isEdited && <span>(edited)</span>}
            {mine && m.readBy && m.readBy.length > 1 && <span>✓ Seen</span>}
            {m.fileSize && <span>{formatFileSize(m.fileSize)}</span>}
          </>
        )}
      </div>

      {mine && !m.isDeleted && !isAI && !m.uploading && (
        <div className="msg-actions">
          {!m.fileUrl && <span onClick={() => onEdit(m)}>Edit</span>}
          <span onClick={() => onDelete(m)}>Delete</span>
          <span onClick={() => onReply(m)}>Reply</span>
        </div>
      )}
      {!mine && !isAI && !m.uploading && (
        <div className="msg-actions">
          <span onClick={() => onReply(m)}>Reply</span>
        </div>
      )}
    </div>
  );
}
