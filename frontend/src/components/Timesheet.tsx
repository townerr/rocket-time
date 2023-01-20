import React, {useEffect, useState} from 'react';
import Day from '../components/Day';

const Timesheet = () => {
    //States for storing timesheet times
    const [startArr, setStartArr] = useState<string[]>([]);
    const [endArr, setEndArr] = useState<string[]>([]);
    const [deductionsArr, setDeductionsArr] = useState<string[]>([]);

    let totalHours = 45;
    let totalDeductions = 5;
    let overall = totalHours - totalDeductions;

    //vars for calculating week and dates of week
    let weekNumber = getCurrentWeekNumber();
    let year = new Date().getFullYear();
    let week: Date[] = getFirstDayOfWeek(weekNumber, year);

    function getCurrentWeekNumber() {
        let currentDate = new Date();
        let startDate = new Date(currentDate.getFullYear(), 0, 1);
        let days = Math.floor((currentDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000));

        return Math.ceil(days / 7);
    }

    function getFirstDayOfWeek(week: number, year: number) {
        let d = new Date(year, 0);
        let days: Date[] = [];
        let dayNum = d.getDay();
        let requiredDate = --week * 7;

        if (dayNum != 0 || dayNum > 4) {
            requiredDate += 7;
        }

        d.setDate(1 - d.getDay() + ++requiredDate);

        for(let i = 0; i < 7; i++) {
            let temp = new Date(d.getFullYear(), d.getMonth(), d.getDate() + i);
            days.push(temp);
        }

        return days;
    }

    return (
        <div className='flex flex-col'>
            <div className='flex flex-wrap gap-2 justify-center mt-24'>
                {week.map(day => {
                    return(<Day key={week.indexOf(day)} id={week.indexOf(day)} date={day} setStartArr={setStartArr} setEndArr={setEndArr} setDeductionsArr={setDeductionsArr} startArr={startArr} endArr={endArr} deductionsArr={deductionsArr}/>)
                })}
            </div>
            <div className='flex flex-col text-start m-auto mt-4 mb-12 bg-gray-300 w-48 p-4 rounded-lg'>
                <div className='font-semibold grid grid-cols-3 gap-2'>
                    <div className='col-span-2'>Hours:</div>
                    <div className='text-right'>{totalHours}</div>
                    <div className='col-span-2'>Deductions:</div>
                    <div className='text-right'>{totalDeductions}</div>
                    <div className='col-span-3 py-1'>
                        <hr className='border-[1.5px] border-gray-500' />
                    </div>
                    <div className='col-span-2'>Overall Hours:</div>
                    <div className='text-right'>{overall}</div>
                </div>
                <div className='text-center'>
                    <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 mt-8 w-36 border-blue-700 hover:border-blue-500 rounded-lg">Submit</button>
                </div>
            </div>
        </div>
    )
}

export default Timesheet