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

// Some browsers partially implement mediaDevices. We can't just assign an object
// with getUserMedia as it would overwrite existing properties.
// Here, we will just add the getUserMedia property if it's missing.
if(navigator.mediaDevices.getUserMedia === undefined) {
  navigator.mediaDevices.getUserMedia = promisifiedOldGUM;
}


// Prefer camera resolution nearest to 1280x720.
var constraints = { 
  audio: true, 
  video: { 
    width: 1280, 
    height: 720, 
    facingMode: { 
      exact: "environment" 
    } 
  } 
};

navigator.mediaDevices.getUserMedia(constraints)
.then(function(stream) {
  var video = document.querySelector('video');
  video.src = window.URL.createObjectURL(stream);
  video.onloadedmetadata = function(e) {
    video.play();
  };
})
.catch(function(err) {
  console.log(err.name + ": " + err.message);
});