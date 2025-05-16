import React, { useState } from 'react';
import Navbar from '../../components/NavigationBar/Navbar';
import PasswordInput from '../../components/Input/PasswordInput';
import { Link, useNavigate } from 'react-router-dom';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';

const SignUp = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();

        if (!name) {
            setError("Please enter your name");
            return;
        }

        if (!validateEmail(email)) {
            setError("Please enter a valid email address");
            return;
        }

        if (!password) {
            setError("Please enter the password");
            return;
        }

        setError('');

        try {
            const response = await axiosInstance.post("/create-account", {
                fullName: name,
                email: email,
                password: password,
            });

            if (response.data?.error) {
                setError(response.data.message);
                return;
            }

            if (response.data?.accessToken) {
                localStorage.setItem("token", response.data.accessToken);
                navigate('/dashboard');
            }
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "An unexpected error occurred. Please try again."
            );
        }
    };

    return (
        <>
            <Navbar />

            <div className="flex items-center justify-center mt-16 sm:mt-28 px-4 animate-fade-in">
                <div className="w-full max-w-sm sm:max-w-md rounded-lg bg-white px-6 sm:px-7 py-10 shadow-xl border-2 border-transparent bg-gradient-to-tr from-purple-50 via-white to-indigo-50">
                    <form onSubmit={handleSignUp}>
                        <h4 className="text-2xl sm:text-3xl font-semibold text-center mb-7 text-indigo-700">Sign Up</h4>

                        <input
                            type="text"
                            placeholder="Name"
                            className="w-full mb-4 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                        <input
                            type="text"
                            placeholder="Email"
                            className="w-full mb-4 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <PasswordInput
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        {error && <p className="text-red-500 text-xs pb-1">{error}</p>}

                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 rounded-md mt-4 hover:scale-[1.02] transition-all duration-200 hover:shadow-lg"
                        >
                            Sign Up
                        </button>

                        <p className="text-sm text-center mt-4">
                            Already have an account?{" "}
                            <Link to="/login" className="font-medium text-indigo-600 underline hover:text-purple-600 transition-colors duration-200">
                                Log In
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </>
    );
};

export default SignUp;
