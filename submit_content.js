
// ------------------------------------------------------------------------
// CONFIGURATION
// ------------------------------------------------------------------------

// (A) Ten caustic lines for the first 10 clicks
const mockingLines = [
  "Pfft, even a snail could’ve clicked faster.",
  "Seriously? That’s your best attempt?",
  "Stop flailing—this isn’t amateur hour!",
  "Oh look, another feeble click. Pathetic.",
  "You click like you’ve never used a computer before.",
  "You might want to read a ‘Clicking For Dummies’ guide.",
  "Honestly, I expected more from you. Disappointing.",
  "At this rate, you’ll graduate when you’re 80.",
  "If aimlessness was an art, you’d be Picasso.",
  "The button doesn’t want your sweaty clicks—go away!"
];

// (B) Ten-step submission checks
const submissionCheckMessages = [
  "1) Are you sure you want to submit?",
  "2) Are you REALLY sure you want to submit?",
  "3) This might be a mistake… Are you for real?",
  "4) Wait, really? You’re 100% certain you want to submit?",
  "5) Think about your future. Are you absolutely positive?",
  "6) Don’t say we didn’t warn you. Still want to submit?",
  "7) You might regret this. Sure you want to move forward?",
  "8) Double check: you REALLY want to submit this?",
  "9) Last-ish chance to back out… sure about that?",
  "10) Do you really, for real, actually not lying want to submit the problem?"
];

// (C) Final Quiz questions
const quizQuestions = [
  {
    prompt: "Quiz 1: How many hours of social media did you do today?",
    validate: (value) => {
      const num = parseFloat(value);
      return !isNaN(num) && num >= 5;
    },
    failMessage: "Quiz 탈락! You haven't wasted enough hours on social media."
  },
  {
    prompt: "Quiz 2: How many times did you hang out with your friends?",
    validate: (value) => {
      const num = parseFloat(value);
      return !isNaN(num) && num >= 5;
    },
    failMessage: "Quiz 탈락! You haven't been social enough."
  },
  {
    prompt: "Quiz 3: How many DMs did you NOT read?",
    validate: (value) => {
      const num = parseFloat(value);
      return !isNaN(num) && num < 5;
    },
    failMessage: "Quiz 탈락! You're ignoring too many messages."
  },
  {
    prompt: "Quiz 4: What is your attendance rate this week at school? (Enter a number, e.g. 60 for 60%)",
    validate: (value) => {
      const num = parseFloat(value);
      return !isNaN(num) && num < 75;
    },
    failMessage: "Quiz 탈락! You're attending too much school!"
  }
];
const quizFinalQuestion = "Quiz 5: Here we go… Let me ask you one last time. Do you REALLY want to submit?";

// ------------------------------------------------------------------------
// TRACKING STATE
// ------------------------------------------------------------------------
let mockAttempts = 0;            
let submissionChecksDone = false;
let quizDone = false;            

// ------------------------------------------------------------------------
// UTILITY: CREATE & SHOW A MODAL (with larger, modern design)
// ------------------------------------------------------------------------
function createModal(contentElement, customStyles = {}) {
  // Dim overlay
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
  overlay.style.display = 'flex';
  overlay.style.justifyContent = 'center';
  overlay.style.alignItems = 'center';
  overlay.style.zIndex = '10000';

  // Modal box with larger dimensions and new font
  const box = document.createElement('div');
  box.style.backgroundColor = '#ffffff';
  box.style.padding = '2rem';
  box.style.border = '3px solid #333';
  box.style.borderRadius = '12px';
  box.style.textAlign = 'center';
  box.style.fontFamily = 'Roboto, sans-serif';
  box.style.fontSize = '20px';
  box.style.width = '500px';
  box.style.maxWidth = '90%';
  box.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';

  for (const prop in customStyles) {
    box.style[prop] = customStyles[prop];
  }

  box.appendChild(contentElement);
  overlay.appendChild(box);
  document.body.appendChild(overlay);
  return overlay;
}

