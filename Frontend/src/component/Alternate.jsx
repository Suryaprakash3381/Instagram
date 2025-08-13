import React from 'react'

function Alternate() {
  return (
    
    <>
        <div className='bg-black text-white justify-between w-full h-full items-center border border-black'>
          
          
          <div className='flex flex-row flex-wrap items-center justify-between gap-3 mx-3 mt-3'>
                 <h1 className='text-lg sm:text-2xl font-semibold mb-6'><a href="#" className='hover:text-gray-400 transition'><i className="fa-regular fa-house"></i> </a></h1>
             <h1 className='text-lg sm:text-2xl font-semibold mb-6'><a href="/search-user" className='hover:text-gray-400 transition'><i className="fas fa-search"></i> </a></h1>
            <h1 className='text-lg sm:text-2xl font-semibold mb-6'><a href="#" className='hover:text-gray-400 transition'><i className="fa-regular fa-compass"></i> </a></h1>
            <h1 className='text-lg sm:text-2xl font-semibold mb-6'><a href="#" className='hover:text-gray-400 transition'><i className="fa-regular fa-comments"></i> </a></h1>
            <h1 className='text-lg sm:text-2xl font-semibold mb-6'><a href="#" className='hover:text-gray-400 transition'><i className="fa-regular fa-heart"></i> </a></h1>
            <h1 className='text-lg sm:text-2xl font-semibold mb-6'><a href="/profile" className='hover:text-gray-400 transition'><i className="fa-regular fa-user"></i> </a></h1>
            </div>
            


        </div>
      
    </>
  )
  
}

export default Alternate
