const socket = io("http://localhost:8000");

const send_form = document.getElementById("send_form");
const msg_inp = document.getElementById("msgbox");
const send_btn = document.getElementById("send_btn");
const msg_container = document.getElementById("msg_container");
let pop_audio = new Audio('pop.mp3');

const update_data = (name)=>{
    const update_msg = document.createElement('div');
    update_msg.classList.add('update_msg');
    update_msg.innerText = name + " the chat!";
    msg_container.append(update_msg);
}
const add_msg = (data)=>{
    const msg_div = document.createElement('div');
    msg_div.classList.add('msg');
    msg_div.innerHTML = `<div class="nametag">${data.name}</div> ${data.msg}`;

    if( data.name == 'you'){
        msg_div.classList.add('right');
    }
    else{
        pop_audio.play();
        msg_div.classList.add('left');
    }
    msg_container.append(msg_div);
    msg_container.scrollTop = msg_container.scrollHeight;
}

send_form.addEventListener('submit' , (e) =>{
    e.preventDefault();
    const msg = msg_inp.value;
    msg_inp.value = "";
    socket.emit('msg-send' , msg);
    add_msg( {name : 'you' , msg : msg});
})

const username = prompt("Welcome to online chat! \n \nEnter your name : ");
socket.emit('user-join', username);

socket.on('new-user' , name =>{
    update_data(name);
});

socket.on('msg-rec' , data => {
    add_msg(data);
})

socket.on('user-left' , name =>{
    update_data(name);
})