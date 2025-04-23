import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Body from './components/Body'
import Dashboard from './components/Dashboard'
import About from './components/About'

function App() {
  

  return (
    <div className='bg-white'>
    
    <BrowserRouter basename='/'>
    <Routes>
      <Route path='/' element={<Body/>} >
          <Route path='/' element={<Dashboard/>}/>
          <Route path='/about' element={<About/>}/>
      </Route>
    </Routes>
    </BrowserRouter>
      
    </div>
  )
}

export default App
