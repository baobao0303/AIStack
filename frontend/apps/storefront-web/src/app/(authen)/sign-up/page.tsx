'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../../shared/styles/page.module.scss';
import ShaderBackground from '../../../shared/ui/ShaderBackground';

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, []);

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) return;
    if (password !== confirmPassword) {
      alert('Mật khẩu xác nhận không khớp!');
      return;
    }
    if (!agreeTerms) {
      alert('Vui lòng đồng ý với Điều khoản và Chính sách bảo mật.');
      return;
    }
    setIsLoading(true);

    // Simulate registration progression
    setTimeout(() => {
      setIsLoading(false);
      setSuccess(true);
      setTimeout(() => {
        router.push('/sign-in');
      }, 1500);
    }, 1800);
  };

  return (
    <div className={styles.storefrontLayout} style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', padding: 0 }}>
      {/* Background Weave Layer */}
      <div className={styles.ambientGrain}></div>
      <ShaderBackground />

      <div className={styles.authSplitCard}>
        {/* LEFT COLUMN: AMBIENT VISUAL BANNER WITH QUOTE */}
        <div className={styles.authSplitVisual}>
          <img 
            src="https://lh3.googleusercontent.com/aida/ADBb0ujF9EIkF5XOFy216NOg8aknzCdm9ueX3Jyuk-ITk6aFQPVlAN_EU6vUUhkgarLmQe7R3C-xkwozhAookNyvYAQyZX67D3rN7f3HIcEXA58aDlf3ZFe9LjxO5256k6tuxJ2uG2O8DZJBd6uHISR4G4stSq-Hil1q-xI7XxSQx6M_jMG91kaSkDLpOJPbqB4N2w5JSU1bgNbqRsl0D1fqOPGSW9zaCBPvG9e0EVpajr99p8Bx5Pdt6s2gW424"
            alt="Knitting yarn artisan detailing"
            className={`${styles.authVisualImg} ${styles.authAnimateImg}`}
          />
          <div className={styles.authVisualOverlay}></div>
          <div className={styles.authVisualText}>
            <div className={styles.authAnimateHeader} style={{ marginBottom: '16px', opacity: 0.8 }}>
              <span className="material-symbols-outlined" style={{ fontSize: '36px', color: '#ffffff' }}>format_quote</span>
            </div>
            <h3 className={styles.authAnimateHeader} style={{ fontSize: '24px', lineHeight: 1.4, fontWeight: 700 }}>Gói trọn tình yêu.</h3>
            <p className={styles.authAnimateField1} style={{ marginTop: '12px', fontSize: '13px', lineHeight: 1.6, color: 'rgba(255, 255, 255, 0.85)', fontStyle: 'italic', fontWeight: 300 }}>
              — Mỗi mũi đan là một câu chuyện, mỗi sản phẩm là một tâm tình từ đôi bàn tay nghệ nhân.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: BRANDED SIGN-UP FORM */}
        <div className={styles.authSplitForm}>
          {/* Brand Logo & Header */}
          <div className={`${styles.authSplitHeader} ${styles.authAnimateHeader}`}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#4a654f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-outlined" style={{ color: '#ffffff', fontSize: '20px' }}>pets</span>
              </div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', fontWeight: 700, color: '#4a654f', letterSpacing: '-0.02em', margin: 0 }}>Tiệm Nhà Zịt</h1>
            </div>
            <h2>Tạo tài khoản mới</h2>
            <p>Tham gia cộng đồng yêu len thủ công ngay hôm nay.</p>
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
              <div className={styles.authFormFields}>
                
                {/* FULL NAME FIELD */}
                <div className={styles.authAnimateField1}>
                  <label className={styles.authSplitLabel} htmlFor="fullName">HỌ VÀ TÊN</label>
                  <div className={styles.loginInputWrapper}>
                    <span className="material-symbols-outlined">person</span>
                    <input
                      type="text"
                      id="fullName"
                      placeholder="Nguyễn Văn A"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      style={{ borderRadius: '8px', backgroundColor: '#faf9f6', paddingLeft: '48px' }}
                    />
                  </div>
                </div>

                {/* EMAIL FIELD */}
                <div className={styles.authAnimateField2}>
                  <label className={styles.authSplitLabel} htmlFor="email">EMAIL</label>
                  <div className={styles.loginInputWrapper}>
                    <span className="material-symbols-outlined">mail</span>
                    <input
                      type="email"
                      id="email"
                      placeholder="email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      style={{ borderRadius: '8px', backgroundColor: '#faf9f6', paddingLeft: '48px' }}
                    />
                  </div>
                </div>

                {/* PASSWORD & CONFIRM PASSWORD COLUMN */}
                <div className={`${styles.authPasswordRow} ${styles.authAnimateField3}`}>
                  <div>
                    <label className={styles.authSplitLabel} htmlFor="password">MẬT KHẨU</label>
                    <div className={styles.loginInputWrapper}>
                      <span className="material-symbols-outlined">lock</span>
                      <input
                        type="password"
                        id="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ borderRadius: '8px', backgroundColor: '#faf9f6', paddingLeft: '48px' }}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={styles.authSplitLabel} htmlFor="confirmPass">XÁC NHẬN</label>
                    <div className={styles.loginInputWrapper}>
                      <span className="material-symbols-outlined">lock</span>
                      <input
                        type="password"
                        id="confirmPass"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        style={{ borderRadius: '8px', backgroundColor: '#faf9f6', paddingLeft: '48px' }}
                      />
                    </div>
                  </div>
                </div>

              </div>

              {/* AGREEMENT CHECKBOX & REGISTER SUBMIT */}
              <div className={styles.authAnimateField4} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
                <div className={styles.loginFormActions} style={{ margin: 0 }}>
                  <label className={styles.loginRememberCheckbox}>
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                    />
                    <span className={styles.loginCheckboxSpan}></span>
                    <span style={{ fontSize: '12px', color: 'rgba(26, 28, 26, 0.7)' }}>
                      Tôi đồng ý với <strong>Điều khoản</strong> và <strong>Chính sách bảo mật</strong>.
                    </span>
                  </label>
                </div>

                <button 
                  type="submit" 
                  className={styles.authSubmitBtn} 
                  disabled={isLoading}
                  style={{ marginTop: '8px' }}
                >
                  {isLoading ? (
                    <div className={styles.loginSpinner}></div>
                  ) : (
                    <>
                      <span>Đăng ký ngay</span>
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_right_alt</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* SOCIAL INTEGRATIONS */}
          <div className={`${styles.loginSocialGroup} ${styles.authAnimateField5}`}>
            <div className={styles.loginDivider}>
              <div className={styles.line}></div>
              <span>HOẶC TIẾP TỤC VỚI</span>
              <div className={styles.line}></div>
            </div>

            <div className={styles.loginSocialButtons}>
              <button
                type="button"
                className={styles.loginSocialBtn}
                onClick={() => alert('Liên kết Google...')}
                style={{ borderRadius: '8px', padding: '12px', gap: '8px' }}
              >
                <svg style={{ width: '18px', height: '18px', flexShrink: 0 }} viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                </svg>
                Google
              </button>
              <button
                type="button"
                className={styles.loginSocialBtn}
                onClick={() => alert('Liên kết Facebook...')}
                style={{ borderRadius: '8px', padding: '12px', gap: '8px' }}
              >
                <svg style={{ width: '18px', height: '18px', flexShrink: 0 }} fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path>
                </svg>
                Facebook
              </button>
            </div>
          </div>

          {/* REDIRECT FOOTER */}
          <div className={`${styles.loginFooter} ${styles.authAnimateField5}`} style={{ marginTop: '8px' }}>
            <span>Đã có tài khoản? </span>
            <button 
              type="button" 
              onClick={() => router.push('/sign-in')}
              style={{ fontWeight: '700', color: '#4a654f' }}
            >
              Đăng nhập
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
