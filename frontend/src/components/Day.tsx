import React, {Dispatch, SetStateAction, useEffect} from 'react'

type DateProp = {
    date: Date;
    id: number;
    startArr: string[];
    endArr: string[];
    deductionsArr: string[];
    setStartArr: Dispatch<SetStateAction<Array<string>>>;
    setEndArr: Dispatch<SetStateAction<Array<string>>>;
    setDeductionsArr: Dispatch<SetStateAction<Array<string>>>;
}

const Day = (day: DateProp) => {

  function updateStartArray(e: React.ChangeEvent<HTMLInputElement>) {
    const newStart = [...day.startArr];
    newStart[day.id] = e.target.value;
    day.setStartArr(newStart);
  }

  function updateEndArray(e: React.ChangeEvent<HTMLInputElement>) {
    const newEnd = [...day.endArr];
    newEnd[day.id] = e.target.value;
    day.setStartArr(newEnd);
  }

  function updateDedArray(e: React.ChangeEvent<HTMLInputElement>) {
    const newDed = [...day.deductionsArr];
    newDed[day.id] = e.target.value;
    day.setStartArr(newDed);
  }

  return (
    <div className='flex flex-col bg-gray-300 w-48 p-4 rounded-lg'>
        <h4 className='text-center font-semibold'>{day.date.toDateString()}</h4>

        <div className='mt-2'>Start Time:</div>
        <input type="time" onChange={updateStartArray}/>

        <div className='mt-2'>End Time:</div>
        <input type="time" onChange={updateEndArray}/>

        <div className='mt-2'>Break Deduction:</div>
        <input type="time" onChange={updateDedArray}/>
    </div>
  )
}

export default Day