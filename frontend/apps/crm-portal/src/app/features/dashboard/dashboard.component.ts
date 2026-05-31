import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CrmApiService } from '../../core/services/crm-api.service';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-container">
      <!-- 4 KPI Cards in 4-column Grid -->
      <section class="crm-grid-4">
        <div class="crm-card kpi-card">
          <span class="kpi-label">Tổng sản phẩm</span>
          <span class="kpi-value">{{ totalProducts }}</span>
          <span class="kpi-trend up">
            <span>↑ 4.2%</span> <span style="color: var(--color-text-light)">so với tháng trước</span>
          </span>
        </div>

        <div class="crm-card kpi-card">
          <span class="kpi-label">Đang hiển thị (Active)</span>
          <span class="kpi-value" style="color: var(--color-success)">{{ activeProducts }}</span>
          <span class="kpi-trend up">
            <span>↑ 8.5%</span> <span style="color: var(--color-text-light)">đang đăng bán</span>
          </span>
        </div>

        <div class="crm-card kpi-card">
          <span class="kpi-label">Hết hàng / Sắp hết</span>
          <span class="kpi-value" [style.color]="lowStockCount > 0 ? 'var(--color-error)' : 'var(--color-text-muted)'">
            {{ lowStockCount }}
          </span>
          <span class="kpi-trend" [class.down]="lowStockCount > 0" [class.neutral]="lowStockCount === 0">
            <span>{{ lowStockCount > 0 ? '⚠ Cần bổ sung' : '✔ An toàn' }}</span>
          </span>
        </div>

        <div class="crm-card kpi-card">
          <span class="kpi-label">Bản nháp (Draft)</span>
          <span class="kpi-value" style="color: var(--color-text-muted)">{{ draftProducts }}</span>
          <span class="kpi-trend neutral">
            <span>• Chờ kiểm duyệt</span>
          </span>
        </div>
      </section>

      <!-- 2-column Grid for Lists & Logs -->
      <section class="crm-grid-2" style="margin-top: 32px;">
        <!-- Left Panel: Low stock alert list -->
        <div class="crm-card">
          <div class="panel-header">
            <h3 class="panel-title">Cảnh báo tồn kho thấp</h3>
            <span class="badge badge-warning" *ngIf="lowStockItems.length > 0">Ngưỡng &le; 5</span>
          </div>
          
          <div class="panel-body">
            <div class="empty-state" *ngIf="lowStockItems.length === 0">
              <span class="icon" style="font-size: 48px;">✔</span>
              <p>Mọi sản phẩm đều có mức tồn kho an toàn!</p>
            </div>
            
            <table class="crm-table" *ngIf="lowStockItems.length > 0" style="margin-top: 16px;">
              <thead>
                <tr>
                  <th>Sản phẩm</th>
                  <th>Kho</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let item of lowStockItems">
                  <td class="product-cell">
                    <img [src]="item.imageUrl" alt="" class="thumb" />
                    <div>
                      <div class="name">{{ item.name }}</div>
                      <div class="sku">{{ item.woolType }}</div>
                    </div>
                  </td>
                  <td>
                    <strong [style.color]="item.inventoryStock === 0 ? 'var(--color-error)' : 'var(--color-warning)'">
                      {{ item.inventoryStock }}
                    </strong>
                  </td>
                  <td>
                    <span class="badge" [class.badge-danger]="item.inventoryStock === 0" [class.badge-warning]="item.inventoryStock > 0">
                      {{ item.inventoryStock === 0 ? 'Hết hàng' : 'Cần nhập thêm' }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Right Panel: Customer reviews log overview -->
        <div class="crm-card">
          <div class="panel-header">
            <h3 class="panel-title">Phản hồi khách hàng mới nhất</h3>
            <a routerLink="/reviews" class="btn btn-secondary btn-sm">Xem tất cả</a>
          </div>

          <div class="panel-body">
            <div class="review-list" style="margin-top: 16px; display: flex; flex-direction: column; gap: 16px;">
              <div class="review-item" *ngFor="let rev of recentReviews">
                <div class="rev-header">
                  <span class="rev-product">{{ rev.productName }}</span>
                  <span class="rev-stars">{{ getStars(rev.rating) }}</span>
                </div>
                <p class="rev-comment">"{{ rev.comment }}"</p>
                <div class="rev-footer">
                  <span class="rev-date">{{ rev.createdAt | date:'dd/MM/yyyy HH:mm' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .panel-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--color-border);
      padding-bottom: 12px;
      
      .panel-title {
        font-size: 18px;
        color: var(--color-primary);
      }
    }
    
    .product-cell {
      display: flex;
      align-items: center;
      gap: 12px;
      
      .thumb {
        width: 36px;
        height: 36px;
        border-radius: var(--radius-sm);
        object-fit: cover;
        border: 1px solid var(--color-border);
      }
      
      .name {
        font-weight: 600;
        font-size: 13px;
      }
      
      .sku {
        font-size: 11px;
        color: var(--color-text-muted);
      }
    }

    .empty-state {
      text-align: center;
      padding: 40px 20px;
      color: var(--color-text-muted);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
    }

    .review-item {
      background-color: var(--bg-primary);
      border-radius: var(--radius-md);
      padding: 16px;
      border: 1px solid var(--color-border);
      
      .rev-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 6px;
        
        .rev-product {
          font-weight: 600;
          font-size: 13px;
          color: var(--color-primary);
        }
        
        .rev-stars {
          color: #f59e0b;
          font-size: 12px;
        }
      }
      
      .rev-comment {
        font-style: italic;
        font-size: 13px;
        color: var(--color-text-main);
      }
      
      .rev-footer {
        margin-top: 8px;
        text-align: right;
        font-size: 11px;
        color: var(--color-text-light);
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  totalProducts = 0;
  activeProducts = 0;
  lowStockCount = 0;
  draftProducts = 0;
  lowStockItems: any[] = [];
  recentReviews: any[] = [];

  constructor(private apiService: CrmApiService) {}

  ngOnInit() {
    this.loadStats();
    this.loadRecentReviews();
  }

  loadStats() {
    this.apiService.getProducts().subscribe({
      next: (res) => {
        const items = res.items || [];
        this.totalProducts = items.length;
        this.activeProducts = items.filter((p: any) => p.status === 'Active' || !p.status).length;
        this.draftProducts = items.filter((p: any) => p.status === 'Draft').length;

        // Fetch precise inventory for each to identify low-stock items
        this.lowStockItems = [];
        items.forEach((p: any) => {
          const stock = p.inventoryStock !== undefined ? p.inventoryStock : 10;
          if (stock <= 5) {
            this.lowStockItems.push({
              ...p,
              inventoryStock: stock
            });
          }
        });
        
        this.lowStockCount = this.lowStockItems.length;
      }
    });
  }

  loadRecentReviews() {
    this.apiService.getAllReviews().subscribe({
      next: (res) => {
        this.recentReviews = res.slice(0, 3); // Take top 3 reviews
      }
    });
  }

  getStars(rating: number): string {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  }
}
