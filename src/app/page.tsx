"use client";
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

const adminLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

    if(email === "muhammadumar128512@gmail.com" && password === "98765") {
        localStorage.setItem("isLoginIn", "true");
        router.push("/dashboard")
    } else {
        alert("Invalid email or password")
    }
  };
  return (

    <div className='flex justify-center items-center h-screen bg-gradient-to-r from-gray-100 to-gray-300'>
    <form onSubmit={handleLogin} className='bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm'>
        <h2 className='text-2xl font-bold text-gray-800 mb-6 text-center'>Admin Login</h2>
        
        <input 
            type='email'
            placeholder='Email'
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className='w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500'
        />
        
        <input
            type='password'
            placeholder='Password'
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className='w-full p-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500'
        />
        
        <button
            type='submit'
            className='w-full bg-red-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-red-700 transition duration-300'
        >
            Login
        </button>
    </form>
</div>
  )
}

export default adminLogin