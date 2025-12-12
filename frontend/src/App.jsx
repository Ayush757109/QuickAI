import { Route, Routes } from 'react-router-dom'
import './App.css'

import Home from './pages/Home'
import Layout from './pages/Layout'
import Dashboard from './pages/Dashboard'
import WriteArtical from './pages/WriteArtical'
import BlogTitles from './pages/BlogTitles'
import GenerateImages from './pages/GenerateImages'
import Removebackground from './pages/Removebackground'
import RemoveObject from './pages/RemoveObject'
import ReviewResume from './pages/ReviewResume'
import Community from './pages/Community'
import {Toaster} from "react-hot-toast"

import { useAuth } from '@clerk/clerk-react'
import { useEffect } from 'react'

function App() {
  

  return (
    <div>
      <Toaster/>
      <Routes>
        <Route path='/' element={<Home />} />

        <Route path='/ai' element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path='write-article' element={<WriteArtical />} />
          <Route path='blog-titles' element={<BlogTitles />} />
          <Route path='generate-images' element={<GenerateImages />} />
          <Route path='remove-background' element={<Removebackground />} />
          <Route path='remove-object' element={<RemoveObject />} />
          <Route path='review-resume' element={<ReviewResume />} />
          <Route path='community' element={<Community />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
