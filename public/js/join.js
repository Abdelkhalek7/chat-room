
const socket =  io()

const $joinForm = document.querySelector('#join-btn-form')
const $joinFormusername = $joinForm.querySelector('#jusername')
const $joinFormroom = $joinForm.querySelector('#jroom')
const $joinFormpassword = $joinForm.querySelector('#jpassword')

const $joinFormbtn = $joinForm.querySelector('button')

console.log($joinForm)
console.log('$joinForm')

console.log($joinFormbtn)
console.log('$joinForm')

console.log($joinFormroom)
console.log('$joinForm')
console.log($joinFormpassword)


console.log('here1')
$joinForm.addEventListener('submit', (e) => {
    e.preventDefault()

  
    //const message = e.target.elements.message.value
    const room=$joinFormroom.value
    const username = $joinFormusername.value
    console.log(room)
    console.log('$joinForm')
    console.log('here3')
    const password=$joinFormpassword.value
    console.log(password)
    socket.emit('chekjoin', username,room, password,(err) => {
      if(err==="1") {
             
         
        return alert('password or room name is wrong ')
      }else if(err==="2")
      {
        return alert('other user use same name in this room')
      }
  
    
      localStorage.setItem('username', username)
      localStorage.setItem('room', room)
        
        location.href = `chat.html`
    })
})

