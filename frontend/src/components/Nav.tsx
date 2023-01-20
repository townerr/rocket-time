import React from 'react';
import Link from 'next/link';
import { Dropdown } from 'flowbite-react';
import { UserStore } from '@/stores/UserStore';

const Nav = () => {
    const { firstName, lastName } = UserStore();

    return (
        <nav className="bg-blue-500 border-gray-200 px-2 sm:px-4 py-2.5">
            <div className="container flex flex-wrap items-center justify-between mx-auto">
                <Link href="/" className="flex items-center">
                    <span className="text-3xl">🚀</span>
                    <span className="self-center text-xl font-semibold whitespace-nowrap text-white pl-2">RocketTime</span>
                </Link>
                <div className="flex md:order-2 gap-2">
                    <div className=''>
                        <Dropdown label={firstName + " " + lastName} dismissOnClick={false}>
                            <Dropdown.Item>Profile</Dropdown.Item>
                            <Dropdown.Item>Admin Dashboard</Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item>Sign out</Dropdown.Item>
                        </Dropdown>
                    </div>
                    <button data-collapse-toggle="navbar-default" type="button" className="inline-flex items-center p-2 text-sm text-white rounded-lg md:hidden hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-gray-200" aria-controls="navbar-cta" aria-expanded="false">
                        <span className="sr-only">Open main menu</span>
                        <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
                    </button>
                </div>
                <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-default">
                    <ul className="flex flex-col mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-blue-700">
                        <li className="hover:bg-blue-800 p-4 rounded-lg">
                            <button className="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:p-0" aria-current="page">Timesheets</button>
                        </li>
                        <li className="hover:bg-blue-800 p-4 rounded-lg">
                            <button className="block py-2 pl-3 pr-4 text-white rounded hover:bg-gray-100 md:hover:bg-transparent md:p-0">Calendar</button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
  )
}

export default Nav