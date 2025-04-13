import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Body from './components/Body'
import Dashboard from './components/Dashboard'

function App() {
  

  return (
    <>
    
    <BrowserRouter basename='/'>
    <Routes>
      <Route path='/' element={<Body/>} >
          <Route path='/' element={<Dashboard/>}/>
          <Route path='/about'/>
      </Route>
    </Routes>
    </BrowserRouter>
      
    </>
  )
}

export default App