// ------------------------------------------------------------------------
// PHASE 2: 10-STEP SUBMISSION CHECKS
// ------------------------------------------------------------------------
function runSubmissionChecks(clickedButton) {
  let currentIndex = 0;
  function showCheckModal(index) {
    const para = document.createElement('p');
    para.textContent = submissionCheckMessages[index];
    para.style.marginBottom = '1.5rem';

    const yesBtn = document.createElement('button');
    yesBtn.textContent = 'Yes';
    yesBtn.style.margin = '0 1rem';
    yesBtn.style.padding = '0.5rem 1.5rem';
    yesBtn.style.fontSize = '18px';
    yesBtn.style.fontFamily = 'Roboto, sans-serif';

    const noBtn = document.createElement('button');
    noBtn.textContent = 'No';
    noBtn.style.padding = '0.5rem 1.5rem';
    noBtn.style.fontSize = '18px';
    noBtn.style.fontFamily = 'Roboto, sans-serif';

    const container = document.createElement('div');
    container.appendChild(para);
    container.appendChild(yesBtn);
    container.appendChild(noBtn);

    const overlay = createModal(container);

    yesBtn.addEventListener('click', function() {
      overlay.remove();
      if (index < submissionCheckMessages.length - 1) {
        showCheckModal(index + 1);
      } else {
        submissionChecksDone = true;
        runFinalQuiz(clickedButton);
      }
    });

    noBtn.addEventListener('click', function() {
      overlay.remove();
      window.location.href = 'https://classroom.google.com';
    });
  }
  showCheckModal(currentIndex);
}

// ------------------------------------------------------------------------
// PHASE 3: FINAL QUIZ
// ------------------------------------------------------------------------
function runFinalQuiz(clickedButton) {
  if (quizDone) return;

  function showQuizQuestion(index) {
    const q = quizQuestions[index];
    const questionPara = document.createElement('p');
    questionPara.textContent = q.prompt;
    questionPara.style.marginBottom = '1rem';

    const input = document.createElement('input');
    input.type = 'text';
    input.style.padding = '0.5rem';
    input.style.fontSize = '18px';
    input.style.marginBottom = '1rem';
    input.style.width = '80%';
    input.style.fontFamily = 'Roboto, sans-serif';

    const confirmBtn = document.createElement('button');
    confirmBtn.textContent = 'Confirm';
    confirmBtn.style.padding = '0.5rem 1.5rem';
    confirmBtn.style.fontSize = '18px';
    confirmBtn.style.fontFamily = 'Roboto, sans-serif';

    const container = document.createElement('div');
    container.appendChild(questionPara);
    container.appendChild(input);
    container.appendChild(confirmBtn);

    const overlay = createModal(container);

    confirmBtn.addEventListener('click', function() {
      const value = input.value.trim();
      if (!q.validate(value)) {
        overlay.remove();
        alert(q.failMessage);
        window.location.href = 'https://classroom.google.com';
      } else {
        overlay.remove();
        if (index < quizQuestions.length - 1) {
          showQuizQuestion(index + 1);
        } else {
          showQuizFinalQuestion();
        }
      }
    });
  }

  function showQuizFinalQuestion() {
    const questionPara = document.createElement('p');
    questionPara.textContent = quizFinalQuestion;
    questionPara.style.marginBottom = '1rem';

    const yesBtn = document.createElement('button');
    yesBtn.textContent = 'Yes';
    yesBtn.style.margin = '0 1rem';
    yesBtn.style.padding = '0.5rem 1.5rem';
    yesBtn.style.fontSize = '18px';
    yesBtn.style.fontFamily = 'Roboto, sans-serif';

    const noBtn = document.createElement('button');
    noBtn.textContent = 'No';
    noBtn.style.padding = '0.5rem 1.5rem';
    noBtn.style.fontSize = '18px';
    noBtn.style.fontFamily = 'Roboto, sans-serif';

    const container = document.createElement('div');
    container.appendChild(questionPara);
    container.appendChild(yesBtn);
    container.appendChild(noBtn);

    const overlay = createModal(container);

    yesBtn.addEventListener('click', function() {
      overlay.remove();
      quizDone = true;
      runThreeGameChallenge(clickedButton);
    });

    noBtn.addEventListener('click', function() {
      overlay.remove();
      window.location.href = 'https://classroom.google.com';
    });
  }
  showQuizQuestion(0);
}

