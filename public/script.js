const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const myPeer = new Peer()
let myVideoStream;
let uId;
const myVideo = document.createElement('video')
myVideo.muted = true;
const peers = {}
users = []
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  myVideoStream = stream;
  addVideoStream(myVideo, stream)
  myPeer.on('call', call => {
    call.answer(stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
  })

  socket.on('user-connected', userId => {
    // connectToNewUser(userId, stream)
    setTimeout(function ()
    {
      connectToNewUser(userId, stream)
      users.push(userId)
      uId = userId
    },5000)
  })
  // input value
  let text = $("input");
  // when press enter send message
  $('html').keydown(function (e) {
    if (e.which == 13 && text.val().length !== 0) {
      socket.emit('message', text.val());
      text.val('')
    }
  });
  socket.on("createMessage", message => {
    $("ul").append(`<li class="message"><b>user: </b><br/>${message}</li>`);
    scrollToBottom()
  })
})

socket.on('user-disconnected', userId => {
  var pos = users.indexOf(userId);
    if (pos >= 0)
      users.splice(pos, 1);

  if (peers[userId]) peers[userId].close()
  uId = ''
})

myPeer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id)
  users.push(id)
  uId = id
})

function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream)
  const video = document.createElement('video')
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream)
  })
  call.on('close', () => {
    video.remove()
  })

  uId = userId
  peers[userId] = call
}

function addVideoStream(video, stream) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  videoGrid.append(video)
}


const scrollToBottom = () => {
  var d = $('.main__chat_window');
  d.scrollTop(d.prop("scrollHeight"));
}


const muteUnmute = () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  } else {
    setMuteButton();
    myVideoStream.getAudioTracks()[0].enabled = true;
  }
}

const playStop = () => {
  let enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    setPlayVideo()
  } else {
    setStopVideo()
    myVideoStream.getVideoTracks()[0].enabled = true;
  }
}

const setMuteButton = () => {
  const html = `
    <i class="fas fa-microphone"></i>
    <span>Mute</span>
  `
  document.querySelector('.main__mute_button').innerHTML = html;
}

const setUnmuteButton = () => {
  const html = `
    <i class="unmute fas fa-microphone-slash"></i>
    <span>Unmute</span>
  `
  document.querySelector('.main__mute_button').innerHTML = html;
}

const setStopVideo = () => {
  const html = `
    <i class="fas fa-video"></i>
    <span>Stop Video</span>
  `
  document.querySelector('.main__video_button').innerHTML = html;
}

const setPlayVideo = () => {
  const html = `
  <i class="stop fas fa-video-slash"></i>
    <span>Play Video</span>
  `
  document.querySelector('.main__video_button').innerHTML = html;
}

const showHideChat = () => {
  let enabled = document.getElementById('chatWin').value;
  if ('show'==enabled) {
    document.getElementById('chatWin').style.visibility = 'visible'
    document.getElementById('chatWin').value = 'hide'
    document.getElementById('disableChatAlt').style.visibility = 'hidden'
  } else {
    document.getElementById('chatWin').style.visibility = 'hidden'
    document.getElementById('chatWin').value = 'show'
    document.getElementById('disableChatAlt').style.visibility = 'visible'
  }
}

const leaveMeeting = () => {
  console.log('object')
  let enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
  }
    document.getElementById('chat_message').style.visibility = 'hidden'
    document.getElementById('controlDiv').innerHTML = ' '
    document.getElementById('video-grid').innerHTML = '<h3>You left the meeting</h3>'
}

function openNav() {
  document.getElementById("mySidebar").style.width = "350px";
  document.getElementById("main_left_part").style.marginLeft = "350px";
}

/* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
function closeNav() {
  document.getElementById("mySidebar").style.width = "0";
  document.getElementById("main_left_part").style.marginLeft = "0";
}


