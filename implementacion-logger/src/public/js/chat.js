const socket = io();

socket.emit('all-messages')

socket.on('message-all', (data) => {
  render(data)
  let chat = document.getElementById("chat-messages");
  chat.scrollTop = chat.scrollHeight;
})

const render = (data) => {
  const html = data.map(elem => {
    return(
      `
        <div>
          <strong>${elem.user}</strong> dice <em>${elem.message}</em>
        </div>
      `
    )
  }).join(' ')
  document.getElementById("chat-messages").innerHTML = html;
}

const addMessage = () => {
  const msg = {
    user: document.getElementById("user").value,
    message: document.getElementById("message").value
  }

  document.getElementById("message").value = ''

  socket.emit('new-message', msg)
  return false
}