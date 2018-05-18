const initTasks = [
  {
    content: 'Some code string 1',
    side: 'left'
  },
  {
    content: 'Some code string 2',
    side: 'right'
  },
  {
    content: 'Some code string 3',
    side: 'right'
  },
  {
    content: 'Some code string 4',
    side: 'left'
  },
  {
    content: 'Some code string 5',
    side: 'right'
  },
  {
    content: 'Some code string 6',
    side: 'left'
  },
  {
    content: 'Some code string 7',
    side: 'left'
  },
  {
    content: 'Some code string 8',
    side: 'right'
  },
  {
    content: 'Some code string 9',
    side: 'right'
  },
  {
    content: 'Some code string 10',
    side: 'right'
  },
  {
    content: 'Some code string 11',
    side: 'left'
  },
  {
    content: 'Some code string 12',
    side: 'right'
  },
  {
    content: 'Some code string 13',
    side: 'right'
  },
  {
    content: 'Some code string 14',
    side: 'right'
  },
  {
    content: 'Some code string 15',
    side: 'left'
  },
  {
    content: 'Some code string 16',
    side: 'left'
  },
  {
    content: 'Some code string 17',
    side: 'right'
  },
  {
    content: 'Some code string 18',
    side: 'right'
  },
  {
    content: 'Some code string 19',
    side: 'right'
  },
  {
    content: 'Some code string 20',
    side: 'right'
  }
];

const App = {
  gameId: null,
  username: '',
  useremail: '',
  info: {
    userSteps: 0,
    errorCount: 0
  },
  constants: {
    limitErrors: 5,
    maxSteps: 20,
    height: 24,
    lapTime: 3
  },
  tasks: initTasks.slice(),
  controls: {
    startBtn: document.querySelector('.start'),
    deck: document.querySelector('.deck')
  },
  events: {
    init: function() {
      App.info.errorCount = 0;
      App.info.userSteps = 0;
      App.tasks = initTasks.slice();
      App.controls.deck.innerHTML = '';
      App.controls.deck.classList.add('hidden');
      App.controls.startBtn.classList.remove('hidden');
    },

    loose: function(data) {
      Storage.saveScore(data);
      HtmlHelper.renderScore();
      alert('You lose!');
      App.events.init();
    },

    win: function(data) {
      Storage.saveScore(data);
      HtmlHelper.renderScore();
      alert('You win!');
      App.events.init();
    }
  }
};

class Storage {
  static saveScore(data) {
    const scores = Storage.getScores();
    scores[App.gameId] = data;
    localStorage.setItem('scores', JSON.stringify(scores));
  }

  static getScore() {
    const scores = Storage.getScores();
    return scores[App.gameId];
  }

  static getScores() {
    try {
      return JSON.parse(localStorage.getItem('scores')) || {};
    } catch (e) {
      return {};
    }
  }
}

class HtmlHelper {
  static hideScores() {
    const scores = document.querySelector('.scores-info');
    if (scores) {
      scores.remove();
    }
  }

  static renderScore() {
    const div = document.createElement('div');
    div.className = 'scores-info';
    const { errorCount, userSteps } = Storage.getScore();
    div.innerHTML = `
     <div>Ошибок: ${errorCount}</div>
     <div>Шагов: ${userSteps}</div>
    `;
    document.body.appendChild(div);
  }
}

const speed =
  (document.documentElement.clientHeight - App.constants.height) /
  App.constants.lapTime;

const nextEvent = function() {
  if (
    App.info.errorCount < App.constants.limitErrors &&
    App.info.userSteps < App.constants.maxSteps
  ) {
    run();
  } else if (App.info.errorCount >= App.constants.limitErrors) {
    App.events.loose({
      username: App.username,
      useremail: App.useremail,
      errorCount: App.info.errorCount,
      userSteps: App.info.userSteps
    });
  } else if (App.info.userSteps >= App.constants.maxSteps) {
    App.events.win({
      username: App.username,
      useremail: App.useremail,
      errorCount: App.info.errorCount,
      userSteps: App.info.userSteps
    });
  }
};

