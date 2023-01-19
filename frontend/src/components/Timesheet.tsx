import React from 'react';
import Day from '../components/Day';

const Timesheet = () => {
    let weekNumber = getCurrentWeekNumber();
    let year = new Date().getFullYear();
    let week: Date[] = getFirstDayOfWeel(weekNumber, year);

    function getCurrentWeekNumber() {
        let currentDate = new Date();
        let startDate = new Date(currentDate.getFullYear(), 0, 1);
        let days = Math.floor((currentDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000));

        return Math.ceil(days / 7);
    }

    function getFirstDayOfWeel(week: number, year: number) {
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
        <div className='flex flex-wrap gap-2 justify-center mt-24'>
            {week.map(day => {
                return(<Day key={week.indexOf(day)} date={day} />)
            })}
        </div>
    )
}

export default Timesheet