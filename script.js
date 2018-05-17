var limit = 5;
var max = 20;
var count = 0;
var fail = 0;
var height = 24;

var tasks = [
    {
        content: "Some code string 1",
        side: "left"
    },
    {
        content: "Some code string 2",
        side: "right"
    },
    {
        content: "Some code string 3",
        side: "right"
    },
    {
        content: "Some code string 4",
        side: "left"
    },
    {
        content: "Some code string 5",
        side: "right"
    },
    {
        content: "Some code string 6",
        side: "left"
    },
    {
        content: "Some code string 7",
        side: "left"
    },
    {
        content: "Some code string 8",
        side: "right"
    },
    {
        content: "Some code string 9",
        side: "right"
    },
    {
        content: "Some code string 10",
        side: "right"
    },
    {
        content: "Some code string 11",
        side: "left"
    },
    {
        content: "Some code string 12",
        side: "right"
    },
    {
        content: "Some code string 13",
        side: "right"
    },
    {
        content: "Some code string 14",
        side: "right"
    },
    {
        content: "Some code string 15",
        side: "left"
    },
    {
        content: "Some code string 16",
        side: "left"
    },
    {
        content: "Some code string 17",
        side: "right"
    },
    {
        content: "Some code string 18",
        side: "right"
    },
    {
        content: "Some code string 19",
        side: "right"
    },
    {
        content: "Some code string 20",
        side: "right"
    },
];

var startBtn = document.querySelector(".start");
var deck = document.querySelector(".deck");

var random = function(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

var lose = function() {
    alert("You lose!");
    deck.innerHTML = "";
    deck.classList.add("hidden");
    startBtn.classList.remove("hidden");
};

var win = function() {
    alert("You win!");
    deck.innerHTML = "";
    deck.classList.add("hidden");
    startBtn.classList.remove("hidden");
};

var step = function() {
    let index = random(0, tasks.length);
    let { content, side } = tasks[index];
    tasks = [...tasks.slice(0, index), ...tasks.slice(index + 1)];

    let brick = document.createElement("div");
    brick.classList.add("brick");
    brick.textContent = content + " / " + side;
    brick.dataset.side = side;
    deck.appendChild(brick);

    let endPosition = (deck.clientHeight - height) - (height * fail);

    setTimeout(function() {
        brick.classList.add("animate");
        brick.style.transitionDuration = "5s";
        brick.style.transform = `translateX(-50%) translateY(${endPosition}px)`;
    }, 0);

    const onDropTransitionEnd = function() {
        brick.removeEventListener("transitionend", onDropTransitionEnd);
        document.removeEventListener("keydown", onArrowKeyDown);
        count++;
        fail++;
        brick.classList.remove("animate");
        brick.style.transitionDuration = "";
        if (fail < limit && count < max) {
            step();
        } else if (fail >= limit) {
            lose();
        } else if (count >= max) {
            win();
        }
    };

    const onArrowKeyDown = function(evt) {
        if (evt.keyCode !== 37 && evt.keyCode !== 39) {
            return false;
        }

        brick.removeEventListener("transitionend", onDropTransitionEnd);

        document.removeEventListener("keydown", onArrowKeyDown);

        let userSide = evt.keyCode === 37 ? "left" : "right";
        let position = brick.getBoundingClientRect();

        if (userSide === side) {
            brick.style.transitionDuration = "";
            brick.style.transform = `translateX(-50%) translateY(${position.top}px)`;

            let shiftX = side === "left" ? (-(position.left + brick.clientWidth)) : (deck.clientWidth - position.left);

            setTimeout(function() {
                brick.style.transitionDuration = "0.5s";
                brick.style.transform = `translateX(${shiftX}px) translateY(${position.top}px)`;
            }, 0);

            const onSuccessTransitionEnd = function() {
                count++;
                brick.remove();
                if (fail < limit && count < max) {
                    step();
                } else if (fail >= limit) {
                    lose();
                } else if (count >= max) {
                    win();
                }
                brick.removeEventListener("transitionend", onSuccessTransitionEnd);
            };

            brick.addEventListener("transitionend", onSuccessTransitionEnd);
        } else {
            brick.style.transitionDuration = "";
            brick.style.transform = `translateX(-50%) translateY(${position.top}px)`;

            setTimeout(function() {
                brick.style.transitionDuration = "0.5s";
                brick.style.transform = `translateX(-50%) translateY(${endPosition}px)`;
            }, 0);

            const onFailTransitionEnd = function() {
                count++;
                fail++;
                brick.classList.remove("animate");
                brick.style.transitionDuration = "";
                if (fail < limit && count < max) {
                    step();
                } else if (fail >= limit) {
                    lose();
                } else if (count >= max) {
                    win();
                }
                brick.removeEventListener("transitionend", onFailTransitionEnd);
            };

            brick.addEventListener("transitionend", onFailTransitionEnd);
        }
    };

    brick.addEventListener("transitionend", onDropTransitionEnd);

    document.addEventListener("keydown", onArrowKeyDown);
};

var start = function() {
    startBtn.classList.add("hidden");
    deck.classList.remove("hidden");
    step();
};