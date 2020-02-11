$(document).ready(function () {
    // connect with socket
    const socket = io('http://localhost:3000');

    // get dom elements
    const messageContainer = document.getElementById('message-container');
    const usernameInput = document.getElementById('username-input');
    const messageInputContainer = document.getElementById('message-input-container');
    const usernameInputContainer = document.getElementById('username-input-container');
    const messageInput = document.getElementById('message-input');
    const joinChatButton = document.getElementById('join-chat-button');
    const sendMessageButton = document.getElementById('send-message-button');

    // variable for store user message background color
    let messageBoxColor;

    // initially show join inputs and hide chat
    showJoin(true);
    showChat(false);

    // listen socket events
    listenSocket();

    function showJoin(isVisible) {
        usernameInputContainer.style.display = isVisible ? 'block' :'none';
        usernameInput.style.display = isVisible ? 'block' :'none';
        joinChatButton.style.display = isVisible ? 'block' :'none';
    }

    function showChat(isVisible) {
        messageInputContainer.style.display = isVisible ? 'block' :'none';
        messageInput.style.display = isVisible ? 'block' :'none';
        messageContainer.style.display = isVisible ? 'block' :'none';
        sendMessageButton.style.display = isVisible ? 'block' :'none';
    }

    function listenSocket()  {
        socket.on('chat-message', (messageData) => {
            appendMessage(`${messageData.name}: ${messageData.message}`, messageData.color)
        });

        socket.on('user-connected', (messageData) => {
            appendMessage(`${messageData.name} have joined to room`, messageData.color)
        });

        socket.on('user-disconnected', (messageData) => {
            appendMessage(`${messageData.name} leave room`, messageData.color)
        });
    }

    // join to room button listener
    joinChatButton.addEventListener('click', e => {
        e.preventDefault();
        // get username from input
        const username = usernameInput.value;

        // check if username are set
        if (!username) {
            alert('Username can not be empty');
            return;
        }

        // generate random color for new user
        messageBoxColor = "#" + ((1 << 24) * Math.random() | 0).toString(16);

        // hide join inputs and show chat
        showJoin(false);
        showChat(true);

        // clear message container
        messageContainer.innerText = "";

        // append new user joined to chat box
        appendMessage('You have joined', messageBoxColor);

        // emit new user event to server
        socket.emit('new-user', username, messageBoxColor);
    });

    // send message button listener
    sendMessageButton.addEventListener('click', e => {
        e.preventDefault();

        // getvalue from input
        const message = messageInput.value;

        // check if message are set
        if (!message) {
            alert('Message can not be empty')
        }

        // append message to chat box
        appendMessage(`You: ${message}`, messageBoxColor);

        // emit message event to server
        socket.emit('send-chat-message', message);

        // finally clear message input value
        messageInput.value = '';
    });

    function appendMessage(message, color) {
        // create dom elements
        const messageElement = document.createElement('div');
        const messageBody = document.createElement('p');

        // set style
        messageElement.className = 'card mb-2 mt-2';
        messageBody.className = 'card-text mb-2 mt-2 ml-2 mr-2';
        messageBody.style.color = 'white';
        messageElement.style.backgroundColor = color;

        // set received message to input value
        messageBody.innerText = message;

        // append message
        messageElement.append(messageBody);
        messageContainer.append(messageElement)
    }
});

