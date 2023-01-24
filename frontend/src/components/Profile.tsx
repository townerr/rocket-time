import React from 'react';
import TimesheetReport from './TimesheetReport';
import { UserStore } from '@/stores/UserStore';

const Profile = () => {
    const { firstName, lastName, email, userId } = UserStore();
    return (
        <div className='mt-16 md:w-1/2 m-auto'>
            <h3 className='font-semibold text-2xl text-center'>{firstName + " " + lastName}&apos;s Profile</h3>
            <div className='grid grid-cols-2 mt-12 m-auto justify-items-center gap-8'>
                <div>
                    <div className='py-2'>Employee Id:</div>
                    <input className='disabled:bg-gray-200' value={userId} disabled={true} readOnly={true} type="text" />
                </div>
                <div>
                    <div className='py-2'>Email:</div>
                    <input className='disabled:bg-gray-200' value={email} disabled={true} type="text" />
                </div>
                <div>
                    <div className='py-2'>First Name:</div>
                    <input className='disabled:bg-gray-200' value={firstName} disabled={true} readOnly={true} type="text" />
                </div>
                <div>
                    <div className='py-2'>Last Name:</div>
                    <input className='disabled:bg-gray-200' value={lastName} disabled={true} readOnly={true} type="text" />
                </div>
            </div>
            <h3 className='mt-24 font-semibold text-2xl text-center'>Previous Timesheets</h3>
            <TimesheetReport id={userId} />
        </div>
    )
}

export default Profile