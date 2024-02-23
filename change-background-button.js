const backgrounds = [
    "/image/background-cartoon-space.jpg",
    "/image/background-planet.jpg"
];
let currentBackgroundIndex = 0;
const button = document.getElementById('button-background');

button.addEventListener("click", changeBackgroundImage);

function changeBackgroundImage() {
    document.body.style.backgroundImage =`url("${backgrounds[currentBackgroundIndex]}")`;
    currentBackgroundIndex++;
    if (currentBackgroundIndex === backgrounds.length) {
        currentBackgroundIndex = 0;
    }
}