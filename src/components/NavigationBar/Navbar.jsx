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
    const hideOn = ["/login", "/signUp"];
    const shouldShowSearchBar = !hideOn.includes(location.pathname);
    // Hide logout button on login/signup pages
    const shouldShowLogout = !hideOn.includes(location.pathname);
    
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };
    
    return (
        <div className="bg-gradient-to-r from-purple-100 via-indigo-50 to-blue-100 px-4 sm:px-6 py-3 shadow-md border-b border-indigo-200">
            {/* Desktop view */}
            <div className="hidden sm:flex sm:flex-row sm:items-center sm:justify-between sm:gap-0">
                <div className="flex items-center">
                    <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-600 text-2xl font-extrabold tracking-tight drop-shadow-sm">
                        <span className="inline-block transform hover:scale-105 transition-transform duration-300">Quik</span>
                        <span className="inline-block transform hover:scale-105 transition-transform duration-300 text-indigo-800">Scribe</span>
                    </h2>
                </div>
                
                {shouldShowSearchBar && (
                    <div className="w-auto">
                        <SearchBar
                            value={searchQuery}
                            onChange={({ target }) => setSearchQuery(target.value)}
                            handleSearch={handleSearch}
                            onClearSearch={onClearSearch}
                        />
                    </div>
                )}
                
                <div>
                    {shouldShowLogout ? (
                        <Profile userInfo={userInfo} onLogout={onLogout} />
                    ) : null}
                </div>
            </div>
            
            {/* Mobile view */}
            <div className="sm:hidden">
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-600 text-2xl font-extrabold tracking-tight drop-shadow-sm">
                            <span className="inline-block">Quik</span>
                            <span className="inline-block text-indigo-800">Scribe</span>
                        </h2>
                    </div>
                    
                    <button 
                        className="focus:outline-none" 
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
                
                {isMenuOpen && (
                    <div className="mt-3 flex flex-col gap-3">
                        {shouldShowSearchBar && (
                            <div className="w-full">
                                <SearchBar
                                    value={searchQuery}
                                    onChange={({ target }) => setSearchQuery(target.value)}
                                    handleSearch={handleSearch}
                                    onClearSearch={onClearSearch}
                                />
                            </div>
                        )}
                        
                        {shouldShowLogout && (
                            <div className="mt-2">
                                <Profile userInfo={userInfo} onLogout={onLogout} />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;
