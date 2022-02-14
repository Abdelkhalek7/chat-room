const socket =  io()

const $createForm = document.querySelector('#create-btn-form')
const $createFormusername = $createForm.querySelector('#cusername')
const $createFormroom = $createForm.querySelector('#croom')
const $createFormpassword = $createForm.querySelector('#cpassword')

const $createFormbtn = $createForm.querySelector('button')

console.log($createForm)
console.log('$joinForm')

 console.log($createFormbtn);
 console.log("$joinForm");

 console.log($createFormroom);
console.log("$joinForm");
console.log($createFormpassword.value);

$createForm.addEventListener("submit", (e) => {
  e.preventDefault();

  //const message = e.target.elements.message.value
  const room = $createFormroom.value;
  const username = $createFormusername.value;
  console.log(room);
  console.log("$joinForm");
  const password = $createFormpassword.value;
  console.log(password);
  socket.emit( 'createroom',username, room, password,
    (e) => {
      if(e)
      {
         return alert("room name is already existing");
      }
      localStorage.setItem('username', username)
      localStorage.setItem('room', room)

      location.href = `chat.html`;
    }
  )
});

