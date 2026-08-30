// import React, { useEffect } from 'react';
// import { formatTime, formatFileSize, truncate, getId, guessMediaKindFromUrl } from '../helpers.js';
// import ReactMarkdown from 'react-markdown';
// import remarkGfm from 'remark-gfm';

// /* Circular upload progress ring */
// function CircularProgress({ percent = 0, small = false }) {
//   const size = small ? 34 : 52;
//   const radius = small ? 13 : 22;
//   const strokeWidth = small ? 3 : 4;
//   const center = size / 2;
//   const circumference = 2 * Math.PI * radius;
//   const offset = circumference - (Math.min(100, Math.max(0, percent)) / 100) * circumference;

//   return (
//     <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
//       <circle cx={center} cy={center} r={radius} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth={strokeWidth} />
//       <circle
//         cx={center}
//         cy={center}
//         r={radius}
//         fill="none"
//         stroke="#fff"
//         strokeWidth={strokeWidth}
//         strokeDasharray={circumference}
//         strokeDashoffset={offset}
//         strokeLinecap="round"
//         transform={`rotate(-90 ${center} ${center})`}
//         className="transition-[stroke-dashoffset] duration-150 ease-linear"
//       />
//       {!small && (
//         <text x={center} y={center + 4} textAnchor="middle" fontSize="11" fontWeight="600" fill="#fff">
//           {percent}%
//         </text>
//       )}
//     </svg>
//   );
// }

// function FileContent({ type, url, fileName, fileSize, uploading, uploadProgress, localPreviewUrl }) {
//   const isUploading = !!uploading;
//   const previewSrc = isUploading ? localPreviewUrl : url;

//   if (type === 'image') {
//     return (
//       <div className="mt-1 max-w-[280px]">
//         <div className="relative overflow-hidden rounded-xl leading-none">
//           <img
//             src={previewSrc}
//             alt={fileName || 'Image'}
//             onClick={() => !isUploading && window.open(url, '_blank')}
//             className={`block max-h-[300px] w-full rounded-xl object-contain ${
//               isUploading ? 'cursor-default brightness-[0.55]' : 'cursor-pointer'
//             }`}
//           />
//           {isUploading && (
//             <div className="absolute inset-0 flex items-center justify-center bg-black/30">
//               <CircularProgress percent={uploadProgress || 0} />
//             </div>
//           )}
//         </div>
//         {fileName && <span className="mt-1 block truncate text-xs text-[#aaa]">{fileName}</span>}
//       </div>
//     );
//   }

//   if (type === 'video') {
//     return (
//       <div className="mt-1 max-w-[280px]">
//         <div className="relative overflow-hidden rounded-xl leading-none">
//           <video
//             src={previewSrc}
//             controls={!isUploading}
//             muted={isUploading}
//             className="block max-h-[300px] w-full rounded-xl"
//           />
//           {isUploading && (
//             <div className="absolute inset-0 flex items-center justify-center bg-black/30">
//               <CircularProgress percent={uploadProgress || 0} />
//             </div>
//           )}
//         </div>
//         {fileName && <span className="mt-1 block truncate text-xs text-[#aaa]">{fileName}</span>}
//       </div>
//     );
//   }

//   if (type === 'audio') {
//     return (
//       <div className="mt-1">
//         {isUploading ? (
//           <div className="flex items-center gap-3 rounded-lg bg-white/5 px-3 py-2 text-[#e8e8e8]">
//             <CircularProgress percent={uploadProgress || 0} small />
//             <span className="truncate text-xs text-[#aaa]">{fileName}</span>
//           </div>
//         ) : (
//           <audio src={url} controls className="w-full max-w-[250px] rounded-lg" />
//         )}
//       </div>
//     );
//   }

//   // Generic file / document
//   return (
//     <div className="mt-1">
//       {isUploading ? (
//         <div className="flex items-center gap-3 rounded-lg bg-white/5 px-3 py-2 text-[#e8e8e8]">
//           <CircularProgress percent={uploadProgress || 0} small />
//           <span className="truncate text-xs text-[#aaa]">{fileName || 'File'}</span>
//         </div>
//       ) : (
//         <a
//           href={url}
//           target="_blank"
//           rel="noreferrer"
//           className="flex items-center gap-2 rounded-lg bg-black/20 px-3 py-2 text-sm text-inherit no-underline transition-colors hover:bg-black/30"
//         >
//           <span className="text-lg">📄</span>
//           <span className="truncate">{fileName || 'File'}</span>
//           {fileSize ? <span className="ml-auto shrink-0 text-[10px] opacity-70">{formatFileSize(fileSize)}</span> : null}
//         </a>
//       )}
//     </div>
//   );
// }

