document.addEventListener("DOMContentLoaded", function () {
  const searchButton = document.getElementById("search-btn");
  const usernameInput = document.getElementById("user-input");
  const statsContainer = document.getElementById("stats-container");
  const easyProgressCircle = document.getElementById("easy-progress");
  const mediumProgressCircle = document.getElementById("medium-progress");
  const hardProgressCircle = document.getElementById("hard-progress");
  const easyLabel = document.getElementById("easy-label");
  const mediumLabel = document.getElementById("medium-label");
  const hardLabel = document.getElementById("hard-label");
  const cardStatsContainer = document.getElementById("stats-cards");

  function validateUsername(username) {
    if (username.trim() === "") {
      alert("Username cannot be empty");
      return false;
    }
    const regex = /^[a-zA-Z0-9_-]{1,15}$/;
    const isMatching = regex.test(username);
    if (!isMatching) {
      alert("Invalid username");
    }
    return isMatching;
  }

  async function fetchUserDetails(username) {
    const url = `https://leetcode-stats-api.herokuapp.com/${username}`;
    try {
      searchButton.textContent = "Searching...";
      searchButton.disabled = true;
      statsContainer.classList.add("hidden");

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const parsedData = await response.json();
      console.log(parsedData);
      displayUserData(parsedData);
    } catch (err) {
      // statsContainer.innerHTML = `<p>No Data Found</p>`;
      console.error(err);
    } finally {
      searchButton.textContent = "Search";
      searchButton.disabled = false;

      console.log("Request completed");
    }
  }

  function updateProgress(solved, total, label, circle) {
    const progressDegree = (solved / total) * 100;
    circle.style.setProperty("--progress-degree", `${progressDegree}%`);
    label.textContent = `${solved}/${total}`;
  }

  function displayUserData(parsedData) {
    const totalQues = parsedData.totalQuestions;
    const totalHardQues = parsedData.totalHard;
    const totalMediumQues = parsedData.totalMedium;
    const totalEasyQues = parsedData.totalEasy;

    const SolvedTotalQues = parsedData.totalSolved;
    const SolvedHardQues = parsedData.hardSolved;
    const SolvedMediumQues = parsedData.mediumSolved;
    const SolvedEasyQues = parsedData.easySolved;

    updateProgress(
      SolvedEasyQues,
      totalEasyQues,
      easyLabel,
      easyProgressCircle
    );
    updateProgress(
      SolvedMediumQues,
      totalMediumQues,
      mediumLabel,
      mediumProgressCircle
    );
    updateProgress(
      SolvedHardQues,
      totalHardQues,
      hardLabel,
      hardProgressCircle
    );

    const cardsData = [
      {
        label: "Overall Submissions",
        value: SolvedTotalQues,
      },
      {
        label: "Easy",
        value: SolvedEasyQues,
      },
      {
        label: "Medium",
        value: SolvedMediumQues,
      },
      {
        label: "Hard",
        value: SolvedHardQues,
      },
    ];

    console.log(cardsData);

    cardStatsContainer.innerHTML = cardsData
      .map((data) => {
        return `
        <div class="card">
            <h4>${data.label}</h4>
            <p>${data.value}</p>
        </div>
        `;
      })
      .join("");
  }

  searchButton.addEventListener("click", function () {
    const username = usernameInput.value;
    console.log(username);
    if (validateUsername(username)) {
      fetchUserDetails(username);
    }
  });
});
