import React, { useState } from 'react'

const Login = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  let passwordHash;

  async function login() {
    //tanstack query to login

    //set userstore
  }

  function hashPassword() {
    //hash with bcrypt

  }

  return (
    <div className="flex h-screen">
        <form className="py-8 bg-blue-200 rounded-2xl w-96 grid justify-center m-auto border-4 border-blue-300">
            <div className="text-6xl mb-4 text-center">🚀</div>
            <div className="text-6xl mb-8 text-center font-bold">RocketTime</div>
            <div className="text-2xl mb-4 text-center font-semibold">Login</div>
            <div className="flex flex-col">
                <input className="h-10 p-2 my-2 rounded-lg" type="email" placeholder="Email" />
                <input className="h-10 p-2 my-2 rounded-lg" type="password" placeholder="Password" />
            </div>
            <div className="flex flex-row gap-2 mt-4 justify-center text-center">
                <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 w-36 border-blue-700 hover:border-blue-500 rounded">Login</button>
                <button className="bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 border-b-4 w-36 border-green-700 hover:border-green-500 rounded">Register</button>
            </div>
        </form>
    </div>
  )
}

export default Login