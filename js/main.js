var promisifiedOldGUM = function(constraints) {

  // First get ahold of getUserMedia, if present
  var getUserMedia = (navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia);

  // Some browsers just don't implement it - return a rejected promise with an error
  // to keep a consistent interface
  if(!getUserMedia) {
    return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
  }

  // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
  return new Promise(function(resolve, reject) {
    getUserMedia.call(navigator, constraints, resolve, reject);
  });
		
}

// Older browsers might not implement mediaDevices at all, so we set an empty object first
if(navigator.mediaDevices === undefined) {
  navigator.mediaDevices = {};
}

if(navigator.mediaDevices.getUserMedia === undefined) {
  navigator.mediaDevices.getUserMedia = promisifiedOldGUM;
}

var constraints = { 
  audio: false, 
  video: { 
    width: { ideal: 500 },
    height: { ideal: 1000 },
    facingMode: {
      exact: "environment"
    }
  } 
};

var video = document.getElementById('video');

navigator.mediaDevices.getUserMedia(constraints)
.then(function(stream) {
  video.src = window.URL.createObjectURL(stream);

  video.onloadedmetadata = function(e) {
    video.play();
  };
})
.catch(function(err) {
  console.log(err.name + ": " + err.message);
});

function snapShot(){
  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d'); 
  ctx.drawImage(video, 0, 0, video.width, video.height);
  return canvas;
}