import React, { useState } from 'react'
import { Image, Sparkles, Hash } from 'lucide-react'
import Markdown from 'react-markdown'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuth } from '@clerk/clerk-react'
 axios.defaults.baseURL = import.meta.env.VITE_BASE_URL
const GenerateImages = () => {
  const ImageStyle = [
    'Realistic',
    'Anime Style',
    'Cartoon Style',
    'Fantasy Style',
    '3D Style',
    'Portrait Style',
  ]

  const [selectedStyle, setSelectedStyle] = useState('Realistic')
  const [input, setInput] = useState('')
  const [publish, setPublish] = useState(false)
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')
  const { getToken } = useAuth()

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    try{
  setLoading(true)
  const prompt = `Generate an image of  ${input} in the style${selectedStyle}`
       const { data } = await axios.post(
        '/api/ai/generate-image',
        { prompt,publish, length: selectedStyle.length },
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        }
      )
      
      if (data.success) {
        setContent(data.content)
      } else {
        toast.error(data.message)
      }
    }catch(error){
       toast.error(error.message)
    }
    setLoading(false)
  }

  return (
    <div className='h-full p-6 flex flex-col md:flex-row gap-4 text-slate-700'>

      {/* ✅ LEFT COLUMN */}
      <form
        onSubmit={onSubmitHandler}
        className='w-full md:w-1/2 p-4 bg-white rounded-lg border border-gray-200'
      >
        <div className='flex items-center gap-3'>
          <Sparkles className='w-6 text-[#00AD25]' />
          <h3 className='text-xl font-semibold'>AI Image Generator</h3>
        </div>

        <p className='mt-6 text-sm font-medium'>Describe Your Image</p>

        <textarea
          onChange={(e) => setInput(e.target.value)}
          value={input}
          rows={4}
          className='w-full p-2 mt-2 px-3 outline-none text-sm rounded-md border border-gray-800'
          placeholder='Describe what you want to see in the image ....'
          required
        />

        <p className='mt-4 text-sm font-medium'>Style</p>

        <div className='mt-3 flex gap-3 flex-wrap'>
          {ImageStyle.map((item) => (
            <span
              key={item}
              onClick={() => setSelectedStyle(item)}
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${
                selectedStyle === item
                  ? 'bg-purple-50 text-purple-700'
                  : 'text-gray-500 border-gray-300'
              }`}
            >
              {item}
            </span>
          ))}
        </div>

        {/* ✅ FIXED CHECKBOX */}
        <div className='my-6 flex items-center gap-2'>
          <label className='relative cursor-pointer'>
            <input
              type='checkbox'
              checked={publish}
              onChange={(e) => setPublish(e.target.checked)}
              className='sr-only peer'
            />
            <div className='w-9 h-5 bg-slate-300 rounded-full peer-checked:bg-green-500 transition'></div>
            <span className='absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition peer-checked:translate-x-4'></span>
          </label>
          <p className='text-sm'>Make this Image Public</p>
        </div>

        <button  disabled ={loading} className='w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#00AD25] to-[#8E37EB]
         text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer'>
          {
            loading ? <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span> : <Image className='w-5' />
          }
         
          Generate Image
        </button>
      </form>

      {/* ✅ RIGHT COLUMN */}
      <div
        className='w-full md:w-1/2 p-4 bg-white rounded-lg flex flex-col border border-gray-200 
        min-h-[24rem] max-h-[600px] overflow-y-auto'
      >
        <div className='flex items-center gap-3'>
          <Image className='w-5 h-5 text-[#8E37EB]' />
          <h3 className='text-xl font-semibold'>Generated Images</h3>
        </div>
        {
          !content ?(<div className='flex-1 flex justify-center items-center'>
          <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
            <Image className='w-9 h-9' />
            <p>Enter a prompt and click "Generate Image" to Get Started</p>
          </div>
        </div>) :(
          <div className='mt-3 h-full'>
            <img src={content} alt='image' className='w-full h-full'/>
          </div>
        )
        }

      </div>

    </div>
  )
}

export default GenerateImages
