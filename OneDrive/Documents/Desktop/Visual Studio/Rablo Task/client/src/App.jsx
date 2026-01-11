import React from 'react'
import Applayout from './applayout/Applayout'
import { BrowserRouter } from 'react-router'
export default function App() {
  return (
    <div className='app-container'>
    <BrowserRouter>
    <Applayout/>
    </BrowserRouter>
    </div>
  )
}