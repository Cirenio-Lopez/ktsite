window.onload = function () {
  var playerTrack = document.getElementById("player-track"),
    albumName = document.getElementById("album-name"),
    largeAlbumName = document.getElementById("album"),
    largetrackName = document.getElementById("track"),
    trackName = document.getElementById("track-name"),
    albumArt = document.getElementById("album-art"),
    sArea = document.getElementById("s-area"),
    seekBar = document.getElementById("seek-bar"),
    trackTime = document.getElementById("track-time"),
    insTime = document.getElementById("ins-time"),
    sHover = document.getElementById("s-hover"),
    playPauseButton = document.getElementById("play-pause-button"),
    i = document.getElementById("play-icon"),
    tProgress = document.getElementById("current-time"),
    tTime = document.getElementById("track-length"),
    seekT,
    seekLoc,
    seekBarPos,
    cM,
    ctMinutes,
    ctSeconds,
    curMinutes,
    curSeconds,
    durMinutes,
    durSeconds,
    playProgress,
    bTime,
    nTime = 0,
    buffInterval = null,
    tFlag = false,
    albums = [
      "Strawberry Skies",
      "What's Left Of Me",
      "SickLuv",
      "SPOOKY SZN",
      "My Bad!",
    ],
    trackNames = [
      "Strawberry Skies",
      "Strawberry Skies",
      "No Labels",
      "No Labels",
      "Luvsick (Deluxe)",
    ],
    albumArtworks = ["_1", "_2", "_3", "_4", "_5"],
    trackUrl = [
      "%PUBLIC_URL%/../audio/Strawberry Skies.mp3",
      "%PUBLIC_URL%/../audio/What's Left Of Me.mp3",
      "%PUBLIC_URL%/../audio/SickLuv.mp3",
      "%PUBLIC_URL%/../audio/Spooky SZN.mp3",
      "%PUBLIC_URL%/../audio/My Bad!.mp3",
    ],
    playPreviousTrackButton = document.getElementById("play-previous"),
    playNextTrackButton = document.getElementById("play-next"),
    currIndex = -1;

  function playPause() {
    setTimeout(function () {
      if (audio.paused) {
        playerTrack.classList.add("active");
        albumArt.classList.add("active");
        checkBuffering();
        i.setAttribute("class", "fas fa-pause");
        audio.play();
      } else {
        playerTrack.classList.remove("active");
        albumArt.classList.remove("active");
        clearInterval(buffInterval);
        albumArt.classList.remove("buffering");
        i.setAttribute("class", "fas fa-play");
        audio.pause();
      }
    }, 300);
  }

  function showHover(event) {
    var sAreaStyle = window.getComputedStyle(sArea);
    seekBarPos = {
      top: parseInt(sAreaStyle.getPropertyValue("top"), 10) + window.scrollY,
      left: parseInt(sAreaStyle.getPropertyValue("left"), 10) + window.scrollX,
    };
    seekT = event.clientX - seekBarPos.left;
    seekLoc = audio.duration * (seekT / sArea.offsetWidth);

    sHover.style.width = seekT;

    cM = seekLoc / 60;

    ctMinutes = Math.floor(cM);
    ctSeconds = Math.floor(seekLoc - ctMinutes * 60);

    if (ctMinutes < 0 || ctSeconds < 0) return;

    if (ctMinutes < 0 || ctSeconds < 0) return;

    if (ctMinutes < 10) ctMinutes = "0" + ctMinutes;
    if (ctSeconds < 10) ctSeconds = "0" + ctSeconds;

    if (isNaN(ctMinutes) || isNaN(ctSeconds)) insTime.textContent = "--:--";
    else insTime.textContent = ctMinutes + ":" + ctSeconds;
    insTime.style.left = seekT;
    insTime.style.marginLeft = "-21px";
    setTimeout(() => {
      insTime.style.opacity = 1;
    }, this.animationDelay + 20);
  }

  function hideHover() {
    sHover.style.width = 0;
    insTime.textContent = "00:00";
    insTime.style.left = "0px";
    insTime.style.marginLeft = "0px";
    setTimeout(() => {
      insTime.style.opacity = 0;
    }, this.animationDelay + 20);
  }

  function playFromClickedPos() {
    audio.currentTime = seekLoc;
    seekBar.style.width = seekT;
    hideHover();
  }

  function updateCurrTime() {
    nTime = new Date();
    nTime = nTime.getTime();

    if (!tFlag) {
      tFlag = true;
      trackTime.classList.add("active");
    }

    curMinutes = Math.floor(audio.currentTime / 60);
    curSeconds = Math.floor(audio.currentTime - curMinutes * 60);

    durMinutes = Math.floor(audio.duration / 60);
    durSeconds = Math.floor(audio.duration - durMinutes * 60);

    playProgress = (audio.currentTime / audio.duration) * 100;

    if (curMinutes < 10) curMinutes = "0" + curMinutes;
    if (curSeconds < 10) curSeconds = "0" + curSeconds;

    if (durMinutes < 10) durMinutes = "0" + durMinutes;
    if (durSeconds < 10) durSeconds = "0" + durSeconds;

    if (isNaN(curMinutes) || isNaN(curSeconds)) tProgress.textContent = "00:00";
    else tProgress.textContent = curMinutes + ":" + curSeconds;

    if (isNaN(durMinutes) || isNaN(durSeconds)) tTime.textContent = "00:00";
    else tTime.textContent = durMinutes + ":" + durSeconds;

    if (
      isNaN(curMinutes) ||
      isNaN(curSeconds) ||
      isNaN(durMinutes) ||
      isNaN(durSeconds)
    )
      trackTime.classList.remove("active");
    else trackTime.classList.add("active");

    seekBar.style.width = playProgress + "%";

    if (playProgress === 100) {
      i.setAttribute("class", "fa fa-play");
      seekBar.style.width = 0;
      tProgress.textContent = "00:00";
      albumArt.classList.remove("buffering");
      albumArt.classList.remove("active");
      clearInterval(buffInterval);
    }
  }

  function checkBuffering() {
    clearInterval(buffInterval);
    buffInterval = setInterval(function () {
      if (nTime === 0 || bTime - nTime > 1000)
        albumArt.classList.add("buffering");
      else albumArt.classList.remove("buffering");

      bTime = new Date();
      bTime = bTime.getTime();
    }, 100);
  }

  function selectTrack(flag) {
    if (flag === 0 || flag === 1) ++currIndex;
    else --currIndex;

    if (currIndex > -1 && currIndex < albumArtworks.length) {
      if (flag === 0) {
        i.setAttribute("class", "fa fa-play");
      } else {
        albumArt.classList.remove("buffering");
        i.setAttribute("class", "fa fa-pause");
      }

      seekBar.style.width = 0;
      trackTime.classList.remove("active");
      tProgress.textContent = "00:00";
      tTime.textContent = "00:00";

      var currAlbum = albums[currIndex];
      var currTrackName = trackNames[currIndex];
      var currArtwork = albumArtworks[currIndex];

      audio.src = trackUrl[currIndex];

      nTime = 0;
      bTime = new Date();
      bTime = bTime.getTime();

      if (flag != 0) {
        audio.play();
        playerTrack.classList.add("active");
        albumArt.classList.add("active");

        clearInterval(buffInterval);
        checkBuffering();
      }

      albumName.textContent = currAlbum;
      largetrackName.textContent = currAlbum;
      trackName.textContent = currTrackName;
      largeAlbumName.textContent = currTrackName;
      albumArt.querySelector("img.active").classList.remove("active");
      document.getElementById("" + currArtwork).classList.add("active");
    } else {
      if (flag === 0 || flag === 1) --currIndex;
      else ++currIndex;
    }
  }

  function initPlayer() {
    audio = new Audio();

    selectTrack(0);

    audio.loop = false;

    playPauseButton.addEventListener("click", playPause);

    sArea.addEventListener("mousemove", function (event) {
      showHover(event);
    });

    sArea.addEventListener("mouseout", hideHover);

    sArea.addEventListener("click", playFromClickedPos);

    audio.addEventListener("timeupdate", updateCurrTime);

    playPreviousTrackButton.addEventListener("click", function () {
      selectTrack(-1);
    });
    playNextTrackButton.addEventListener("click", function () {
      selectTrack(1);
    });
  }

  initPlayer();
};
