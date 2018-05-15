var game = document.querySelector(".game");
var brickHeight = 24;
var maxPosition = game.clientHeight - brickHeight;
var lapTime = 5;
var speed = maxPosition / lapTime;
var limit = 5;
var bricks = 0;

var step = function() {
    var brick = document.createElement("div");
    brick.classList.add("brick");
    brick.textContent = "Some code string";
    game.appendChild(brick);
    var endPosition = maxPosition - (bricks * brickHeight);
    var duration = endPosition / speed;
    setTimeout(function() {
        brick.classList.add("animate");
        brick.style.transitionDuration = `${duration}s`;
        brick.style.transform = `translateX(-50%) translateY(${endPosition}px)`;
    }, 0);
    var onKeydown = function(evt) {
        if (evt.keyCode === 37 || evt.keyCode === 39) {
            var position = brick.getBoundingClientRect()
            brick.classList.remove("animate");
            brick.style.transitionDuration = "";
            brick.style.transform = `translateX(-50%) translateY(${position.top}px)`;

            if (evt.keyCode === 37) {
                setTimeout(function() {
                    brick.classList.add("animate");
                    brick.style.transitionDuration = "0.5s";
                    brick.style.transform = `translateX(-50%) translateY(${endPosition}px)`;
                }, 0);
            }

            if (evt.keyCode === 39) {
                bricks--;
                setTimeout(function() {
                    brick.classList.add("animate");
                    brick.style.transitionDuration = `1s`;
                    brick.style.transform = `translateX(${game.clientWidth - position.left}px) translateY(${position.top}px)`;
                }, 0);
            }

            document.removeEventListener("keydown", onKeydown);
        }
    };
    document.addEventListener("keydown", onKeydown);
    var onTransitionend = function() {
                bricks++;
        if (bricks < limit) {
            step();
        }
        brick.removeEventListener("transitionend", onTransitionend);
        document.removeEventListener("keydown", onKeydown);
    };
    brick.addEventListener("transitionend", onTransitionend);
};

step();