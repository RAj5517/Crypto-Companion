class SimpleChatBot {
    constructor() {
        this.container = document.querySelector('.chatbot-section');
        this.messagesContainer = document.querySelector('.chat-messages');
        this.inputField = document.querySelector('.chat-input input');
        this.sendButton = document.querySelector('.chat-input button');
        this.toggleButton = document.querySelector('.chatbot-toggle');
        
        this.apiUrl = 'https://api.gemini.com/v1'; // Gemini API base URL

        this.initialize();
    }

    initialize() {
        // Event listeners
        this.sendButton.addEventListener('click', () => this.handleSend());
        this.inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSend();
        });
        this.toggleButton.addEventListener('click', () => this.toggleChat());

        // Initial greeting
        this.addMessage('Hello! I\'m here to chat with you. How can I assist you today?', 'bot');
    }

    handleSend() {
        const message = this.inputField.value.trim();
        if (message) {
            this.addMessage(message, 'user');
            this.inputField.value = '';
            this.processMessage(message);
        }
    }

    async processMessage(message) {
        // Add loading indicator
        const loadingId = this.addLoadingIndicator();

        try {
            let response;
            if (message.toLowerCase().includes('crypto price')) {
                response = await this.getCryptoPrice(message);
            } else {
                response = this.generateResponse(message);
            }
            
            // Remove loading indicator and add response
            this.removeLoadingIndicator(loadingId);
            this.addMessage(response, 'bot');
        } catch (error) {
            this.removeLoadingIndicator(loadingId);
            this.addMessage('Sorry, I encountered an error. Please try again.', 'bot');
        }
    }

    async getCryptoPrice(message) {
        const cryptoSymbol = this.extractCryptoSymbol(message);
        if (!cryptoSymbol) {
            return 'Please provide a valid cryptocurrency symbol (e.g., BTC, ETH) for price information.';
        }

        const url = `${this.apiUrl}/pubticker/${cryptoSymbol}usd`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            return 'I couldn\'t retrieve data for that cryptocurrency symbol. Please try another one.';
        }

        const price = data.last;
        return `The latest price for ${cryptoSymbol.toUpperCase()} is $${price}.`;
    }

    extractCryptoSymbol(message) {
        const words = message.split(' ');
        for (let word of words) {
            if (word.length <= 5 && /^[A-Za-z]+$/.test(word)) {
                return word.toLowerCase();
            }
        }
        return null;
    }

    generateResponse(message) {
        const lowerMessage = message.toLowerCase();

        if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
            return 'Hello! How can I help you today?';
        } else if (lowerMessage.includes('how are you')) {
            return 'I\'m just a bot, but I\'m here to help you!';
        } else if (lowerMessage.includes('help')) {
            return 'Sure, I\'m here to assist you. What do you need help with?';
        } else {
            return 'I\'m not sure how to respond to that, but I\'m here to chat!';
        }
    }

    addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender);
        messageDiv.textContent = text;
        this.messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }

    addLoadingIndicator() {
        const loadingDiv = document.createElement('div');
        loadingDiv.classList.add('message', 'bot', 'loading');
        loadingDiv.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
        this.messagesContainer.appendChild(loadingDiv);
        this.scrollToBottom();
        return loadingDiv.id = 'loading-' + Date.now();
    }

    removeLoadingIndicator(id) {
        const loadingDiv = document.getElementById(id);
        if (loadingDiv) loadingDiv.remove();
    }

    scrollToBottom() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    toggleChat() {
        this.container.classList.toggle('minimized');
        this.toggleButton.innerHTML = this.container.classList.contains('minimized') ? '↑' : '↓';
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SimpleChatBot();
}); 