import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = () => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    return (
        <button
            onClick={toggleTheme}
            className="fixed top-6 right-6 z-50 p-3 rounded-2xl glass transition-all duration-500 hover:scale-110 active:scale-95 group overflow-hidden"
            aria-label="Toggle Theme"
        >
            <div className="relative w-6 h-6">
                {theme === 'light' ? (
                    <Moon className="w-6 h-6 text-indigo-600 animate-in fade-in zoom-in duration-500" />
                ) : (
                    <Sun className="w-6 h-6 text-amber-400 animate-in fade-in zoom-in duration-500" />
                )}
            </div>

            {/* Animated background glow */}
            <div className={`absolute inset-0 opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-500 ${theme === 'light' ? 'bg-indigo-400' : 'bg-amber-300'}`}></div>
        </button>
    );
};

export default ThemeToggle;