// export default function MessageItem({ m, me, onEdit, onDelete, onReply, onMarkRead }) {
//   const senderId = getId(m.sender);
//   const mine = senderId !== null && senderId === getId(me);
//   const isAI = m.isAI || m.sender === 'ai';

//   // Normalize file detection: some messages only carry a bare URL in
//   // `content` (e.g. a socket echo without full file metadata) — in that
//   // case we still want to render it as media, not as a raw URL string.
//   const inferredKind = !m.fileUrl && !m.uploading ? guessMediaKindFromUrl(m.content) : null;
//   const effectiveType = m.type || inferredKind;
//   const effectiveUrl = m.fileUrl || (inferredKind ? m.content : null);
//   const isFileMsg =
//     m.uploading ||
//     (!!effectiveUrl && (effectiveType === 'image' || effectiveType === 'video' || effectiveType === 'file' || effectiveType === 'audio'));

//   // Mark as read once rendered (fire and forget) - mirrors original behaviour
//   useEffect(() => {
//     if (!mine && !isAI && m._id) {
//       const alreadyRead = m.readBy?.includes(getId(me));
//       if (!alreadyRead) {
//         onMarkRead(m._id);
//       }
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [m._id, m.readBy]);

//   const bubbleClasses = isAI
//     ? 'bg-[#0EA5A3]/15 border border-[#0EA5A3]/20 text-[#e8e8e8]'
//     : mine
//       ? 'bg-gradient-to-br from-[#7C6FF0] to-[#6355D6] text-white'
//       : 'bg-[#1c1c24] border border-white/[0.04] text-[#e8e8e8]';

//   return (
//     <div className={`flex max-w-[85%] flex-col sm:max-w-[75%] ${mine ? 'ml-auto items-end' : 'items-start'}`}>
//       {!mine && !isAI && <div className="mb-0.5 ml-2 text-[11px] text-[#999]">{m.sender?.username || 'User'}</div>}
//       {isAI && <div className="mb-0.5 ml-2 text-[11px] text-[#999]">🤖 Nova AI</div>}

//       <div className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm [word-wrap:break-word] [overflow-wrap:anywhere] ${bubbleClasses} ${mine ? 'rounded-br-sm' : 'rounded-bl-sm'}`}>
//         {m.replyTo && m.replyTo.content && (
//           <div className="mb-1 border-l-2 border-current pl-2 text-xs opacity-70">{truncate(m.replyTo.content, 60)}</div>
//         )}

//         {m.isDeleted ? (
//           <span className="italic opacity-60">This message was deleted</span>
//         ) : isFileMsg ? (
//           <FileContent
//             type={effectiveType}
//             url={effectiveUrl}
//             fileName={m.fileName}
//             fileSize={m.fileSize}
//             uploading={m.uploading}
//             uploadProgress={m.uploadProgress}
//             localPreviewUrl={m.localPreviewUrl}
//           />
//         ) : (
//           <div className="prose-chat">
//             <ReactMarkdown
//               remarkPlugins={[remarkGfm]}
//               components={{
//                 a: ({ node, ...props }) => (
//                   <a
//                     {...props}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="underline decoration-current/40 underline-offset-2 hover:decoration-current"
//                   />
//                 ),
//                 code({ inline, children, ...props }) {
//                   if (inline) {
//                     return (
//                       <code {...props} className="rounded bg-black/20 px-1.5 py-0.5 text-[0.9em]">
//                         {children}
//                       </code>
//                     );
//                   }
//                   return (
//                     <pre className="mt-1 overflow-x-auto rounded-lg bg-black/25 p-2.5">
//                       <code {...props} className="bg-transparent p-0">
//                         {children}
//                       </code>
//                     </pre>
//                   );
//                 },
//               }}
//             >
//               {m.content || ''}
//             </ReactMarkdown>
//           </div>
//         )}
//       </div>

