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
            {/* Desktop view - exactly like original */}
            <div className="hidden sm:flex sm:flex-row sm:items-center sm:justify-between sm:gap-0">
                <h2 className="text-2xl font-bold text-indigo-700">QuikScribe</h2>
                
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
                    <Profile userInfo={userInfo} onLogout={onLogout} />
                </div>
            </div>
            
            {/* Mobile view */}
            <div className="sm:hidden">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-indigo-700">QuikScribe</h2>
                    
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
                        
                        <div className="mt-2">
                            <Profile userInfo={userInfo} onLogout={onLogout} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;
