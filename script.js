let doc = document;

class AudioController {
  constructor() {
    this.birdsMusic = new Audio("Assets/Audios/birds.wav");
    this.flipSound = new Audio("Assets/Audios/flip.wav");
    this.matchSound = new Audio("Assets/Audios/match.wav");
    this.victorySound = new Audio("Assets/Audios/victory.wav");
    this.gameOverSound = new Audio("Assets/Audios/gameover1.wav");

    this.birdsMusic.loop = 1;
    this.birdsMusic.volume = 0.6;

    this.flipSound.volume = 0.5;
  }

  startMusic() {
    this.birdsMusic.play();
  }
  stopMusic() {
    this.birdsMusic.pause();
    this.birdsMusic.currentTime = 0;
  }
  flip() {
    this.flipSound.play();
  }
  match() {
    this.matchSound.play();
  }
  victory() {
    this.stopMusic();
    this.victorySound.play();
  }
  gameover() {
    this.stopMusic();
    this.gameOverSound.play();
  }
}

class FlipOrQuit {
  constructor(totalTime, cards) {
    this.totalTime = totalTime;
    this.remainingTime = totalTime;

    this.cards = cards;

    this.flips = doc.getElementById("flips");
    this.timer = doc.getElementById("timer");

    this.audioController = new AudioController();
  }

  startGame() {
    this.remainingTime = this.totalTime;
    this.cardToCheck = null;
    this.matchedCards = [];
    this.busy = true;
    this.flipsCounter = 0;

    this.hideCards();

    setTimeout(() => {
      this.shuffleCards();
      this.busy = false;
      this.audioController.startMusic();
      this.countDown = this.startTimer();
    }, 500);

    this.flips.innerText = this.flipsCounter;
    this.timer.innerText = this.remainingTime;
  }

  startTimer() {
    return setInterval(() => {
      this.timer.innerText = --this.remainingTime;
      if (this.remainingTime === 0) {
        this.gameover();
      }
    }, 1000);
  }

  hideCards() {
    this.cards.forEach((card) => {
      card.classList.remove("matched");
      card.classList.remove("visible");
    });
  }

  shuffleCards() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      let randIdx = Math.floor(Math.random() * (i + 1));
      this.cards[i].style.order = randIdx;
      this.cards[randIdx].style.order = i;
    }
  }

  flipCard(card) {
    if (this.canFlipCard(card)) {
      this.audioController.flip();
      this.flips.innerText = ++this.flipsCounter;

      card.classList.add("visible");

      if (!this.cardToCheck) this.cardToCheck = card;
      else this.checkIfMatching(card);
    }
  }

  canFlipCard(card) {
    return (
      !this.busy &&
      !this.matchedCards.includes(card) &&
      card !== this.cardToCheck
    );
  }

  checkIfMatching(card) {
    if (this.getCardType(card) === this.getCardType(this.cardToCheck))
      this.cardsMatch(card, this.cardToCheck);
    else this.cardsMisMatch(card, this.cardToCheck);

    this.cardToCheck = null;
  }

  cardsMatch(card1, card2) {
    this.matchedCards.push(card1);
    this.matchedCards.push(card2);

    card1.classList.add("matched");
    card2.classList.add("matched");

    this.audioController.match();

    if (this.matchedCards.length === this.cards.length) this.victory();
  }

  cardsMisMatch(card1, card2) {
    this.busy = true;
    setTimeout(() => {
      card1.classList.remove("visible");
      card2.classList.remove("visible");
      this.busy = false;
    }, 1000);
  }

  getCardType(card) {
    return card.getElementsByClassName("back-face")[0].firstElementChild.src;
  }

  victory() {
    clearInterval(this.countDown);
    this.audioController.victory();
    doc.getElementById("victory").classList.add("visible");
    doc.getElementById("victory").style.animation =
      "overlay-show 1s linear forwards";
  }

  gameover() {
    clearInterval(this.countDown);
    this.audioController.gameover();
    doc.getElementById("gameover").classList.add("visible");
    doc.getElementById("gameover").style.animation =
      "overlay-show 1s linear forwards";

    let randIdx = Math.floor(Math.random() * 3);

    if (randIdx === 0)
      this.audioController.gameOverSound = this.gameOverSound = new Audio(
        "Assets/Audios/gameover1.wav"
      );
    else if (randIdx === 1)
      this.audioController.gameOverSound = this.gameOverSound = new Audio(
        "Assets/Audios/gameover2.wav"
      );
    else if (randIdx === 2)
      this.audioController.gameOverSound = this.gameOverSound = new Audio(
        "Assets/Audios/gameover3.wav"
      );
  }
}

function startLoading() {
  let overlays = Array.from(doc.getElementsByClassName("overlay-text"));
  let cards = Array.from(doc.getElementsByClassName("game-card"));
  let game = new FlipOrQuit(60, cards);

  overlays.forEach((overlay) => {
    overlay.onclick = () => {
      overlay.style.animation = "overlay-hide 1s linear forwards";
      game.startGame();
    };
  });

  cards.forEach((card) => {
    card.onclick = () => {
      game.flipCard(card);
    };
  });
}

if (doc.readyState === "loading") {
  doc.addEventListener("DOMContentLoaded", startLoading());
} else {
  startLoading();
}
