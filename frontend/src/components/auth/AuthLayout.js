'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthLayout = ({ children, type }) => {
    const router = useRouter();

    useEffect(() => {
        const container = document.getElementById("container");
        const registerBtn = document.getElementById("register");
        const loginBtn = document.getElementById("login");

        // Set the initial state based on the page type
        if (type === 'signup') {
            container?.classList.add("active");
        }
        //co
        else{
            container?.classList.remove("active");
        }

        const handleRegisterClick = () => {
            // Instead of toggling, we navigate to the correct page
            router.push('/signup');
        };
        // const handleLoginClick = () => {
        //     router.push('/login');
        // };
    //     const handleRegisterClick = () => {
    //     if (type !== 'signup') {
    //         container?.classList.add("active");
    //         //setTimeout(() => router.push('/signup'), 600); // Wait for animation
    //     }
    // };
    const handleLoginClick = () => {
        if (type !== 'login') {
            container?.classList.remove("active");
            setTimeout(() => router.push('/login'), 600); // Wait for animation
        }
    };

        if (registerBtn && loginBtn && container) {
            registerBtn.addEventListener("click", handleRegisterClick);
            loginBtn.addEventListener("click", handleLoginClick);

            return () => {
                registerBtn.removeEventListener("click", handleRegisterClick);
                loginBtn.removeEventListener("click", handleLoginClick);
            };
        }
    }, [type, router]);

    return (
        <div className="login-page-body">
            <style jsx global>{`
                /* ... (All the CSS from your login page design goes here) ... */
                @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');
                .login-page-body { background-color: #c9d6ff; background: linear-gradient(to right, #e2e2e2, #c9d6ff); display: flex; align-items: center; justify-content: center; flex-direction: column; height: 100vh; font-family: 'Montserrat', sans-serif; }
                .container { background-color: #fff; border-radius: 30px; box-shadow: 0 5px 15px rgba(0, 0, 0, 0.35); position: relative; overflow: hidden; width: 768px; max-width: 100%; min-height: 480px; }
                .container p { font-size: 14px; line-height: 20px; letter-spacing: 0.3px; margin: 20px 0; }
                .container span { font-size: 12px; }
                .container a { color: #333; font-size: 13px; text-decoration: none; margin: 15px 0 10px; }
                .container button { background-color: #2da0a8; color: #fff; font-size: 12px; padding: 10px 45px; border: 1px solid transparent; border-radius: 8px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; margin-top: 10px; cursor: pointer; }
                .container button.hidden { background-color: transparent; border-color: #fff; }
                .container form { background-color: #fff; display: flex; align-items: center; justify-content: center; flex-direction: column; padding: 0 40px; height: 100%; }
                .container input { background-color: #eee; border: none; margin: 8px 0; padding: 10px 15px; font-size: 13px; border-radius: 8px; width: 100%; outline: none; }
                .form-container { position: absolute; top: 0; height: 100%; transition: all 0.6s ease-in-out; }
                .sign-in { left: 0; width: 50%; z-index: 2; }
                .container.active .sign-in { transform: translateX(100%); }
                .sign-up { left: 0; width: 50%; opacity: 0; z-index: 1; }
                .container.active .sign-up { transform: translateX(100%); opacity: 1; z-index: 5; animation: move 0.6s; }
                @keyframes move { 0%, 49.99% { opacity: 0; z-index: 1; } 50%, 100% { opacity: 1; z-index: 5; } }
                .toggle-container { position: absolute; top: 0; left: 50%; width: 50%; height: 100%; overflow: hidden; transition: all 0.6s ease-in-out; border-radius: 150px 0 0 100px; z-index: 1000; }
                .container.active .toggle-container { transform: translateX(-100%); border-radius: 0 150px 100px 0; }
                .toggle { background-color: #2da0a8; height: 100%; background: linear-gradient(to right, #5c6bc0, #2da0a8); color: #fff; position: relative; left: -100%; height: 100%; width: 200%; transform: translateX(0); transition: all 0.6s ease-in-out; }
                .container.active .toggle { transform: translateX(50%); }
                .toggle-panel { position: absolute; width: 50%; height: 100%; display: flex; align-items: center; justify-content: center; flex-direction: column; padding: 0 30px; text-align: center; top: 0; transform: translateX(0); transition: all 0.6s ease-in-out; }
                .toggle-left { transform: translateX(-200%); }
                .container.active .toggle-left { transform: translateX(0); }
                .toggle-right { right: 0; transform: translateX(0); }
                .container.active .toggle-right { transform: translateX(200%); }
            `}</style>
            <div className="container" id="container">
                {children} {/* This is where the login or signup form will be placed */}
                <div className="toggle-container">
                    <div className="toggle">
                        <div className="toggle-panel toggle-left">
                            <h1>Welcome Back!</h1>
                            <p>Already have an account? Click below to sign in.</p>
                            <button className="" id="login">Sign In</button>
                        </div>
                        <div className="toggle-panel toggle-right">
                            <h1>Hello, Friend!</h1>
                            <p>Don't have an account? Register here to get started.</p>
                            <button className="" id="register">Sign Up</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;