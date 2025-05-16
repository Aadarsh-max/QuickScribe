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
    const [isLoading, setIsLoading] = useState(false);
    
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
        setIsLoading(true);
        
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
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            
            <div className="flex items-center justify-center flex-grow px-4 py-8 sm:py-12 md:py-16 bg-gray-50">
                <div className="w-full max-w-xs sm:max-w-sm md:max-w-md rounded-xl bg-white p-5 sm:p-8 md:p-10 shadow-lg border border-gray-200 bg-gradient-to-tr from-purple-50 via-white to-indigo-50 transition-all">
                    <form onSubmit={handleLogin} className="space-y-5">
                        <h4 className="text-xl sm:text-2xl md:text-3xl font-semibold text-center mb-6 text-indigo-700">Login</h4>
                        
                        <div className="space-y-4">
                            <div>
                                <input
                                    type="text"
                                    placeholder="Email"
                                    className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    aria-label="Email"
                                />
                            </div>
                            
                            <div>
                                <PasswordInput
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>
                        
                        {error && (
                            <div className="pt-1">
                                <p className="text-red-500 text-xs sm:text-sm">{error}</p>
                            </div>
                        )}
                        
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 sm:py-3 rounded-lg text-sm sm:text-base font-medium hover:scale-[1.01] transition-all duration-200 hover:shadow-md flex items-center justify-center"
                        >
                            {isLoading ? (
                                <span className="inline-flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Logging in...
                                </span>
                            ) : (
                                "Login"
                            )}
                        </button>
                        
                        <div className="flex justify-center">
                            <p className="text-xs sm:text-sm text-center mt-4 text-gray-600">
                                Not registered yet?{" "}
                                <Link to="/signUp" className="font-medium text-indigo-600 underline hover:text-purple-600 transition-colors duration-200">
                                    Create an Account
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;