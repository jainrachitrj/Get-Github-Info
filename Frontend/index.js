//Element Selectors

const btn = document.querySelector("#get-repo-btn");
const input = document.querySelector("#username");
const alertBox = document.querySelector(".alert-box");
const overlay = document.querySelector(".overlay");
const topHeadline = document.querySelector(".main-head");
let page = 1,
  reposCount = 0,
  reposList;

//Functions

function smoothScroll(target, duration) {
  let startTime = null;
  const startPosition = window.pageYOffset || window.scrollY;
  const targetPosition = target.offsetTop;
  let distance = targetPosition - startPosition;
  function loop(timestamp) {
    if (startTime === null) {
      startTime = timestamp;
    }
    const progress = timestamp - startTime;
    window.scrollTo(0, ease(progress, startPosition, distance, duration));
    if (progress < duration) {
      requestAnimationFrame(loop);
    }
  }
  requestAnimationFrame(loop);
}

function ease(t, b, c, d) {
  t /= d / 2;
  if (t < 1) return (c / 2) * t * t + b;
  t--;
  return (-c / 2) * (t * (t - 2) - 1) + b;
}

function displayArrowUp() {
  if (window.innerHeight < document.body.clientHeight) {
    let elemExists = false;
    window.addEventListener("scroll", () => {
      if (window.scrollY >= window.innerHeight / 2) {
        const children = document.body.children;
        for (let index = 0; index < children.length; index++) {
          if (children[index].className === "move-up") {
            elemExists = true;
            break;
          }
        }
        if (!elemExists) {
          const moveUp = document.createElement("div");
          moveUp.classList.add("move-up");
          moveUp.innerHTML = `<svg aria-hidden="true" focusable="false" viewBox="0 0 448 512"><path d="M34.9 289.5l-22.2-22.2c-9.4-9.4-9.4-24.6 0-33.9L207 39c9.4-9.4 24.6-9.4 33.9 0l194.3 194.3c9.4 9.4 9.4 24.6 0 33.9L413 289.4c-9.5 9.5-25 9.3-34.3-.4L264 168.6V456c0 13.3-10.7 24-24 24h-32c-13.3 0-24-10.7-24-24V168.6L69.2 289.1c-9.3 9.8-24.8 10-34.3.4z"></path></svg>`;
          moveUp.addEventListener("click", () => {
            smoothScroll(topHeadline, 500);
          });
          document.body.appendChild(moveUp);
        }
      }
      if (window.scrollY <= topHeadline.offsetTop) {
        const children = document.body.children;
        for (let index = 0; index < children.length; index++) {
          if (children[index].className === "move-up") {
            children[index].remove();
            elemExists = false;
            index--;
          }
        }
      }
    });
  }
}

// using XHR
// function makeRequestRepos(username) {
//   const request = new XMLHttpRequest();
//   request.addEventListener("load", (e) => getResponseRepos(username, e.target));
//   request.open("GET", `https://api.github.com/users/${username}/repos`);
//   request.send();
// }

//Using fetch()
async function makeRequestRepos(username, page) {
  try {
    let request;
    if (page) {
      request = await fetch(
        `https://api.github.com/users/${username}/repos?page=${page}&per_page=100`
      );
    } else {
      request = await fetch(
        `https://api.github.com/users/${username}/repos?per_page=100`
      );
    }
    if (request.ok) {
      getResponseRepos(username, request);
    } else {
      alertBoxShow(`${request.statusText} ${request.status}`, "normal");
    }
  } catch (error) {
    alertBoxShow(`Oops! Something went wrong ${error}`, "normal");
  }
}

// Using XHR
// function makeRequestRepoCommits(username, repo, commitsBox) {
//   const requestCommit = new XMLHttpRequest();
//   requestCommit.addEventListener("load", (e) => {
//     getResponseRepoCommits(e.target, commitsBox);
//   });
//   requestCommit.open(
//     "GET",
//     `https://api.github.com/repos/${username}/${repo}/commits`
//   );
//   requestCommit.send();
// }

// Using fetch()
async function makeRequestRepoCommits(username, repo, commitsBox) {
  try {
    const request = await fetch(
      `https://api.github.com/repos/${username}/${repo}/commits?per_page=100`
    );
    if (request.ok) {
      getResponseRepoCommits(username, repo, request, commitsBox);
    } else {
      alertBoxShow(`${request.statusText} ${request.status}`, "normal");
    }
  } catch (error) {
    alertBoxShow(`Oops! Something went wrong`, "normal");
  }
}

