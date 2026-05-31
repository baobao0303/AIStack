'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import authStyles from '../auth.module.scss';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);

    // Simulate recovery email submission loader
    setTimeout(() => {
      setIsLoading(false);
      setSuccess(true);
    }, 1800);
  };

  return (
    <div className="w-full">
      {success ? (
        <div className="flex flex-col items-center justify-center py-6 text-center animate-none">
          <div className="w-16 h-16 rounded-full bg-sage/15 flex items-center justify-center mb-4 text-sage">
            <span className="material-symbols-outlined text-[32px]">mail</span>
          </div>
          <h4 className="font-playfair text-xl font-semibold text-charcoal m-0 mb-2 text-center">Đã Gửi Hướng Dẫn!</h4>
          <p className="max-w-[320px] text-xs text-charcoal/70 leading-relaxed mt-2 text-center">
            Vui lòng kiểm tra hòm thư <strong className="font-semibold">{email}</strong> để hoàn tất khôi phục mật khẩu tài khoản của bạn.
          </p>
          <Link 
            href="/sign-in"
            className="w-full max-w-[200px] bg-sage text-white border-none font-sans font-semibold text-sm py-3 px-7 rounded-lg cursor-pointer flex items-center justify-center gap-2 transition-all duration-300 shadow-[0_4px_12px_rgba(74,101,79,0.1)] hover:bg-sage-dark hover:shadow-[0_8px_20px_rgba(74,101,79,0.2)] hover:translate-y-[-1px] active:translate-y-0 mt-6"
          >
            Quay lại Đăng nhập
          </Link>
        </div>
      ) : (
        <form className="flex flex-col items-center" onSubmit={handleForgotSubmit}>
          
          {/* Lock Icon Section (Stitch Style) */}
          <div className="w-16 h-16 rounded-full bg-sage/25 flex items-center justify-center mb-5 text-sage">
            <span className="material-symbols-outlined text-[32px]">lock</span>
          </div>
          
          <h2 className="font-playfair text-[28px] font-semibold text-charcoal m-0 mb-2 text-center leading-tight">Khôi phục mật khẩu</h2>
          
          <p className="text-xs leading-relaxed text-charcoal/60 text-center m-0 mb-6 px-2">
            Đừng lo lắng, hãy nhập email bạn đã đăng ký. Chúng tôi sẽ gửi một liên kết để bạn đặt lại mật khẩu mới.
          </p>

          <div className="w-full flex flex-col gap-4">
            
            {/* EMAIL FIELD */}
            <div className={`${authStyles.authAnimateField1} w-full`}>
              <label className="text-[11px] font-bold text-charcoal/45 uppercase tracking-wider block mb-2 text-left select-none" htmlFor="email">EMAIL ĐĂNG KÝ</label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-4 text-[20px] text-charcoal/40 pointer-events-none transition-colors duration-300 peer-focus:text-sage">mail</span>
                <input
                  type="email"
                  id="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="peer w-full bg-ivory border border-customBorder/50 py-3.5 pl-12 pr-4 rounded-lg font-sans text-sm text-charcoal outline-none transition-all duration-300 focus:bg-white focus:border-sage focus:ring-4 focus:ring-sage/10 box-border"
                />
              </div>
            </div>

          </div>

          {/* SUBMIT BUTTON */}
          <button 
            type="submit" 
            className={`${authStyles.authAnimateField2} w-full bg-sage text-white border-none font-sans font-semibold text-sm py-4 rounded-lg cursor-pointer flex items-center justify-center gap-2 transition-all duration-300 shadow-[0_4px_12px_rgba(74,101,79,0.1)] hover:bg-sage-dark hover:shadow-[0_8px_20px_rgba(74,101,79,0.2)] hover:translate-y-[-1px] active:translate-y-0 mt-6 uppercase tracking-wider group`}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Gửi liên kết khôi phục</span>
                <span className="material-symbols-outlined text-[18px] transition-transform duration-300 group-hover:translate-x-1">arrow_right_alt</span>
              </>
            )}
          </button>

          {/* ROUTE REDIRECT BACK */}
          <div className={`${authStyles.authAnimateField3} w-full flex justify-center mt-6`}>
            <Link 
              href="/sign-in"
              className="flex items-center gap-1.5 font-semibold text-xs text-[#6b5c4c] transition-colors duration-200 hover:text-sage"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              <span>Quay lại đăng nhập</span>
            </Link>
          </div>

        </form>
      )}
    </div>
  );
}
