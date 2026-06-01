import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CrmApiService } from '../services/crm-api.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="crm-layout">
      <!-- Sidebar Panel -->
      <aside class="crm-sidebar">
        <div class="crm-logo-section">
          <div class="logo-title">Tiệm Nhà Zịt</div>
          <div class="logo-subtitle">CRM Portal</div>
        </div>

        <nav class="crm-nav-menu">
          <li class="crm-nav-item" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
            <a routerLink="/dashboard">
              <span class="material-symbols-outlined">dashboard</span>
              <span>Tổng quan</span>
            </a>
          </li>
          <li class="crm-nav-item" routerLinkActive="active">
            <a routerLink="/products">
              <span class="material-symbols-outlined">yard</span>
              <span>Sản phẩm</span>
            </a>
          </li>
          <li class="crm-nav-item" routerLinkActive="active">
            <a routerLink="/categories">
              <span class="material-symbols-outlined">folder</span>
              <span>Danh mục</span>
            </a>
          </li>
          <li class="crm-nav-item" routerLinkActive="active">
            <a routerLink="/inventory">
              <span class="material-symbols-outlined">inventory_2</span>
              <span>Tồn kho</span>
            </a>
          </li>
          <li class="crm-nav-item" routerLinkActive="active">
            <a routerLink="/reviews">
              <span class="material-symbols-outlined">star</span>
              <span>Đánh giá</span>
            </a>
          </li>
        </nav>

        <!-- User profile panel -->
        <div class="crm-user-panel">
          <div class="avatar">A</div>
          <div class="user-info">
            <span class="name">Admin Zịt</span>
            <span class="role">Super Admin</span>
          </div>
        </div>
      </aside>

      <!-- Main Layout Body -->
      <main class="crm-main-content">
        <header class="crm-header">
          <div>
            <h1 class="page-title">{{ getPageTitle() }}</h1>
          </div>
          
          <!-- Search box with auto suggestions -->
          <div class="suggestions-container" style="width: 320px;">
            <input 
              type="text" 
              class="form-control" 
              placeholder="Tìm gợi ý sản phẩm..."
              [(ngModel)]="searchQuery"
              (input)="onSearchInput()"
              (blur)="hideSuggestions()"
            />
            <ul class="suggestions-dropdown" *ngIf="suggestions.length > 0">
              <li *ngFor="let suggestion of suggestions" (mousedown)="selectSuggestion(suggestion)" style="display: flex; align-items: center; gap: 8px; padding: 10px 14px; cursor: pointer;">
                <span class="material-symbols-outlined" style="font-size: 16px; color: var(--color-text-muted);">search</span>
                <span>{{ suggestion }}</span>
              </li>
            </ul>
          </div>
        </header>

        <!-- Dynamic Child Pages -->
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .page-title {
      font-size: 28px;
      color: var(--color-primary);
    }
  `]
})
export class LayoutComponent {
  searchQuery = '';
  suggestions: string[] = [];

  constructor(private router: Router, private apiService: CrmApiService) {}

  getPageTitle(): string {
    const url = this.router.url;
    if (url.includes('/dashboard')) return 'Bảng điều khiển';
    if (url.includes('/products')) return 'Quản lý Sản phẩm';
    if (url.includes('/categories')) return 'Quản lý Danh mục';
    if (url.includes('/inventory')) return 'Quản lý Tồn kho';
    if (url.includes('/reviews')) return 'Kiểm duyệt Đánh giá';
    return 'Cổng quản trị CRM';
  }

  onSearchInput() {
    if (this.searchQuery.trim().length < 1) {
      this.suggestions = [];
      return;
    }
    this.apiService.getProductSuggestions(this.searchQuery).subscribe({
      next: (res) => {
        this.suggestions = res || [];
      },
      error: () => {
        // Handle gracefully, offline/fallback mock data
        const sampleSuggestions = ['Calcifer', 'Calcifer Blue', 'Móc khóa Totoro', 'Áo len Merino'];
        this.suggestions = sampleSuggestions.filter(s => 
          s.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }
    });
  }

  selectSuggestion(suggestion: string) {
    this.searchQuery = suggestion;
    this.suggestions = [];
    // Redirect to products page and filter by suggestion
    this.router.navigate(['/products'], { queryParams: { keyword: suggestion } });
  }

  hideSuggestions() {
    setTimeout(() => {
      this.suggestions = [];
    }, 200);
  }
}
