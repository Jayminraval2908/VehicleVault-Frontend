import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';

export const GetApiDemo = () => {
    const [users, setusers] = useState([]);

    const getUsers = async () => {
        const res = await axios.get("https://node5.onrender.com/user/user/");
        console.log(res)
        console.log(res.data.data)
        setusers(res.data.data)
    }

    const deleteUser = async (id) => {
        const res = await axios.delete(`https://node5.onrender.com/user/user/${id}`);
        console.log(res);

        if (res.status==204) {
            toast.success("User Deleted Successfully....");
            getUsers();
        }

    }

    useEffect(() => {
        getUsers()
    }, []);
    return (
        <div className="p-6 bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100 min-h-screen">
            <h1 className="text-3xl font-bold text-center text-purple-700 mb-6">
                GET API DEMO
            </h1>

            <div className="overflow-x-auto">
                <table className="min-w-full rounded-xl overflow-hidden shadow-xl">

                    {/* Header */}
                    <thead>
                        <tr className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white text-left">
                            <th className="px-6 py-4">ID</th>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Email</th>
                            <th className="px-6 py-4">Action</th>
                            {/* <th className="px-6 py-4">Action</th> */}
                        </tr>
                    </thead>

                    {/* Body */}
                    <tbody className="text-gray-700 font-medium">
                        {users.map((user, index) => (
                            <tr
                                key={user._id}
                                className={`transition duration-300 hover:scale-[1.01] hover:bg-purple-100
                                           ${index % 2 === 0 ? "bg-white" : "bg-pink-50"}`}
                            >
                                <td className="px-6 py-4 break-all">{user._id}</td>
                                <td className="px-6 py-4">{user.name}</td>
                                <td className="px-6 py-4 text-blue-600">{user.email}</td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => deleteUser(user._id)}
                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>
        </div>
    )
}
