const socket =  io()

////////////////////////////////

//////////////

////////////////////////////////
// Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')

const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')
const $admin = document.querySelector('#admin')

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

// Options
//const { username, room ,password } =Qs.parse(location.search, { ignoreQueryPrefix: true })

const autoscroll = () => {
    // New message element
    const $newMessage = $messages.lastElementChild

    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // Visible height
    const visibleHeight = $messages.offsetHeight

    // Height of messages container
    const containerHeight = $messages.scrollHeight

    // How far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
}

socket.on('message', (message) => {
    console.log(message)
    console.log('message')

    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('locationMessage', (message) => {
    console.log(message)
    const html = Mustache.render(locationMessageTemplate, {
        username: message.username,
        url: message.url,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('roomData', ({ room, users,admin }) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users,
        admin
    })
    document.querySelector('#sidebar').innerHTML = html
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()

    $messageFormButton.setAttribute('disabled', 'disabled')

    const message = e.target.elements.message.value

    socket.emit('sendMessage', message, (error) => {
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()

        if (error) {
            return console.log(error)
        }

        console.log('Message delivered!')
    })
})

$sendLocationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser.')
    }

    $sendLocationButton.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            $sendLocationButton.removeAttribute('disabled')
            console.log('Location shared!')  
        })
    })
})


socket.on('beforeMessage', (messages) => {

   console.log(messages)
   let html
   messages.forEach((mg) =>{
     html = Mustache.render(messageTemplate, {
        username: mg.message.owner,
        message: mg.message.msg,
        createdAt: moment(parseInt(mg.message.time)).format('h:mm a')
        
   })


$messages.insertAdjacentHTML('beforeend', html)
})
$messages.scrollTop = $messages.scrollHeight

 })


 var username = localStorage.getItem('username');
 var room=localStorage.getItem('room')
 if(!room||!username){
    location.href='/'
 }
socket.emit('join', {username,room}, (error) => {
    if(error=="1") {
        $messageFormdelebtn.style.display = "none"
       
    }
    else if(error) {
        location.href='/'
        alert('password is wrong')
    }
})


const $messageFormdelebtn = document.querySelector("#deletebtn")
$messageFormdelebtn.addEventListener('click', () => {
    
    socket.emit('roomdeleted',room)
    location.href='/'
})


socket.on('deleted', (room) => {
  
    console.log('deleted')
    location.href='/'

})

//$messageFormdelebtn.style.visibility = "hidden"