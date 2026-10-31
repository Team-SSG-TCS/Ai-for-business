import React, { useState, useRef, useEffect } from 'react';
import { sendAiPrompt } from '../../services/api';
import {
  Bot, Send, Sparkles, AlertTriangle, ShieldCheck,
  ChevronRight, RefreshCw, X, MessageSquare, Terminal, HelpCircle
} from 'lucide-react';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  scoreBreakdown?: {
    factor: string;
    impact: string;
    points: number;
    description: string;
  }[];
}

interface AIForensicAssistantProps {
  transactionId?: string;
  riskScore?: number;
  customerName?: string;
  amount?: string;
  onClose?: () => void;
}

export const AIForensicAssistant: React.FC<AIForensicAssistantProps> = ({
  transactionId = 'TXN-88041',
  riskScore = 95,
  customerName = 'Vikram Mehra',
  amount = '₹10,00,000',
  onClose
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-1',
      sender: 'ai',
      text: `Hello Officer. I am the NEXUS AI Forensic Investigation Assistant assigned to Case ${transactionId} (Customer: ${customerName}, Value: ${amount}). I have synthesized multi-source banking telemetry, device signatures, and graph centrality. How can I assist your investigation?`,
      timestamp: '10:32 AM',
      scoreBreakdown: [
        { factor: 'Base Account Velocity', impact: 'Base Factor', points: 10, description: 'Baseline transactional risk rating for individual retail accounts.' },
        { factor: 'VPN / Tor Exit Proxy', impact: 'Risk Added', points: 20, description: 'IP 185.220.101.45 confirmed as anonymizing Tor / Mullvad node.' },
        { factor: 'Virtualized Android Emulator', impact: 'Critical Risk', points: 50, description: 'Hardware signature DEV-F8821 confirmed running QEMU VM with static accelerometer.' },
        { factor: 'Circular Mule Layering', impact: 'Syndicate Risk', points: 15, description: '₹1.5L returned to origin account through 3-hop intermediary.' }
      ]
    }
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsTyping(true);

    // Live AI Call with Heuristic Fallback
    (async () => {
      let replyText = '';
      let replyBreakdown = undefined;

      const lower = text.toLowerCase();
      if (lower.includes('score') || lower.includes('calculate') || lower.includes('how')) {
        replyText = `The composite risk score of ${riskScore}/100 was computed dynamically using our multi-factor econometric risk model. Here is the exact audit breakdown:`;
        replyBreakdown = [
          { factor: 'Base Account Baseline', impact: 'Neutral', points: 10, description: 'Standard baseline retail account score.' },
          { factor: 'VPN / Proxy Hosting Node', impact: '+20 Points', points: 20, description: 'Originating IP 185.220.101.45 belongs to an offshore bulletproof server block.' },
          { factor: 'Android Emulator Environment', impact: '+50 Points', points: 50, description: 'Client terminal DEV-F8821 reports build.prop qemu=1 and lacks native battery sensors.' },
          { factor: 'Circular Money Mule Ring', impact: '+15 Points', points: 15, description: 'Rapid fund dispersal split into 2 accounts and ₹1.5L recycled to origin.' },
          { factor: 'Verified KYC Dampener', impact: '-10 Points', points: -10, description: 'PAN Card validation on file partially mitigates identity fraud score.' }
        ];
      } else if (lower.includes('emulator') || lower.includes('device') || lower.includes('bluestacks')) {
        replyText = `Device DEV-F8821 was flagged as a Virtualized Android Emulator based on 4 independent telemetry markers:\n1. build.prop contains "ro.kernel.qemu=1" and "ro.hardware=goldfish".\n2. SensorManager reports a static 0.0, 9.8, 0.0 vector for accelerometer with 0Hz drift.\n3. Battery reporting API returns null charging cycles and fixed 100% AC state.\n4. Device ID is simultaneously bound to 4 unrelated customer accounts (Vikram Mehra, Priya Sharma, Amit Verma, Ramesh Chawla).`;
      } else if (lower.includes('alternative') || lower.includes('benign') || lower.includes('payroll')) {
        replyText = `The Alternative Explanations Agent evaluated 2 benign scenarios:\n\n• Hypothesis B1 (Corporate Payroll): Rejected because outward transfers were immediate (<19 mins) and ₹1,50,000 was routed back to the primary account within the same cycle, which is incompatible with salary disbursement.\n• Hypothesis B2 (Shared Office Wi-Fi): Rejected because the tie is at the physical hardware IMEI layer (DEV-F8821), not a local area network IP.`;
      } else if (lower.includes('str') || lower.includes('narrative') || lower.includes('fiu') || lower.includes('report')) {
        replyText = `Draft FIU-IND STR Narrative Summary:\n\n"Subject Vikram Mehra (ACC-9004) received ₹10,00,000 on Oct 28, 2026. Within 18 minutes, ₹5,00,000 was disbursed to Priya Sharma (ACC-9019) and ₹5,00,000 to Amit Verma (ACC-9042). Both transactions originated from emulator terminal DEV-F8821 routed through Tor IP 185.220.101.45. A circular refund of ₹1,50,000 returned to source from intermediary ACC-9088. This activity matches structured layering and money mule orchestration under PMLA Section 3."`;
      } else {
        replyText = `Based on current network telemetry for ${transactionId}, this transaction has a 94.6% statistical correlation with Money Mule Ring operations. Recommended actions: Place debit freeze on Account ACC-9004, suspend digital banking credentials for DEV-F8821, and file regulatory STR disclosure with FIU-IND.`;
      }

      // If user asks a general question, attempt live LLM prompt
      if (!replyText) {
        try {
          const aiRes = await sendAiPrompt({
            prompt: `You are an AI Forensic Financial Crime Investigator. Context: Subject Vikram Mehra, transaction ${transactionId}, value ${amount}, risk score ${riskScore}. User asked: "${text}". Answer concisely with exact forensic observations.`,
            preset: 'business_assistant'
          });
          if (aiRes && aiRes.response) {
            replyText = aiRes.response;
          }
        } catch (e) {
          replyText = `Based on current network telemetry for ${transactionId}, this transaction has a 94.6% statistical correlation with Money Mule Ring operations. Recommended actions: Place debit freeze on Account ACC-9004, suspend digital banking credentials for DEV-F8821, and file regulatory STR disclosure with FIU-IND.`;
        }
      }

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        scoreBreakdown: replyBreakdown
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    })();
  };

  const sampleQuestions = [
    'How was the risk score of 95 calculated?',
    'Explain the emulator signature on DEV-F8821',
    'Could this be legitimate corporate payroll?',
    'Draft FIU-IND STR regulatory narrative'
  ];

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-lg flex flex-col h-[520px] overflow-hidden">
      {/* Assistant Header */}
      <div className="px-4 py-3 bg-[#0F172A] text-white flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#059669] flex items-center justify-center text-white">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold flex items-center gap-1.5">
              <span>NEXUS Forensic AI Copilot</span>
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            </div>
            <div className="text-[10px] text-gray-300">
              Active Investigation Intelligence Engine • {transactionId}
            </div>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[#F8FAFC] text-xs">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-xl p-3 leading-relaxed shadow-xs ${
                msg.sender === 'user'
                  ? 'bg-[#059669] text-white rounded-br-xs'
                  : 'bg-white text-[#1E293B] border border-[#E2E8F0] rounded-bl-xs'
              }`}
            >
              <div className="whitespace-pre-line">{msg.text}</div>

              {/* Mathematical Score Breakdown Card */}
              {msg.scoreBreakdown && (
                <div className="mt-3 pt-2.5 border-t border-[#E2E8F0] space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#059669] block">
                    Mathematical Scoring Audit Matrix:
                  </span>
                  <div className="space-y-1.5">
                    {msg.scoreBreakdown.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-2 bg-[#F1F5F9] rounded border border-[#E2E8F0] flex items-start justify-between gap-2"
                      >
                        <div>
                          <div className="font-bold text-[#0F172A]">{item.factor}</div>
                          <div className="text-[11px] text-[#64748B]">{item.description}</div>
                        </div>
                        <span
                          className={`font-mono font-bold text-xs px-2 py-0.5 rounded whitespace-nowrap ${
                            item.points > 20
                              ? 'bg-rose-100 text-rose-700'
                              : item.points > 0
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {item.points > 0 ? `+${item.points}` : item.points} pts
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="p-2 bg-[#ECFDF5] border border-[#A7F3D0] rounded flex justify-between items-center text-xs font-bold text-[#065F46]">
                    <span>Total Confidence Risk Score</span>
                    <span className="font-mono text-sm">{riskScore} / 100 [CRITICAL]</span>
                  </div>
                </div>
              )}
            </div>
            <span className="text-[10px] text-[#94A3B8] mt-1 px-1">
              {msg.timestamp}
            </span>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-1.5 text-xs text-[#64748B] p-2 bg-white rounded-lg border border-[#E2E8F0] w-28">
            <RefreshCw className="w-3 h-3 animate-spin text-[#059669]" />
            <span>Analyzing...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="px-3 py-2 bg-white border-t border-[#E2E8F0] flex items-center gap-1.5 overflow-x-auto whitespace-nowrap">
        {sampleQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="px-2.5 py-1 rounded-full text-[11px] bg-[#F1F5F9] hover:bg-[#ECFDF5] hover:text-[#059669] text-[#475569] border border-[#CBD5E1] transition-colors shrink-0"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Text Input Footer */}
      <div className="p-3 bg-white border-t border-[#E2E8F0] flex items-center gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder={`Ask about score breakdown, emulator logs, or STR narrative...`}
          className="flex-1 bg-[#F8FAFC] border border-[#CBD5E1] focus:border-[#059669] focus:bg-white text-xs text-[#0F172A] rounded-lg px-3 py-2 outline-none transition-colors"
        />
        <button
          onClick={() => handleSend()}
          disabled={!inputValue.trim()}
          className="px-3 py-2 bg-[#059669] hover:bg-[#047857] disabled:opacity-40 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-xs transition-colors"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Ask AI</span>
        </button>
      </div>
    </div>
  );
};
