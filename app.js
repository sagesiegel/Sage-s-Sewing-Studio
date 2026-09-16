const menuButton = document.querySelector(".menu-button");
const navigation = document.querySelector(".site-nav");

menuButton?.addEventListener("click", () => {
  const isOpen = navigation.classList.toggle("open");

  menuButton.setAttribute("aria-expanded", String(isOpen));
});

navigation?.addEventListener("click", () => {
  navigation.classList.remove("open");

  menuButton?.setAttribute("aria-expanded", "false");
});

const year = document.querySelector("#year");

if (year) {
  year.textContent = new Date().getFullYear();
}

const completedLessons = JSON.parse(
  localStorage.getItem("sageCompletedLessons") || "[]"
);

const completedCount = document.querySelector("#completed-count");
const progressBar = document.querySelector("#course-progress-bar");

if (completedCount) {
  completedCount.textContent = completedLessons.length;
}

if (progressBar) {
  progressBar.style.width =
    `${(completedLessons.length / 13) * 100}%`;
}

completedLessons.forEach((lessonNumber) => {
  document
    .querySelector(`[data-lesson="${lessonNumber}"]`)
    ?.classList.add("completed");
});
