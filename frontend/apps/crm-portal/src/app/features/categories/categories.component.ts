import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CrmApiService } from '../../core/services/crm-api.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="categories-container">
      <!-- Toolbar Section -->
      <section class="toolbar-section crm-card">
        <div>
          <h3 style="color: var(--color-primary); font-size: 18px;">Danh sách phân loại sản phẩm</h3>
          <p style="font-size: 13px; color: var(--color-text-muted);">Quản lý các nhóm sản phẩm len thủ công của cửa hàng</p>
        </div>
        <button class="btn btn-primary" (click)="openAddModal()">
          <span>+ Thêm Danh Mục</span>
        </button>
      </section>

      <!-- Table Section -->
      <section class="crm-table-container" style="margin-top: 24px;">
        <table class="crm-table">
          <thead>
            <tr>
              <th style="width: 100px;">Mã số</th>
              <th>Tên danh mục phân loại</th>
              <th style="text-align: right;">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngIf="loading">
              <td colspan="3" style="text-align: center; padding: 30px; color: var(--color-text-muted);">
                Đang tải danh sách phân loại hàng...
              </td>
            </tr>
            <tr *ngIf="!loading && categories.length === 0">
              <td colspan="3" style="text-align: center; padding: 30px; color: var(--color-text-muted);">
                Chưa có danh mục phân loại nào.
              </td>
            </tr>
            <tr *ngFor="let cat of categories">
              <td><strong>{{ cat.id }}</strong></td>
              <td>
                <span style="font-weight: 600; font-size: 15px; color: var(--color-text-main);">{{ cat.name }}</span>
              </td>
              <td style="text-align: right;">
                <div class="actions-group">
                  <button class="btn btn-outline btn-sm" (click)="openEditModal(cat)">Sửa</button>
                  <button class="btn btn-danger btn-sm" (click)="deleteCategory(cat.id)">Xóa</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- Modal Category CRUD -->
      <div class="crm-modal-backdrop" *ngIf="showModal">
        <div class="crm-modal" style="max-width: 450px;">
          <div class="crm-modal-header">
            <h3>{{ isEditMode ? 'Cập Nhật Danh Mục' : 'Thêm Mới Danh Mục Đồ Len' }}</h3>
            <button class="close-btn" (click)="closeModal()">&times;</button>
          </div>
          
          <div class="crm-modal-body">
            <form>
              <div class="form-group">
                <label for="cat-name">Tên danh mục *</label>
                <input id="cat-name" type="text" class="form-control" [(ngModel)]="formModel.name" name="name" required placeholder="Nhập ví dụ: Thảm Len..." />
              </div>

            </form>
          </div>

          <div class="crm-modal-footer">
            <button class="btn btn-outline" (click)="closeModal()">Hủy</button>
            <button class="btn btn-primary" (click)="saveCategory()">Lưu danh mục</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .toolbar-section {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 24px;
    }
    
    .actions-group {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }
  `]
})
export class CategoriesComponent implements OnInit {
  categories: any[] = [];
  loading = false;
  
  showModal = false;
  isEditMode = false;
  formModel = { id: '', name: '' };

  constructor(private apiService: CrmApiService) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.loading = true;
    this.apiService.getCategories().subscribe({
      next: (res) => {
        this.categories = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  openAddModal() {
    this.isEditMode = false;
    this.formModel = { id: '', name: '' };
    this.showModal = true;
  }

  openEditModal(cat: any) {
    this.isEditMode = true;
    this.formModel = { ...cat };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  saveCategory() {
    if (!this.formModel.name.trim()) {
      alert('Vui lòng nhập tên danh mục phân loại!');
      return;
    }

    if (this.isEditMode) {
      this.apiService.updateCategory(this.formModel.id, this.formModel).subscribe({
        next: () => {
          this.closeModal();
          this.loadCategories();
        }
      });
    } else {
      this.apiService.createCategory(this.formModel).subscribe({
        next: () => {
          this.closeModal();
          this.loadCategories();
        }
      });
    }
  }

  deleteCategory(id: string) {
    if (confirm('Bạn chắc chắn muốn xóa phân loại sản phẩm này? Các sản phẩm thuộc nhóm này có thể cần cập nhật lại.')) {
      this.apiService.deleteCategory(id).subscribe({
        next: () => this.loadCategories()
      });
    }
  }
}
