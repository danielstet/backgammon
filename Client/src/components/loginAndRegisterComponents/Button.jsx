import React from 'react';

const Button = ({ children, ...props }) => {
    const baseStyle = 'px-4 py-2 rounded-md bg-black text-white'; // הכפתור יהיה שחור עם כיתוב לבן

    return (
        <div style={{ display: "flex", justifyContent: "center" }}>
            <button 
                className={baseStyle} 
                style={{ display: "flex", justifyContent: "center", alignItems: "center", border: "1px solid black"}} 
                {...props}
            >
                {children}
            </button>
        </div>
    );
};

export default Button;
