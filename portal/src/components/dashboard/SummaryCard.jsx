
import React from 'react'

function SummaryCard({icon,text,number,color,onClick,className}) {
  return (
    <div onClick={onClick} className={`rounded flex bg-white ${className}`}>
        <div className={` text-2xl flex justify-center items-center ${color} text-white px-4`}>
             {icon}
        </div>
        <div className='pl-4'>
            <p className='text-lg font-semibold'>{text}</p>
            <p className='text-lg font-bold'>{number}</p>
        </div>
    </div>
  )
}

export default SummaryCard;