//Using fetch()
function getResponseRepos(username, req) {
  const reqJson = req.json();
  reqJson
    .then((data) => {
      returnRepo(username, data);
    })
    .catch((error) => {
      console.log(error);
    });
}

// using XHR
// function getResponseRepos(username, req) {
//   returnRepo(username, JSON.parse(req.responseText));
// }

// using XHR
// function getResponseRepoCommits(reqCommitt, commitsBox) {
//   returnRepoCommits(JSON.parse(reqCommitt.responseText), commitsBox);
// }

// Using fetch()
function getResponseRepoCommits(username, repo, req, commitsBox) {
  const reqJson = req.json();
  reqJson
    .then((data) => {
      returnRepoCommits(username, repo, data, commitsBox);
    })
    .catch((err) => console.log(err));
}

function returnRepoCommits(username, repo, commits, commitsBox) {
  commitsBox.innerHTML = "";
  commitsBox.innerHTML += `<h3>Commits for ${repo}</h3>`;
  const commitsOl = document.createElement("ol");
  const commitsContent = [];
  commits.forEach((commit) => {
    commitsContent.push(
      `Author: <strong>${commit.commit.author.name}</strong><br>Description: ${commit.commit.message}`
    );
  });
  commitsOl.innerHTML = commits
    .map((commit, index) => `<li>${commitsContent[index]}</li>`)
    .join("");
  commitsBox.appendChild(commitsOl);
  commitsBox.innerHTML += `<p class="close-btn">&times;</p>`;
  displayArrowUp();
  const closeBtn = document.querySelector(".close-btn");
  closeBtn.addEventListener("click", () => {
    document.body.removeChild(commitsBox);
    displayArrowUp();
  });
  if (commitsOl.childElementCount >= 100) {
    const seeMoreLink = document.createElement("a");
    seeMoreLink.classList.add("see-more-commits");
    seeMoreLink.target = "_blank";
    seeMoreLink.setAttribute(
      "href",
      `https://github.com/${username}/${repo}/commits`
    );
    seeMoreLink.textContent = "See More Commits";
    commitsBox.appendChild(seeMoreLink);
  }
}

