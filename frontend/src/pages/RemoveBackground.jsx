import { Eraser, Sparkles } from 'lucide-react'
import React, { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuth } from '@clerk/clerk-react'
import Markdown from 'react-markdown'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

const RemoveBackground = () => {
  const [input, setInput] = useState(null)
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')
  const { getToken } = useAuth()

  const onSubmitHandler = async (e) => {
    e.preventDefault()

    if (!input) return toast.error('Please upload an image')

    try {
      setLoading(true)

      const formData = new FormData()
      formData.append('image', input)

      const token = await getToken()

      const { data } = await axios.post(
        '/api/ai/remove-image-background',
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (data.success) {
        // backend may return { image: ... } or { content: ... }
        setContent(data.image || data.content)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    }

    setLoading(false)
  }

  return (
    <div className='h-full p-6 flex flex-col md:flex-row gap-4 text-slate-700'>
      
      <form
        onSubmit={onSubmitHandler}
        className='w-full md:w-1/2 p-4 bg-white rounded-lg border border-gray-200'
      >
        <div className='flex items-center gap-3'>
          <Sparkles className='w-6 text-[#FF4938]' />
          <h3 className='text-xl font-semibold'>Background Removal</h3>
        </div>

        <p className='mt-6 text-sm font-medium'>Upload Image</p>

        <input
          type='file'
          accept='image/*'
          onChange={(e) => setInput(e.target.files[0])}
          className='w-full p-2 mt-2 px-3 outline-none text-sm rounded-md border border-gray-800 text-gray-600'
          required
        />

        <p className='font-light mt-1 text-xs text-gray-500'>
          Supports JPG, PNG, and other image formats
        </p>

        <button
          disabled={loading}
          className='w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#F6AB41] to-[#FF4938]
          text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer'
        >
          {loading ? (
            <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span>
          ) : (
            <Eraser className='w-5' />
          )}
          Remove Background
        </button>
      </form>

      <div
        className='w-full md:w-1/2 p-4 bg-white rounded-lg flex flex-col border border-gray-200 
        max-h-[600px] overflow-y-auto'
      >
        <div className='flex items-center gap-3'>
          <Eraser className='w-5 h-5 text-[#FF4938]' />
          <h3 className='text-xl font-semibold'>Processed Image</h3>
        </div>

        {!content ? (
          <div className='flex-1 flex justify-center items-center'>
            <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
              <Eraser className='w-9 h-9' />
              <p>Upload an image and click "Remove Background" to begin</p>
            </div>
          </div>
        ) : (
          <img src={content} alt='Processed' className='mt-3 w-full h-full' />
        )}
      </div>
    </div>
  )
}

export default RemoveBackground
