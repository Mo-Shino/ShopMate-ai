import { create } from 'zustand';

export interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
    action?: 'add_to_cart_prompt'; // For when bot suggests a product
    productData?: any; // To store product details if action is triggered
    suggestedProducts?: any[]; // New: Array of products to display as cards
}

interface ChatState {
    messages: Message[];
    isTyping: boolean;
    addMessage: (message: Message) => void;
    setTyping: (typing: boolean) => void;
}

export const useChatStore = create<ChatState>((set) => ({
    messages: [
        {
            id: '1',
            text: 'أهلاً بك في فتح الله! أنا مساعدك الذكي. تحب أساعدك في إيه النهاردة؟',
            sender: 'bot',
            timestamp: new Date(),
        },
    ],
    isTyping: false,
    addMessage: (message) =>
        set((state) => ({ messages: [...state.messages, message] })),
    setTyping: (typing) => set({ isTyping: typing }),
}));