//       <div className={`mt-0.5 flex flex-wrap items-center gap-1.5 text-[10px] ${mine ? 'text-white/50' : 'text-[#888]'}`}>
//         {m.uploading ? (
//           <span>Sending…</span>
//         ) : (
//           <>
//             <span>{formatTime(m.createdAt || m.timestamp)}</span>
//             {m.isEdited && <span>(edited)</span>}
//             {mine && m.readBy && m.readBy.length > 1 && <span>✓ Seen</span>}
//           </>
//         )}
//       </div>

//       {mine && !m.isDeleted && !isAI && !m.uploading && (
//         <div className="mt-0.5 flex gap-2 text-[11px] text-[#999]">
//           {!m.fileUrl && (
//             <span onClick={() => onEdit(m)} className="cursor-pointer transition-colors hover:text-white">
//               Edit
//             </span>
//           )}
//           <span onClick={() => onDelete(m)} className="cursor-pointer transition-colors hover:text-white">
//             Delete
//           </span>
//           <span onClick={() => onReply(m)} className="cursor-pointer transition-colors hover:text-white">
//             Reply
//           </span>
//         </div>
//       )}
//       {!mine && !isAI && !m.uploading && (
//         <div className="mt-0.5 flex gap-2 text-[11px] text-[#999]">
//           <span onClick={() => onReply(m)} className="cursor-pointer transition-colors hover:text-white">
//             Reply
//           </span>
//         </div>
//       )}
//     </div>
//   );
// }


import React, { useEffect } from 'react';
import { formatTime, formatFileSize, truncate, getId, guessMediaKindFromUrl } from '../helpers.js';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/* Circular upload progress ring */
function CircularProgress({ percent = 0, small = false }) {
  const size = small ? 34 : 52;
  const radius = small ? 13 : 22;
  const strokeWidth = small ? 3 : 4;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, Math.max(0, percent)) / 100) * circumference;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={center} cy={center} r={radius} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth={strokeWidth} />
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
        className="transition-[stroke-dashoffset] duration-150 ease-linear"
      />
      {!small && (
        <text x={center} y={center + 4} textAnchor="middle" fontSize="11" fontWeight="600" fill="#fff">
          {percent}%
        </text>
      )}
    </svg>
  );
}

