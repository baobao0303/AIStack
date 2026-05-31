import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CrmApiService } from '../../core/services/crm-api.service';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="inventory-container">
      <!-- Warnings and Threshold Setup Panel -->
      <section class="threshold-setup-bar crm-card">
        <div class="setup-desc">
          <h3 style="color: var(--color-primary); font-size: 18px;">Quản lý kho hàng thời gian thực</h3>
          <p style="font-size: 13px; color: var(--color-text-muted);">
            Giám sát số lượng tồn kho vật lý (Physical), số lượng đang giữ tạm (Reserved) và lượng khả dụng thực tế (Available)
          </p>
        </div>
        <div class="threshold-controls">
          <label for="warning-threshold">Cảnh báo mức tồn kho thấp:</label>
          <div style="display: flex; align-items: center; gap: 8px;">
            <input id="warning-threshold" type="number" class="form-control" style="width: 70px;" [(ngModel)]="warningThreshold" />
            <span>cái</span>
          </div>
        </div>

      </section>

      <!-- Inventory Grid -->
      <section class="crm-table-container" style="margin-top: 24px;">
        <table class="crm-table">
          <thead>
            <tr>
              <th>Ảnh</th>
              <th>Tên sản phẩm len</th>
              <th>Mã SKU</th>
              <th style="width: 150px;">Tổng kho (Physical)</th>
              <th style="width: 150px;">Tạm giữ (Reserved)</th>
              <th style="width: 150px;">Khả dụng (Available)</th>
              <th style="text-align: right; width: 220px;">Cập nhật nhanh</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngIf="loading">
              <td colspan="7" style="text-align: center; padding: 30px; color: var(--color-text-muted);">
                Đang nạp dữ liệu kiểm kho...
              </td>
            </tr>
            <tr *ngFor="let p of products">
              <td class="img-col">
                <img [src]="p.imageUrl" alt="" class="prod-thumb" />
              </td>
              <td>
                <div style="font-weight: 600;">{{ p.name }}</div>
                <div style="font-size: 11px; color: var(--color-text-muted)">{{ p.woolType }}</div>
              </td>
              <td><code>{{ p.sku || 'SKU-000' }}</code></td>
              <td>
                <strong [style.color]="p.inventoryStock === 0 ? 'var(--color-error)' : 'var(--color-text-main)'">
                  {{ p.inventoryStock }}
                </strong>
              </td>
              <td>
                <span style="color: var(--color-text-muted); font-weight: 500;">
                  {{ p.reservedStock }}
                </span>
              </td>
              <td>
                <span class="badge" 
                      [class.badge-success]="p.availableStock > warningThreshold" 
                      [class.badge-warning]="p.availableStock <= warningThreshold && p.availableStock > 0"
                      [class.badge-danger]="p.availableStock === 0">
                  {{ p.availableStock }} cái {{ p.availableStock <= warningThreshold ? '(Thấp!)' : '' }}
                </span>
              </td>
              <td style="text-align: right;">
                <div class="adjustment-input-group">
                  <input type="number" class="form-control adj-input" [(ngModel)]="p.tempStock" placeholder="Số lượng..." />
                  <button class="btn btn-primary btn-sm" (click)="updateStock(p)">Lưu</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  `,
  styles: [`
    .threshold-setup-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 24px;
      gap: 16px;
    }
    
    .threshold-controls {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 14px;
      font-weight: 600;
      color: var(--color-text-muted);
    }
    
    .img-col {
      width: 60px;
      
      .prod-thumb {
        width: 40px;
        height: 40px;
        border-radius: var(--radius-sm);
        object-fit: cover;
        border: 1px solid var(--color-border);
      }
    }

    .adjustment-input-group {
      display: flex;
      align-items: center;
      gap: 8px;
      justify-content: flex-end;
      
      .adj-input {
        width: 80px;
        text-align: center;
      }
    }
  `]
})
export class InventoryComponent implements OnInit {
  products: any[] = [];
  loading = false;
  warningThreshold = 5;

  constructor(private apiService: CrmApiService) {}

  ngOnInit() {
    this.loadInventoryData();
  }

  loadInventoryData() {
    this.loading = true;
    this.apiService.getProducts().subscribe({
      next: (res) => {
        const items = res.items || [];
        this.products = [];

        // Loop and load real-time stock profiles for each product
        items.forEach((p: any) => {
          const item: any = {
            id: p.id,
            name: p.name,
            sku: p.sku || 'SKU-' + Math.floor(Math.random() * 1000000),
            woolType: p.woolType || '100% Cotton',
            imageUrl: p.imageUrl,
            inventoryStock: p.inventoryStock !== undefined ? p.inventoryStock : 10,
            reservedStock: 0,
            availableStock: p.inventoryStock !== undefined ? p.inventoryStock : 10,
            tempStock: p.inventoryStock !== undefined ? p.inventoryStock : 10
          };
          
          this.products.push(item);
          
          // Call API endpoint to load precise reserved stock details
          this.apiService.getInventory(p.id).subscribe({
            next: (inv) => {
              item.inventoryStock = inv.inventoryStock;
              item.reservedStock = inv.reservedStock;
              item.availableStock = inv.availableStock;
              item.tempStock = inv.inventoryStock;
            }
          });
        });
        
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  updateStock(p: any) {
    if (p.tempStock === undefined || p.tempStock === null || p.tempStock < 0) {
      alert('Số lượng tồn kho không được âm hoặc để trống!');
      return;
    }

    this.apiService.updateInventory(p.id, p.tempStock).subscribe({
      next: () => {
        alert(`Đã cập nhật tồn kho vật lý của ${p.name} thành ${p.tempStock} cái!`);
        this.loadInventoryData();
      }
    });
  }
}
