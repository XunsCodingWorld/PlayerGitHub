window.addEventListener('load', function() {
	
	video = document.getElementById('video');
	pauseScreen = document.getElementById('screen');
	screenButton = document.getElementById('screen-button');

	audio = document.getElementById('audio');
	
	pbarContainer = document.getElementById('pbar-container');
	pbar = document.getElementById('pbar');
	
	reverseButton = document.getElementById('play-reverse');
	playButton = document.getElementById('play-button');
	speedButton = document.getElementById('play-speed');

	timeField =  document.getElementById('time-field');

	soundButton = document.getElementById('sound-button');

	sbarContainer = document.getElementById('sbar-container');
	sbar =  document.getElementById('sbar');

	fullScreenButton = document.getElementById('full-screen');
	
	video.load();

	video.addEventListener('canplay', function() {

		playButton.addEventListener('click', playorPause, false);
		speedButton.addEventListener('click', speed, false);
		reverseButton.addEventListener('click', reverse, false);

		pbarContainer.addEventListener('click', skip, false);
		soundButton.addEventListener('click', muteOrUnmute, false);
		sbarContainer.addEventListener('click', adjustVolume, false);

		fullScreenButton.addEventListener('click', fullScreen, false);

		pauseScreen.addEventListener('click', playorPause, false);

		updatePlayer();

	}, false);
	
}, false);

function playorPause() {

	if(video.paused) {
		video.play();
		playButton.src = 'pics/pause.png';
		update = setInterval(updatePlayer, 30);
		screenButton.style.display = 'none';
	} else {
		video.pause();
		playButton.src = 'pics/play.png';
		window.clearInterval(update);

		screenButton.style.display = 'block';
		screenButton.src = 'pics/play.png';
	}

}

function speed() {
	video.currentTime += 0.02 * video.duration;
	updatePlayer();
}

function reverse() {
	video.currentTime -= 0.02 * video.duration;
	updatePlayer();
}

function updatePlayer() {

	var percentage = (video.currentTime/video.duration) * 100;
	pbar.style.width = percentage + '%';
	timeField.innerHTML = getFormattedTime();
	if(video.paused) {
		playButton.src = 'pics/play.png'
		screenButton.src = 'pics/play.png';
	}
	if(video.ended) {
		window.clearInterval(update);
		playButton.src = 'pics/play.png';

		screenButton.style.display = 'block';
		screenButton.src = 'pics/replay.png';
	}
}

function skip(ev) {

	var mouseX = ev.pageX - pbarContainer.offsetLeft;
	var width = window.getComputedStyle(pbarContainer).getPropertyValue('width');
	width = parseFloat(width.substr(0, width.length - 2));

	video.currentTime = (mouseX/width) * video.duration;
	updatePlayer();

}

function getFormattedTime() {

	var seconds = Math.round(video.currentTime);
	var minutes = Math.floor(seconds / 60);
	if(minutes > 0) seconds -= minutes * 60;
	if(seconds.toString().length === 1) seconds = '0' + seconds;

	var totalSeconds = Math.round(video.duration);
	var totalMinutes = Math.floor(totalSeconds / 60);
	if(totalMinutes > 0) totalSeconds -= totalMinutes * 60;
	if(totalSeconds.toString().length === 1) totalSeconds = '0' + totalSeconds;

	return minutes + ':' + seconds + ' / ' + totalMinutes + ':' + totalSeconds;

}

function muteOrUnmute() {
	if(!video.muted) {
		video.muted = true;
		soundButton.src = 'pics/mute.png';
		sbar.style.display = 'none';
	} else {
		if(video.volume < 0.3) {
			soundButton.src = 'pics/sound0.png';
		} else {
			soundButton.src = 'pics/sound.png';
		}
		video.muted = false;
		sbar.style.display = 'block';
	}
}

function adjustVolume(ev) {
	var mouseX = ev.pageX - sbarContainer.offsetLeft;
	var width = window.getComputedStyle(sbarContainer).getPropertyValue('width');
	width = parseFloat(width.substr(0, width.length - 2));

	video.volume = (mouseX / width);
	sbar.style.width = (mouseX / width) * 100 + '%';

	if(mouseX === 0) {
		video.mute = true;
		soundButton.src = 'pics/mute.png';
	} else {
		if(video.volume < 0.2) {
			soundButton.src = 'pics/sound0.png';
		} else {
			soundButton.src = 'pics/sound.png';
		}
		video.muted = false;
		sbar.style.display = 'block';
	}

}

function fullScreen() {
	if (video.requestFullscreen) {
	  video.requestFullscreen();
	} else if (video.msRequestFullscreen) {
	  video.msRequestFullscreen();
	} else if (video.mozRequestFullScreen) {
	  video.mozRequestFullScreen();
	} else if (video.webkitRequestFullscreen) {
	  video.webkitRequestFullscreen();
	}
}

function loadVideo() {
   for (var i = 0; i < arguments.length; i++) {
      var file = arguments[i].split('.');
      var ext = file[file.length - 1];
      if (canPlayVideo(ext)) {
         resetMediaPlayer();
         mediaPlayer.src = arguments[i];
         mediaPlayer.load();
         break;
      }
   }
}

function canPlayVideo(ext) {
   var ableToPlay = mediaPlayer.canPlayType('video/' + ext);
   if (ableToPlay == '') return false;
   else return true;
}