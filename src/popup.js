document.addEventListener('DOMContentLoaded', () => {
  let contests = [];

  const homeBtn = document.querySelector('#home-btn');
  const feedbackBtn = document.querySelector('#feedback-btn');
  const exitBtn = document.querySelector('#exit-btn');
  const contestsDisplay = document.querySelector('#contests-display');
  const feedbackDisplay = document.querySelector('#feedback-display');  
  init();

  
  function init() {
    fetchContestList();
  }
  
  // Close extension
  exitBtn.addEventListener('click', () => window.close());

  // Open Feedback
  feedbackBtn.addEventListener('click', () => {
    contestsDisplay.classList.add('hidden');
    feedbackDisplay.classList.remove('hidden');
  });
  
  // Display contest on the home page
  homeBtn.addEventListener('click', () => {
    contestsDisplay.classList.remove('hidden');
    feedbackDisplay.classList.add('hidden');
  });

  // Fetching CF API and getting details about the contest
  async function fetchContestList() {
    try {
      const response = await fetch('https://codeforces.com/api/contest.list');
      const jsonData = await response.json();
      
      // jsonData.result is an array which contains information about every CF contest
      const allContests = jsonData.result;
      
      populateArray(allContests);
      createCards();
    } catch(error) {
      console.log(error);
    }
  }

  // Populating the array with relevant contest's information
  function populateArray(allContests) {
    contests = allContests.filter((contest) => {
      return contest.phase === 'BEFORE';
    });
    console.log(contests);
  } 

  // Create cards with contest's information form contests array
  function createCards() {
    contests.forEach(contest => {
      const container = document.createElement('div');
      container.setAttribute('class', 'bg-gray-900/80 p-4 mb-6 rounded-xl border border-gray-700 relative');

      const contestDate = new Date(contest.startTimeSeconds * 1000);
      const remainingTime = new Date(contest.relativeTimeSeconds * -1 );
      
      const days = Math.floor(remainingTime / (24 * 60 * 60));
      const hours = remainingTime.getUTCHours().toString();
      const minutes = remainingTime.getUTCMinutes().toString();
      const seconds = remainingTime.getUTCSeconds().toString();
      
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

      container.innerHTML = `
        <div class="flex items-center justify-center">
          <h3 class="text-white text-lg font-semibold">${contest.name}</h3>
        </div>
  
        <div class="mt-4 border-t border-gray-700 pt-4 text-center">
          <p class="text-gray-400 text-sm">${weekDays[contestDate.getDay()]} &middot; ${months[contestDate.getMonth()]} ${contestDate.getDate()}, ${contestDate.getFullYear()} &middot; ${contestDate.getHours()}:${contestDate.getMinutes()} IST</p>
          <p class="text-gray-500 text-s mt-2">${days}:${hours}:${minutes}:${seconds}</p>
        </div>
  
        <div class="mt-4 flex items-end justify-between">
          <div class="text-sm text-green-900 bg-green-600 px-4 py-1 rounded-lg ">Registration Open &#10004;</div>
          <a href="https://codeforces.com/contests/${contest.id}" class="transform transition active:scale-110 ease-in-out cursor-pointer px-4 py-1.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg shadow text-lg">Link</a>
        </div>
      `;

      contestsDisplay.appendChild(container);
    })
  }
})