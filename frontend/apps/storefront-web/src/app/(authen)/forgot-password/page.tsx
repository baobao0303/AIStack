'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../../shared/styles/page.module.scss';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, []);

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

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Smooth angle scaling to keep it subtle (max ~6 degrees)
    const rotateX = -(y / (rect.height / 2)) * 6;
    const rotateY = (x / (rect.width / 2)) * 6;
    
    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`,
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
      transition: 'transform 0.5s ease-out',
    });
  };

  return (
    <div className={styles.parallaxWrapper}>
      {/* Background Weave Layer */}
      <div className={styles.ambientGrain}></div>
      
      {/* Background Cover Image with Dim Overlay */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: "linear-gradient(rgba(250, 249, 246, 0.72), rgba(250, 249, 246, 0.72)), url('https://lh3.googleusercontent.com/aida/ADBb0ujP0BmZTk0IVcdllVj0erCnC_Fa7atY4sPeLUMwCmttOZnXOR6MGAyxPzftwtlwBQmnT3lFsPyb7hp7EjnF_BTAkjuEX4bn2i5nNduk03Ns9DXhDvEIxLJWg700HTOye2qlIYTUWKParwjDUMR6tigLLXlPC43UAc0scOzb3prHnxOByu2aVMXnbT1xl1TO_AhcJSV0QmuAlYJmtX-Dgd2i5ljiHnByqP6ZESM1NiG2OS36j4FRP5zOFVc')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          filter: 'blur(1px)',
          zIndex: 0
        }}
      />

      {/* Decorative Corner Ambient Glow Elements */}
      <div className={styles.ambientGlowLeft}></div>
      <div className={styles.ambientGlowRight}></div>

      {/* Top Navigation Branding (Strict Stitch Specification) */}
      <header style={{ position: 'fixed', top: 0, left: 0, width: '100%', display: 'flex', justifyContent: 'center', paddingTop: '32px', zIndex: 50 }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', fontWeight: 700, color: '#4a654f', letterSpacing: '-0.02em', margin: 0 }}>Tiệm Nhà Zịt</h1>
      </header>

      {/* Centered Glassmorphic Form Container */}
      <div className="w-full max-w-[440px] mt-12" style={{ zIndex: 10 }}>
        <div 
          className={`${styles.glassCard} ${styles.authAnimateHeader}`} 
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ 
            ...tiltStyle, 
            background: 'rgba(255, 255, 255, 0.65)',
            border: '1px solid rgba(244, 223, 203, 0.5)'
          }}
        >
          {success ? (
            <div className={styles.loginSuccessBlock} style={{ animation: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div className={styles.successIconOuter} style={{ backgroundColor: 'rgba(74, 101, 79, 0.15)', marginBottom: '16px', width: '64px', height: '64px', borderRadius: '99px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-outlined" style={{ color: '#4a654f', fontSize: '32px' }}>mail</span>
              </div>
              <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', fontWeight: 600, color: '#1a1c1a', margin: '0 0 8px 0', textAlign: 'center' }}>Đã Gửi Hướng Dẫn!</h4>
              <p style={{ maxWidth: '320px', fontSize: '13px', color: '#424842', lineHeight: 1.6, marginTop: '8px', textAlign: 'center' }}>
                Vui lòng kiểm tra hòm thư <strong>{email}</strong> để hoàn tất khôi phục mật khẩu tài khoản của bạn.
              </p>
              <button 
                type="button" 
                className={styles.authSubmitBtn} 
                onClick={() => router.push('/sign-in')}
                style={{ marginTop: '24px', width: 'auto', padding: '12px 28px', borderRadius: '8px' }}
              >
                Quay lại Đăng nhập
              </button>
            </div>
          ) : (
            <form className={styles.loginForm} onSubmit={handleForgotSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              
              {/* Lock Icon Section (Stitch Style) */}
              <div style={{ width: '64px', height: '64px', borderRadius: '99px', backgroundColor: 'rgba(141, 170, 145, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '32px', color: '#4a654f' }}>lock</span>
              </div>
              
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', fontWeight: 600, color: '#1a1c1a', margin: '0 0 8px 0', textAlign: 'center' }}>Khôi phục mật khẩu</h2>
              
              <p style={{ fontSize: '13px', lineHeight: 1.6, color: '#424842', textAlign: 'center', margin: '0 0 24px 0', padding: '0 8px' }}>
                Đừng lo lắng, hãy nhập email bạn đã đăng ký. Chúng tôi sẽ gửi một liên kết để bạn đặt lại mật khẩu mới.
              </p>

              <div className={styles.authFormFields} style={{ width: '100%' }}>
                
                {/* EMAIL FIELD */}
                <div className={styles.authAnimateField1} style={{ width: '100%' }}>
                  <label className={styles.authSplitLabel} htmlFor="email" style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', color: '#1a1c1a', marginBottom: '8px', display: 'block', textAlign: 'left' }}>EMAIL ĐĂNG KÝ</label>
                  <div className={styles.loginInputWrapper}>
                    <span className="material-symbols-outlined">mail</span>
                    <input
                      type="email"
                      id="email"
                      placeholder="email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      style={{ borderRadius: '8px', backgroundColor: '#faf9f6', paddingLeft: '48px', width: '100%', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

              </div>

              {/* REGISTER SUBMIT BUTTON */}
              <button 
                type="submit" 
                className={`${styles.authSubmitBtn} ${styles.authAnimateField2}`} 
                disabled={isLoading}
                style={{ marginTop: '24px', borderRadius: '8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}
              >
                {isLoading ? (
                  <div className={styles.loginSpinner}></div>
                ) : (
                  <>
                    <span>Gửi liên kết khôi phục</span>
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_right_alt</span>
                  </>
                )}
              </button>

              {/* ROUTE REDIRECT BACK */}
              <div className={`${styles.loginFooter} ${styles.authAnimateField3}`} style={{ marginTop: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <button 
                  type="button" 
                  onClick={() => router.push('/sign-in')}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600', color: '#6b5c4c', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.2s ease' }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_back</span>
                  <span>Quay lại đăng nhập</span>
                </button>
              </div>

            </form>
          )}
        </div>

        {/* Centralized Brand Footer */}
        <footer style={{ marginTop: '24px', textAlign: 'center' }}>
          <p style={{ fontSize: '12px', color: '#737972', margin: 0 }}>
            © 2024 Tiệm Nhà Zịt CRM - Handcrafted with Love
          </p>
        </footer>
      </div>
    </div>
  );
}
