import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CrmApiService } from '../../core/services/crm-api.service';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="reviews-container">
      <!-- Rating Filters Panel -->
      <section class="filters-panel crm-card">
        <div style="display: flex; flex-direction: column; gap: 4px;">
          <h3 style="color: var(--color-primary); font-size: 18px;">Kiểm duyệt đánh giá khách hàng</h3>
          <p style="font-size: 13px; color: var(--color-text-muted);">
            Theo dõi, ẩn hoặc hiện các phản hồi của người mua đối với sản phẩm đồ len handmade trên storefront
          </p>
        </div>
        <div class="stars-filter">
          <span style="font-size: 13px; font-weight: 600; color: var(--color-text-muted);">Lọc theo số sao:</span>
          <div class="chips-group">
            <button class="filter-chip" [class.active]="activeFilter === 0" (click)="setFilter(0)">Tất cả</button>
            <button class="filter-chip" [class.active]="activeFilter === 5" (click)="setFilter(5)">5 ★</button>
            <button class="filter-chip" [class.active]="activeFilter === 4" (click)="setFilter(4)">4 ★</button>
            <button class="filter-chip" [class.active]="activeFilter === 3" (click)="setFilter(3)">3 ★</button>
            <button class="filter-chip" [class.active]="activeFilter === 2" (click)="setFilter(2)">2 ★</button>
            <button class="filter-chip" [class.active]="activeFilter === 1" (click)="setFilter(1)">1 ★</button>
          </div>
        </div>
      </section>

      <!-- Reviews list table -->
      <section class="crm-table-container" style="margin-top: 24px;">
        <table class="crm-table">
          <thead>
            <tr>
              <th>Sản phẩm</th>
              <th style="width: 140px;">Đánh giá</th>
              <th>Ý kiến khách hàng</th>
              <th style="width: 150px;">Thời gian</th>
              <th style="width: 130px;">Trạng thái</th>
              <th style="text-align: right; width: 180px;">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngIf="loading">
              <td colspan="6" style="text-align: center; padding: 30px; color: var(--color-text-muted);">
                Đang đọc danh sách phản hồi từ hệ thống...
              </td>
            </tr>
            <tr *ngIf="!loading && filteredReviews.length === 0">
              <td colspan="6" style="text-align: center; padding: 30px; color: var(--color-text-muted);">
                Chưa có phản hồi nào phù hợp với bộ lọc số sao.
              </td>
            </tr>
            <tr *ngFor="let r of filteredReviews">
              <td><strong>{{ r.productName }}</strong></td>
              <td>
                <span class="stars-display">{{ getStars(r.rating) }}</span>
              </td>
              <td>
                <span class="comment-text">"{{ r.comment }}"</span>
              </td>
              <td>
                <span style="font-size: 13px; color: var(--color-text-muted);">
                  {{ r.createdAt | date:'dd/MM/yyyy HH:mm' }}
                </span>
              </td>
              <td>
                <span class="badge" [class.badge-success]="r.approved !== false" [class.badge-danger]="r.approved === false">
                  {{ r.approved !== false ? 'Hiển thị' : 'Đã ẩn' }}
                </span>
              </td>
              <td style="text-align: right;">
                <div class="actions-group">
                  <button 
                    *ngIf="r.approved !== false" 
                    class="btn btn-danger btn-sm" 
                    (click)="toggleModeration(r)"
                  >
                    Ẩn ý kiến
                  </button>
                  <button 
                    *ngIf="r.approved === false" 
                    class="btn btn-secondary btn-sm" 
                    (click)="toggleModeration(r)"
                  >
                    Duyệt hiển thị
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  `,
  styles: [`
    .filters-panel {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 16px 24px;
    }
    
    .stars-filter {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .chips-group {
      display: flex;
      gap: 8px;
    }
    
    .filter-chip {
      background-color: var(--bg-primary);
      border: 1px solid var(--color-border);
      padding: 6px 12px;
      border-radius: var(--radius-full);
      font-size: 13px;
      cursor: pointer;
      font-weight: 500;
      color: var(--color-text-muted);
      transition: var(--transition-smooth);
      
      &:hover {
        background-color: var(--color-primary-light);
        color: var(--color-primary);
      }
      
      &.active {
        background-color: var(--color-primary);
        color: white;
        border-color: var(--color-primary);
      }
    }
    
    .stars-display {
      color: #f59e0b;
      font-weight: bold;
      letter-spacing: 1px;
    }
    
    .comment-text {
      font-style: italic;
      font-size: 14px;
      color: var(--color-text-main);
    }
    
    .actions-group {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }
  `]
})
export class ReviewsComponent implements OnInit {
  reviews: any[] = [];
  filteredReviews: any[] = [];
  loading = false;
  activeFilter = 0; // 0 = All

  constructor(private apiService: CrmApiService) {}

  ngOnInit() {
    this.loadReviewsData();
  }

  loadReviewsData() {
    this.loading = true;
    this.apiService.getAllReviews().subscribe({
      next: (res) => {
        this.reviews = res;
        this.applyFilter();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  setFilter(stars: number) {
    this.activeFilter = stars;
    this.applyFilter();
  }

  applyFilter() {
    if (this.activeFilter === 0) {
      this.filteredReviews = [...this.reviews];
    } else {
      this.filteredReviews = this.reviews.filter(r => r.rating === this.activeFilter);
    }
  }

  getStars(rating: number): string {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  }

  toggleModeration(r: any) {
    r.approved = r.approved === false ? true : false;
    alert(`Đã ${r.approved ? 'phê duyệt hiển thị' : 'ẩn'} phản hồi của khách hàng đối với ${r.productName}!`);
    this.applyFilter();
  }
}
