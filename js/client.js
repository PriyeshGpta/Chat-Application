const socket = io('http://localhost:8000', {transports:["websocket"]});

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.container');
var audio = new Audio('iPhone - Message Notification.mp3');

const append = (message, position) =>{
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position == 'left')
    {
        audio.play();
    }
}

// Ask new user for his/her name and let the server know by emiting new-user-joined event.
const Name = prompt("Enter your name to join");
socket.emit('new-user-joined', Name); 

// If new user joins, recieve his/her name from the server.
socket.on('user-joined', Name =>{
    append(`${Name} joined the chat`, 'right');
})  

// If server sends a message, receive it. 
socket.on('receive', data =>{
    append(`${data.Name}: ${data.message}`, 'left');
})  

// If a user leaves the chat, append the info to the container.
socket.on('left', Name =>{
    append(`${Name} left the chat `, 'left');
})  

// If the form get submitted, send message to the server.
form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = '';
})