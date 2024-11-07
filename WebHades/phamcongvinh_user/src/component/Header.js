import React from 'react'
import { Link } from 'react-router-dom'

function Header() {
  return (
    <header>
      <div className='container mx-auto'>
        <div className='flex flex-row justify-between items-center'>
          <Link
            to='/Home'>
            <div className='basis-6 md:basis-2/12'>
              <img className='transition-all w-full group-hover:scale-125 group-hover:duration-700 ease-in-out'
                src='https://theme.hstatic.net/1000306633/1001194548/14/logo_menu_no_scroll.png?v=225'
              />
            </div>
          </Link>
          <div className=' md:basis-7/12 hidden  md:block bg-gray-500'>MENU</div>
          <div className=' md:basis-3/12 bg-green-400'>CART</div>
        </div>
      </div>
    </header>
  )
}

export default Header
