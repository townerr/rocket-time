import React from 'react'

type DateProp = {
    date: Date;
}

const Day = (day: DateProp) => {
  return (
    <div className='flex flex-col bg-gray-300 w-48 p-4 rounded-lg'>
        <h4 className='text-center font-semibold'>{day.date.toDateString()}</h4>

        <div>Start Time:</div>
        <input type="time" />

        <div>End Time:</div>
        <input type="time" />
    </div>
  )
}

export default Day