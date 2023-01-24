import React, { Dispatch, SetStateAction, useState } from 'react';

type RegisterProps = {
  setPage: Dispatch<SetStateAction<string>>;
}

const Register = (p: RegisterProps) => {
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  let passwordHash;
  
  function register() {
    //tanstack query to register

    //then back to login
    p.setPage("login");
  }

  function hashPassword() {
    //hash with bcrypt
  }

  return (
    <div className="flex h-screen">
        <form className="py-8 bg-blue-200 rounded-2xl w-96 grid justify-center m-auto border-4 border-blue-300">
            <div className="text-6xl mb-4 text-center">🚀</div>
            <div className="text-6xl mb-8 text-center font-bold">RocketTime</div>
            <div className="text-2xl mb-4 text-center font-semibold">Create Account</div>
            <div className="flex flex-col">
                <input className="h-10 p-2 my-2 rounded-lg" type="text" placeholder="First Name" />
                <input className="h-10 p-2 my-2 rounded-lg" type="text" placeholder="Last Name" />
                <input className="h-10 p-2 my-2 rounded-lg" type="email" placeholder="Email" />
                <input className="h-10 p-2 my-2 rounded-lg" type="password" placeholder="Password" />
                <input className="h-10 p-2 my-2 rounded-lg" type="password" placeholder="Confirm Password" />
            </div>
            <div className="flex flex-row gap-2 mt-4 justify-center text-center">
                <button className="bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 border-b-4 w-36 border-green-700 hover:border-green-500 rounded" onClick={register}>Register</button>
            </div>
        </form>
    </div>
  )
}

export default Register