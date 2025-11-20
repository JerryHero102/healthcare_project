import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';  

const Login_E = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const API_BASE = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:5001';

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsLoading(true);

        try {
            const res = await axios.post(`${API_BASE}/api/employee/auth/login`, {
                username,
                password
            });

            if (!res.data?.success) {
                setMessage(res.data?.message || 'Sai thông tin đăng nhập');
                return;
            }

            const user = res.data.user;

            // Lưu token và auth_id
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('auth_id', user.auth_id);
            localStorage.setItem('employeeId', user.username);
            localStorage.setItem('role', user.role);

            setMessage('Đăng nhập thành công!');
            setTimeout(() => navigate('/Admin/Dashboard'), 400);
        } catch (err) {
            const msg = err.response?.data?.message || 'Lỗi kết nối';
            setMessage(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--color-admin-bg-light)]">
            <div className="w-full max-w-md">
                <div className="bg-[var(--color-admin-card-light)] rounded-xl shadow-lg border border-[var(--color-admin-border-light)] p-8">
                    <div className="flex flex-col items-center mb-8">
                        <div className="size-16 text-[var(--color-admin-primary)] mb-4">
                            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z" fill="currentColor"></path>
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-[var(--color-admin-text-light-primary)]">
                            HealthCare Admin
                        </h1>
                        <p className="text-sm text-[var(--color-admin-text-light-secondary)] mt-2">
                            Đăng nhập vào hệ thống quản trị
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-[var(--color-admin-text-light-primary)] mb-2">
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                placeholder="Nhập username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className="w-full px-4 py-3 rounded-lg border border-[var(--color-admin-border-light)] bg-white text-[var(--color-admin-text-light-primary)] placeholder:text-[var(--color-admin-text-light-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-[var(--color-admin-text-light-primary)] mb-2">
                                Mật khẩu
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="Nhập mật khẩu"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-3 rounded-lg border border-[var(--color-admin-border-light)] bg-white text-[var(--color-admin-text-light-primary)] placeholder:text-[var(--color-admin-text-light-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-transparent"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[var(--color-admin-primary)] text-white font-semibold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <span className="material-symbols-outlined animate-spin">refresh</span>
                                    Đang đăng nhập...
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined">login</span>
                                    Đăng nhập
                                </>
                            )}
                        </button>

                        {message && (
                            <div className={`p-3 rounded-lg text-sm text-center ${
                                message.includes('thành công')
                                    ? 'bg-[var(--color-admin-success)]/10 text-[var(--color-admin-success)]'
                                    : 'bg-[var(--color-admin-danger)]/10 text-[var(--color-admin-danger)]'
                            }`}>
                                {message}
                            </div>
                        )}
                    </form>

                    <p className="text-center text-xs text-[var(--color-admin-text-light-secondary)] mt-6">
                        © 2024 HealthCare. Phiên bản demo
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login_E;
