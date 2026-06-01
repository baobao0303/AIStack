'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useAppStore } from '../../store/app.store';
import * as signalR from '@microsoft/signalr';

interface Message {
  senderType: 'Customer' | 'Employee' | 'AI' | 'System';
  senderName: string;
  content: string;
  sentAt: string;
}

export default function SupportChat() {
  const { isSupportChatOpen, setIsSupportChatOpen } = useAppStore(
    useShallow((state) => ({
      isSupportChatOpen: state.isSupportChatOpen,
      setIsSupportChatOpen: state.setIsSupportChatOpen,
    }))
  );

  const [customerEmail, setCustomerEmail] = useState('');
  const [isChatInitiated, setIsChatInitiated] = useState(false);
  const [chatSessionId, setChatSessionId] = useState<string | null>(null);
  const [chatStatus, setChatStatus] = useState<'Init' | 'Queued' | 'Active' | 'Closed'>('Init');
  const [assignedAgentName, setAssignedAgentName] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [typedMessage, setTypedMessage] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  const connectionRef = useRef<signalR.HubConnection | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll messages to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Clean up socket connections on unmount
  useEffect(() => {
    return () => {
      if (connectionRef.current) {
        connectionRef.current.stop();
      }
    };
  }, []);

  const handleStartChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerEmail.trim()) return;

    setIsConnecting(true);
    setIsChatInitiated(true);
    setChatStatus('Queued');

    const gatewayHubUrl = 'http://localhost:5119/hubs/chat';

    try {
      // 1. Build SignalR Connection targeting API Gateway hub route
      const conn = new signalR.HubConnectionBuilder()
        .withUrl(gatewayHubUrl, {
          skipNegotiation: false,
          transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling
        })
        .withAutomaticReconnect()
        .configureLogging(signalR.LogLevel.Information)
        .build();

      // 2. Register Hub Client Event Receivers
      conn.on('AgentAssigned', (agentId: string, agentName: string) => {
        setAssignedAgentName(agentName);
        setChatStatus('Active');
        setMessages((prev) => [
          ...prev,
          {
            senderType: 'System',
            senderName: 'Hệ thống',
            content: `Nghệ nhân ${agentName} đã tham gia phòng tư vấn.`,
            sentAt: new Date().toISOString()
          }
        ]);
      });

      conn.on('ChatQueued', () => {
        setChatStatus('Queued');
      });

      conn.on('ReceiveMessage', (senderType: string, senderName: string, content: string, sentAt: string) => {
        setMessages((prev) => [
          ...prev,
          {
            senderType: senderType as any,
            senderName,
            content,
            sentAt
          }
        ]);
      });

      conn.on('ChatClosed', () => {
        setChatStatus('Closed');
        setMessages((prev) => [
          ...prev,
          {
            senderType: 'System',
            senderName: 'Hệ thống',
            content: 'Phiên tư vấn này đã kết thúc. Cảm ơn bạn!',
            sentAt: new Date().toISOString()
          }
        ]);
        if (connectionRef.current) {
          connectionRef.current.stop();
        }
      });

      // 3. Establish socket connection
      await conn.start();
      connectionRef.current = conn;

      // 4. Invoke server methods to create session & matchmake routing
      const tenantId = '11111111-1111-1111-1111-111111111111'; // default workspace tenant
      const sessionId = await conn.invoke<string>('InitiateChat', tenantId, customerEmail);
      setChatSessionId(sessionId);
      setIsConnecting(false);

    } catch (err) {
      console.warn('[Support Chat] SignalR Hub connection failed. Switched to smart mock client mode.', err);
      // Online fallback resilience: Trigger automated chatbot
      setIsConnecting(false);
      setChatStatus('Active');
      setAssignedAgentName('Nghệ nhân Mai Chi');
      
      setMessages([
        {
          senderType: 'System',
          senderName: 'Hệ thống',
          content: 'Đang kết nối thời gian thực... Bạn đã được kết nối với Kênh Tư Vấn Nghệ Nhân (Chế độ tự động phục hồi).',
          sentAt: new Date().toISOString()
        },
        {
          senderType: 'Employee',
          senderName: 'Nghệ nhân Mai Chi',
          content: 'Chào bạn! Mình là Mai Chi, nghệ nhân đan len tại Tiệm Nhà Zịt. Bạn đang cần hỗ trợ đan móc hay tùy chỉnh kích thước cho sản phẩm nào thế?',
          sentAt: new Date().toISOString()
        }
      ]);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim()) return;

    const messageContent = typedMessage;
    setTypedMessage('');

    // Append customer message locally
    const customerMsg: Message = {
      senderType: 'Customer',
      senderName: 'Bạn',
      content: messageContent,
      sentAt: new Date().toISOString()
    };
    setMessages((prev) => [...prev, customerMsg]);

    if (connectionRef.current && chatSessionId) {
      try {
        // Send to SignalR Hub
        await connectionRef.current.invoke('SendMessage', chatSessionId, 'Customer', 'Khách hàng', messageContent);
      } catch (err) {
        console.error('[Support Chat] Could not relay socket message', err);
      }
    } else {
      // Mock Auto-reply script
      setTimeout(() => {
        let reply = 'Các sản phẩm đan móc của tiệm được chế tác hoàn toàn thủ công bằng sợi cotton hữu cơ tự nhiên, cực kỳ mềm mịn, không phai màu và an toàn tuyệt đối cho làn da của bé nhé!';
        if (messageContent.toLowerCase().includes('size') || messageContent.toLowerCase().includes('áo')) {
          reply = 'Đối với các dòng áo len cardigan, tiệm hỗ trợ tùy chỉnh hoàn toàn số đo vai, dài tay và ngực. Bạn chỉ cần điền ghi chú số đo lúc đặt hàng hoặc nhắn riêng số đo cho mình đan riêng nhé!';
        } else if (messageContent.toLowerCase().includes('calcifer') || messageContent.toLowerCase().includes('móc khóa')) {
          reply = 'Móc khóa Calcifer đan len hiện là dòng Best Seller của tiệm! Đơn hàng đan thủ công thường được nghệ nhân chuẩn bị chu đáo và giao đi trong vòng 2-3 ngày bạn nha!';
        }
        setMessages((prev) => [
          ...prev,
          {
            senderType: 'Employee',
            senderName: 'Nghệ nhân Mai Chi',
            content: reply,
            sentAt: new Date().toISOString()
          }
        ]);
      }, 1000);
    }
  };

  if (!isSupportChatOpen) {
    // Floating circular bubble trigger (Visible across all page routes)
    return (
      <button
        onClick={() => setIsSupportChatOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-sage text-white rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 shadow-[0_8px_24px_rgba(74,101,79,0.3)] hover:shadow-[0_12px_32px_rgba(74,101,79,0.45)] hover:scale-110 active:scale-95 border-none z-[999] group"
        title="Tư vấn trực tiếp với nghệ nhân"
      >
        <span className="material-symbols-outlined text-[26px] transition-transform duration-300 group-hover:rotate-12 text-white">support_agent</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-[360px] h-[500px] z-[1000] flex flex-col bg-[rgba(244,244,240,0.92)] backdrop-blur-md border border-sage/10 rounded-[28px] p-3.5 shadow-[0_12px_40px_rgba(74,69,62,0.15)] animate-[slideUp_0.4s_cubic-bezier(0.16,1,0.3,1)] font-sans">
      <div className="flex-1 flex flex-col bg-white rounded-[20px] shadow-sm border border-customBorder/30 overflow-hidden">
        {/* Hub header panel */}
        <header className="px-4 py-3.5 border-b border-customBorder/30 bg-ivory flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sage animate-pulse"></span>
            <div>
              <h3 className="font-serif font-bold text-sm text-charcoal/90 leading-tight">Hỗ trợ Nghệ nhân</h3>
              <p className="text-[10px] text-charcoal/50 leading-none mt-0.5">
                {chatStatus === 'Active' ? `Đang chat với ${assignedAgentName}` : 'Phòng chat trực tuyến'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsSupportChatOpen(false)}
            className="w-7 h-7 rounded-full hover:bg-sage/10 flex items-center justify-center text-charcoal/60 hover:text-charcoal transition-all border-none cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </header>

        {/* Dynamic chat states */}
        {chatStatus === 'Init' && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <span className="material-symbols-outlined text-[44px] text-sage/80 mb-3 bg-sage/5 w-16 h-16 rounded-full flex items-center justify-center">support_agent</span>
            <h4 className="font-serif font-bold text-sm text-charcoal/80">Trò chuyện trực tiếp</h4>
            <p className="text-xs text-charcoal/50 mt-1 max-w-[24ch] leading-relaxed">
              Nhập email để chúng mình kết nối bạn đến nghệ nhân đan len lành nghề trong ca trực nhé.
            </p>
            <form onSubmit={handleStartChat} className="w-full mt-5 flex flex-col gap-3">
              <input
                type="email"
                placeholder="Nhập email của bạn..."
                required
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-ivory/80 border border-customBorder/60 rounded-xl text-xs text-charcoal focus:outline-none focus:border-sage focus:ring-1 focus:ring-sage/20 transition-all font-sans"
              />
              <button
                type="submit"
                disabled={isConnecting}
                className="w-full bg-sage text-white py-2.5 rounded-xl font-bold text-xs cursor-pointer border-none flex items-center justify-center gap-2 hover:bg-sage/90 active:scale-[0.98] transition-all"
              >
                <span>{isConnecting ? 'Đang kết nối...' : 'Bắt đầu Tư vấn'}</span>
                <span className="material-symbols-outlined text-[14px] text-white">arrow_forward</span>
              </button>
            </form>
          </div>
        )}

        {chatStatus === 'Queued' && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <span className="material-symbols-outlined text-[44px] text-sage/80 mb-3 animate-spin w-16 h-16 rounded-full bg-sage/5 flex items-center justify-center">hourglass_empty</span>
            <h4 className="font-serif font-bold text-sm text-charcoal/80">Đang tìm nghệ nhân...</h4>
            <p className="text-xs text-charcoal/50 mt-1 max-w-[25ch] leading-relaxed">
              Hệ thống đang định tuyến và tìm nghệ nhân rảnh rỗi trong ca trực. Vui lòng giữ cửa sổ chat này.
            </p>
          </div>
        )}

        {(chatStatus === 'Active' || chatStatus === 'Closed') && (
          <div className="flex-1 flex flex-col min-h-0 bg-ivory/20">
            {/* Scrollable messages log */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 min-h-0">
              {messages.map((msg, i) => {
                if (msg.senderType === 'System') {
                  return (
                    <div key={i} className="text-center my-1 select-none">
                      <span className="px-3 py-1 bg-sage/5 text-sage text-[9px] font-bold rounded-full border border-sage/10 font-sans tracking-wide uppercase">
                        {msg.content}
                      </span>
                    </div>
                  );
                }

                const isSelf = msg.senderType === 'Customer';
                return (
                  <div key={i} className={`flex flex-col max-w-[80%] ${isSelf ? 'self-end items-end' : 'self-start items-start'}`}>
                    <span className="text-[9px] text-charcoal/40 font-bold mb-0.5 px-1">{msg.senderName}</span>
                    <div className={`px-3 py-2.5 rounded-2xl text-xs font-sans leading-relaxed shadow-sm border ${
                      isSelf
                        ? 'bg-sage text-white rounded-br-none border-sage/10'
                        : 'bg-white text-charcoal rounded-bl-none border-customBorder/30'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input relay bar */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-customBorder/30 bg-white flex gap-2">
              <input
                type="text"
                disabled={chatStatus === 'Closed'}
                placeholder={chatStatus === 'Closed' ? 'Đã đóng phòng chat...' : 'Gửi lời nhắn đến nghệ nhân...'}
                value={typedMessage}
                onChange={(e) => setTypedMessage(e.target.value)}
                className="flex-1 px-3.5 py-2.5 bg-ivory/60 border border-customBorder/50 rounded-xl text-xs text-charcoal focus:outline-none focus:border-sage focus:bg-white focus:ring-1 focus:ring-sage/20 transition-all font-sans"
              />
              <button
                type="submit"
                disabled={chatStatus === 'Closed' || !typedMessage.trim()}
                className="w-10 h-10 rounded-xl bg-sage text-white flex items-center justify-center cursor-pointer border-none transition-all hover:bg-sage/90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-[16px] text-white">send</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