// ------------------------------------------------------------------------
// PHASE 4: 3-GAME CHALLENGE (with larger, designed UI)
// ------------------------------------------------------------------------
function runThreeGameChallenge(clickedButton) {
  // Container for all game UIs
  const container = document.createElement('div');

  // Title
  const title = document.createElement('h2');
  title.textContent = "3-Game Challenge!";
  title.style.marginBottom = '1rem';
  title.style.fontFamily = 'Roboto, sans-serif';
  container.appendChild(title);

  // Instructions
  const intro = document.createElement('p');
  intro.textContent = "Win each game or be sent home. Good luck!";
  intro.style.marginBottom = '1.5rem';
  intro.style.fontFamily = 'Roboto, sans-serif';
  container.appendChild(intro);

  // ---------- (1) Rock–Paper–Scissors ----------
  const rpsDiv = document.createElement('div');
  rpsDiv.style.margin = "1.5rem 0";

  const rpsHeading = document.createElement('h3');
  rpsHeading.textContent = "Rock–Paper–Scissors";
  rpsHeading.style.marginBottom = '0.5rem';
  rpsHeading.style.fontFamily = 'Roboto, sans-serif';
  rpsDiv.appendChild(rpsHeading);

  const rpsSelect = document.createElement('select');
  rpsSelect.style.fontSize = '18px';
  rpsSelect.style.padding = '0.5rem';
  rpsSelect.style.fontFamily = 'Roboto, sans-serif';
  ["rock","paper","scissors"].forEach(choice => {
    const opt = document.createElement('option');
    opt.value = choice;
    opt.textContent = choice.charAt(0).toUpperCase() + choice.slice(1);
    rpsSelect.appendChild(opt);
  });
  rpsDiv.appendChild(rpsSelect);

  const rpsBtn = document.createElement('button');
  rpsBtn.textContent = "Play RPS";
  rpsBtn.style.marginLeft = "1rem";
  rpsBtn.style.padding = "0.5rem 1.5rem";
  rpsBtn.style.fontSize = "18px";
  rpsBtn.style.fontFamily = 'Roboto, sans-serif';
  rpsDiv.appendChild(rpsBtn);

  const rpsResult = document.createElement('p');
  rpsResult.style.marginTop = "1rem";
  rpsResult.style.fontSize = "20px";
  rpsResult.style.fontFamily = 'Roboto, sans-serif';
  rpsDiv.appendChild(rpsResult);

  container.appendChild(rpsDiv);

  // ---------- (2) Tic–Tac–Toe ----------
  const tttDiv = document.createElement('div');
  tttDiv.style.margin = "1.5rem 0";
  tttDiv.style.display = "none"; // hidden until RPS is won

  const tttHeading = document.createElement('h3');
  tttHeading.textContent = "Tic–Tac–Toe (vs AI)";
  tttHeading.style.marginBottom = '0.5rem';
  tttHeading.style.fontFamily = 'Roboto, sans-serif';
  tttDiv.appendChild(tttHeading);

  const tttBoard = document.createElement('div');
  tttBoard.style.display = "grid";
  tttBoard.style.gridTemplateColumns = "repeat(3, 80px)";
  tttBoard.style.gap = "10px";
  tttBoard.style.marginBottom = "1rem";
  tttDiv.appendChild(tttBoard);

  let tttBoardState = Array(9).fill("");
  let tttGameActive = false;

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.style.width = "80px";
    cell.style.height = "80px";
    cell.style.border = "2px solid #333";
    cell.style.fontSize = "28px";
    cell.style.textAlign = "center";
    cell.style.lineHeight = "80px";
    cell.style.cursor = "pointer";
    cell.style.fontFamily = 'Roboto, sans-serif';
    cell.dataset.index = i;
    cell.addEventListener('click', () => {
      if (!tttGameActive) return;
      if (tttBoardState[i] !== "") return;
      tttBoardState[i] = "X";
      cell.textContent = "X";
      if (checkTTTWin("X", tttBoardState)) {
        tttStatus.textContent = "You win Tic–Tac–Toe!";
        tttGameActive = false;
        reactionDiv.style.display = "block";
        return;
      }
      if (tttBoardState.every(v => v !== "")) {
        failAndRedirect("Tie in Tic–Tac–Toe => You lose. Sorry!");
        return;
      }
      aiMove();
      if (checkTTTWin("O", tttBoardState)) {
        failAndRedirect("AI beat you at Tic–Tac–Toe!");
      } else if (tttBoardState.every(v => v !== "")) {
        failAndRedirect("Tie in Tic–Tac–Toe => You lose. Sorry!");
      }
    });
    tttBoard.appendChild(cell);
  }

  const tttStatus = document.createElement('p');
  tttStatus.style.fontSize = "20px";
  tttStatus.style.fontFamily = 'Roboto, sans-serif';
  tttDiv.appendChild(tttStatus);
  container.appendChild(tttDiv);

  function startTTT() {
    tttBoardState = Array(9).fill("");
    tttGameActive = true;
    tttStatus.textContent = "Your turn (X). Defeat the AI!";
    const cells = tttBoard.querySelectorAll('div');
    cells.forEach(c => c.textContent = "");
  }

  // ---------- (3) Reaction Timer ----------
  const reactionDiv = document.createElement('div');
  reactionDiv.style.margin = "1.5rem 0";
  reactionDiv.style.display = "none"; // hidden until TTT is won

  const reactionHeading = document.createElement('h3');
  reactionHeading.textContent = "Reaction Timer";
  reactionHeading.style.marginBottom = '0.5rem';
  reactionHeading.style.fontFamily = 'Roboto, sans-serif';
  reactionDiv.appendChild(reactionHeading);

  const reactionInfo = document.createElement('p');
  reactionInfo.textContent = "Press 'Start Timer' and wait for 'CLICK NOW!'. Then click quickly.";
  reactionInfo.style.fontSize = "18px";
  reactionInfo.style.fontFamily = 'Roboto, sans-serif';
  reactionDiv.appendChild(reactionInfo);

  const reactionBtn = document.createElement('button');
  reactionBtn.textContent = "Start Timer";
  reactionBtn.style.padding = "0.5rem 1.5rem";
  reactionBtn.style.fontSize = "18px";
  reactionBtn.style.fontFamily = 'Roboto, sans-serif';
  reactionDiv.appendChild(reactionBtn);

  const reactionMessage = document.createElement('p');
  reactionMessage.style.fontSize = "20px";
  reactionMessage.style.marginTop = "1rem";
  reactionMessage.style.fontFamily = 'Roboto, sans-serif';
  reactionDiv.appendChild(reactionMessage);

  const reactionResult = document.createElement('p');
  reactionResult.style.fontSize = "20px";
  reactionResult.style.fontFamily = 'Roboto, sans-serif';
  reactionDiv.appendChild(reactionResult);

  let waitingToClick = false, startTime = 0;

  reactionBtn.addEventListener('click', () => {
    reactionMessage.textContent = "Get ready...";
    reactionResult.textContent = "";
    waitingToClick = false;
    const delay = Math.random() * 3000 + 2000; // 2–5s delay
    setTimeout(() => {
      reactionMessage.textContent = "CLICK NOW!";
      startTime = performance.now();
      waitingToClick = true;
    }, delay);
  });

  reactionDiv.addEventListener('click', () => {
    if (!waitingToClick) return;
    const endTime = performance.now();
    const timeTaken = (endTime - startTime) / 1000;
    reactionMessage.textContent = "Your reaction time:";
    reactionResult.textContent = `${timeTaken.toFixed(3)} seconds`;
    waitingToClick = false;
    if (timeTaken > 1.0) {
      failAndRedirect(`Too slow! Needed under 1.0s, got ${timeTaken.toFixed(3)}s.`);
    } else {
      gamesOverlay.remove();
      finalSubmit(clickedButton);
    }
  });

  container.appendChild(reactionDiv);

  const gamesOverlay = createModal(container, { width: "600px" });

  function failAndRedirect(msg) {
    gamesOverlay.remove();
    alert(msg);
    window.location.href = 'https://classroom.google.com';
  }

  function finalSubmit(btn) {
    const form = btn.closest('form');
    if (form) {
      form.submit();
    } else {
      alert("No form found—submitted anyway!");
    }
  }

  rpsBtn.addEventListener('click', () => {
    const player = rpsSelect.value;
    const options = ["rock", "paper", "scissors"];
    const comp = options[Math.floor(Math.random() * 3)];
    let msg = `Computer chose: ${comp}. `;
    if (player === comp) {
      failAndRedirect("Tie in RPS => you lose!");
      return;
    }
    if (
      (player === "rock" && comp === "scissors") ||
      (player === "paper" && comp === "rock") ||
      (player === "scissors" && comp === "paper")
    ) {
      msg += "You win RPS! Next game unlocked: Tic–Tac–Toe.";
      rpsResult.textContent = msg;
      tttDiv.style.display = "block";
      startTTT();
    } else {
      failAndRedirect("You lost RPS! Back to home.");
    }
  });

  function aiMove() {
    if (!tttGameActive) return;
    let empties = [];
    for (let i = 0; i < 9; i++) {
      if (tttBoardState[i] === "") empties.push(i);
    }
    if (!empties.length) return;
    const choice = empties[Math.floor(Math.random() * empties.length)];
    tttBoardState[choice] = "O";
    const cellDiv = tttBoard.querySelector(`[data-index='${choice}']`);
    if (cellDiv) cellDiv.textContent = "O";
  }

  function checkTTTWin(player, board) {
    const wins = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ];
    return wins.some(([a, b, c]) => (
      board[a] === player && board[b] === player && board[c] === player
    ));
  }
}

