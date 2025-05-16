import React, { useState } from 'react';
import Profile from '../Cards/Profile';
import { useNavigate, useLocation } from 'react-router-dom';
import SearchBar from '../SearchBar/SearchBar';

const Navbar = ({ userInfo, onSearchNote, handleClearSearch }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    
    const onLogout = () => {
        localStorage.clear();
        navigate("/login");
    };
    
    const handleSearch = () => {
        if (searchQuery) {
            onSearchNote(searchQuery);
        }
    };
    
    const onClearSearch = () => {
        setSearchQuery("");
        handleClearSearch();
    };
    
    // Hide SearchBar on /login and /signup routes
    const hideSearchOn = ["/login", "/signUp"];
    const shouldShowSearchBar = !hideSearchOn.includes(location.pathname);
    
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };
    
    return (
        <div className="bg-gradient-to-r from-purple-50 via-white to-indigo-50 px-4 sm:px-6 py-3 shadow-md border-b border-indigo-100">
            <div className="flex flex-col md:flex-row items-center w-full">
                <div className="flex justify-between items-center w-full md:w-auto">
                    <h2 className="text-2xl font-bold text-indigo-700">QuikScribe</h2>
                    
                    {/* Hamburger menu for mobile */}
                    <button 
                        className="md:hidden focus:outline-none" 
                        onClick={toggleMenu}
                        aria-label="Toggle menu"
                    >
                        <svg className="w-6 h-6 text-indigo-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            {isMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                            )}
                        </svg>
                    </button>
                </div>
                
                {/* Mobile menu */}
                <div className={`flex flex-col md:flex-row md:items-center w-full md:justify-between mt-3 md:mt-0 ${isMenuOpen ? 'block' : 'hidden md:flex'}`}>
                    {shouldShowSearchBar && (
                        <div className="w-full md:w-auto md:mx-4 mb-3 md:mb-0">
                            <SearchBar
                                value={searchQuery}
                                onChange={({ target }) => setSearchQuery(target.value)}
                                handleSearch={handleSearch}
                                onClearSearch={onClearSearch}
                            />
                        </div>
                    )}
                    
                    <div className="mt-3 md:mt-0">
                        <Profile userInfo={userInfo} onLogout={onLogout} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
