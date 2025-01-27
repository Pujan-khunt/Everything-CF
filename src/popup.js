// document.addEventListener('DOMContentLoaded', () => {
//     let cf_contests = [];
//     const btn = document.querySelector('#getApi');
//     const displayContests = document.querySelector('#display-contests');

//     btn.addEventListener('click', async () => {
//         try {
//             const response = await fetch('https://codeforces.com/api/contest.list');
//             const data = await response.json();
//             populateArray(data);
//             createCards();
//         } catch (error) {
//             console.log(error);
//         }
//     })

//     function populateArray(data) {
//         const contestList = data.result;
        
//         cf_contests = contestList.filter((contest) => {
//             return contest.phase === 'BEFORE';
//         });

//         console.log(cf_contests);
//     }

//     function createCards() {
//         cf_contests.forEach((contest) => {
//             const container = document.createElement('div');
//             container.setAttribute('class', 'bg-neutral-600 w-full rounded-lg py-2 px-4 mt-4 text-white');
//             container.innerHTML = `
//                 ${contest.name}
//             `;

//             displayContests.appendChild(container);
//         });
//     }
// });