'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Footer from '../../widgets/footer/ui/Footer';
import { useScrollReveal } from '../../shared/lib/useScrollReveal';
import { useViewNavigation } from '../../shared/lib/useViewNavigation';
import globalStyles from '../../shared/styles/page.module.scss';
import authStyles from './auth.module.scss';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const handleActiveViewChange = useViewNavigation();

  // Dynamically map pathname to Action Title
  const getActionTitle = () => {
    if (pathname.includes('/sign-in')) return 'Đăng nhập';
    if (pathname.includes('/sign-up')) return 'Đăng ký';
    if (pathname.includes('/forgot-password')) return 'Khôi phục mật khẩu';
    return 'Xác thực';
  };

  // Bind scroll reveal animations (matches Home page triggers)
  useScrollReveal(globalStyles.isVisible, [pathname]);
  return (
    <div className="flex flex-col min-h-screen overflow-y-auto overflow-x-hidden bg-white w-full box-border">
      {/* 2. MAIN SPLIT SECTION */}
      <main className="min-h-[calc(100vh-72px)] max-md:min-h-[calc(100vh-64px)] bg-gradient-to-br from-sage-light to-ivory flex items-center justify-center p-10 max-[991px]:px-4 max-[991px]:py-5 box-border relative overflow-hidden">
        {/* Decorative corner glows */}
        <div className="absolute top-0 -left-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-sage/10 to-transparent blur-[120px] pointer-events-none z-[1] -translate-y-1/4"></div>
        <div className="absolute bottom-0 -right-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-sage/10 to-transparent blur-[120px] pointer-events-none z-[1] translate-y-1/4"></div>
        <div className="absolute inset-0 opacity-[0.01] pointer-events-none bg-[radial-gradient(#1a1c1a_1px,transparent_1px)] bg-[size:24px_24px] z-[2]"></div>

        <div className="w-full max-w-[1100px] h-full grid grid-cols-[1.15fr_1fr] gap-12 items-center z-[5] max-[991px]:grid-cols-1 max-[991px]:gap-0">
          {/* Left Column: Visual building/yarn shot */}
          <div className="relative w-full h-full max-h-[480px] rounded-2xl overflow-hidden shadow-[0_20px_40px_rgba(74,101,79,0.06)] bg-white flex flex-col justify-end max-[991px]:hidden">
            <img
              alt="Organic Crafting Studio backdrop"
              className={`w-full h-full object-cover object-[center_40%] absolute top-0 left-0 transition-transform duration-[1200ms] cubic-bezier(0.16,1,0.3,1) hover:scale-[1.03] ${authStyles.authAnimateImg}`}
              src="https://lh3.googleusercontent.com/aida/ADBb0ujF9EIkF5XOFy216NOg8aknzCdm9ueX3Jyuk-ITk6aFQPVlAN_EU6vUUhkgarLmQe7R3C-xkwozhAookNyvYAQyZX67D3rN7f3HIcEXA58aDlf3ZFe9LjxO5256k6tuxJ2uG2O8DZJBd6uHISR4G4stSq-Hil1q-xI7XxSQx6M_jMG91kaSkDLpOJPbqB4N2w5JSU1bgNbqRsl0D1fqOPGSW9zaCBPvG9e0EVpajr99p8Bx5Pdt6s2gW424"
            />
            {/* Visual overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-sage/70 via-charcoal/10 to-transparent pointer-events-none z-[1]"></div>
            {/* Overlay description text */}
            <div className="absolute bottom-10 left-10 right-10 text-white font-sans z-[2]">
              <div className="mb-3 opacity-85">
                <span className="material-symbols-outlined text-[32px] text-white">format_quote</span>
              </div>
              <h3 className="font-playfair text-[26px] leading-[1.3] font-bold m-0 mb-2.5 [text-shadow:0_2px_4px_rgba(0,0,0,0.15)]">Gói trọn tình yêu thương.</h3>
              <p className="text-xs leading-relaxed text-white/90 italic font-light">
                — Mỗi sản phẩm thủ công tại Tiệm Nhà Zịt không chỉ là vật dụng, mà còn là một câu chuyện về sự tỉ mỉ và tâm huyết của người nghệ nhân.
              </p>
            </div>
          </div>

          {/* Right Column: Dynamic Form card wrapper */}
          <div className={`w-full max-h-full bg-white rounded-2xl p-8 max-sm:p-4 border border-customBorder/15 shadow-[0_20px_50px_rgba(74,101,79,0.06)] overflow-y-auto box-border ${authStyles.authCardContainer}`}>
            {children}
          </div>
        </div>
      </main>

      {/* 3. CORPORATE SHARED FOOTER SECTION (Rendered exactly like the Home page footer) */}
      <Footer styles={globalStyles} setActiveView={handleActiveViewChange} />
    </div>
  );
}
