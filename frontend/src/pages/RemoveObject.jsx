import { Scissors, Sparkles } from 'lucide-react'
import React, { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuth } from '@clerk/clerk-react'
import Markdown from 'react-markdown'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

const RemoveObject = () => {
  const [input, setInput] = useState(null)
  const [object, setObject] = useState('')
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')
  const { getToken } = useAuth()

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    setInput(file)
    setPreview(URL.createObjectURL(file))
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault()

    if (!input) return toast.error("Please upload an image")

    if (object.trim().split(" ").length > 1) {
      return toast.error("Enter only ONE object name (e.g., watch)")
    }

    try {
      setLoading(true)

      const formData = new FormData()
      formData.append("image", input)
      formData.append("object", object)

      const token = await getToken()

      const { data } = await axios.post('/api/ai/remove-image-object', formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })

      if (data.success) {
        setContent(data.content)
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
          <Sparkles className='w-6 text-[#4A7AFF]' />
          <h3 className='text-xl font-semibold'>Object Removal</h3>
        </div>

        <p className='mt-6 text-sm font-medium'>Upload Image</p>

        <input
          type='file'
          accept='image/*'
          onChange={handleFileChange}
          className='w-full p-2 mt-2 px-3 outline-none text-sm rounded-md border border-gray-800 text-gray-600'
          required
        />

        <p className='mt-6 text-sm font-medium'>Object to Remove</p>

        <textarea
          onChange={(e) => setObject(e.target.value)}
          value={object}
          rows={3}
          className='w-full p-2 mt-2 px-3 outline-none text-sm rounded-md border border-gray-800'
          placeholder='e.g., watch'
          required
        />

        <button 
          disabled={loading}
          type="submit"
          className='w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#417DF6] to-[#8E37EB]
           text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer'
        >
          {loading ? (
            <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span>
          ) : (
            <Scissors className='w-5' />
          )}
          Remove Object
        </button>
      </form>

      {/* RIGHT PANEL */}
      <div className='w-full md:w-1/2 p-4 bg-white rounded-lg border border-gray-200 max-h-[600px] overflow-y-auto'>
        <div className='flex items-center gap-3'>
          <Scissors className='w-5 h-5 text-[#4A7AFF]' />
          <h3 className='text-xl font-semibold'>Processed Image</h3>
        </div>

        {!content ? (
          <div className='mt-6 flex justify-center'>
            {preview ? (
              <img src={preview} alt="Preview" className="max-h-[500px] rounded-md object-contain" />
            ) : (
              <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
                <Scissors className='w-9 h-9' />
                <p>Upload an image to preview</p>
              </div>
            )}
          </div>
        ) : (
          <img src={content} alt="Processed" className="mt-4 max-h-[500px] rounded-md object-contain" />
        )}
      </div>

    </div>
  )
}

export default RemoveObject