// ------------------------------------------------------------------------
// PHASE 1: MOCKING LINES
// ------------------------------------------------------------------------
function showMockingLine(button) {
  button.style.position = 'absolute';
  const maxTop = window.innerHeight - button.offsetHeight;
  const maxLeft = window.innerWidth - button.offsetWidth;
  button.style.top = Math.floor(Math.random() * maxTop) + 'px';
  button.style.left = Math.floor(Math.random() * maxLeft) + 'px';
  const oldBubble = document.getElementById('mockingBubble');
  if (oldBubble) oldBubble.remove();
  const bubble = document.createElement('div');
  bubble.id = 'mockingBubble';
  bubble.textContent = mockingLines[mockAttempts];
  mockAttempts++;
  bubble.style.position = 'absolute';
  bubble.style.backgroundColor = '#fff';
  bubble.style.border = '2px solid #333';
  bubble.style.borderRadius = '8px';
  bubble.style.padding = '8px 12px';
  bubble.style.fontFamily = 'Roboto, sans-serif';
  bubble.style.fontSize = '18px';
  bubble.style.pointerEvents = 'none';
  bubble.style.zIndex = '10000';
  document.body.appendChild(bubble);
  const bubbleWidth = bubble.offsetWidth;
  const bubbleHeight = bubble.offsetHeight;
  const buttonWidth = button.offsetWidth;
  const buttonTop = button.offsetTop;
  const buttonLeft = button.offsetLeft;
  bubble.style.left = (buttonLeft + buttonWidth / 2 - bubbleWidth / 2) + 'px';
  bubble.style.top = (buttonTop - bubbleHeight - 15) + 'px';
}

// ------------------------------------------------------------------------
// MAIN EVENT LISTENER
// ------------------------------------------------------------------------
document.addEventListener('click', function(e) {
  const button = e.target.closest('button');
  if (!button) return;
  if (button.textContent.trim().toLowerCase().includes("turn in")) {
    if (quizDone) {
      console.log("All steps completed; user can finally click freely.");
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    if (mockAttempts < mockingLines.length) {
      showMockingLine(button);
      return;
    }
    if (!submissionChecksDone) {
      runSubmissionChecks(button);
      return;
    }
    if (!quizDone) {
      runFinalQuiz(button);
    }
  }
}, true);