const animateBrick = function(brick) {
  let endPosition =
    App.controls.deck.clientHeight -
    App.constants.height -
    App.constants.height * App.info.errorCount;

  let duration = endPosition / speed;

  setTimeout(() => {
    brick.classList.add('animate');
    brick.style.transitionDuration = `${duration}s`;
    brick.style.transform = `translateX(-50%) translateY(${endPosition}px)`;
  });
};

const userGoodChoise = (brick, side) => {
  let position = brick.getBoundingClientRect();
  brick.style.transitionDuration = '';
  brick.style.transform = `translateX(-50%) translateY(${position.top}px)`;

  let shiftX =
    side === 'left'
      ? -(position.left + brick.clientWidth)
      : App.controls.deck.clientWidth - position.left;

  setTimeout(function() {
    brick.style.transitionDuration = '0.5s';
    brick.style.transform = `translateX(${shiftX}px) translateY(${
      position.top
    }px)`;
  });

  const onSuccessTransitionEnd = function() {
    App.info.userSteps++;
    brick.remove();
    nextEvent();
    brick.removeEventListener('transitionend', onSuccessTransitionEnd);
  };

  brick.addEventListener('transitionend', onSuccessTransitionEnd);
};

const userFailChoise = brick => {
  let position = brick.getBoundingClientRect();

  let endPosition =
    App.controls.deck.clientHeight -
    App.constants.height -
    App.constants.height * App.info.errorCount;

  brick.style.transitionDuration = '';
  brick.style.transform = `translateX(-50%) translateY(${position.top}px)`;

  setTimeout(function() {
    brick.style.transitionDuration = '0.5s';
    brick.style.transform = `translateX(-50%) translateY(${endPosition}px)`;
  }, 0);

  const onFailTransitionEnd = function() {
    App.info.userSteps++;
    App.info.errorCount++;
    brick.classList.remove('animate');
    brick.style.transitionDuration = '';
    nextEvent();
    brick.removeEventListener('transitionend', onFailTransitionEnd);
  };

  brick.addEventListener('transitionend', onFailTransitionEnd);
};

const createBrick = function(content, side) {
  const brick = document.createElement('div');
  brick.classList.add('brick');
  brick.textContent = content + ' / ' + side;
  brick.dataset.side = side;
  App.controls.deck.appendChild(brick);

  animateBrick(brick);

  return brick;
};

const run = function() {
  const indexRandomTask = Math.floor(Math.random() * App.tasks.length);
  const task = App.tasks[indexRandomTask];
  if (!task) {
    throw new Error(
      'Немогу взять таск ' + indexRandomTask + ';' + App.tasks.length
    );
  }
  const { content, side } = task;
  App.tasks.slice().splice(indexRandomTask, 1);

  const brick = createBrick(content, side);

  const onArrowKeyDown = function(evt) {
    // игнорируем любые нажатия кроме стрелки влево вправо
    if (evt.keyCode !== 37 && evt.keyCode !== 39) {
      return false;
    }
    // удаляем события?
    brick.removeEventListener('transitionend', onDropTransitionEnd);
    document.removeEventListener('keydown', onArrowKeyDown);

    // проверяем правильный ли выбор сдел пользователь
    const userSide = evt.keyCode === 37 ? 'left' : 'right';
    if (userSide === side) {
      userGoodChoise(brick, side);
    } else {
      userFailChoise(brick);
    }
  };

  document.addEventListener('keydown', onArrowKeyDown);

  const onDropTransitionEnd = function() {
    brick.classList.remove('animate');
    brick.style.transitionDuration = '';

    document.removeEventListener('keydown', onArrowKeyDown);
    App.info.userSteps++;
    App.info.errorCount++;
    nextEvent();
    brick.removeEventListener('transitionend', onDropTransitionEnd);
  };

  brick.addEventListener('transitionend', onDropTransitionEnd);
};

const start = function() {
  HtmlHelper.hideScores();
  App.username = prompt('Как вас зовут?', '');
  App.useremail = prompt('Ваша почта?', '');
  App.gameId = Date.now();
  App.controls.startBtn.classList.add('hidden');
  App.controls.deck.classList.remove('hidden');
  run();
};
