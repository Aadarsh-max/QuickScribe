import React, { useState } from 'react';
import Profile from '../Cards/Profile';
import { useNavigate, useLocation } from 'react-router-dom';
import SearchBar from '../SearchBar/SearchBar';

const Navbar = ({ userInfo, onSearchNote, handleClearSearch }) => {
    const [searchQuery, setSearchQuery] = useState("");
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

    return (
        <div className="bg-gradient-to-r from-purple-50 via-white to-indigo-50 px-4 sm:px-6 py-3 shadow-md border-b border-indigo-100">
            <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-3 sm:gap-0">
                <h2 className="text-2xl font-bold text-indigo-700">QuikScribe</h2>

                {shouldShowSearchBar && (
                    <div className="w-full sm:w-auto">
                        <SearchBar
                            value={searchQuery}
                            onChange={({ target }) => setSearchQuery(target.value)}
                            handleSearch={handleSearch}
                            onClearSearch={onClearSearch}
                        />
                    </div>
                )}

                <div className="mt-2 sm:mt-0">
                    <Profile userInfo={userInfo} onLogout={onLogout} />
                </div>
            </div>
        </div>
    );
};

export default Navbar;
