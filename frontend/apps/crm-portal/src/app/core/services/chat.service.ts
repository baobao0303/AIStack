import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import * as signalR from '@microsoft/signalr';

export interface ChatSession {
  id: string;
  customerEmail: string;
  assignedEmployeeId?: string;
  status: 'Queued' | 'Active' | 'Closed';
  summary?: string;
  buyerScore?: number;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  senderType: 'Customer' | 'Employee' | 'AI' | 'System';
  senderName: string;
  content: string;
  sentAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiBase = '/api'; // Proxied gateway root
  private hubConnection: signalR.HubConnection | null = null;

  // Real-time message events subject
  private messageReceivedSource = new BehaviorSubject<{ sessionId: string; message: ChatMessage } | null>(null);
  messageReceived$ = this.messageReceivedSource.asObservable();

  // Active status events
  private agentAssignedSource = new BehaviorSubject<{ sessionId: string; agentName: string } | null>(null);
  agentAssigned$ = this.agentAssignedSource.asObservable();

  // Mock sessions state for offline fallback resilience
  private mockSessions: ChatSession[] = [
    {
      id: 'session-001',
      customerEmail: 'customer1@gmail.com',
      status: 'Queued',
      createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString() // 5m ago
    },
    {
      id: 'session-002',
      customerEmail: 'customer2@test.com',
      assignedEmployeeId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', // John Doe
      status: 'Active',
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
    }
  ];

  private mockMessages: Record<string, ChatMessage[]> = {
    'session-001': [
      {
        id: 'msg-001',
        sessionId: 'session-001',
        senderType: 'Customer',
        senderName: 'Khách hàng',
        content: 'Cho mình hỏi về kích thước của Áo Khoác Len Thủ Công?',
        sentAt: new Date(Date.now() - 5 * 60 * 1000).toISOString()
      }
    ],
    'session-002': [
      {
        id: 'msg-002',
        sessionId: 'session-002',
        senderType: 'Customer',
        senderName: 'Khách hàng',
        content: 'Móc khóa Calcifer đan len có sẵn nhiều màu không shop?',
        sentAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
      },
      {
        id: 'msg-003',
        sessionId: 'session-002',
        senderType: 'Employee',
        senderName: 'John Doe',
        content: 'Dạ chào bạn, Calcifer tiệm đan sẵn các màu Đỏ, Xanh nước biển và hồng dâu nhé!',
        sentAt: new Date(Date.now() - 28 * 60 * 1000).toISOString()
      }
    ]
  };

  constructor(private http: HttpClient) {}

  // --- HTTP Endpoints ---

  getSessions(status?: string): Observable<ChatSession[]> {
    const url = status ? `${this.apiBase}/chatsessions?status=${status}` : `${this.apiBase}/chatsessions`;
    return this.http.get<ChatSession[]>(url).pipe(
      catchError(() => {
        console.warn('[CRM Chat API] Using resilient mock sessions state');
        let filtered = [...this.mockSessions];
        if (status) {
          filtered = filtered.filter(s => s.status === status);
        }
        return of(filtered);
      })
    );
  }

  getSessionMessages(sessionId: string): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>(`${this.apiBase}/chatsessions/${sessionId}/messages`).pipe(
      catchError(() => {
        console.warn('[CRM Chat API] Using resilient mock messages state');
        return of(this.mockMessages[sessionId] || []);
      })
    );
  }

  assignSession(sessionId: string, employeeId: string): Observable<any> {
    return this.http.put(`${this.apiBase}/chatsessions/${sessionId}/assign`, { employeeId }).pipe(
      catchError(() => {
        console.warn('[CRM Chat API] Using resilient mock session assignment');
        const session = this.mockSessions.find(s => s.id === sessionId);
        if (session) {
          session.assignedEmployeeId = employeeId;
          session.status = 'Active';
        }
        return of({ success: true });
      })
    );
  }

  // --- SignalR WebSockets Integration ---

  connectToHub(): void {
    if (this.hubConnection && this.hubConnection.state !== signalR.HubConnectionState.Disconnected) {
      return;
    }

    const hubUrl = '/hubs/chat';

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, {
        skipNegotiation: false,
        transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling
      })
      .withAutomaticReconnect()
      .build();

    // Listen to received messages in real-time
    this.hubConnection.on('ReceiveMessage', (senderType: string, senderName: string, content: string, sentAt: string) => {
      // Find or parse session context
      const currentActiveSession = this.messageReceivedSource.value?.sessionId;
      const newMsg: ChatMessage = {
        id: 'msg-live-' + Math.random(),
        sessionId: currentActiveSession || 'unknown',
        senderType: senderType as any,
        senderName,
        content,
        sentAt
      };
      
      this.messageReceivedSource.next({
        sessionId: currentActiveSession || 'live',
        message: newMsg
      });
    });

    // Listen to agent assignments
    this.hubConnection.on('AgentAssigned', (agentId: string, agentName: string) => {
      this.agentAssignedSource.next({
        sessionId: 'live',
        agentName
      });
    });

    this.hubConnection.start()
      .then(() => console.log('[CRM SignalR] Connected successfully to live support ChatHub.'))
      .catch(err => {
        console.warn('[CRM SignalR] Hub connection failed. Operating in offline simulation mode.', err);
      });
  }

  joinSessionRoom(sessionId: string): void {
    if (this.hubConnection && this.hubConnection.state === signalR.HubConnectionState.Connected) {
      this.hubConnection.invoke('JoinSession', sessionId)
        .catch(err => console.error('[CRM SignalR] JoinSession invocation failed', err));
    }
  }

  sendMessageToRoom(sessionId: string, senderName: string, content: string): void {
    if (this.hubConnection && this.hubConnection.state === signalR.HubConnectionState.Connected) {
      this.hubConnection.invoke('SendMessage', sessionId, 'Employee', senderName, content)
        .catch(err => console.error('[CRM SignalR] SendMessage invocation failed', err));
    } else {
      // Simulating reply in mock mode
      const newMsg: ChatMessage = {
        id: 'msg-' + Date.now(),
        sessionId,
        senderType: 'Employee',
        senderName,
        content,
        sentAt: new Date().toISOString()
      };
      if (!this.mockMessages[sessionId]) this.mockMessages[sessionId] = [];
      this.mockMessages[sessionId].push(newMsg);

      // Trigger automatic simulation reply from customer
      setTimeout(() => {
        const replies = [
          'Dạ em hiểu rồi ạ, em muốn chọn đan màu sage green nhé.',
          'Nghệ nhân khuyên nên lấy size nào vừa vai 42cm ạ?',
          'Vâng ạ, vậy shop ship giúp em về địa chỉ cũ nha!'
        ];
        const randomReply = replies[Math.floor(Math.random() * replies.length)];
        const customerMsg: ChatMessage = {
          id: 'msg-' + Date.now() + '-c',
          sessionId,
          senderType: 'Customer',
          senderName: 'Khách hàng',
          content: randomReply,
          sentAt: new Date().toISOString()
        };
        this.mockMessages[sessionId].push(customerMsg);
        this.messageReceivedSource.next({
          sessionId,
          message: customerMsg
        });
      }, 1500);
    }
  }

  disconnectHub(): void {
    if (this.hubConnection) {
      this.hubConnection.stop();
      this.hubConnection = null;
    }
  }
}
