import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CrmApiService } from '../../core/services/crm-api.service';
import { Product } from '@tiem-nha-zit/shared';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="products-container">
      <!-- Search and Filter Bar -->
      <section class="filter-bar crm-card">
        <div class="filters-left">
          <input 
            type="text" 
            class="form-control search-input" 
            placeholder="Tìm kiếm sản phẩm..." 
            [(ngModel)]="filterKeyword"
            (input)="onSearch()"
          />
          
          <select class="form-control filter-select" [(ngModel)]="filterCategory" (change)="onSearch()">
            <option value="">Tất cả phân loại</option>
            <option *ngFor="let cat of categories" [value]="cat.name">{{ cat.name }}</option>
          </select>
        </div>
        
        <button class="btn btn-primary" (click)="openAddModal()">
          <span>+ Thêm Sản Phẩm</span>
        </button>
      </section>

      <!-- Products Grid/Table -->
      <section class="crm-table-container" style="margin-top: 24px;">
        <table class="crm-table">
          <thead>
            <tr>
              <th>Ảnh</th>
              <th>Tên sản phẩm</th>
              <th>Chất liệu len</th>
              <th>Giá</th>
              <th>Tồn kho</th>
              <th>Trạng thái</th>
              <th style="text-align: right;">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngIf="loading">
              <td colspan="7" style="text-align: center; padding: 40px; color: var(--color-text-muted);">
                Đang tải dữ liệu sản phẩm thủ công...
              </td>
            </tr>
            <tr *ngIf="!loading && products.length === 0">
              <td colspan="7" style="text-align: center; padding: 40px; color: var(--color-text-muted);">
                Không tìm thấy sản phẩm len nào phù hợp.
              </td>
            </tr>
            <tr *ngFor="let p of products">
              <td class="img-col">
                <img [src]="p.imageUrl || 'https://images.unsplash.com/photo-1608027828729-2d142435405e'" alt="" class="prod-thumb" />
              </td>
              <td>
                <div class="prod-name">{{ p.name }}</div>
                <div class="prod-sku">SKU: {{ p.sku }}</div>
              </td>
              <td>{{ p.woolType }}</td>
              <td><strong>{{ p.price | number }} đ</strong></td>
              <td>
                <span class="badge" [class.badge-primary]="p.inventoryStock > 5" [class.badge-warning]="p.inventoryStock <= 5 && p.inventoryStock > 0" [class.badge-danger]="p.inventoryStock === 0">
                  {{ p.inventoryStock }} cái
                </span>
              </td>
              <td>
                <span class="badge" [class.badge-success]="p.status === 'Active'" [class.badge-warning]="p.status === 'Draft'" [class.badge-danger]="p.status === 'OutOfStock'" [class.badge-info]="p.status === 'Archived'">
                  {{ getStatusText(p.status) }}
                </span>
              </td>
              <td style="text-align: right;">
                <div class="actions-group">
                  <button 
                    *ngIf="p.status === 'Draft' || p.status === 'Archived'" 
                    class="btn btn-secondary btn-sm" 
                    title="Đăng bán"
                    (click)="publishProduct(p.id)"
                  >
                    🚀 Đăng bán
                  </button>
                  <button 
                    *ngIf="p.status === 'Active'" 
                    class="btn btn-outline btn-sm" 
                    title="Lưu trữ"
                    (click)="archiveProduct(p.id)"
                  >
                    📦 Lưu trữ
                  </button>
                  <button class="btn btn-outline btn-sm" (click)="openEditModal(p)">Sửa</button>
                  <button class="btn btn-danger btn-sm" (click)="deleteProduct(p.id)">Xóa</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- Edit / Create Product Modal -->
      <div class="crm-modal-backdrop" *ngIf="showModal">
        <div class="crm-modal">
          <div class="crm-modal-header">
            <h3>{{ isEditMode ? 'Chỉnh Sửa Sản Phẩm Đồ Len' : 'Thêm Mới Sản Phẩm Thủ Công' }}</h3>
            <button class="close-btn" (click)="closeModal()">&times;</button>
          </div>
          
          <div class="crm-modal-body">
            <form class="product-form">
              <div class="crm-grid-2" style="grid-template-columns: 1fr 1fr; gap: 16px;">
                <div class="form-group">
                  <label for="prod-name">Tên sản phẩm *</label>
                  <input id="prod-name" type="text" class="form-control" [(ngModel)]="formModel.name" name="name" required />
                </div>
                <div class="form-group">
                  <label for="prod-sku">Mã SKU *</label>
                  <input id="prod-sku" type="text" class="form-control" [(ngModel)]="formModel.sku" name="sku" required />
                </div>
              </div>

              <div class="crm-grid-2" style="grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 12px;">
                <div class="form-group">
                  <label for="prod-price">Giá bán (VND) *</label>
                  <input id="prod-price" type="number" class="form-control" [(ngModel)]="formModel.price" name="price" required />
                </div>
                <div class="form-group">
                  <label for="prod-stock">Số lượng tồn kho ban đầu *</label>
                  <input id="prod-stock" type="number" class="form-control" [(ngModel)]="formModel.inventoryStock" name="inventoryStock" required />
                </div>
              </div>

              <div class="crm-grid-2" style="grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 12px;">
                <div class="form-group">
                  <label for="prod-wool">Chất liệu len *</label>
                  <input id="prod-wool" type="text" class="form-control" [(ngModel)]="formModel.woolType" name="woolType" placeholder="Ví dụ: Cotton Milk, Merino" />
                </div>
                <div class="form-group">
                  <label for="prod-category">Danh mục *</label>
                  <select id="prod-category" class="form-control" [(ngModel)]="formModel.categoryId" name="categoryId">
                    <option *ngFor="let cat of categories" [value]="cat.id">{{ cat.name }}</option>
                  </select>
                </div>
              </div>

              <div class="form-group" style="margin-top: 12px;">
                <label for="prod-desc">Mô tả chi tiết</label>
                <textarea id="prod-desc" class="form-control" rows="3" [(ngModel)]="formModel.description" name="description"></textarea>
              </div>

              <!-- Premium Color Tag Generator segment -->
              <div class="form-group" style="margin-top: 12px;">
                <label for="color-picker-input">Bảng màu len (Colors)</label>
                <div class="color-generator-inputs">
                  <input id="color-picker-input" type="text" class="form-control" style="width: 140px;" placeholder="Tên màu..." [(ngModel)]="newColorName" name="newColorName" />
                  <input type="color" class="form-control" style="width: 60px; padding: 2px;" [(ngModel)]="newColorHex" name="newColorHex" aria-label="Chọn màu sắc" />
                  <button type="button" class="btn btn-secondary btn-sm" (click)="addColorChip()">Thêm màu</button>
                </div>
                <div class="colors-chips-list" *ngIf="formModel.colors && formModel.colors.length > 0">
                  <div class="color-chip" *ngFor="let c of formModel.colors; let idx = index" [style.background-color]="c.hex + '15'" [style.border-color]="c.hex">
                    <span class="color-indicator" [style.background-color]="c.hex"></span>
                    <span class="color-chip-text">{{ c.name }}</span>
                    <button type="button" class="remove-chip" (click)="removeColorChip(idx)" aria-label="Xóa màu">&times;</button>
                  </div>
                </div>
              </div>

              <!-- Media Drag & Drop upload section -->
              <div class="form-group" style="margin-top: 12px;">
                <label for="file-upload-input">Ảnh đại diện sản phẩm</label>
                <div class="media-uploader-box">
                  <button type="button" class="upload-trigger" (click)="fileInput.click()">
                    <span class="upload-icon">📷</span>
                    <span class="upload-text">Bấm vào đây để tải ảnh len lên S3</span>
                  </button>
                  <input id="file-upload-input" type="file" #fileInput style="display: none;" (change)="onFileSelected($event)" accept="image/*" />
                  
                  <div class="upload-preview" *ngIf="formModel.imageUrl">
                    <img [src]="formModel.imageUrl" alt="Preview" />
                    <button type="button" class="btn btn-danger btn-sm delete-img" (click)="formModel.imageUrl = ''">Gỡ bỏ</button>
                  </div>
                </div>
                <div class="upload-spinner" *ngIf="uploading">Đang tải tệp hình ảnh lên MinIO S3...</div>
              </div>
            </form>
          </div>
          
          <div class="crm-modal-footer">
            <button class="btn btn-outline" (click)="closeModal()">Hủy</button>
            <button class="btn btn-primary" (click)="saveProduct()">Lưu sản phẩm</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .filter-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 16px 24px;
      
      .filters-left {
        display: flex;
        align-items: center;
        gap: 16px;
        flex: 1;
      }
      
      .search-input {
        max-width: 350px;
      }
      
      .filter-select {
        max-width: 200px;
      }
    }
    
    .img-col {
      width: 60px;
      text-align: center;
      
      .prod-thumb {
        width: 48px;
        height: 48px;
        border-radius: var(--radius-md);
        object-fit: cover;
        border: 1px solid var(--color-border);
      }
    }
    
    .prod-name {
      font-weight: 600;
      color: var(--color-primary);
    }
    
    .prod-sku {
      font-size: 11px;
      color: var(--color-text-muted);
    }

    .actions-group {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }

    // Color Tags Custom Styling
    .color-generator-inputs {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
    }

    .colors-chips-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      padding: 8px;
      background-color: var(--bg-primary);
      border-radius: var(--radius-md);
      border: 1px dashed var(--color-border-accent);
    }

    .color-chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      border-radius: var(--radius-full);
      border: 1px solid;
      font-size: 12px;
      font-weight: 500;
      
      .color-indicator {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        display: inline-block;
        border: 1px solid rgba(0, 0, 0, 0.1);
      }
      
      .color-chip-text {
        color: var(--color-text-main);
      }
    }

    button.remove-chip {
      background: none;
      border: none;
      cursor: pointer;
      color: var(--color-text-light);
      font-weight: 700;
      margin-left: 4px;
      padding: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
      font-size: 14px;
      
      &:hover { color: var(--color-error); }
    }

    // Media Drag Box
    .media-uploader-box {
      border: 2px dashed var(--color-border-accent);
      background-color: var(--bg-primary);
      border-radius: var(--radius-md);
      padding: 16px;
      display: flex;
      align-items: center;
      gap: 20px;
      justify-content: space-between;
    }

    button.upload-trigger {
      background: none;
      border: none;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      cursor: pointer;
      flex: 1;
      text-align: center;
      padding: 12px;
      transition: var(--transition-smooth);
      font-family: inherit;
      color: var(--color-text-muted);
      
      &:hover {
        color: var(--color-primary);
        background-color: var(--color-primary-light);
      }
      
      .upload-icon { font-size: 28px; }
      .upload-text { font-size: 13px; font-weight: 500; }
    }
    
    .upload-preview {
      width: 100px;
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      
      img {
        width: 80px;
        height: 80px;
        border-radius: var(--radius-md);
        object-fit: cover;
        border: 1px solid var(--color-border);
      }
    }

    .upload-spinner {
      margin-top: 6px;
      font-size: 12px;
      color: var(--color-primary);
      font-weight: 500;
      animation: fadeIn 0.3s ease;
    }
  `]
})
export class ProductsComponent implements OnInit {
  products: any[] = [];
  categories: any[] = [];
  loading = false;
  uploading = false;
  
  // Search parameters
  filterKeyword = '';
  filterCategory = '';

  // Modal forms
  showModal = false;
  isEditMode = false;
  formModel: any = this.resetForm();

  // Color generator helpers
  newColorName = '';
  newColorHex = '#4a654f';

  constructor(private apiService: CrmApiService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.loadCategories();
    this.route.queryParams.subscribe(params => {
      if (params['keyword']) {
        this.filterKeyword = params['keyword'];
      }
      this.loadProducts();
    });
  }

  loadCategories() {
    this.apiService.getCategories().subscribe({
      next: (res) => this.categories = res
    });
  }

  loadProducts() {
    this.loading = true;
    const queryParams: any = {};
    if (this.filterKeyword) queryParams.keyword = this.filterKeyword;
    if (this.filterCategory) queryParams.category = this.filterCategory;

    this.apiService.getProducts(queryParams).subscribe({
      next: (res) => {
        const rawItems = res.items || [];
        this.products = rawItems.map((p: any) => ({
          ...p,
          sku: p.sku || 'N/A',
          woolType: p.woolType || '100% Cotton',
          inventoryStock: p.inventoryStock !== undefined ? p.inventoryStock : 10,
          status: p.status || 'Active'
        }));
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  onSearch() {
    this.loadProducts();
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'Active': return 'Đang bán';
      case 'Draft': return 'Bản nháp';
      case 'OutOfStock': return 'Hết hàng';
      case 'Archived': return 'Lưu trữ';
      default: return 'Đang bán';
    }
  }

  resetForm() {
    return {
      name: '',
      sku: '',
      price: 0,
      inventoryStock: 10,
      woolType: '100% Organic Cotton',
      categoryId: 'cat-001',
      description: '',
      imageUrl: '',
      colors: []
    };
  }

  openAddModal() {
    this.isEditMode = false;
    this.formModel = this.resetForm();
    this.showModal = true;
  }

  openEditModal(p: Product) {
    this.isEditMode = true;
    const matchedCategory = this.categories.find(c => c.name === p.category);
    this.formModel = {
      id: p.id,
      name: p.name,
      sku: (p as any).sku || 'SKU-' + Date.now(),
      price: p.price,
      inventoryStock: (p as any).inventoryStock !== undefined ? (p as any).inventoryStock : 10,
      woolType: p.woolType || '100% Cotton',
      categoryId: matchedCategory ? matchedCategory.id : 'cat-001',
      description: p.description || '',
      imageUrl: p.imageUrl,
      colors: p.colors ? [...p.colors] : []
    };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  addColorChip() {
    if (!this.newColorName.trim()) return;
    if (!this.formModel.colors) this.formModel.colors = [];
    this.formModel.colors.push({
      name: this.newColorName.trim(),
      hex: this.newColorHex
    });
    this.newColorName = '';
  }

  removeColorChip(index: number) {
    this.formModel.colors.splice(index, 1);
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (!file) return;

    this.uploading = true;
    this.apiService.uploadImage(file).subscribe({
      next: (res) => {
        this.formModel.imageUrl = res.data;
        this.uploading = false;
      },
      error: () => {
        this.uploading = false;
      }
    });
  }

  saveProduct() {
    if (!this.formModel.name || !this.formModel.sku) {
      alert('Vui lòng điền tên sản phẩm và mã SKU!');
      return;
    }

    if (this.isEditMode) {
      this.apiService.updateProduct(this.formModel.id, this.formModel).subscribe({
        next: () => {
          this.closeModal();
          this.loadProducts();
        }
      });
    } else {
      this.apiService.createProduct(this.formModel).subscribe({
        next: () => {
          this.closeModal();
          this.loadProducts();
        }
      });
    }
  }

  publishProduct(id: string) {
    this.apiService.publishProduct(id).subscribe({
      next: () => this.loadProducts()
    });
  }

  archiveProduct(id: string) {
    this.apiService.archiveProduct(id).subscribe({
      next: () => this.loadProducts()
    });
  }

  deleteProduct(id: string) {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm len này?')) {
      this.apiService.deleteProduct(id).subscribe({
        next: () => this.loadProducts()
      });
    }
  }
}
