'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ViewType } from '@tiem-nha-zit/shared';
import authStyles from '../styles/auth.module.scss';

interface LoginViewProps {
  setActiveView: (view: ViewType) => void;
}

export default function LoginView({ setActiveView }: LoginViewProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setIsLoading(true);

    // Simulate luxury loader
    setTimeout(() => {
      setIsLoading(false);
      setSuccess(true);
      setTimeout(() => {
        setActiveView('home');
      }, 1500);
    }, 1800);
  };

  return (
    <div className="w-full">
      {/* Branded header info */}
      <div className={`${authStyles.authAnimateHeader} mb-6`}>
        <h2 className="font-playfair text-[26px] font-bold text-charcoal m-0 mb-2 leading-tight">Chào mừng quay lại</h2>
        <p className="text-xs leading-normal text-charcoal/55 m-0">Đăng nhập tài khoản để quản lý các ưu đãi đan móc và tiến trình đơn hàng.</p>
      </div>

      {success ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="w-16 h-16 rounded-full bg-sage/15 flex items-center justify-center mb-4 text-sage">
            <span className="material-symbols-outlined text-[32px]">check_circle</span>
          </div>
          <h4 className="font-playfair text-xl font-bold text-charcoal m-0 mb-2">Đăng Nhập Thành Công!</h4>
          <p className="text-sm text-charcoal/60 m-0">Đang chuyển hướng về trang chủ...</p>
        </div>
      ) : (
        <form className="flex flex-col gap-5" onSubmit={handleLoginSubmit}>
          <div className="flex flex-col gap-4">
            
            {/* EMAIL FIELD */}
            <div className={authStyles.authAnimateField1}>
              <label className="text-[11px] font-bold text-charcoal/45 uppercase tracking-wider block mb-2 select-none" htmlFor="email">EMAIL</label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-4 text-[20px] text-charcoal/40 pointer-events-none transition-colors duration-300 peer-focus:text-sage">mail</span>
                <input
                  type="email"
                  id="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="peer w-full bg-ivory border border-customBorder/50 py-3.5 pl-12 pr-4 rounded-xl font-sans text-sm text-charcoal outline-none transition-all duration-300 focus:bg-white focus:border-sage focus:ring-4 focus:ring-sage/10 box-border"
                />
              </div>
            </div>

            {/* PASSWORD FIELD WITH FORGOT OPTION */}
            <div className={authStyles.authAnimateField2}>
              <div className="flex justify-between items-center mb-2">
                <label className="text-[11px] font-bold text-charcoal/45 uppercase tracking-wider block select-none mb-0" htmlFor="password">MẬT KHẨU</label>
                <Link
                  href="/forgot-password"
                  className="bg-none border-none p-0 font-sans text-xs font-semibold text-gold cursor-pointer transition-colors duration-300 hover:text-[#ae863b] hover:underline uppercase tracking-wider text-[11px]"
                >
                  Quên mật khẩu?
                </Link>
              </div>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-4 text-[20px] text-charcoal/40 pointer-events-none transition-colors duration-300 peer-focus:text-sage">lock</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="peer w-full bg-ivory border border-customBorder/50 py-3.5 pl-12 pr-12 rounded-xl font-sans text-sm text-charcoal outline-none transition-all duration-300 focus:bg-white focus:border-sage focus:ring-4 focus:ring-sage/10 box-border"
                />
                <button
                  type="button"
                  className="absolute right-4 z-10 bg-none border-none p-0 cursor-pointer flex items-center justify-center text-charcoal/40 hover:text-sage transition-colors duration-300"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

          </div>

          {/* REMEMBER ME CHECKBOX */}
          <div className={`${authStyles.authAnimateField3} flex justify-between items-center text-xs mt-1`}>
            <label className="flex items-center gap-2 cursor-pointer select-none font-medium text-charcoal/65">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="peer hidden"
              />
              <span className="w-[18px] h-[18px] border border-customBorder/80 rounded flex items-center justify-center transition-all duration-200 peer-checked:bg-sage peer-checked:border-sage peer-checked:after:scale-100 after:content-['check'] after:font-['Material_Symbols_Outlined'] after:text-xs after:text-white after:scale-0 after:transition-transform after:duration-200"></span>
              <span className="text-xs text-charcoal/70">
                Ghi nhớ đăng nhập
              </span>
            </label>
          </div>

          {/* LOGIN BUTTON */}
          <button 
            type="submit" 
            className={`${authStyles.authAnimateField4} w-full bg-sage text-white border-none font-sans font-semibold text-sm py-2 pl-7 pr-2.5 rounded-full cursor-pointer flex items-center justify-between gap-2 transition-all duration-300 shadow-[0_4px_12px_rgba(74,101,79,0.1)] hover:bg-sage-dark hover:shadow-[0_8px_20px_rgba(74,101,79,0.2)] hover:translate-y-[-1px] active:translate-y-0 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-4 group`}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
            ) : (
              <>
                <span>Đăng nhập</span>
                <span className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center shrink-0 transition-all duration-300 group-hover:bg-white/25">
                  <span className="material-symbols-outlined text-[18px] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-white">arrow_outward</span>
                </span>
              </>
            )}
          </button>
        </form>
      )}

      {/* SOCIAL INTEGRATIONS */}
      <div className={`${authStyles.authAnimateField5} mt-6`}>
        <div className="flex items-center gap-3 text-center my-6">
          <div className="flex-1 h-[1px] bg-customBorder/30"></div>
          <span className="text-[11px] font-bold text-charcoal/40 tracking-widest uppercase">HOẶC TIẾP TỤC VỚI</span>
          <div className="flex-1 h-[1px] bg-customBorder/30"></div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            className="bg-white border border-customBorder/60 py-3 px-4 rounded-full font-sans text-xs font-semibold text-charcoal/70 cursor-pointer flex items-center justify-center gap-2 transition-all duration-300 hover:border-sage/50 hover:bg-sage-light/10 hover:text-sage hover:translate-y-[-1px] active:translate-y-0 shadow-sm"
            onClick={() => alert('Đăng nhập Google...')}
          >
            <svg className="w-[18px] h-[18px] shrink-0" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
            </svg>
            Google
          </button>
          <button
            type="button"
            className="bg-white border border-customBorder/60 py-3 px-4 rounded-full font-sans text-xs font-semibold text-charcoal/70 cursor-pointer flex items-center justify-center gap-2 transition-all duration-300 hover:border-sage/50 hover:bg-sage-light/10 hover:text-sage hover:translate-y-[-1px] active:translate-y-0 shadow-sm"
            onClick={() => alert('Đăng nhập Facebook...')}
          >
            <svg className="w-[18px] h-[18px] shrink-0" fill="#1877F2" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path>
            </svg>
            Facebook
          </button>
        </div>
      </div>

      {/* REDIRECT FOOTER */}
      <div className={`${authStyles.authAnimateField5} text-center text-xs text-charcoal/50 mt-6`}>
        <span>Bạn chưa có tài khoản? </span>
        <Link 
          href="/sign-up"
          className="font-bold text-sage hover:text-sage-dark hover:underline transition-colors ml-1"
        >
          Đăng ký tài khoản mới
        </Link>
      </div>
    </div>
  );
}
