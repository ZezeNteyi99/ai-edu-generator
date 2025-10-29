import React from 'react';

export const Header: React.FC = () => {
    return (
        <header className="text-center border-b-2 border-indigo-500 pb-4">
            <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
                AI <span className="text-indigo-400">Edu-Generator</span>
            </h1>
            <p className="mt-2 text-lg text-gray-400">
                Generate Study Guides & Quizzes Instantly
            </p>
        </header>
    );
};
