const socket = io();

const clientTotal = document.getElementById('client-total');
const messageContainer = document.getElementById('message-container');
const nameInput = document.getElementById('name-input');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');

const messageTone = new Audio('/notification.mp3'); // Replace with your actual path

// Handle client total update
socket.on('clients-total', (total) => {
    clientTotal.innerText = `Total clients: ${total}`;
});

// Handle form submit
messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    sendMessage();
});

// Send message
function sendMessage() {
    const message = messageInput.value.trim();
    if (message === '') return;

    const data = {
        name: nameInput.value || 'anonymous',
        message: message,
        dateTime: new Date()
    };

    socket.emit('message', data); // Send to server
    addMessageToUI(true, data);   // Show on right side
    messageInput.value = '';
}

// Receive message from other clients
socket.on('chat-message', (data) => {
    messageTone.play();
    addMessageToUI(false, data); // Show on left side
});

// Add message to UI
function addMessageToUI(isOwnMessage, data) {
    clearFeedback();

    const messageElement = document.createElement('li');
    messageElement.className = isOwnMessage ? 'message-right' : 'message-left';

    const msg = document.createElement('p');
    msg.className = 'message';
    msg.innerText = data.message;

    const span = document.createElement('span');
    span.innerText = `${data.name} • ${moment(data.dateTime).fromNow()}`;

    msg.appendChild(span);
    messageElement.appendChild(msg);
    messageContainer.appendChild(messageElement);

    scrollToBottom();
}

// Scroll to bottom
function scrollToBottom() {
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

// Typing feedback
messageInput.addEventListener('focus', () => {
    socket.emit('feedback', {
        feedback: `${nameInput.value} is typing a message`
    });
});

messageInput.addEventListener('keypress', () => {
    socket.emit('feedback', {
        feedback: `${nameInput.value} is typing a message`
    });
});

messageInput.addEventListener('blur', () => {
    socket.emit('feedback', {
        feedback: ''
    });
});

// Clear feedback
function clearFeedback() {
    document.querySelectorAll('li.message-feedback').forEach((el) => el.remove());
}

// Show typing feedback
socket.on('feedback', (data) => {
    clearFeedback();

    if (data.feedback) {
        const feedbackElement = document.createElement('li');
        feedbackElement.className = 'message-feedback';

        const p = document.createElement('p');
        p.className = 'feedback';
        p.id = 'feedback';
        p.innerText = data.feedback;

        feedbackElement.appendChild(p);
        messageContainer.appendChild(feedbackElement);

        scrollToBottom();
    }
});
