import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CrmApiService } from '../../core/services/crm-api.service';

@Component({
  selector: 'app-shifts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="shifts-workspace" style="display: flex; flex-direction: column; gap: 28px;">
      <!-- Header Actions Bar -->
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <div>
          <h2 style="font-family: 'Playfair Display', serif; font-size: 24px; font-weight: 700; color: var(--color-primary); margin: 0;">
            Quản lý Nhân sự & Lịch Ca Trực
          </h2>
          <p style="font-size: 13px; color: var(--color-text-muted); margin: 4px 0 0 0;">
            Điều phối ca trực tư vấn trực tuyến và cập nhật trạng thái hoạt động của nghệ nhân hỗ trợ.
          </p>
        </div>
        <button 
          (click)="openSchedulerModal()" 
          class="btn btn-primary"
          style="border-radius: var(--radius-full); padding: 10px 24px; display: flex; align-items: center; gap: 8px;"
        >
          <span class="material-symbols-outlined">add_circle</span>
          <span>Phân lịch Ca trực mới</span>
        </button>
      </div>

      <!-- Main Split Workspace Layout -->
      <div style="display: grid; grid-template-columns: 1fr 1.2fr; gap: 28px; align-items: start;">
        <!-- LEFT: Employees directory with live status overrides -->
        <section class="crm-card" style="display: flex; flex-direction: column; gap: 20px; overflow: hidden; padding: 24px;">
          <header style="border-bottom: 1px solid var(--bg-surface-container); padding-bottom: 14px;">
            <h3 style="font-size: 16px; font-weight: 700; color: var(--color-primary); display: flex; align-items: center; gap: 8px; margin: 0;">
              <span class="material-symbols-outlined">badge</span>
              <span>Danh bạ Nghệ nhân hỗ trợ</span>
            </h3>
          </header>

          <div style="display: flex; flex-direction: column; gap: 16px;">
            <div 
              *ngFor="let emp of employees" 
              style="padding: 16px; border: 1px solid var(--color-border); border-radius: var(--radius-md); background-color: var(--bg-primary); display: flex; flex-direction: column; gap: 12px;"
            >
              <div style="display: flex; align-items: center; justify-content: space-between;">
                <div style="display: flex; align-items: center; gap: 12px;">
                  <div 
                    [ngStyle]="{
                      'background-color': emp.activeChatStatus === 'Online' ? 'var(--color-success-bg)' : emp.activeChatStatus === 'Busy' ? 'var(--color-warning-bg)' : 'var(--bg-surface-container)',
                      'color': emp.activeChatStatus === 'Online' ? 'var(--color-success)' : emp.activeChatStatus === 'Busy' ? 'var(--color-warning)' : 'var(--color-text-light)'
                    }"
                    style="width: 36px; height: 36px; border-radius: var(--radius-full); display: flex; align-items: center; justify-content: center; font-weight: 700;"
                  >
                    {{ emp.firstName.charAt(0) }}
                  </div>
                  <div>
                    <h4 style="font-size: 14px; font-weight: 700; color: var(--color-text-main); margin: 0;">
                      {{ emp.firstName }} {{ emp.lastName }}
                    </h4>
                    <span style="font-size: 11px; color: var(--color-text-muted);">{{ emp.department }}</span>
                  </div>
                </div>

                <!-- Status override select dropdown -->
                <div style="position: relative;">
                  <select 
                    [ngModel]="emp.activeChatStatus" 
                    (ngModelChange)="onStatusChange(emp.id, $event)"
                    class="form-control"
                    style="font-size: 12px; padding: 6px 28px 6px 12px; border-radius: var(--radius-full); cursor: pointer; width: 110px; background-color: white;"
                  >
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                    <option value="Busy">Busy</option>
                  </select>
                </div>
              </div>

              <div style="font-size: 12px; color: var(--color-text-light); display: flex; align-items: center; gap: 6px;">
                <span class="material-symbols-outlined" style="font-size: 16px;">mail</span>
                <span>{{ emp.email }}</span>
              </div>
            </div>
          </div>
        </section>

        <!-- RIGHT: Daily schedule ca trực list -->
        <section class="crm-card" style="display: flex; flex-direction: column; gap: 20px; padding: 24px;">
          <header style="border-bottom: 1px solid var(--bg-surface-container); padding-bottom: 14px;">
            <h3 style="font-size: 16px; font-weight: 700; color: var(--color-primary); display: flex; align-items: center; gap: 8px; margin: 0;">
              <span class="material-symbols-outlined">calendar_month</span>
              <span>Lịch biểu Phân ca trong ngày</span>
            </h3>
          </header>

          <div style="display: flex; flex-direction: column; gap: 16px;">
            <div *ngIf="shifts.length === 0" style="text-align: center; padding: 48px 16px; color: var(--color-text-light); font-size: 13px;">
              <span class="material-symbols-outlined" style="font-size: 40px; opacity: 0.5; margin-bottom: 8px;">event_busy</span>
              <div>Hôm nay chưa có lịch trực nào được lên.</div>
            </div>

            <div 
              *ngFor="let s of shifts" 
              style="padding: 16px; border: 1px solid var(--color-border); border-radius: var(--radius-md); display: flex; flex-direction: column; gap: 12px; background-color: white;"
            >
              <div style="display: flex; align-items: flex-start; justify-content: space-between;">
                <div>
                  <div style="font-weight: 700; font-size: 14px; color: var(--color-primary); display: flex; align-items: center; gap: 6px;">
                    <span class="material-symbols-outlined" style="font-size: 18px;">person</span>
                    <span>{{ s.employeeName }}</span>
                  </div>
                  
                  <div style="margin-top: 6px; font-size: 12px; color: var(--color-text-muted); line-height: 1.5;">
                    {{ s.notes || 'Ca trực hỗ trợ tư vấn chung.' }}
                  </div>
                </div>

                <button 
                  (click)="cancelShift(s.id)"
                  class="btn btn-outline btn-sm"
                  style="border-radius: var(--radius-full); width: 32px; height: 32px; padding: 0; border-color: rgba(211, 47, 47, 0.2); color: var(--color-error);"
                  title="Hủy ca trực"
                >
                  <span class="material-symbols-outlined" style="font-size: 16px;">delete</span>
                </button>
              </div>

              <!-- Time display metadata -->
              <div style="display: flex; gap: 16px; border-top: 1px solid var(--bg-surface-low); padding-top: 12px; font-size: 11px; color: var(--color-text-light);">
                <div style="display: flex; align-items: center; gap: 4px;">
                  <span class="material-symbols-outlined" style="font-size: 15px;">schedule</span>
                  <span>Bắt đầu: {{ formatTime(s.shiftStart) }}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 4px;">
                  <span class="material-symbols-outlined" style="font-size: 15px;">schedule</span>
                  <span>Kết thúc: {{ formatTime(s.shiftEnd) }}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- CREATE SHIFT DIALOG MODAL (Double-Bezel Tray Layout) -->
      <div class="crm-modal-backdrop" *ngIf="isSchedulerOpen">
        <div class="crm-modal" style="max-width: 480px; background: rgba(74, 101, 79, 0.04); border: 1px solid rgba(74, 101, 79, 0.08); border-radius: 32px; padding: 16px;">
          <div style="background: white; border-radius: 24px; padding: 28px 24px; box-shadow: var(--shadow-medium); border: 1px solid var(--bg-surface-container); display: flex; flex-direction: column; gap: 20px;">
            <header style="display: flex; align-items: center; justify-content: space-between;">
              <h3 style="font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 700; color: var(--color-primary); margin: 0;">
                Lập Lịch Ca Trực Mới
              </h3>
              <button 
                (click)="closeSchedulerModal()" 
                style="background: none; border: none; font-size: 20px; cursor: pointer; color: var(--color-text-light);"
              >
                <span class="material-symbols-outlined">close</span>
              </button>
            </header>

            <form (ngSubmit)="submitScheduler()" style="display: flex; flex-direction: column; gap: 16px;">
              <!-- Select Employee -->
              <div class="form-group" style="margin-bottom: 0;">
                <label for="employeeSelect">Chọn nghệ nhân trực</label>
                <select 
                  id="employeeSelect" 
                  name="employeeId" 
                  [(ngModel)]="newShift.employeeId"
                  required
                  class="form-control"
                  style="padding: 10px 14px; border-radius: var(--radius-md);"
                >
                  <option value="" disabled>-- Chọn nghệ nhân --</option>
                  <option *ngFor="let emp of employees" [value]="emp.id">
                    {{ emp.firstName }} {{ emp.lastName }} ({{ emp.department }})
                  </option>
                </select>
              </div>

              <!-- Select Date -->
              <div class="form-group" style="margin-bottom: 0;">
                <label for="shiftDate">Chọn Ngày trực</label>
                <input 
                  type="date" 
                  id="shiftDate" 
                  name="shiftDate" 
                  [(ngModel)]="newShift.date"
                  required
                  class="form-control"
                />
              </div>

              <!-- Select Start Time & End Time -->
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                <div class="form-group" style="margin-bottom: 0;">
                  <label for="startTime">Giờ Bắt đầu</label>
                  <input 
                    type="time" 
                    id="startTime" 
                    name="startTime" 
                    [(ngModel)]="newShift.startTime"
                    required
                    class="form-control"
                  />
                </div>
                <div class="form-group" style="margin-bottom: 0;">
                  <label for="endTime">Giờ Kết thúc</label>
                  <input 
                    type="time" 
                    id="endTime" 
                    name="endTime" 
                    [(ngModel)]="newShift.endTime"
                    required
                    class="form-control"
                  />
                </div>
              </div>

              <!-- Notes field -->
              <div class="form-group" style="margin-bottom: 0;">
                <label for="shiftNotes">Ghi chú ca trực</label>
                <textarea 
                  id="shiftNotes" 
                  name="notes" 
                  [(ngModel)]="newShift.notes"
                  placeholder="Ghi chú công việc ca trực..."
                  class="form-control"
                  rows="3"
                  style="border-radius: var(--radius-md); font-family: inherit; resize: none;"
                ></textarea>
              </div>

              <!-- Submit button with nested circular kinetics -->
              <button 
                type="submit" 
                class="btn-auth-submit"
                style="margin-top: 12px;"
              >
                <span>Xác nhận Phân ca</span>
                <span class="btn-icon-bubble">
                  <span class="material-symbols-outlined">arrow_forward</span>
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ShiftsComponent implements OnInit {
  employees: any[] = [];
  shifts: any[] = [];

  // Modal control state
  isSchedulerOpen = false;
  newShift = {
    employeeId: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '08:00',
    endTime: '17:00',
    notes: ''
  };

  constructor(private apiService: CrmApiService) {}

  ngOnInit(): void {
    this.loadEmployees();
    this.loadShifts();
  }

  loadEmployees(): void {
    this.apiService.getEmployees().subscribe((res) => {
      this.employees = res || [];
    });
  }

  loadShifts(): void {
    this.apiService.getShifts().subscribe((res) => {
      this.shifts = res || [];
    });
  }

  onStatusChange(employeeId: string, newStatus: string): void {
    const emp = this.employees.find(e => e.id === employeeId);
    if (!emp) return;

    const updated = { ...emp, activeChatStatus: newStatus };
    this.apiService.updateEmployee(employeeId, updated).subscribe({
      next: () => {
        emp.activeChatStatus = newStatus;
      }
    });
  }

  cancelShift(shiftId: string): void {
    this.apiService.deleteShift(shiftId).subscribe({
      next: () => {
        this.loadShifts();
      }
    });
  }

  openSchedulerModal(): void {
    this.isSchedulerOpen = true;
    this.newShift = {
      employeeId: '',
      date: new Date().toISOString().split('T')[0],
      startTime: '08:00',
      endTime: '17:00',
      notes: ''
    };
  }

  closeSchedulerModal(): void {
    this.isSchedulerOpen = false;
  }

  submitScheduler(): void {
    const { employeeId, date, startTime, endTime, notes } = this.newShift;
    if (!employeeId || !date || !startTime || !endTime) return;

    // Build ISO datetime strings
    const startIso = new Date(`${date}T${startTime}`).toISOString();
    const endIso = new Date(`${date}T${endTime}`).toISOString();

    const payload = {
      employeeId,
      shiftStart: startIso,
      shiftEnd: endIso,
      notes
    };

    this.apiService.createShift(payload).subscribe({
      next: () => {
        this.closeSchedulerModal();
        this.loadShifts();
      }
    });
  }

  formatTime(isoString: string): string {
    const d = new Date(isoString);
    return `${d.toLocaleDateString('vi-VN')} ${d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`;
  }
}
