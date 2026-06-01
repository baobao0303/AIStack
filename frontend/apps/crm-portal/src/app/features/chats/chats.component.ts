import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ChatService, ChatSession, ChatMessage } from '../../core/services/chat.service';
import { AuthService } from '../../core/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chats',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="chats-workspace" style="display: flex; gap: 24px; height: calc(100vh - 160px); overflow: hidden; margin-top: -12px;">
      <!-- LEFT PANEL: Conversation rooms index list -->
      <aside class="rooms-list-card" style="width: 320px; background: var(--bg-surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); box-shadow: var(--shadow-soft); display: flex; flex-direction: column; overflow: hidden;">
        <header style="padding: 18px 20px; border-bottom: 1px solid var(--bg-surface-container); bg: var(--bg-primary);">
          <h2 style="font-size: 16px; font-weight: 700; color: var(--color-primary); display: flex; align-items: center; gap: 8px; margin: 0;">
            <span class="material-symbols-outlined">forum</span>
            <span>Hội thoại trực tuyến</span>
          </h2>
          <p style="font-size: 11px; color: var(--color-text-muted); margin: 4px 0 0 0;">Quản lý phiên chat với khách hàng</p>
        </header>

        <!-- Dynamic Rooms List -->
        <div style="flex: 1; overflow-y: auto; padding: 12px 8px; display: flex; flex-direction: column; gap: 8px;">
          <div *ngIf="sessions.length === 0" style="text-align: center; padding: 32px 16px; color: var(--color-text-light); font-size: 13px;">
            <span class="material-symbols-outlined" style="font-size: 32px; opacity: 0.5; margin-bottom: 8px;">hourglass_empty</span>
            <div>Không có cuộc trò chuyện nào.</div>
          </div>

          <div 
            *ngFor="let s of sessions" 
            (click)="selectSession(s)"
            [ngClass]="{'active-room': selectedSession?.id === s.id}"
            class="room-item"
            style="padding: 14px 16px; border-radius: var(--radius-md); border: 1px solid transparent; cursor: pointer; transition: var(--transition-smooth); display: flex; flex-direction: column; gap: 6px;"
          >
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <span style="font-weight: 600; font-size: 13px; color: var(--color-text-main); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 180px;">
                {{ s.customerEmail }}
              </span>
              <span class="badge" [ngClass]="{
                'badge-warning': s.status === 'Queued',
                'badge-success': s.status === 'Active',
                'badge-danger': s.status === 'Closed'
              }" style="font-size: 9px; padding: 2px 8px;">
                {{ s.status === 'Queued' ? 'Chờ phục vụ' : s.status === 'Active' ? 'Đang chat' : 'Đã đóng' }}
              </span>
            </div>
            
            <div style="display: flex; align-items: center; justify-content: space-between; font-size: 11px; color: var(--color-text-light);">
              <span style="display: flex; align-items: center; gap: 4px;">
                <span class="material-symbols-outlined" style="font-size: 14px;">schedule</span>
                <span>{{ formatTime(s.createdAt) }}</span>
              </span>
              <span *ngIf="s.buyerScore" style="display: flex; align-items: center; gap: 4px; color: var(--color-primary); font-weight: 700;">
                <span class="material-symbols-outlined" style="font-size: 14px;">analytics</span>
                <span>AI: {{ s.buyerScore }}đ</span>
              </span>
            </div>
          </div>
        </div>
      </aside>

      <!-- RIGHT PANEL: Live Chat Room Area -->
      <section class="chat-workspace-card" style="flex: 1; background: var(--bg-surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); box-shadow: var(--shadow-soft); display: flex; flex-direction: column; overflow: hidden;">
        <!-- No selected room placeholder -->
        <div *ngIf="!selectedSession" style="flex: 1; display: flex; flex-direction: column; items-center: center; justify-content: center; text-align: center; padding: 48px; color: var(--color-text-light);">
          <span class="material-symbols-outlined" style="font-size: 64px; color: var(--color-accent); opacity: 0.6; mb: 16px;">support_agent</span>
          <h3 style="font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 700; color: var(--color-primary); margin-top: 12px;">Phòng đàm thoại nghệ nhân</h3>
          <p style="font-size: 13px; max-width: 32ch; margin: 8px auto 0 auto; line-height: 1.6;">
            Chọn một cuộc hội thoại bên trái để bắt đầu hỗ trợ khách hàng, đàm luận số đo và trả lời thắc mắc trực tuyến.
          </p>
        </div>

        <!-- Selected Active chat room -->
        <div *ngIf="selectedSession" style="flex: 1; display: flex; flex-direction: column; height: 100%; min-height: 0;">
          <!-- Room Header -->
          <header style="padding: 16px 24px; border-b: 1px solid var(--color-border); background-color: var(--bg-primary); display: flex; align-items: center; justify-content: space-between;">
            <div>
              <h3 style="font-size: 15px; font-weight: 700; color: var(--color-primary); margin: 0; display: flex; align-items: center; gap: 8px;">
                <span class="material-symbols-outlined">alternate_email</span>
                <span>{{ selectedSession.customerEmail }}</span>
              </h3>
              <p style="font-size: 11px; color: var(--color-text-muted); margin: 2px 0 0 0;">
                Mã phòng: {{ selectedSession.id }}
              </p>
            </div>

            <!-- Join room or operational action controls -->
            <div style="display: flex; gap: 12px; align-items: center;">
              <button 
                *ngIf="selectedSession.status === 'Queued'" 
                (click)="joinRoom()" 
                class="btn btn-primary btn-sm"
                style="border-radius: var(--radius-full); padding: 6px 16px;"
              >
                <span class="material-symbols-outlined" style="font-size: 14px;">assignment_ind</span>
                <span>Nhận Hỗ Trợ Ca Trực</span>
              </button>

              <button 
                *ngIf="selectedSession.status === 'Active'" 
                (click)="closeRoom()" 
                class="btn btn-danger btn-sm"
                style="border-radius: var(--radius-full); padding: 6px 16px;"
              >
                <span class="material-symbols-outlined" style="font-size: 14px;">check_circle</span>
                <span>Đóng Phòng Chat</span>
              </button>
            </div>
          </header>

          <!-- Chat messages area -->
          <div #scrollContainer style="flex: 1; overflow-y: auto; padding: 24px; display: flex; flex-direction: column; gap: 16px; background-color: rgba(244, 244, 240, 0.2);">
            <div *ngFor="let m of messages" [ngClass]="{'msg-self': m.senderType === 'Employee', 'msg-other': m.senderType === 'Customer', 'msg-sys': m.senderType === 'System'}" style="display: flex; flex-direction: column; max-width: 75%;">
              <!-- Sender metadata -->
              <span style="font-size: 10px; color: var(--color-text-light); margin-bottom: 3px; font-weight: 600; padding: 0 4px;">
                {{ m.senderName }} • {{ formatTimeOnly(m.sentAt) }}
              </span>
              <!-- Message Bubble -->
              <div 
                [ngStyle]="{
                  'background-color': m.senderType === 'Employee' ? 'var(--color-primary)' : m.senderType === 'System' ? 'transparent' : 'var(--bg-surface)',
                  'color': m.senderType === 'Employee' ? 'white' : 'var(--color-text-main)',
                  'border-radius': m.senderType === 'Employee' ? '18px 18px 2px 18px' : m.senderType === 'System' ? '99px' : '18px 18px 18px 2px',
                  'border': m.senderType === 'System' ? '1px solid var(--color-border)' : '1px solid var(--bg-surface-container)',
                  'padding': m.senderType === 'System' ? '4px 16px' : '12px 16px',
                  'font-size': '13px',
                  'box-shadow': m.senderType === 'System' ? 'none' : 'var(--shadow-soft)'
                }"
                class="msg-bubble"
              >
                {{ m.content }}
              </div>
            </div>
            <div ref="messagesEnd"></div>
          </div>

          <!-- Gemini AI Reply Suggestion bar -->
          <div *ngIf="selectedSession.status === 'Active'" style="padding: 10px 24px; border-top: 1px solid var(--bg-surface-container); background: rgba(74, 101, 79, 0.02); display: flex; flex-direction: column; gap: 8px;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <span style="font-size: 11px; font-weight: 700; color: var(--color-primary); display: flex; align-items: center; gap: 4px;">
                <span class="material-symbols-outlined" style="font-size: 16px; color: var(--color-primary);">psychology</span>
                <span>Gợi ý trả lời thông minh bởi Gemini AI</span>
              </span>
              <button 
                (click)="getSuggestions()" 
                [disabled]="isFetchingSuggestions"
                style="background: none; border: none; font-size: 11px; color: var(--color-primary); font-weight: bold; cursor: pointer; display: flex; align-items: center; gap: 4px;"
              >
                <span class="material-symbols-outlined" style="font-size: 14px;" [ngClass]="{'animate-spin': isFetchingSuggestions}">sync</span>
                <span>{{ isFetchingSuggestions ? 'Đang tạo gợi ý...' : 'Tải gợi ý mới' }}</span>
              </button>
            </div>

            <!-- Suggestion chips list -->
            <div style="display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px;">
              <div 
                *ngFor="let suggestion of suggestions" 
                (click)="useSuggestion(suggestion)"
                style="background: white; border: 1px solid var(--color-border); padding: 8px 14px; border-radius: var(--radius-full); font-size: 12px; cursor: pointer; color: var(--color-text-muted); white-space: nowrap; transition: var(--transition-smooth); box-shadow: var(--shadow-soft);"
                class="suggestion-chip"
              >
                {{ suggestion }}
              </div>
            </div>
          </div>

          <!-- Message input form -->
          <footer *ngIf="selectedSession.status === 'Active'" style="padding: 16px 24px; border-t: 1px solid var(--color-border); background-color: var(--bg-surface); display: flex; gap: 12px;">
            <input 
              type="text" 
              class="form-control" 
              placeholder="Nhập câu trả lời tư vấn..."
              [(ngModel)]="newMessageText"
              (keyup.enter)="sendMessage()"
              style="padding: 12px 16px; border-radius: var(--radius-md); font-sans: inherit;"
            />
            <button 
              (click)="sendMessage()" 
              [disabled]="!newMessageText.trim()"
              class="btn btn-primary"
              style="border-radius: var(--radius-md); padding: 12px 24px; display: flex; align-items: center; gap: 8px;"
            >
              <span>Gửi tin</span>
              <span class="material-symbols-outlined">send</span>
            </button>
          </footer>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .room-item {
      background: var(--bg-surface-low);
      
      &:hover {
        background: var(--bg-surface-container);
        border-color: var(--color-border);
      }
      
      &.active-room {
        background: var(--color-primary-light);
        border-color: var(--color-primary);
      }
    }

    .msg-self {
      align-self: flex-end;
      align-items: flex-end;
    }

    .msg-other {
      align-self: flex-start;
      align-items: flex-start;
    }

    .msg-sys {
      align-self: center;
      align-items: center;
      max-width: 90% !important;
    }

    .suggestion-chip:hover {
      border-color: var(--color-primary);
      color: var(--color-primary);
      background-color: var(--color-primary-light);
    }
  `]
})
export class ChatsComponent implements OnInit, OnDestroy, AfterViewChecked {
  sessions: ChatSession[] = [];
  selectedSession: ChatSession | null = null;
  messages: ChatMessage[] = [];
  newMessageText = '';

  // Suggestions state
  suggestions: string[] = [
    'Sản phẩm đan kim thủ công hoàn toàn từ len Merino hữu cơ.',
    'Có thể giặt máy nhẹ nhàng nhưng khuyên giặt tay để bền len nhất.',
    'Hỗ trợ đan số đo vai ngực riêng cho bạn miễn phí.'
  ];
  isFetchingSuggestions = false;

  private chatSub: Subscription | null = null;
  private agentName = ' John Doe';

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  constructor(
    private chatService: ChatService,
    private authService: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (user) {
      this.agentName = `${user.email.split('@')[0]}`;
    }

    // 1. Establish Hub Connection
    this.chatService.connectToHub();

    // 2. Fetch Sessions List
    this.loadSessions();

    // 3. Register real-time messages listener
    this.chatSub = this.chatService.messageReceived$.subscribe((data) => {
      if (data && this.selectedSession && data.sessionId === this.selectedSession.id) {
        this.messages.push(data.message);
        this.scrollToBottom();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.chatSub) this.chatSub.unsubscribe();
    this.chatService.disconnectHub();
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  loadSessions(): void {
    this.chatService.getSessions().subscribe((res) => {
      this.sessions = res || [];
    });
  }

  selectSession(session: ChatSession): void {
    this.selectedSession = session;
    this.messages = [];
    this.chatService.joinSessionRoom(session.id);
    
    // Fetch History
    this.chatService.getSessionMessages(session.id).subscribe((res) => {
      this.messages = res || [];
      this.scrollToBottom();
    });

    // Populate initial suggestion chips matching standard handmade care
    this.suggestions = [
      'Sản phẩm đan kim thủ công hoàn toàn từ len Merino hữu cơ.',
      'Có thể giặt máy nhẹ nhàng nhưng khuyên giặt tay để bền len nhất.',
      'Hỗ trợ đan số đo vai ngực riêng cho bạn miễn phí.'
    ];
  }

  joinRoom(): void {
    if (!this.selectedSession) return;
    
    const user = this.authService.currentUser();
    const agentId = user?.userId || 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
    
    this.chatService.assignSession(this.selectedSession.id, agentId).subscribe({
      next: () => {
        this.selectedSession!.status = 'Active';
        this.selectedSession!.assignedEmployeeId = agentId;
        this.loadSessions();
        this.chatService.joinSessionRoom(this.selectedSession!.id);
      }
    });
  }

  closeRoom(): void {
    if (!this.selectedSession) return;

    // Simulate closing or call real method
    const sessId = this.selectedSession.id;
    this.chatService.assignSession(sessId, '').subscribe({
      next: () => {
        this.selectedSession!.status = 'Closed';
        this.loadSessions();
      }
    });
  }

  sendMessage(): void {
    if (!this.selectedSession || !this.newMessageText.trim()) return;

    const content = this.newMessageText;
    this.newMessageText = '';

    const newMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sessionId: this.selectedSession.id,
      senderType: 'Employee',
      senderName: this.agentName,
      content,
      sentAt: new Date().toISOString()
    };
    this.messages.push(newMsg);

    this.chatService.sendMessageToRoom(this.selectedSession.id, this.agentName, content);
    this.scrollToBottom();
  }

  getSuggestions(): void {
    if (!this.selectedSession) return;
    this.isFetchingSuggestions = true;

    const recentMsgText = this.messages.slice(-3).map(m => m.content);
    
    this.http.post<string[]>('/api/ai/suggest', {
      productContext: 'Wool Cardigan handmade. Care instructions: handwash only, no bleach, organic Merino yarn.',
      recentMessages: recentMsgText
    }).subscribe({
      next: (res) => {
        this.isFetchingSuggestions = false;
        this.suggestions = res && res.length > 0 ? res : [
          'Sợi len nhung đan móc an toàn tuyệt đối cho bé.',
          'Giao hàng toàn quốc hoả tốc 24h nội thành.',
          'Cam kết hoàn trả 100% nếu phát hiện lỗi sợi xơ xù.'
        ];
      },
      error: () => {
        this.isFetchingSuggestions = false;
        // Resilient fallback chips
        this.suggestions = [
          'Sợi len nhung đan móc an toàn tuyệt đối cho bé.',
          'Giao hàng toàn quốc hoả tốc 24h nội thành.',
          'Cam kết hoàn trả 100% nếu phát hiện lỗi sợi xơ xù.'
        ];
      }
    });
  }

  useSuggestion(suggestion: string): void {
    this.newMessageText = suggestion;
  }

  formatTime(isoString: string): string {
    const d = new Date(isoString);
    return `${d.toLocaleDateString('vi-VN')} ${d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`;
  }

  formatTimeOnly(isoString: string): string {
    const d = new Date(isoString);
    return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      if (this.scrollContainer) {
        this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
      }
    }, 100);
  }
}
