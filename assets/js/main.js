document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("theme-toggle");
  const themeIcon = document.getElementById("theme-icon");

  if (!toggleBtn || !themeIcon) return;

  // Check saved theme or system preference
  const savedTheme = localStorage.getItem("theme");
  const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
    document.documentElement.setAttribute("data-theme", "dark");
    themeIcon.classList.replace("fa-sun", "fa-moon");
  } else {
    document.documentElement.setAttribute("data-theme", "light");
    themeIcon.classList.replace("fa-moon", "fa-sun");
  }

  toggleBtn.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const targetTheme = currentTheme === "dark" ? "light" : "dark";

    document.documentElement.setAttribute("data-theme", targetTheme);
    localStorage.setItem("theme", targetTheme);

    if (targetTheme === "dark") {
      themeIcon.classList.replace("fa-sun", "fa-moon");
    } else {
      themeIcon.classList.replace("fa-moon", "fa-sun");
    }
  });

  // Font Toggle Logic
  const fontToggleBtn = document.getElementById("font-toggle");
  if (fontToggleBtn) {
    const savedFontTheme = localStorage.getItem("font-theme");
    if (savedFontTheme === "sans") {
      document.documentElement.setAttribute("data-font-theme", "sans");
    } else {
      document.documentElement.setAttribute("data-font-theme", "serif");
    }

    fontToggleBtn.addEventListener("click", () => {
      const currentFontTheme = document.documentElement.getAttribute("data-font-theme") || "serif";
      const targetFontTheme = currentFontTheme === "serif" ? "sans" : "serif";

      document.documentElement.setAttribute("data-font-theme", targetFontTheme);
      localStorage.setItem("font-theme", targetFontTheme);
    });
  }

  // Back to Top Button Logic
  const backToTopBtn = document.getElementById("back-to-top-btn");
  if (backToTopBtn) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add("show");
      } else {
        backToTopBtn.classList.remove("show");
      }
    });

    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

  // Copy Code Button Logic
  document.querySelectorAll(".highlight").forEach((highlightDiv) => {
    const button = document.createElement("button");
    button.className = "copy-code-btn";
    button.type = "button";
    button.innerText = "Copy";

    button.addEventListener("click", () => {
      const codeBlock = highlightDiv.querySelector("code");
      if (!codeBlock) return;

      navigator.clipboard.writeText(codeBlock.innerText).then(() => {
        button.innerText = "Copied!";
        setTimeout(() => {
          button.innerText = "Copy";
        }, 2000);
      }).catch((err) => {
        console.error("Failed to copy code: ", err);
        button.innerText = "Error";
      });
    });

    highlightDiv.appendChild(button);
  });
});
