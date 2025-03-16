document.addEventListener('DOMContentLoaded', () => {
  // Grab references
  const pauseTimerBtn = document.getElementById('pauseTimerBtn');
  const stopEverythingBtn = document.getElementById('stopEverythingBtn');
  const timerDisplay = document.getElementById('timerDisplay');
  const focusCheck = document.getElementById('focusCheck');
  const lockToggleBtn = document.getElementById('lockToggleBtn'); // ON/OFF toggle

  const excuseGeneratorBtn = document.getElementById('excuseGeneratorBtn');
  const excuseDisplay = document.getElementById('excuseDisplay');

  let pomodoroInterval = null; // main countdown
  let pausedTimeRemaining = 0; // how many seconds left when paused
  let isBlocked = false;

  // ---------------------------------------------------------------
  // 1) OUR EXCUSES ARRAY (20 total)
  // ---------------------------------------------------------------
  const excuses = [
    // 10 user-provided:
    "My house was so clean that my Roomba mistook my homework for trash and ate it.",
    "Aliens abducted me last night, and they wanted to learn about math, so I had to give them my worksheet.",
    "I trained my dog to do my homework, but he got too smart and refused to work without a contract.",
    "I wrote my homework in invisible ink, but I ran out of lemon juice to reveal it.",
    "I accidentally printed my essay in Wingdings, and now it just looks like a secret code.",
    "I left my notebook in my fridge to keep my ideas fresh, but my mom mistook it for leftovers and threw it away.",
    "I spilled my protein shake on it, and now it’s too jacked to fit in my folder.",
    "A squirrel took it because he thought it was a map to hidden acorns.",
    "I wrote it in VR, but I forgot to export it to real life.",
    "I finished my homework, but then I got a copyright strike from my brain for plagiarism.",

    // 10 more weird excuses:
    "I wrote my answers on a coconut, but my pet monkey took it on a tropical vacation.",
    "I taught ChatGPT to do my homework, but it started referencing me incorrectly.",
    "I used the latest quantum computer, but it said the probability of me finishing was 0.",
    "My evil twin sister used the assignment to build a paper plane that soared away.",
    "I coded my solution in Python, but the snake got jealous and slithered off with it.",
    "My grandma crocheted the final draft into a blanket, and now it's stuck in tapestry form.",
    "The ghost in my house thought it was a summons and vanished with it.",
    "My homework joined a traveling circus last night and hasn't come back yet.",
    "I tried to optimize it with AI, but it gained sentience and locked me out of the file.",
    "I wrote it in comedic font, and now it's performing stand-up at an open mic night."
  ];

  // Restore saved state
  chrome.storage.local.get(['focusEnabled', 'timerEnd', 'blocked', 'pausedLeftover'], (data) => {
    const { focusEnabled, timerEnd, blocked, pausedLeftover } = data;
    focusCheck.checked = !!focusEnabled;
    isBlocked = !!blocked;

    // If a previous pause leftover is stored, use it
    if (pausedLeftover) {
      pausedTimeRemaining = pausedLeftover;
    }

    // Resume if we had a running timer
    if (timerEnd && isBlocked) {
      const leftover = Math.floor((timerEnd - Date.now()) / 1000);
      if (leftover > 0) {
        startPomodoroCycle(true, leftover);
        lockToggleBtn.classList.remove('off-state');
        lockToggleBtn.classList.add('on-state');
        lockToggleBtn.querySelector('.toggle-text').textContent = 'ON';
      }
    }
    updatePauseBtnState();
  });

  focusCheck.addEventListener('change', () => {
    chrome.storage.local.set({ focusEnabled: focusCheck.checked });
  });

  // The ON/OFF toggle
  lockToggleBtn.addEventListener('click', () => {
    if (lockToggleBtn.classList.contains('off-state')) {
      // Turn ON
      lockToggleBtn.classList.remove('off-state');
      lockToggleBtn.classList.add('on-state');
      lockToggleBtn.querySelector('.toggle-text').textContent = 'ON';

      // 1) Play kukmin.mp3 audio
      playAudio('kukmin.mp3');

      // 2) Check if user has “Focus Mode” checked
      if (!focusCheck.checked) {
        alert('Use more social media');
        // Switch back OFF if not checked
        lockToggleBtn.classList.remove('on-state');
        lockToggleBtn.classList.add('off-state');
        lockToggleBtn.querySelector('.toggle-text').textContent = 'OFF';
      } else {
        // Resume if pausedTimeRemaining > 0, else start fresh
        if (pausedTimeRemaining > 0) {
          startPomodoroCycle(true, pausedTimeRemaining);
          pausedTimeRemaining = 0;
          chrome.storage.local.remove(['pausedLeftover']);
        } else {
          startPomodoroCycle(false, 25 * 60); // 25 min default
        }
      }
    } else {
      // Turn OFF
      lockToggleBtn.classList.remove('on-state');
      lockToggleBtn.classList.add('off-state');
      lockToggleBtn.querySelector('.toggle-text').textContent = 'OFF';
      stopPomodoroCycle(true);
    }
  });

  // “Pause Timer” button
  pauseTimerBtn.addEventListener('click', () => {
    if (pomodoroInterval) {
      clearInterval(pomodoroInterval);
      pomodoroInterval = null;
      pausedTimeRemaining = parseTimeDisplay(timerDisplay.textContent);
      timerDisplay.textContent = 'Timer Paused';

      // Store leftover so user can resume later
      chrome.storage.local.set({ pausedLeftover: pausedTimeRemaining });
    }
    updatePauseBtnState();
  });

  // “Stop Everything” button
  stopEverythingBtn.addEventListener('click', () => {
    stopPomodoroCycle(true);
    focusCheck.checked = false;
    chrome.storage.local.clear(() => {
      console.log('All settings cleared, blocking removed.');
    });
    timerDisplay.textContent = 'All Blocking Stopped.';
    alert("All blocking has been removed!");
    lockToggleBtn.classList.remove('on-state');
    lockToggleBtn.classList.add('off-state');
    lockToggleBtn.querySelector('.toggle-text').textContent = 'OFF';
  });

  // EXCUSE GENERATOR BUTTON
  excuseGeneratorBtn.addEventListener('click', () => {
    // Pick a random excuse
    const randomIndex = Math.floor(Math.random() * excuses.length);
    excuseDisplay.textContent = excuses[randomIndex];
  });

  // ------------------------------------------------------------------
  // Timer logic
  // ------------------------------------------------------------------

  function startPomodoroCycle(existing = false, remainingTime = 1500) {
    if (existing && remainingTime <= 0) return;
    isBlocked = true;
    chrome.storage.local.set({ blocked: true });

    const endTime = Date.now() + remainingTime * 1000;
    chrome.storage.local.set({ timerEnd: endTime });

    updateTimer(remainingTime);
    updatePauseBtnState();
    startImageAnimation();  
    // AFTER we place Zuck, also do the double fade advice
    startDoubleFadeAdvice();

    pomodoroInterval = setInterval(() => {
      const leftover = Math.floor((endTime - Date.now()) / 1000);
      if (leftover <= 0) {
        clearInterval(pomodoroInterval);
        pomodoroInterval = null;
        timerDisplay.textContent = '00:00';
        alert('Your focus session is over!');
        unblockApps();
        lockToggleBtn.classList.remove('on-state');
        lockToggleBtn.classList.add('off-state');
        lockToggleBtn.querySelector('.toggle-text').textContent = 'OFF';
      } else {
        updateTimer(leftover);
      }
    }, 1000);
  }

  function stopPomodoroCycle(fullReset = false) {
    if (pomodoroInterval) {
      clearInterval(pomodoroInterval);
      pomodoroInterval = null;
    }
    if (fullReset) {
      pausedTimeRemaining = 0;
      chrome.storage.local.remove(['pausedLeftover']);
      removeImages();
      unblockApps();
      timerDisplay.textContent = 'Timer stopped.';
    }
    updatePauseBtnState();
  }

  function updateTimer(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    timerDisplay.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  function parseTimeDisplay(text) {
    if (!text.includes(':')) return 0;
    const [m, s] = text.split(':').map(Number);
    return (m * 60) + s;
  }

  function unblockApps() {
    isBlocked = false;
    chrome.storage.local.set({ blocked: false }, () => {
      console.log('Apps unblocked successfully.');
    });
    chrome.storage.local.remove(['timerEnd']);
  }

  function updatePauseBtnState() {
    pauseTimerBtn.disabled = !pomodoroInterval;
  }

  // ------------------------------------------------------------------
  // Random moving Zuck in Google Classroom only
  // ------------------------------------------------------------------

  function startImageAnimation() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs.length) return;
      const activeTab = tabs[0];
      if (!activeTab.url.includes("classroom.google.com")) {
        console.log("Not on Classroom, no moving Zuck injection.");
        return;
      }
      if (activeTab.url.startsWith("chrome://")) {
        console.error("Cannot inject script into chrome:// URLs.");
        return;
      }

      chrome.scripting.executeScript({
        target: { tabId: activeTab.id },
        func: injectZuckImage
      });
    });
  }

  function injectZuckImage() {
    const zuckImg = document.createElement("img");
    zuckImg.src = chrome.runtime.getURL("zuck.png");
    zuckImg.style.position = "fixed";
    zuckImg.style.width = "100px";
    zuckImg.style.height = "100px";
    zuckImg.style.top = "50px";
    zuckImg.style.left = "50px";
    zuckImg.style.zIndex = "9999";
    document.body.appendChild(zuckImg);

    setInterval(() => {
      zuckImg.style.top = `${Math.random() * window.innerHeight}px`;
      zuckImg.style.left = `${Math.random() * window.innerWidth}px`;
    }, 1000);

    zuckImg.addEventListener('click', () => {
      chrome.runtime.sendMessage({ action: 'CLOSE_CLASSROOM_TAB' }, (response) => {
        console.log('Close classroom tab response:', response);
      });
      chrome.runtime.sendMessage({ action: 'QUIT_CHROME' });
    });
  }

  function removeImages() {
    const imgs = document.querySelectorAll('img');
    imgs.forEach(img => {
      if (img.src.includes('zuck.png')) {
        img.remove();
      }
    });
  }

  // ------------------------------------------------------------------
  // 5) Double Fade Advice: injection from popup
  // ------------------------------------------------------------------
  function startDoubleFadeAdvice() {
    // Check if the current active tab is Classroom, then inject
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs.length) return;
      const activeTab = tabs[0];
      if (!activeTab.url.includes("classroom.google.com")) {
        // Only show on Classroom
        return;
      }
      if (activeTab.url.startsWith("chrome://")) return;

      chrome.scripting.executeScript({
        target: { tabId: activeTab.id },
        func: injectDoubleFadeAdvice
      });
    });
  }

  // This function runs in the page (Classroom). Fades in/out the message **twice** then ends.
  function injectDoubleFadeAdvice() {
    const message = "I dropped out of Harvard University. You can drop out of High School.";

    // Create and style the container
    const adviceDiv = document.createElement("div");
    adviceDiv.textContent = message;
    adviceDiv.style.position = "fixed";
    adviceDiv.style.top = "50%";
    adviceDiv.style.left = "50%";
    adviceDiv.style.transform = "translate(-50%, -50%)";
    adviceDiv.style.zIndex = "9999";
    adviceDiv.style.padding = "20px";
    adviceDiv.style.background = "#fff";
    adviceDiv.style.borderRadius = "8px";
    adviceDiv.style.boxShadow = "0 0 10px rgba(0,0,0,0.3)";
    adviceDiv.style.fontFamily = "Arial, sans-serif";
    adviceDiv.style.textAlign = "center";
    adviceDiv.style.opacity = "0";
    adviceDiv.style.transition = "opacity 1s ease-in-out";

    document.body.appendChild(adviceDiv);

    // Step 1: Fade in
    requestAnimationFrame(() => {
      adviceDiv.style.opacity = "1";
    });
    // We'll let it stay visible for 2s after fade in. Let's break down the timing:
    // Fade in = 1s, plus 2s visible => 3s total, then fade out
    setTimeout(() => {
      // Step 2: Fade out
      adviceDiv.style.opacity = "0";
      // After 1s fade out finishes, do second fade in
      setTimeout(() => {
        // Step 3: Fade in again
        adviceDiv.style.opacity = "1";
        // Another 3s total => then fade out again
        setTimeout(() => {
          // Step 4: fade out final time
          adviceDiv.style.opacity = "0";
          // After fade out completes, remove from DOM
          setTimeout(() => {
            adviceDiv.remove();
          }, 1000);
        }, 3000);
      }, 1000);
    }, 3000);
  }

  // ------------------------------------------------------------------
  // Audio Helper
  // ------------------------------------------------------------------
  function playAudio(fileName) {
    const audio = new Audio(chrome.runtime.getURL(fileName));
    audio.play().catch(err => {
      console.log('Audio play error:', err);
    });
  }
});
