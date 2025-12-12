import { FileText, Sparkles } from 'lucide-react'
import React, { useState } from 'react'
import axios from "axios"
import toast from 'react-hot-toast'
import { useAuth } from '@clerk/clerk-react'
import Markdown from 'react-markdown'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

const ReviewResume = () => {
  const [input, setInput] = useState(null)
  const [fileName, setFileName] = useState('')
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')
  const { getToken } = useAuth()

  const onSubmitHandler = async (e) => {
    e.preventDefault()

    if (!input) {
      toast.error("Please upload a resume first")
      return
    }

    try {
      setLoading(true)
      const formData = new FormData()
      formData.append('resume', input)

      const token = await getToken()

      const { data } = await axios.post(
        '/api/ai/resume-review',
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (data.success) {
        setContent(data.image || data.content || '')
      } else {
        toast.error(data.message || 'Failed to review resume')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setLoading(false)
    }

    console.log("Resume File:", input)
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // PDF validation
    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed")
      return
    }

    setInput(file)
    setFileName(file.name)
  }

  return (
    <div className='h-full p-6 flex flex-col md:flex-row gap-4 text-slate-700'>
      {/* LEFT SIDE FORM */}
      <form
        onSubmit={onSubmitHandler}
        className='w-full md:w-1/2 p-4 bg-white rounded-lg border border-gray-200'
      >
        <div className='flex items-center gap-3'>
          <Sparkles className='w-6 text-[#00DA83]' />
          <h3 className='text-xl font-semibold'>Resume Review</h3>
        </div>

        <p className='mt-6 text-sm font-medium'>Upload Resume</p>

        <input
          onChange={handleFileChange}
          type='file'
          accept='application/pdf'
          className='w-full p-2 mt-2 px-3 outline-none text-sm rounded-md border border-gray-800 text-gray-600'
        />

        <p className='font-light mt-1 text-xs text-gray-500'>Supports PDF only.</p>

        {/* Show selected file name */}
        {fileName && (
          <p className='mt-2 text-xs text-green-600'>
            Selected: {fileName}
          </p>
        )}

        <button
          type="submit"
          className='w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#F6AB41] to-[#FF4938]
           text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer'
          disabled={loading}
        >
          {
            loading
              ? <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span>
              : <FileText className='w-5' />
          }
          Review Resume
        </button>
      </form>

      {/* RIGHT SIDE RESULT PANEL */}
      <div
        className='w-full md:w-1/2 p-4 bg-white rounded-lg flex flex-col border border-gray-200 max-h-[600px] overflow-y-auto'
      >
        <div className='flex items-center gap-3'>
          <FileText className='w-5 h-5 text-[#FF4938]' />
          <h3 className='text-xl font-semibold'>Analysis Results</h3>
        </div>

        {
          !content ? (
            <div className='flex-1 flex justify-center items-center'>
              <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
                <FileText className='w-9 h-9' />
                <p>Upload a Resume and Click "Review Resume" to Get Started</p>
              </div>
            </div>
          ) : (
            <div className='mt-3 h-full overflow-y-scroll text-sm text-slate-600'>
              <div className='reset-tw'>
                <Markdown>{content}</Markdown>
              </div>
            </div>
          )
        }
      </div>
    </div>
    
  )
}

export default ReviewResume
