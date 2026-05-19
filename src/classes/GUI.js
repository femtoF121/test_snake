export class GUI {
  elements = {};
  selectedMode = "classic";
  bestScore = 0;
  onPlay = null;
  onMenu = null;

  constructor() {
    this.elements = {
      bestScore: document.querySelector("#best-score"),
      currentScore: document.querySelector("#current-score"),
      modesMenu: document.querySelector("#modes-menu"),
      btnPlay: document.querySelector("#btn-play"),
      btnExit: document.querySelector("#btn-exit"),
      btnMenu: document.querySelector("#btn-menu"),
    };

    this.selectedMode = document.querySelector(
      'input[name="gameMode"]:checked',
    )?.value;

    this.bestScore = JSON.parse(localStorage.getItem("best_score")) || 0;
    if (this.elements.bestScore)
      this.elements.bestScore.textContent = this.bestScore;

    this.initListeners();
  }

  initListeners() {
    this.elements.btnPlay?.addEventListener("click", () => {
      if (this.onPlay) this.onPlay(this.selectedMode);
      this.togglePlayingState();
    });

    this.elements.btnMenu?.addEventListener("click", () => {
      if (this.onMenu) this.onMenu();
      this.togglePlayingState();
    });

    this.elements.modesMenu?.addEventListener(
      "change",
      (event) => (this.selectedMode = event.target.value),
    );
  }

  setScore(current) {
    if (this.elements.currentScore)
      this.elements.currentScore.textContent = current;

    if (current > this.bestScore) {
      this.bestScore = current;
      if (this.elements.bestScore)
        this.elements.bestScore.textContent = this.bestScore;
      localStorage.setItem("best_score", JSON.stringify(this.bestScore));
    }
  }

  resetCurrentScore() {
    if (this.elements.currentScore)
      this.elements.currentScore.textContent = "0";
  }

  togglePlayingState() {
    this.elements.modesMenu?.classList.toggle("hidden");
    this.elements.btnPlay?.classList.toggle("hidden");
    this.elements.btnExit?.classList.toggle("hidden");
    this.elements.btnMenu?.classList.toggle("hidden");
  }
}
