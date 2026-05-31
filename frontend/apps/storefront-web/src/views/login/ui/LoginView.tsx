'use client';

import React, { useState } from 'react';
import { ViewType } from '../../../shared/model/types';

interface LoginViewProps {
  styles: Record<string, string>;
  setActiveView: (view: ViewType) => void;
}

export default function LoginView({ styles, setActiveView }: LoginViewProps) {
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
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        {/* Decorative Golden Corner Accent */}
        <div className={styles.loginCornerDecor}></div>

        <div className={styles.loginHeader}>
          <h3>Tiệm Nhà Zịt</h3>
          <h2>Chào Mừng Trở Lại</h2>
          <p>Đăng nhập để xem tiến độ đan len từ nghệ nhân và lưu các ưu đãi đan móc thủ công độc quyền.</p>
        </div>

        {success ? (
          <div className={styles.loginSuccessBlock}>
            <div className={styles.successIconOuter}>
              <span className="material-symbols-outlined">check_circle</span>
            </div>
            <h4>Đăng Nhập Thành Công!</h4>
            <p>Đang chuyển hướng về trang chủ...</p>
          </div>
        ) : (
          <form className={styles.loginForm} onSubmit={handleLoginSubmit}>
            <div className={styles.loginInputGroup}>
              <label htmlFor="email">Email hoặc Số điện thoại</label>
              <div className={styles.loginInputWrapper}>
                <span className="material-symbols-outlined">mail</span>
                <input
                  type="text"
                  id="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className={styles.loginInputGroup}>
              <label htmlFor="password">Mật khẩu</label>
              <div className={styles.loginInputWrapper}>
                <span className="material-symbols-outlined">lock</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className={styles.loginTogglePassword}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <div className={styles.loginFormActions}>
              <label className={styles.loginRememberCheckbox}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className={styles.loginCheckboxSpan}></span>
                Ghi nhớ đăng nhập
              </label>
              <button
                type="button"
                className={styles.loginForgotBtn}
                onClick={() => alert('Chức năng phục hồi mật khẩu đang được phát triển!')}
              >
                Quên mật khẩu?
              </button>
            </div>

            <button type="submit" className={styles.btnLoginSubmit} disabled={isLoading}>
              {isLoading ? (
                <div className={styles.loginSpinner}></div>
              ) : (
                <span>ĐĂNG NHẬP NGAY</span>
              )}
            </button>
          </form>
        )}

        <div className={styles.loginSocialGroup}>
          <div className={styles.loginDivider}>
            <div className={styles.line}></div>
            <span>HOẶC ĐĂNG NHẬP VỚI</span>
            <div className={styles.line}></div>
          </div>

          <div className={styles.loginSocialButtons}>
            <button
              type="button"
              className={styles.loginSocialBtn}
              onClick={() => alert('Đăng nhập Google đang liên kết...')}
            >
              <span className="material-symbols-outlined">google</span>
              Google
            </button>
            <button
              type="button"
              className={styles.loginSocialBtn}
              onClick={() => alert('Đăng nhập Facebook đang liên kết...')}
            >
              <span className="material-symbols-outlined">facebook</span>
              Facebook
            </button>
          </div>
        </div>

        <div className={styles.loginFooter}>
          <span>Bạn chưa có tài khoản? </span>
          <button type="button" onClick={() => alert('Chức năng Đăng ký tài khoản mới đang liên kết!')}>
            Tạo tài khoản tại đây
          </button>
        </div>
      </div>
    </div>
  );
}
