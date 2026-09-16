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

/* Connect homepage buttons to the course page. */

document
  .querySelectorAll(".hero .button-primary, .course-action .button")
  .forEach((link) => {
    link.setAttribute("href", "course.html");
  });

/* Display saved course progress. */

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

/* Interactive lesson pages. */

const lessonContent = document.querySelector("#lesson-content");

const lessonSteps = [
  ...document.querySelectorAll(".lesson-step")
];

const viewButtons = [
  ...document.querySelectorAll(".view-button")
];

const activeLessonId = Number(
  document.body.dataset.lessonId || 5
);

const savedStepKey = `sageLesson${activeLessonId}Step`;

let currentStep = Number(
  localStorage.getItem(savedStepKey) || 1
);

function showLessonStep(step) {
  if (!lessonSteps.length) {
    return;
  }

  currentStep = Math.max(
    1,
    Math.min(step, lessonSteps.length)
  );

  lessonSteps.forEach((item) => {
    const isCurrent =
      Number(item.dataset.step) === currentStep;

    item.classList.toggle("active", isCurrent);
  });

  const label = document.querySelector("#step-label");
  const fill = document.querySelector("#lesson-progress-fill");
  const previous = document.querySelector("#previous-step");
  const next = document.querySelector("#next-step");

  if (label) {
    label.textContent =
      `Step ${currentStep} of ${lessonSteps.length}`;
  }

  if (fill) {
    fill.style.width =
      `${(currentStep / lessonSteps.length) * 100}%`;
  }

  if (previous) {
    previous.disabled = currentStep === 1;
  }

  if (next) {
    next.disabled =
      currentStep === lessonSteps.length;

    next.textContent =
      currentStep === lessonSteps.length
        ? "Ready to finish"
        : "Next step →";
  }

  localStorage.setItem(
    savedStepKey,
    String(currentStep)
  );
}

viewButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const fullView =
      button.dataset.view === "full";

    lessonContent?.classList.toggle(
      "full-view",
      fullView
    );

    viewButtons.forEach((item) => {
      item.classList.toggle(
        "active",
        item === button
      );
    });

    localStorage.setItem(
      "sageLessonView",
      fullView ? "full" : "guided"
    );
  });
});

document
  .querySelector("#previous-step")
  ?.addEventListener("click", () => {
    showLessonStep(currentStep - 1);
  });

document
  .querySelector("#next-step")
  ?.addEventListener("click", () => {
    showLessonStep(currentStep + 1);
  });

document
  .querySelector("#print-lesson")
  ?.addEventListener("click", () => {
    window.print();
  });

document
  .querySelector("#complete-lesson")
  ?.addEventListener("click", () => {
    const savedLessons = JSON.parse(
      localStorage.getItem("sageCompletedLessons") || "[]"
    );

    if (!savedLessons.includes(activeLessonId)) {
      savedLessons.push(activeLessonId);
    }

    localStorage.setItem(
      "sageCompletedLessons",
      JSON.stringify(savedLessons)
    );

    window.location.href = "course.html#lessons";
  });

if (lessonSteps.length) {
  showLessonStep(currentStep);

  if (
    localStorage.getItem("sageLessonView") === "full"
  ) {
    viewButtons
      .find((button) => button.dataset.view === "full")
      ?.click();
  }
}
