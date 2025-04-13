import React from 'react'

const Header = () => {
  return (
    <div className="navbar bg-black shadow-sm">
        <div className="flex-1">
            <a className="btn btn-ghost text-xl text-white">Travel Buddy</a>
        </div>
        <div className="flex-none">
            <ul className="menu menu-horizontal px-1">
            <li className='text-white'><a>Home</a></li>
            <li className='text-white'><a>About</a></li>
            
            </ul>
        </div>
    </div>
  )
}

export default Header