function returnRepo(username, repos) {
  if (page === 1) {
    const headline = document.createElement("h1");
    headline.classList.add("heading");
    headline.innerHTML = `<span>${username}</span>'s repositories`;
    document.body.appendChild(headline);
    reposList = document.createElement("ul");
    reposList.classList.add("repos-list");
  }
  repos.forEach((repo, index) => {
    const repoLi = document.createElement("li");
    repoLi.classList.add("card");
    repoLi.innerHTML = `<a target = "_blank" href = "${repo.html_url}">${repo.name}<svg aria-hidden="true" focusable="false" role="img" viewBox="0 0 512 512"><path d="M432,320H400a16,16,0,0,0-16,16V448H64V128H208a16,16,0,0,0,16-16V80a16,16,0,0,0-16-16H48A48,48,0,0,0,0,112V464a48,48,0,0,0,48,48H400a48,48,0,0,0,48-48V336A16,16,0,0,0,432,320ZM488,0h-128c-21.37,0-32.05,25.91-17,41l35.73,35.73L135,320.37a24,24,0,0,0,0,34L157.67,377a24,24,0,0,0,34,0L435.28,133.32,471,169c15,15,41,4.5,41-17V24A24,24,0,0,0,488,0Z"></path></svg></a>`;
    if (repo.description != null) {
      repoLi.innerHTML += `<p>${repo.description}</p>`;
    }
    if (repo.language != null) {
      repoLi.innerHTML += `<p class = "language">${repo.language}</p>`;
    }
    repoLi.innerHTML += `<button class = "see-info" data-repo = "${index}"><svg aria-hidden="true" focusable="false" viewBox="0 0 512 512"><path d="M256 40c118.621 0 216 96.075 216 216 0 119.291-96.61 216-216 216-119.244 0-216-96.562-216-216 0-119.203 96.602-216 216-216m0-32C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm-36 344h12V232h-12c-6.627 0-12-5.373-12-12v-8c0-6.627 5.373-12 12-12h48c6.627 0 12 5.373 12 12v140h12c6.627 0 12 5.373 12 12v8c0 6.627-5.373 12-12 12h-72c-6.627 0-12-5.373-12-12v-8c0-6.627 5.373-12 12-12zm36-240c-17.673 0-32 14.327-32 32s14.327 32 32 32 32-14.327 32-32-14.327-32-32-32z"></path></svg>Info</button>`;
    reposList.appendChild(repoLi);
  });
  document.body.appendChild(reposList);
  reposCount += repos.length;
  if (repos.length === 100) {
    page++;
    makeRequestRepos(username, page);
    return;
  }
  const count = document.createElement("p");
  count.classList.add("count-repo");
  count.textContent = `No. of repositories : ${reposCount}`; // === 0 ? repos.length : reposCount
  document.body.appendChild(count);
  const infoRepos = document.querySelectorAll(".see-info");
  infoRepos.forEach((infoRepo) => {
    infoRepo.addEventListener("click", () => {
      const repoIndex = infoRepo.dataset.repo.substring(
        infoRepo.dataset.repo.indexOf("o") + 1
      );
      for (let i = 0; i < repos.length; i++) {
        if (i == repoIndex) {
          const info = `Created: ${new Date(
            repos[i].created_at
          ).toDateString()} ${new Date(
            repos[i].created_at
          ).toTimeString()}<br>Updated: ${new Date(
            repos[i].updated_at
          ).toDateString()} ${new Date(
            repos[i].updated_at
          ).toTimeString()}<br><a target = "_blank" href = "${
            repos[i].html_url
          }" class = "clone">Clone Repo</a><a class = "see-commits">See Commits</a>`;
          alertBoxShow(info, "normal");
          const seeCommit = document.querySelector(".see-commits");
          seeCommit.addEventListener("click", () => {
            const children = document.body.children;
            for (let index = 0; index < children.length; index++) {
              if (children[index].className === "commits-box") {
                children[index].remove();
                index--;
              }
            }
            alertBoxHide();
            const commitsBox = document.createElement("div");
            commitsBox.classList.add("commits-box");
            commitsBox.innerHTML = `<svg aria-hidden="true" focusable="false" class="spinner" viewBox="0 0 512 512"><path d="M304 48c0 26.51-21.49 48-48 48s-48-21.49-48-48 21.49-48 48-48 48 21.49 48 48zm-48 368c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zm208-208c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zM96 256c0-26.51-21.49-48-48-48S0 229.49 0 256s21.49 48 48 48 48-21.49 48-48zm12.922 99.078c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48c0-26.509-21.491-48-48-48zm294.156 0c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48c0-26.509-21.49-48-48-48zM108.922 60.922c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.491-48-48-48z"></path></svg><p class="close-btn">&times;</p>`;
            document.body.appendChild(commitsBox);
            smoothScroll(commitsBox, 1000);
            makeRequestRepoCommits(username, repos[i].name, commitsBox);
          });
        }
      }
    });
  });
  displayArrowUp();
}

function alertBoxShow(msg, type = "normal") {
  alertBox.classList.add("alert-box-toggle");
  overlay.classList.add("overlay-show");

  const alertMsg = document.createElement("p");
  alertMsg.classList.add("alert-msg");
  alertMsg.innerHTML = msg;
  alertBox.appendChild(alertMsg);

  const okBtn = document.createElement("p");
  okBtn.classList.add("ok-btn");
  okBtn.textContent = "OK";
  alertBox.appendChild(okBtn);

  okBtn.addEventListener("click", () => {
    alertBoxHide();
  });
}
function alertBoxHide() {
  while (alertBox.firstChild) {
    alertBox.removeChild(alertBox.firstChild);
  }
  alertBox.classList.remove("alert-box-toggle");
  overlay.classList.remove("overlay-show");
}

//Event Listeners

btn.addEventListener("click", () => {
  page = 1;
  reposCount = 0;
  const children = document.body.children;
  for (let index = 0; index < children.length; index++) {
    if (
      (children[index].className === "heading") |
      (children[index].className === "repos-list") |
      (children[index].className === "count-repo") |
      (children[index].className === "commits-box") |
      (children[index].className === "move-up")
    ) {
      children[index].remove();
      index--;
    }
  }
  if (input.value) {
    const username = input.value;
    makeRequestRepos(username);
  } else {
    if (input.value.trim() === "") {
      const msg = "Input field cannot be empty";
      alertBoxShow(msg, "error");
    }
  }
});