function FileContent({ type, url, fileName, fileSize, uploading, uploadProgress, localPreviewUrl }) {
  const isUploading = !!uploading;
  const previewSrc = isUploading ? localPreviewUrl : url;

  if (type === 'image') {
    return (
      <div className="mt-1 max-w-[280px]">
        <div className="relative overflow-hidden rounded-xl leading-none">
          <img
            src={previewSrc}
            alt={fileName || 'Image'}
            onClick={() => !isUploading && window.open(url, '_blank')}
            className={`block max-h-[300px] w-full rounded-xl object-contain ${
              isUploading ? 'cursor-default brightness-[0.55]' : 'cursor-pointer'
            }`}
          />
          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <CircularProgress percent={uploadProgress || 0} />
            </div>
          )}
        </div>
        {fileName && <span className="mt-1 block truncate text-xs text-[#aaa]">{fileName}</span>}
      </div>
    );
  }

  if (type === 'video') {
    return (
      <div className="mt-1 max-w-[280px]">
        <div className="relative overflow-hidden rounded-xl leading-none">
          <video
            src={previewSrc}
            controls={!isUploading}
            muted={isUploading}
            className="block max-h-[300px] w-full rounded-xl"
          />
          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <CircularProgress percent={uploadProgress || 0} />
            </div>
          )}
        </div>
        {fileName && <span className="mt-1 block truncate text-xs text-[#aaa]">{fileName}</span>}
      </div>
    );
  }

  if (type === 'audio') {
    return (
      <div className="mt-1">
        {isUploading ? (
          <div className="flex items-center gap-3 rounded-lg bg-white/5 px-3 py-2 text-[#e8e8e8]">
            <CircularProgress percent={uploadProgress || 0} small />
            <span className="truncate text-xs text-[#aaa]">{fileName}</span>
          </div>
        ) : (
          <audio src={url} controls className="w-full max-w-[250px] rounded-lg" />
        )}
      </div>
    );
  }

  // Generic file / document
  return (
    <div className="mt-1">
      {isUploading ? (
        <div className="flex items-center gap-3 rounded-lg bg-white/5 px-3 py-2 text-[#e8e8e8]">
          <CircularProgress percent={uploadProgress || 0} small />
          <span className="truncate text-xs text-[#aaa]">{fileName || 'File'}</span>
        </div>
      ) : (
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 rounded-lg bg-black/20 px-3 py-2 text-sm text-inherit no-underline transition-colors hover:bg-black/30"
        >
          <span className="text-lg">📄</span>
          <span className="truncate">{fileName || 'File'}</span>
          {fileSize ? <span className="ml-auto shrink-0 text-[10px] opacity-70">{formatFileSize(fileSize)}</span> : null}
        </a>
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

  const bubbleClasses = isAI
    ? 'bg-[#0EA5A3]/15 border border-[#0EA5A3]/20 text-[#e8e8e8]'
    : mine
      ? 'bg-gradient-to-br from-[#7C6FF0] to-[#6355D6] text-white'
      : 'bg-[#1c1c24] border border-white/[0.04] text-[#e8e8e8]';

  const isMineAligned = mine && !isAI;

  return (
    <div className={`flex max-w-[85%] flex-col sm:max-w-[75%] ${isMineAligned ? 'ml-auto items-end' : 'items-start'}`}>
      {!mine && !isAI && <div className="mb-0.5 ml-2 text-[11px] text-[#999]">{m.sender?.username || 'User'}</div>}
      {isAI && <div className="mb-0.5 ml-2 text-[11px] text-[#999]">🤖 Nova AI</div>}

      <div className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm [word-wrap:break-word] [overflow-wrap:anywhere] ${bubbleClasses} ${mine ? 'rounded-br-sm' : 'rounded-bl-sm'}`}>
        {m.replyTo && m.replyTo.content && (
          <div className="mb-1 border-l-2 border-current pl-2 text-xs opacity-70">{truncate(m.replyTo.content, 60)}</div>
        )}

        {m.isDeleted ? (
          <span className="italic opacity-60">This message was deleted</span>
        ) : isFileMsg ? (
          <FileContent
            type={effectiveType}
            url={effectiveUrl}
            fileName={m.fileName}
            fileSize={m.fileSize}
            uploading={m.uploading}
            uploadProgress={m.uploadProgress}
            localPreviewUrl={m.localPreviewUrl}
          />
        ) : (
          <div className="prose-chat">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                a: ({ node, ...props }) => (
                  <a
                    {...props}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-current/40 underline-offset-2 hover:decoration-current"
                  />
                ),
                code({ inline, children, ...props }) {
                  if (inline) {
                    return (
                      <code {...props} className="rounded bg-black/20 px-1.5 py-0.5 text-[0.9em]">
                        {children}
                      </code>
                    );
                  }
                  return (
                    <pre className="mt-1 overflow-x-auto rounded-lg bg-black/25 p-2.5">
                      <code {...props} className="bg-transparent p-0">
                        {children}
                      </code>
                    </pre>
                  );
                },
              }}
            >
              {m.content || ''}
            </ReactMarkdown>
          </div>
        )}
      </div>

      <div className={`mt-0.5 flex flex-wrap items-center gap-1.5 text-[10px] ${mine ? 'text-white/50' : 'text-[#888]'}`}>
        {m.uploading ? (
          <span>Sending…</span>
        ) : (
          <>
            <span>{formatTime(m.createdAt || m.timestamp)}</span>
            {m.isEdited && <span>(edited)</span>}
            {mine && m.readBy && m.readBy.length > 1 && <span>✓ Seen</span>}
          </>
        )}
      </div>

      {mine && !m.isDeleted && !isAI && !m.uploading && (
        <div className="mt-0.5 flex gap-2 text-[11px] text-[#999]">
          {!m.fileUrl && (
            <span onClick={() => onEdit(m)} className="cursor-pointer transition-colors hover:text-white">
              Edit
            </span>
          )}
          <span onClick={() => onDelete(m)} className="cursor-pointer transition-colors hover:text-white">
            Delete
          </span>
          <span onClick={() => onReply(m)} className="cursor-pointer transition-colors hover:text-white">
            Reply
          </span>
        </div>
      )}
      {!mine && !isAI && !m.uploading && (
        <div className="mt-0.5 flex gap-2 text-[11px] text-[#999]">
          <span onClick={() => onReply(m)} className="cursor-pointer transition-colors hover:text-white">
            Reply
          </span>
        </div>
      )}
    </div>
  );
}
