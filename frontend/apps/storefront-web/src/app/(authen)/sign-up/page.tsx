'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../../shared/styles/page.module.scss';
import ShaderBackground from '../../../shared/ui/ShaderBackground';

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) return;
    if (password !== confirmPassword) {
      alert('Mật khẩu xác nhận không khớp!');
      return;
    }
    if (!agreeTerms) {
      alert('Vui lòng đồng ý với Điều khoản dịch vụ và Chính sách bảo mật.');
      return;
    }
    setIsLoading(true);

    // Simulate luxury registration loader
    setTimeout(() => {
      setIsLoading(false);
      setSuccess(true);
      setTimeout(() => {
        router.push('/sign-in');
      }, 1500);
    }, 1800);
  };

  return (
    <div className={styles.storefrontLayout} style={{ minHeight: '100vh', position: 'relative' }}>
      {/* Background Weave Layer */}
      <div className={styles.ambientGrain}></div>
      <ShaderBackground />

      <div className={styles.loginContainer}>
        <div className={styles.loginCard}>
          {/* Decorative Golden Corner Accent */}
          <div className={styles.loginCornerDecor}></div>

          <div className={styles.loginHeader}>
            <h3>Tiệm Nhà Zịt</h3>
            <h2>Đăng Ký Tài Khoản</h2>
            <p>Tạo tài khoản để nhận ưu đãi đan móc bespoke độc quyền và tích lũy điểm thưởng từ Zịt.</p>
          </div>

          {success ? (
            <div className={styles.loginSuccessBlock}>
              <div className={styles.successIconOuter}>
                <span className="material-symbols-outlined">check_circle</span>
              </div>
              <h4>Đăng Ký Thành Công!</h4>
              <p>Đang chuyển hướng sang trang đăng nhập...</p>
            </div>
          ) : (
            <form className={styles.loginForm} onSubmit={handleRegisterSubmit}>
              <div className={styles.loginInputGroup}>
                <label htmlFor="name">Họ và tên của bạn</label>
                <div className={styles.loginInputWrapper}>
                  <span className="material-symbols-outlined">person</span>
                  <input
                    type="text"
                    id="name"
                    placeholder="Nguyễn Văn A"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className={styles.loginInputGroup}>
                <label htmlFor="email">Địa chỉ Email</label>
                <div className={styles.loginInputWrapper}>
                  <span className="material-symbols-outlined">mail</span>
                  <input
                    type="email"
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

              <div className={styles.loginInputGroup}>
                <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
                <div className={styles.loginInputWrapper}>
                  <span className="material-symbols-outlined">lock</span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className={styles.loginFormActions}>
                <label className={styles.loginRememberCheckbox}>
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                  />
                  <span className={styles.loginCheckboxSpan}></span>
                  <span style={{ fontSize: '11px', color: 'rgba(26, 28, 26, 0.7)' }}>
                    Tôi đồng ý với <strong>Điều khoản dịch vụ</strong> & <strong>Chính sách</strong>
                  </span>
                </label>
              </div>

              <button type="submit" className={styles.btnLoginSubmit} disabled={isLoading}>
                {isLoading ? (
                  <div className={styles.loginSpinner}></div>
                ) : (
                  <span>TẠO TÀI KHOẢN MỚI</span>
                )}
              </button>
            </form>
          )}

          <div className={styles.loginSocialGroup}>
            <div className={styles.loginDivider}>
              <div className={styles.line}></div>
              <span>ĐĂNG KÝ NHANH QUA</span>
              <div className={styles.line}></div>
            </div>

            <div className={styles.loginSocialButtons}>
              <button
                type="button"
                className={styles.loginSocialBtn}
                onClick={() => alert('Liên kết tài khoản Google...')}
              >
                <span className="material-symbols-outlined">google</span>
                Google
              </button>
              <button
                type="button"
                className={styles.loginSocialBtn}
                onClick={() => alert('Liên kết tài khoản Facebook...')}
              >
                <span className="material-symbols-outlined">facebook</span>
                Facebook
              </button>
            </div>
          </div>

          <div className={styles.loginFooter}>
            <span>Bạn đã có tài khoản? </span>
            <button type="button" onClick={() => router.push('/sign-in')}>
              Đăng nhập ngay tại đây
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
