const mySong = document.getElementById("mySong");
const iconMusic = document.getElementById("icon-music");
iconMusic.addEventListener("click", playMusic);
function playMusic() {
    if (mySong.paused) {
        mySong.play();
        iconMusic.src = "/image/mute.png";
    }else{
        mySong.pause();
        iconMusic.src = "/image/volume.png";
    }
    
}