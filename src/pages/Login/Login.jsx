import React, { useState } from 'react';
import Navbar from '../../components/NavigationBar/Navbar';
import PasswordInput from '../../components/Input/PasswordInput';
import { Link, useNavigate } from 'react-router-dom';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!validateEmail(email)) {
            setError("Please enter a valid email address");
            return;
        }

        if (!password) {
            setError("Please enter the password");
            return;
        }

        setError("");

        try {
            const response = await axiosInstance.post("/login", {
                email: email,
                password: password,
            });

            if (response.data && response.data.accessToken) {
                localStorage.setItem("token", response.data.accessToken);
                navigate('/dashboard');
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError("An unexpected error occurred. Please try again.");
            }
        }
    };

    return (
        <>
            <Navbar />

            <div className="flex items-center justify-center min-h-[calc(100vh-5rem)] px-4 sm:px-6 md:px-0 mt-10 animate-fade-in">
                <div className="w-full max-w-sm md:max-w-md rounded-lg bg-white px-6 py-8 sm:px-8 md:px-10 shadow-xl border border-gray-200 bg-gradient-to-tr from-purple-50 via-white to-indigo-50">
                    <form onSubmit={handleLogin}>
                        <h4 className="text-2xl sm:text-3xl font-semibold text-center mb-6 text-indigo-700">Login</h4>

                        <input
                            type="text"
                            placeholder="Email"
                            className="input-box w-full mb-4 px-4 py-2 text-sm sm:text-base rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <PasswordInput
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        {error && <p className="text-red-500 text-xs pt-1">{error}</p>}

                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 rounded-md mt-4 text-sm sm:text-base hover:scale-[1.02] transition-all duration-200 hover:shadow-lg"
                        >
                            Login
                        </button>

                        <p className="text-sm text-center mt-4">
                            Not registered yet?{" "}
                            <Link to="/signUp" className="font-medium text-indigo-600 underline hover:text-purple-600 transition-colors duration-200">
                                Create an Account
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Login;
