const article = document.querySelector(".blog-single");
const toggleBtn = document.querySelector(".toggle-reading");
const smaller = document.querySelector(".font-smaller");
const larger = document.querySelector(".font-larger");
const slider = document.querySelector(".font-slider");
const root = document.documentElement;

let fontSize = 1.0;
let mode = "wide";

toggleBtn?.addEventListener("click", () => {
  if (mode === "wide") {
    article.classList.remove("reading-wide");
    article.classList.add("reading-narrow");
    toggleBtn.textContent = "閱讀模式：窄";
    mode = "narrow";
  } else {
    article.classList.remove("reading-narrow");
    article.classList.add("reading-wide");
    toggleBtn.textContent = "閱讀模式：寬";
    mode = "wide";
  }
});

larger?.addEventListener("click", () => {
  fontSize = Math.min(fontSize + 0.05, 1.4);
  article.style.setProperty("--font-size", fontSize + "rem");
});

smaller?.addEventListener("click", () => {
  fontSize = Math.max(fontSize - 0.05, 0.9);
  article.style.setProperty("--font-size", fontSize + "rem");
});


slider.addEventListener("input", () => {
  root.style.setProperty("--font-size", slider.value + "rem");
});


document.addEventListener("DOMContentLoaded", () => {
  const article = document.querySelector(".blog-single");

  document
    .querySelector(".toggle-reading")
    ?.addEventListener("click", () => {
      article.classList.toggle("reading");
    });

  document
    .querySelector(".font-larger")
    ?.addEventListener("click", () => {
      article.style.setProperty(
        "--font-size",
        "1.25rem"
      );
    });

  document
    .querySelector(".font-smaller")
    ?.addEventListener("click", () => {
      article.style.setProperty(
        "--font-size",
        "1.05rem"
      );
    });
});

if (location.hash === "#article") {
  document.querySelector(".blog-single").scrollIntoView();
}
