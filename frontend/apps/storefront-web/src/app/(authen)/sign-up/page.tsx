'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../../shared/styles/page.module.scss';
import StorefrontShell from '../../../widgets/layout/ui/StorefrontShell';

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
    <StorefrontShell activeView="login">
      <div className={styles.loginContainer} style={{ minHeight: 'calc(100vh - 180px)' }}>
        <div className={styles.authSplitCard}>
          {/* LEFT COLUMN: AMBIENT VISUAL BANNER */}
          <div className={styles.authSplitVisual}>
            <img 
              src="https://lh3.googleusercontent.com/aida/ADBb0uhvpx8zRyIkiRxiqR5TYKu0lVSNibzq_zBeQve0TTm-3dGQykEsnaiMfNG28NfXDihyTrMyl6A2rbAVvVNpQYYub2wts4h-7flmo59K_0jpzXdRFc3nPKLRS7QHxhbpTpd4IHhseUNkyV9C3eQLjjehIQH_5tBzOo7mizGcWa-NN3GGSSPH9y1g0i1TK33ziyq9WBZ5UBC3ykeVjMxhk_rPmyfdfacFbtu-YmQKdTXA0E45BVE3QdM4v1f7"
              alt="Knitting yarn artisan detailing"
              className={styles.authVisualImg}
            />
            <div className={styles.authVisualOverlay}></div>
            <div className={styles.authVisualText}>
              <h3>Gói trọn tình yêu</h3>
              <p>Mỗi mũi đan là một câu chuyện, mỗi sản phẩm là một tâm tình từ đôi bàn tay nghệ nhân.</p>
            </div>
          </div>

          {/* RIGHT COLUMN: DETAILED SIGN-UP FORM */}
          <div className={styles.authSplitForm}>
            <div className={styles.authSplitHeader}>
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
                  <div>
                    <label className={styles.authSplitLabel} htmlFor="fullName">Họ và tênLabel</label>
                    <input
                      type="text"
                      id="fullName"
                      placeholder="Nguyễn Văn A"
                      className={styles.authSplitInput}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  {/* EMAIL FIELD */}
                  <div>
                    <label className={styles.authSplitLabel} htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      placeholder="email@example.com"
                      className={styles.authSplitInput}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  {/* PASSWORD & CONFIRM PASSWORD COLUMN */}
                  <div className={styles.authPasswordRow}>
                    <div>
                      <label className={styles.authSplitLabel} htmlFor="password">Mật khẩu</label>
                      <input
                        type="password"
                        id="password"
                        placeholder="••••••••"
                        className={styles.authSplitInput}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className={styles.authSplitLabel} htmlFor="confirmPass">Xác nhận</label>
                      <input
                        type="password"
                        id="confirmPass"
                        placeholder="••••••••"
                        className={styles.authSplitInput}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                </div>

                {/* AGREEMENT CHECKBOX */}
                <div className={styles.loginFormActions} style={{ margin: '8px 0 0 0' }}>
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

                {/* REGISTER SUBMIT BUTTON */}
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
              </form>
            )}

            {/* SOCIAL DIVER & REGISTER */}
            <div className={styles.loginSocialGroup}>
              <div className={styles.loginDivider}>
                <div className={styles.line}></div>
                <span>HOẶC</span>
                <div className={styles.line}></div>
              </div>

              <div className={styles.loginSocialButtons}>
                <button
                  type="button"
                  className={styles.loginSocialBtn}
                  onClick={() => alert('Liên kết tài khoản Google...')}
                  style={{ borderRadius: '8px', padding: '12px' }}
                >
                  <img src="https://lh3.googleusercontent.com/COxitlgo438w4817x5g8w4817x5g8w4817x5g8w4817x5g8w4817x5g8w4817=s48" alt="" style={{ width: '16px', height: '16px', display: 'none' }} />
                  <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#ea4335' }}>globe</span>
                  Google
                </button>
                <button
                  type="button"
                  className={styles.loginSocialBtn}
                  onClick={() => alert('Liên kết tài khoản Facebook...')}
                  style={{ borderRadius: '8px', padding: '12px' }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#1877f2' }}>facebook</span>
                  Facebook
                </button>
              </div>
            </div>

            {/* ROUTE REDIRECT BACK */}
            <div className={styles.loginFooter} style={{ marginTop: '8px' }}>
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
    </StorefrontShell>
  );
}
