    function startGame() {
      document.getElementById("startPage").classList.add("hidden");
      document.getElementById("gamePage").classList.remove("hidden");
    }

    function checkAnswer(choice) {
      let message = document.getElementById("message");
      let nextBtn = document.getElementById("nextBtn");

      if (choice === 2) {
        message.textContent = "Wrong Answer ❌";
        message.style.color = "red";
      } else if (choice === 3) {
        message.textContent = "🎉 Congratulations, the answer is correct!";
        message.style.color = "green";
        nextBtn.classList.remove("hidden");
      }
    }

    function nextLevel() {
      alert("Next Level Loading... (Demo)");
      // Here you can load the next page or reset for next round
    }