document.addEventListener('DOMContentLoaded', () => {
  let contests = [];

  const homeBtn = document.querySelector('#home-btn');
  const feedbackBtn = document.querySelector('#feedback-btn');
  const exitBtn = document.querySelector('#exit-btn');
  const contestsDisplay = document.querySelector('#contests-display');
  const feedbackDisplay = document.querySelector('#feedback-display');  
  const loadingPage = document.querySelector('#loading-page');
  const mainContent = document.querySelector('#main-content');
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
      // Loading page will appear here
      loadingPage.classList.remove('hidden');
      const response = await fetch('https://codeforces.com/api/contest.list');
      const jsonData = await response.json();
      // Loading page will disappear as all api is fetched
      loadingPage.classList.add('hidden');
      // Everything else will appear here
      mainContent.classList.remove('hidden');
      
      
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

      const contestDate = getContestDate(contest);
      const remainingTime = getRemainingTime(contest);
      
      container.innerHTML = `
      <div class="flex items-center justify-center">
      <h3 class="text-white text-lg font-semibold">${contest.name}</h3>
      </div>
      
      <div class="mt-4 border-t border-gray-700 pt-4 text-center">
      <p class="text-gray-400 text-sm">${contestDate.day} &middot; ${contestDate.month} ${contestDate.date}, ${contestDate.year} &middot; ${contestDate.hours}:${contestDate.minutes} IST</p>
      <p id="contest-timer-display" class="text-gray-500 text-lg mt-2">${remainingTime.days}:${remainingTime.hours}:${remainingTime.minutes}:${remainingTime.seconds}</p>
      </div>
      
      <div class="mt-4 flex items-end justify-between">
      <div class="text-sm text-green-900 bg-green-600 px-4 py-1 rounded-lg ">Registration Open &#10004;</div>
      <a href="https://codeforces.com/contests/${contest.id}" target="_blank" class="transform transition active:scale-110 ease-in-out cursor-pointer px-4 py-1.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg shadow text-lg">Link</a>
      </div>
      `;
      
      contestsDisplay.appendChild(container);
      setInterval(() => {
        updateTimer(contest);
      }, 1000);
    })
  }
  
  function getContestDate(contest) {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const contestDate = new Date(contest.startTimeSeconds * 1000);

    const obj = {
      day: weekDays[contestDate.getDay()],
      month: months[contestDate.getMonth()],
      date: contestDate.getDate().toString().padStart(2, '0'),
      year: contestDate.getFullYear().toString().padStart(2, '0'),
      hours: contestDate.getHours().toString().padStart(2, '0'),
      minutes: contestDate.getMinutes().toString().padStart(2, '0')
    }

    return obj;
  }

  function getRemainingTime(contest) {
    const currentDate = Date.now();
    const startingDate = contest.startTimeSeconds * 1000;
    
    const difference = startingDate - currentDate;
    
    const obj = {
      seconds: (Math.floor((difference / 1000) % 60)).toString().padStart(2, '0'),
      minutes: (Math.floor((difference / (1000 * 60)) % 60)).toString().padStart(2, '0'),
      hours: (Math.floor((difference / (1000 * 60 * 60)) % 24)).toString().padStart(2, '0'),
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    }

    return obj;
  }

  function updateTimer(contest) {
    const contestTimerDisplay = document.querySelector('#contest-timer-display');
    const remainingTime = getRemainingTime(contest);
    contestTimerDisplay.innerHTML = `${remainingTime.days}:${remainingTime.hours}:${remainingTime.minutes}:${remainingTime.seconds}`;
  }
})