$(document).ready(function () {
    let messageBoxColor = "#" + ((1 << 24) * Math.random() | 0).toString(16);
    console.log("ready!");

    const socket = io('http://localhost:3000');
    const messageContainer = document.getElementById('message-container');
    const messageForm = document.getElementById('send-container');
    const usernameInput = document.getElementById('username-input');
    const messageInputContainer = document.getElementById('message-input-container');
    const usernameInputContainer = document.getElementById('username-input-container');
    const messageInput = document.getElementById('message-input');
    const joinChatButton = document.getElementById('join-chat-button');
    const sendMessageButton = document.getElementById('send-message-button');


    messageInputContainer.style.display = 'none';
    messageInput.style.display = 'none';
    messageContainer.style.display = 'none';
    sendMessageButton.style.display = 'none';

    socket.on('chat-message', (messageData) => {
        appendMessage(`${messageData.name}: ${messageData.message}`, messageData.color)
    });

    socket.on('user-connected', (messageData) => {
        appendMessage(`${messageData.name} ha entrado a la sala`, messageData.color)
    });

    socket.on('user-disconnected', (messageData) => {
        appendMessage(`${messageData.name} ha salido de la sala`, messageData.color)
    });

    joinChatButton.addEventListener('click', e => {
        e.preventDefault();
        const name = usernameInput.value;

        usernameInputContainer.style.display = 'none';
        usernameInput.style.display = 'none';
        joinChatButton.style.display = 'none';

        messageInputContainer.style.display = 'block';
        messageInput.style.display = 'block';
        sendMessageButton.style.display = 'block';
        messageContainer.style.display = 'block';
        messageContainer.innerText = "";

        appendMessage('Te has unido a la sala', messageBoxColor);
        socket.emit('new-user', name, messageBoxColor);
    });

    sendMessageButton.addEventListener('click', e => {
        e.preventDefault();
        const message = messageInput.value;
        appendMessage(`Tú: ${message}`, messageBoxColor);
        socket.emit('send-chat-message', message);
        messageInput.value = '';
    });

    function appendMessage(message, color) {
        const messageElement = document.createElement('div');
        const messageBody = document.createElement('p');

        messageElement.className = 'card mb-2 mt-2';
        messageBody.className = 'card-text mb-2 mt-2 ml-2 mr-2';
        messageBody.style.color = 'white';

        messageElement.style.backgroundColor = color;

        messageBody.innerText = message;

        messageElement.append(messageBody);
        messageContainer.append(messageElement)
    }

});

