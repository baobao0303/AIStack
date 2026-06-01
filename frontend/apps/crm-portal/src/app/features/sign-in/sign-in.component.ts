import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="crm-auth-container">
      <!-- Left Panel: Cinematic high-end craft imagery overlay -->
      <section class="crm-auth-visual-side">
        <h1 class="auth-brand-serif">Tiệm Nhà Zịt</h1>
        <p class="auth-brand-desc">
          Bảng điều khiển quản trị trung tâm dành cho các nghệ nhân chế tác sợi len hữu cơ và thêu thủ công cao cấp. Chào mừng bạn quay trở lại xưởng sáng tạo!
        </p>
      </section>

      <!-- Right Panel: Standard Double Bezel authentication Form -->
      <section class="crm-auth-form-side">
        <div class="crm-auth-tray">
          <div class="crm-auth-card">
            <header class="auth-header">
              <h2 class="auth-title">Đăng nhập Portal</h2>
              <p class="auth-subtitle">Cổng quản trị CRM nội bộ Tiệm Nhà Zịt</p>
            </header>

            <!-- Error alert using monoline warning symbol -->
            <div class="auth-error-alert" *ngIf="errorMsg">
              <span class="material-symbols-outlined">warning</span>
              <span>{{ errorMsg }}</span>
            </div>

            <form (ngSubmit)="onSubmit()" #loginForm="ngForm" autocomplete="off">
              <!-- Email Input (Concentric squircle border fields) -->
              <div class="crm-auth-input-group">
                <label for="email" class="input-label">
                  <span class="material-symbols-outlined">mail</span>
                  <span>Email nghệ nhân</span>
                </label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  class="form-control-accent"
                  placeholder="admin@tiemnhazit.com"
                  [(ngModel)]="email"
                  required
                  #emailInput="ngModel"
                />
              </div>

              <!-- Password Input -->
              <div class="crm-auth-input-group" style="margin-top: 24px;">
                <label for="password" class="input-label">
                  <span class="material-symbols-outlined">lock</span>
                  <span>Mật khẩu bảo mật</span>
                </label>
                <input 
                  type="password" 
                  id="password" 
                  name="password" 
                  class="form-control-accent"
                  placeholder="••••••••"
                  [(ngModel)]="password"
                  required
                  #passwordInput="ngModel"
                />
              </div>

              <!-- Submit button with nested circular kinetics -->
              <button 
                type="submit" 
                class="btn-auth-submit"
                [disabled]="isLoading || !loginForm.form.valid"
              >
                <span>{{ isLoading ? 'Đang xác thực...' : 'Đăng nhập vào Portal' }}</span>
                <span class="btn-icon-bubble">
                  <span class="material-symbols-outlined">arrow_forward</span>
                </span>
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  `
})
export class SignInComponent implements OnInit {
  email = '';
  password = '';
  errorMsg: string | null = null;
  isLoading = false;
  private returnUrl = '/';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Lock the return URL parameters to redirect appropriately upon successful sign in
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    
    // Redirect immediately if already logged in
    if (this.authService.isAuthenticated()) {
      this.router.navigate([this.returnUrl]);
    }
  }

  onSubmit(): void {
    if (this.isLoading || !this.email || !this.password) return;

    this.isLoading = true;
    this.errorMsg = null;

    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.isLoading = false;
        console.log('[CRM Auth] Login succeeded, navigating to:', this.returnUrl);
        this.router.navigateByUrl(this.returnUrl);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('[CRM Auth] Authentication error:', err);
        
        if (err.status === 401) {
          this.errorMsg = 'Email hoặc mật khẩu bảo mật không chính xác.';
        } else if (err.status === 429) {
          this.errorMsg = 'Quá nhiều yêu cầu đăng nhập sai liên tục. Vui lòng thử lại sau.';
        } else {
          this.errorMsg = 'Kết nối API máy chủ thất bại. Vui lòng kiểm tra lại đường truyền.';
        }
      }
    });
  }
}
