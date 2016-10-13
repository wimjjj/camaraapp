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

var canvas = document.getElementById('video');
var ctx = canvas.getContext("2d");
var canvasWidth = canvas.clientWidth;
var canvasHeigth = canvas.clientHeight;

var constraints = { 
  audio: false, 
  video: { 
    width: { ideal: 500 },
    height: { ideal: 500 },
    facingMode: {
      exact: "environment"
    }
  } 
};

navigator.mediaDevices.getUserMedia(constraints)
.then(function(stream) {
  var video = document.createElement('video');
  video.src = window.URL.createObjectURL(stream);

  video.onloadedmetadata = function(e) {
    video.play();
  };

  video.addEventListener('play', function (e) {
    var $this = this; //cache
    (function loop() {
        if (!$this.paused && !$this.ended) {
          ctx.drawImage($this, 0, 0);
          setTimeout(loop, 1000 / 30); // drawing at 30fps
        }
    })();
  }, 0);
})
.catch(function(err) {
  console.log(err.name + ": " + err.message);
});