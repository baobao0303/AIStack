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
    <div class="chats-workspace">
      <!-- LEFT PANEL: Double-Bezel nested tray for rooms list -->
      <aside class="rooms-list-tray">
        <div class="rooms-list-card">
          <header class="rooms-header">
            <h2>
              <span class="material-symbols-outlined">forum</span>
              <span>Hội thoại trực tuyến</span>
            </h2>
            <p>Quản lý phiên chat với khách hàng</p>
          </header>

          <!-- Dynamic Rooms List -->
          <div class="rooms-container">
            <div *ngIf="sessions.length === 0" class="rooms-empty-state">
              <span class="material-symbols-outlined">hourglass_empty</span>
              <div>Không có cuộc trò chuyện nào.</div>
            </div>

            <div 
              *ngFor="let s of sessions" 
              (click)="selectSession(s)"
              [ngClass]="{'active-room': selectedSession?.id === s.id}"
              class="room-item"
            >
              <div class="room-top-row">
                <span class="customer-email">
                  {{ s.customerEmail }}
                </span>
                <span class="badge" [ngClass]="{
                  'badge-warning': s.status === 'Queued',
                  'badge-success': s.status === 'Active',
                  'badge-danger': s.status === 'Closed'
                }">
                  {{ s.status === 'Queued' ? 'Chờ phục vụ' : s.status === 'Active' ? 'Đang chat' : 'Đã đóng' }}
                </span>
              </div>
              
              <div class="room-bottom-row">
                <span class="room-time">
                  <span class="material-symbols-outlined">schedule</span>
                  <span>{{ formatTime(s.createdAt) }}</span>
                </span>
                <span *ngIf="s.buyerScore" class="room-ai-score">
                  <span class="material-symbols-outlined">analytics</span>
                  <span>AI: {{ s.buyerScore }}đ</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <!-- RIGHT PANEL: Double-Bezel nested tray for chat window -->
      <section class="chat-workspace-tray">
        <div class="chat-workspace-card">
          <!-- No selected room placeholder -->
          <div *ngIf="!selectedSession" class="chat-empty-state">
            <span class="material-symbols-outlined">support_agent</span>
            <h3>Phòng đàm thoại nghệ nhân</h3>
            <p>
              Chọn một cuộc hội thoại bên trái để bắt đầu hỗ trợ khách hàng, đàm luận số đo và trả lời thắc mắc trực tuyến.
            </p>
          </div>

          <!-- Selected Active chat room -->
          <div *ngIf="selectedSession" class="active-chat-room">
            <!-- Room Header -->
            <header class="chat-header">
              <div class="room-info">
                <h3>
                  <span class="material-symbols-outlined">alternate_email</span>
                  <span>{{ selectedSession.customerEmail }}</span>
                </h3>
                <p>Mã phòng: {{ selectedSession.id }}</p>
              </div>

              <!-- Join room or operational action controls -->
              <div class="header-actions">
                <button 
                  *ngIf="selectedSession.status === 'Queued'" 
                  (click)="joinRoom()" 
                  class="btn-pill-cta"
                >
                  <span>Nhận Hỗ Trợ Ca Trực</span>
                  <span class="cta-bubble">
                    <span class="material-symbols-outlined">assignment_ind</span>
                  </span>
                </button>

                <button 
                  *ngIf="selectedSession.status === 'Active'" 
                  (click)="closeRoom()" 
                  class="btn-pill-danger"
                >
                  <span>Đóng Phòng Chat</span>
                  <span class="cta-bubble">
                    <span class="material-symbols-outlined">check_circle</span>
                  </span>
                </button>
              </div>
            </header>

            <!-- Chat messages area -->
            <div #scrollContainer class="messages-container">
              <div 
                *ngFor="let m of messages" 
                [ngClass]="{
                  'msg-self': m.senderType === 'Employee', 
                  'msg-other': m.senderType === 'Customer', 
                  'msg-sys': m.senderType === 'System'
                }" 
                class="msg-row"
              >
                <!-- Sender metadata -->
                <span class="msg-meta">
                  {{ m.senderName }} • {{ formatTimeOnly(m.sentAt) }}
                </span>
                <!-- Message Bubble -->
                <div class="msg-bubble">
                  {{ m.content }}
                </div>
              </div>
              <div ref="messagesEnd"></div>
            </div>

            <!-- Gemini AI Reply Suggestion bar -->
            <div *ngIf="selectedSession.status === 'Active'" class="ai-suggestions-panel">
              <div class="suggestions-header">
                <span class="suggestions-title">
                  <span class="material-symbols-outlined">psychology</span>
                  <span>Gợi ý trả lời thông minh bởi Gemini AI</span>
                </span>
                <button 
                  (click)="getSuggestions()" 
                  [disabled]="isFetchingSuggestions"
                  class="reload-btn"
                >
                  <span class="material-symbols-outlined" [ngClass]="{'animate-spin': isFetchingSuggestions}">sync</span>
                  <span>{{ isFetchingSuggestions ? 'Đang tạo gợi ý...' : 'Tải gợi ý mới' }}</span>
                </button>
              </div>

              <!-- Suggestion chips list -->
              <div class="suggestions-chips">
                <div 
                  *ngFor="let suggestion of suggestions" 
                  (click)="useSuggestion(suggestion)"
                  class="suggestion-chip"
                >
                  {{ suggestion }}
                </div>
              </div>
            </div>

            <!-- Message input form -->
            <footer *ngIf="selectedSession.status === 'Active'" class="chat-footer">
              <input 
                type="text" 
                class="form-control" 
                placeholder="Nhập câu trả lời tư vấn..."
                [(ngModel)]="newMessageText"
                (keyup.enter)="sendMessage()"
              />
              <button 
                (click)="sendMessage()" 
                [disabled]="!newMessageText.trim()"
                class="btn-pill-cta"
              >
                <span>Gửi tin</span>
                <span class="cta-bubble">
                  <span class="material-symbols-outlined">send</span>
                </span>
              </button>
            </footer>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .chats-workspace {
      display: flex;
      gap: 24px;
      height: calc(100vh - 160px);
      overflow: hidden;
      margin-top: -12px;
    }

    /* Left Panel: Double-Bezel nested tray */
    .rooms-list-tray {
      width: 340px;
      background: rgba(74, 101, 79, 0.04);
      border: 1px solid rgba(74, 101, 79, 0.08);
      border-radius: 32px;
      padding: 8px;
      display: flex;
      flex-direction: column;
      height: 100%;
      box-shadow: var(--shadow-soft);
      transition: var(--transition-smooth);

      &:hover {
        background: rgba(74, 101, 79, 0.06);
        border-color: rgba(74, 101, 79, 0.12);
      }
    }

    .rooms-list-card {
      background: var(--bg-surface);
      border-radius: 24px; /* Concentric squircle outer (32px) - padding (8px) = 24px */
      border: 1px solid var(--color-border);
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
    }

    .rooms-header {
      padding: 20px 24px;
      border-bottom: 1px solid var(--bg-surface-container);
      background: var(--bg-primary);

      h2 {
        font-family: 'Playfair Display', serif;
        font-size: 17px;
        font-weight: 700;
        color: var(--color-primary);
        display: flex;
        align-items: center;
        gap: 10px;
        margin: 0;

        .material-symbols-outlined {
          font-size: 20px;
          color: var(--color-primary);
        }
      }

      p {
        font-size: 11px;
        color: var(--color-text-muted);
        margin: 4px 0 0 0;
        font-weight: 500;
      }
    }

    .rooms-container {
      flex: 1;
      overflow-y: auto;
      padding: 16px 12px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .rooms-empty-state {
      text-align: center;
      padding: 48px 16px;
      color: var(--color-text-light);
      font-size: 13px;
      font-weight: 500;

      .material-symbols-outlined {
        font-size: 36px;
        opacity: 0.4;
        margin-bottom: 12px;
        color: var(--color-accent);
      }
    }

    .room-item {
      padding: 16px 20px;
      border-radius: var(--radius-md); /* 8px */
      border: 1px solid var(--bg-surface-container);
      background: var(--bg-surface-low);
      cursor: pointer;
      transition: var(--transition-smooth);
      display: flex;
      flex-direction: column;
      gap: 8px;

      &:hover {
        background: var(--bg-surface-container);
        border-color: var(--color-border);
        transform: translateY(-1px);
        box-shadow: var(--shadow-soft);
      }

      &.active-room {
        background: var(--color-primary-light);
        border-color: var(--color-primary);
        box-shadow: 0 4px 12px rgba(74, 101, 79, 0.1);
        
        .customer-email {
          color: var(--color-primary-dim) !important;
          font-weight: 700 !important;
        }
      }
    }

    .room-top-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;

      .customer-email {
        font-weight: 600;
        font-size: 13.5px;
        color: var(--color-text-main);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 180px;
      }
    }

    .room-bottom-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 11px;
      color: var(--color-text-light);
      font-weight: 500;

      .room-time {
        display: flex;
        align-items: center;
        gap: 4px;

        .material-symbols-outlined {
          font-size: 13px;
        }
      }

      .room-ai-score {
        display: flex;
        align-items: center;
        gap: 4px;
        color: var(--color-primary);
        font-weight: 700;

        .material-symbols-outlined {
          font-size: 13px;
        }
      }
    }

    /* Right Panel: Double-Bezel nested tray */
    .chat-workspace-tray {
      flex: 1;
      background: rgba(74, 101, 79, 0.04);
      border: 1px solid rgba(74, 101, 79, 0.08);
      border-radius: 32px;
      padding: 8px;
      display: flex;
      flex-direction: column;
      height: 100%;
      box-shadow: var(--shadow-soft);
      transition: var(--transition-smooth);

      &:hover {
        background: rgba(74, 101, 79, 0.06);
        border-color: rgba(74, 101, 79, 0.12);
      }
    }

    .chat-workspace-card {
      background: var(--bg-surface);
      border-radius: 24px; /* Concentric squircle outer (32px) - padding (8px) = 24px */
      border: 1px solid var(--color-border);
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
    }

    /* No conversation selected state */
    .chat-empty-state {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 48px;
      color: var(--color-text-light);

      .material-symbols-outlined {
        font-size: 64px;
        color: var(--color-accent);
        opacity: 0.7;
        margin-bottom: 20px;
      }

      h3 {
        font-family: 'Playfair Display', serif;
        font-size: 22px;
        font-weight: 700;
        color: var(--color-primary);
        margin: 12px 0 8px 0;
      }

      p {
        font-size: 13.5px;
        max-width: 32ch;
        margin: 0 auto;
        line-height: 1.6;
        color: var(--color-text-muted);
        font-weight: 500;
      }
    }

    /* Selected session room styling */
    .active-chat-room {
      flex: 1;
      display: flex;
      flex-direction: column;
      height: 100%;
      min-height: 0;
    }

    .chat-header {
      padding: 20px 28px;
      border-bottom: 1px solid var(--color-border);
      background-color: var(--bg-primary);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;

      .room-info {
        h3 {
          font-size: 16px;
          font-weight: 700;
          color: var(--color-primary);
          margin: 0;
          display: flex;
          align-items: center;
          gap: 8px;

          .material-symbols-outlined {
            font-size: 18px;
            color: var(--color-primary);
          }
        }

        p {
          font-size: 11px;
          color: var(--color-text-light);
          margin: 4px 0 0 0;
          font-weight: 600;
        }
      }

      .header-actions {
        display: flex;
        gap: 12px;
        align-items: center;
      }
    }

    /* Messages List container */
    .messages-container {
      flex: 1;
      overflow-y: auto;
      padding: 28px;
      display: flex;
      flex-direction: column;
      gap: 20px;
      background-color: rgba(244, 244, 240, 0.25);
    }

    .msg-row {
      display: flex;
      flex-direction: column;
      max-width: 75%;
      animation: msgFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;

      .msg-meta {
        font-size: 10px;
        color: var(--color-text-light);
        margin-bottom: 5px;
        font-weight: 600;
        padding: 0 6px;
      }
    }

    @keyframes msgFadeIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .msg-self {
      align-self: flex-end;
      align-items: flex-end;

      .msg-bubble {
        background-color: var(--color-primary);
        color: var(--color-text-on-primary);
        border-radius: 20px 20px 4px 20px;
        border: 1px solid var(--color-primary-dim);
        box-shadow: 0 3px 8px rgba(74, 101, 79, 0.15);
      }
    }

    .msg-other {
      align-self: flex-start;
      align-items: flex-start;

      .msg-bubble {
        background-color: var(--bg-surface);
        color: var(--color-text-main);
        border-radius: 20px 20px 20px 4px;
        border: 1px solid var(--bg-surface-container-high);
        box-shadow: var(--shadow-soft);
      }
    }

    .msg-sys {
      align-self: center;
      align-items: center;
      max-width: 90% !important;

      .msg-bubble {
        background-color: transparent;
        color: var(--color-text-muted);
        border-radius: 99px;
        border: 1px solid var(--color-border);
        padding: 6px 18px;
        font-size: 12px;
        font-weight: 600;
        box-shadow: none;
      }
    }

    .msg-bubble {
      padding: 12px 18px;
      font-size: 13.5px;
      line-height: 1.5;
      font-weight: 500;
      white-space: pre-wrap;
      word-break: break-word;
    }

    /* Gemini Suggested Replies bar */
    .ai-suggestions-panel {
      padding: 16px 28px;
      border-top: 1px solid var(--bg-surface-container);
      background: rgba(74, 101, 79, 0.02);
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .suggestions-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;

      .suggestions-title {
        font-size: 11px;
        font-weight: 700;
        color: var(--color-primary);
        display: flex;
        align-items: center;
        gap: 6px;
        letter-spacing: 0.5px;
        text-transform: uppercase;

        .material-symbols-outlined {
          font-size: 16px;
          color: var(--color-primary);
        }
      }

      .reload-btn {
        background: none;
        border: none;
        font-size: 11px;
        color: var(--color-primary);
        font-weight: 700;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 6px;
        transition: var(--transition-smooth);

        &:hover {
          color: var(--color-primary-dim);
          transform: rotate(30deg);
        }

        &:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .material-symbols-outlined {
          font-size: 14px;
        }
      }
    }

    .suggestions-chips {
      display: flex;
      gap: 10px;
      overflow-x: auto;
      padding-bottom: 6px;
      scrollbar-width: thin;

      .suggestion-chip {
        background: var(--bg-surface);
        border: 1px solid var(--color-border);
        padding: 10px 16px;
        border-radius: var(--radius-full);
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        color: var(--color-text-muted);
        white-space: nowrap;
        transition: var(--transition-smooth);
        box-shadow: var(--shadow-soft);

        &:hover {
          border-color: var(--color-primary);
          color: var(--color-primary);
          background-color: var(--color-primary-light);
          transform: translateY(-1px);
          box-shadow: 0 4px 10px rgba(74, 101, 79, 0.08);
        }

        &:active {
          transform: scale(0.98);
        }
      }
    }

    /* Message Input Footer */
    .chat-footer {
      padding: 20px 28px;
      border-top: 1px solid var(--color-border);
      background-color: var(--bg-surface);
      display: flex;
      gap: 16px;
      align-items: center;

      .form-control {
        flex: 1;
        padding: 14px 20px;
        border-radius: 20px;
        font-size: 14px;
        background-color: var(--bg-surface-low);
        border: 1px solid var(--color-border);
        transition: var(--transition-smooth);

        &:focus {
          background-color: var(--bg-surface);
          border-color: var(--color-primary);
          box-shadow: 0 0 0 3px rgba(74, 101, 79, 0.12);
        }
      }
    }

    /* Elite Pill Nested CTAs & Kinetic micro-interactions */
    .btn-pill-cta {
      display: inline-flex;
      align-items: center;
      justify-content: space-between;
      padding: 6px 6px 6px 20px;
      background-color: var(--color-primary);
      color: var(--color-text-on-primary);
      border: none;
      border-radius: var(--radius-full); /* Fully rounded pill */
      font-weight: 600;
      font-size: 13.5px;
      cursor: pointer;
      transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.25s ease, box-shadow 0.25s ease;
      font-family: inherit;
      height: 44px;

      .cta-bubble {
        width: 32px;
        height: 32px;
        border-radius: var(--radius-full);
        background-color: rgba(255, 255, 255, 0.15);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: var(--transition-smooth);
        margin-left: 14px;

        .material-symbols-outlined {
          font-size: 16px;
          color: #ffffff;
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
      }

      &:hover:not(:disabled) {
        background-color: var(--color-primary-dim);
        box-shadow: 0 6px 15px rgba(74, 101, 79, 0.2);

        .cta-bubble {
          background-color: rgba(255, 255, 255, 0.25);
          
          .material-symbols-outlined {
            transform: translateX(2px) translateY(-1px) rotate(-15deg); /* Subtle diagonal translate & rotation tension */
          }
        }
      }

      &:active:not(:disabled) {
        transform: scale(0.97); /* Haptic spring compression */
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }

    .btn-pill-danger {
      display: inline-flex;
      align-items: center;
      justify-content: space-between;
      padding: 6px 6px 6px 20px;
      background-color: var(--color-error-bg);
      color: var(--color-error);
      border: 1px solid rgba(211, 47, 47, 0.15);
      border-radius: var(--radius-full);
      font-weight: 600;
      font-size: 13px;
      cursor: pointer;
      transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.25s ease, box-shadow 0.25s ease;
      font-family: inherit;
      height: 44px;

      .cta-bubble {
        width: 32px;
        height: 32px;
        border-radius: var(--radius-full);
        background-color: rgba(211, 47, 47, 0.08);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: var(--transition-smooth);
        margin-left: 14px;

        .material-symbols-outlined {
          font-size: 16px;
          color: var(--color-error);
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
      }

      &:hover:not(:disabled) {
        background-color: var(--color-error);
        color: white;
        box-shadow: 0 6px 15px rgba(211, 47, 47, 0.15);

        .cta-bubble {
          background-color: rgba(255, 255, 255, 0.2);
          
          .material-symbols-outlined {
            color: white;
            transform: scale(1.1) rotate(90deg); /* Rotate check circle badge kinetic lock */
          }
        }
      }

      &:active:not(:disabled) {
        transform: scale(0.97);
      }
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
