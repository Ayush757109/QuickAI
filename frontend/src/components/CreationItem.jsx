import React, { useState } from 'react'
import Markdown from "react-markdown"

const CreationItem = ({ item }) => {
  const [expanded, setExpanded] = useState(false)

  const blogTitle = item.prompt
    ? item.prompt.replace(/^write\s+/i, '').slice(0, 70)
    : "Untitled Blog"

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      className='p-4 max-w-5xl text-sm bg-white border border-gray-200 rounded-lg cursor-pointer hover:shadow-md transition'
    >
      <div className='flex justify-between items-start gap-4'>
        <div>
          {/*  Blog Title (Generated from Prompt) */}
          <h2 className='text-lg font-semibold text-gray-800'>
            {blogTitle}
          </h2>

          {/* Article Prompt (Original Prompt) */}
          <p className='text-gray-600 mt-1 line-clamp-2'>
            {item.prompt}
          </p>

          {/*  Meta Info */}
          <p className='text-gray-500 mt-2 text-xs'>
            {item.type} • {new Date(item.created_at).toLocaleDateString()}
          </p>
        </div>

        <button className='bg-[#EFF6FF] border border-[#BFDBFE] text-[#1E40AF] px-4 py-1 rounded-full text-xs font-medium'>
          {item.type}
        </button>
      </div>

      {expanded && (
        <div>
          {item.type === 'image' ? (
            <img
              src={item.content}
              alt=''
              className='mt-3 w-full max-w-md rounded'
            />
          ) : (
            <div className='mt-3 max-h-96 overflow-y-auto text-sm text-slate-700'>
              <div className='reset-tw'>
                <Markdown>{item.content}</Markdown>
              </div>
              
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default CreationItem
