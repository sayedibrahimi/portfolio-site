// Initialize all components when DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Update tab links to use data attributes instead of inline onclick
  const tabLinks = document.getElementsByClassName("tab-links");
  for (let i = 0; i < tabLinks.length; i++) {
    const tab = tabLinks[i];
    const onclickValue = tab.getAttribute("onclick");
    if (onclickValue) {
      const tabName = onclickValue.replace("opentab('", "").replace("')", "");
      tab.setAttribute("data-tab", tabName);
      tab.removeAttribute("onclick");
    }
  }

  // Replace inline onclick attributes with proper event listeners
  const openMenuBtn = document.querySelector(
    '.menu-button[onclick="showSidebar()"]'
  );
  const closeMenuBtn = document.querySelector(
    '.menu-button[onclick="hideSidebar()"]'
  );

  if (openMenuBtn) {
    openMenuBtn.removeAttribute("onclick");
  }

  if (closeMenuBtn) {
    closeMenuBtn.removeAttribute("onclick");
  }

  // Initialize components
  new PortfolioTabs();
  new MobileNavigation();
  new ContactForm();
  new SmoothScroll();
  new ScrollAnimation();
  new ProjectAnimations();
  new ThemeToggle();
  new TypingAnimation();
  new SkillAnimation();

  // Animate metrics counters
  initMetricsCounter();
});

// Theme toggle functionality
class ThemeToggle {
  constructor() {
    this.themeToggleBtn = document.getElementById("theme-toggle-btn");
    this.body = document.body;
    this.isDarkMode = true; // Default is dark mode

    // Check for saved theme preference
    this.checkPreference();

    // Bind event listener
    if (this.themeToggleBtn) {
      this.themeToggleBtn.addEventListener("click", () => this.toggleTheme());
    }
  }

  checkPreference() {
    // Check if theme preference is stored in localStorage
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      this.isDarkMode = savedTheme === "dark";
      this.applyTheme();
    }
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    this.applyTheme();

    // Save preference
    localStorage.setItem("theme", this.isDarkMode ? "dark" : "light");
  }

  applyTheme() {
    if (this.isDarkMode) {
      this.body.classList.remove("light-mode");
      if (this.themeToggleBtn) {
        this.themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
      }
    } else {
      this.body.classList.add("light-mode");
      if (this.themeToggleBtn) {
        this.themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
      }
    }
  }
}

// Typing animation effect
class TypingAnimation {
  constructor() {
    this.typingElements = document.querySelectorAll(".typing-text");
    this.init();
  }

  init() {
    this.typingElements.forEach((element) => {
      const text = element.textContent;
      element.textContent = "";

      let i = 0;
      const typeWriter = () => {
        if (i < text.length) {
          element.textContent += text.charAt(i);
          i++;
          setTimeout(typeWriter, 100);
        }
      };

      // Start typing with a slight delay
      setTimeout(typeWriter, 500);
    });
  }
}

// Animate skill bars when they come into view
class SkillAnimation {
  constructor() {
    this.skillBars = document.querySelectorAll(".skill-progress .progress");
    this.initObserver();
  }

  initObserver() {
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const targetWidth =
                entry.target.parentElement.previousElementSibling
                  .lastElementChild.textContent;
              entry.target.style.width = targetWidth;
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.2 }
      );

      this.skillBars.forEach((bar) => {
        // Initially set width to 0
        bar.style.width = "0";
        observer.observe(bar);
      });
    } else {
      // Fallback for browsers without IntersectionObserver
      this.skillBars.forEach((bar) => {
        const targetWidth =
          bar.parentElement.previousElementSibling.lastElementChild.textContent;
        bar.style.width = targetWidth;
      });
    }
  }
}

// Animate metrics counters
function initMetricsCounter() {
  const metricNumbers = document.querySelectorAll(".metric-number");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target;
            const targetNumber = parseInt(
              target.textContent.replace(/\D/g, "")
            );
            let count = 0;
            const duration = 2000; // 2 seconds
            const interval = duration / targetNumber;

            const counter = setInterval(() => {
              count++;
              target.textContent =
                count + (target.textContent.includes("+") ? "+" : "");

              if (count >= targetNumber) {
                clearInterval(counter);
              }
            }, interval);

            observer.unobserve(target);
          }
        });
      },
      { threshold: 0.5 }
    );

    metricNumbers.forEach((number) => {
      observer.observe(number);
    });
  }
}

// Add resume download tracking
document.addEventListener("DOMContentLoaded", () => {
  const resumeButton = document.querySelector('a[href="resume.pdf"]');
  if (resumeButton) {
    resumeButton.addEventListener("click", () => {
      // You could add actual analytics here
      console.log("Resume downloaded at: " + new Date().toString());

      // Optional: Show feedback to user
      const msg = document.getElementById("msg");
      if (msg) {
        msg.textContent = "Resume download started!";
        setTimeout(() => {
          msg.textContent = "";
        }, 3000);
      }
    });
  }
}); // JavaScript implementation for the portfolio website

// Tab functionality
class PortfolioTabs {
  constructor() {
    this.tabLinks = document.getElementsByClassName("tab-links");
    this.tabContents = document.getElementsByClassName("tab-contents");

    // Bind event listeners
    this.bindEvents();
  }

  bindEvents() {
    // Convert HTMLCollection to Array for forEach
    for (let i = 0; i < this.tabLinks.length; i++) {
      const tabLink = this.tabLinks[i];
      tabLink.addEventListener("click", (event) => {
        const target = event.currentTarget;
        const tabname = target.getAttribute("data-tab");
        if (tabname) {
          this.openTab(tabname, target);
        }
      });
    }
  }

  openTab(tabname, clickedElement) {
    // Remove active class from all tabs
    for (let i = 0; i < this.tabLinks.length; i++) {
      this.tabLinks[i].classList.remove("active-link");
    }

    for (let i = 0; i < this.tabContents.length; i++) {
      this.tabContents[i].classList.remove("active-tab");
    }

    // Add active class to clicked tab
    clickedElement.classList.add("active-link");
    const tabElement = document.getElementById(tabname);
    if (tabElement) {
      tabElement.classList.add("active-tab");
    }
  }
}

// Mobile navigation
class MobileNavigation {
  constructor() {
    this.sidebar = document.querySelector(".sidebar");
    this.bindEvents();
  }

  bindEvents() {
    const menuBtn = document.querySelector(".menu-button a");
    const closeBtn = document.querySelector(".sidebar .menu-button");

    if (menuBtn) {
      menuBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.showSidebar();
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        this.hideSidebar();
      });
    }

    // Close sidebar when clicking on a link
    const sidebarLinks = document.querySelectorAll(".sidebar a");
    sidebarLinks.forEach((link) => {
      link.addEventListener("click", () => {
        this.hideSidebar();
      });
    });
  }

  showSidebar() {
    if (this.sidebar) {
      this.sidebar.style.display = "flex";
      setTimeout(() => {
        if (this.sidebar) {
          this.sidebar.style.transform = "translateX(0)";
        }
      }, 10);
    }
  }

  hideSidebar() {
    if (this.sidebar) {
      this.sidebar.style.transform = "translateX(100%)";
      setTimeout(() => {
        if (this.sidebar) {
          this.sidebar.style.display = "none";
        }
      }, 300);
    }
  }
}

// Contact form handling
class ContactForm {
  constructor() {
    this.form = document.forms.namedItem("submit-to-google-sheet");
    this.messageElement = document.getElementById("msg");
    this.bindEvents();
  }

  bindEvents() {
    if (this.form) {
      this.form.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleSubmit();
      });
    }
  }

  handleSubmit() {
    if (!this.form) return;

    try {
      // You would replace this URL with your actual form submission endpoint
      const scriptURL = "YOUR_FORM_SUBMISSION_URL";
      const formData = new FormData(this.form);

      // Show sending message
      this.showMessage("Sending message...");

      // Simulate API call with a timeout (replace with actual fetch when ready)
      setTimeout(() => {
        this.showMessage("Message sent successfully!");
        this.form.reset();
      }, 1500);

      // When ready to implement actual form submission:
      // fetch(scriptURL, {
      //   method: "POST",
      //   body: formData
      // })
      // .then(response => {
      //   if (response.ok) {
      //     this.showMessage("Message sent successfully!");
      //     this.form.reset();
      //   } else {
      //     throw new Error("Form submission failed");
      //   }
      // })
      // .catch(error => {
      //   console.error("Error submitting form:", error);
      //   this.showMessage("Failed to send message. Please try again.");
      // });
    } catch (error) {
      console.error("Error submitting form:", error);
      this.showMessage("Failed to send message. Please try again.");
    }
  }

  showMessage(text) {
    if (this.messageElement) {
      this.messageElement.innerHTML = text;

      if (text === "Message sent successfully!") {
        setTimeout(() => {
          if (this.messageElement) {
            this.messageElement.innerHTML = "";
          }
        }, 5000);
      }
    }
  }
}

// Smooth scrolling for navigation links
class SmoothScroll {
  constructor() {
    this.initSmoothScroll();
  }

  initSmoothScroll() {
    const navLinks = document.querySelectorAll('a[href^="#"]');

    navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();

        const href = link.getAttribute("href");
        if (!href || href === "#") return;

        const targetElement = document.querySelector(href);
        if (!targetElement) return;

        window.scrollTo({
          top: targetElement.getBoundingClientRect().top + window.scrollY,
          behavior: "smooth",
        });
      });
    });
  }
}

// Scroll animation for navbar
class ScrollAnimation {
  constructor() {
    this.navbar = document.querySelector("nav");
    this.initScrollListener();
  }

  initScrollListener() {
    window.addEventListener("scroll", () => {
      this.handleScroll();
    });
  }

  handleScroll() {
    if (!this.navbar) return;

    if (window.scrollY > 50) {
      this.navbar.classList.add("nav-scrolled");
    } else {
      this.navbar.classList.remove("nav-scrolled");
    }
  }
}

// Project animations on scroll
class ProjectAnimations {
  constructor() {
    this.projectCards = document.querySelectorAll(".project-card");
    this.scrollIndicator = document.querySelector(".scroll-indicator");
    this.projectsScroll = document.querySelector(".projects-scroll");
    this.initIntersectionObserver();
    this.initScrollIndicator();
  }

  initIntersectionObserver() {
    if ("IntersectionObserver" in window) {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
              // Add animation with delay based on index
              setTimeout(() => {
                entry.target.classList.add("animate-in");
              }, index * 150);

              // Unobserve after animation is added
              this.observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.2,
          rootMargin: "0px 0px -100px 0px",
        }
      );

      this.projectCards.forEach((card) => {
        this.observer.observe(card);
      });
    } else {
      // Fallback for browsers that don't support IntersectionObserver
      this.projectCards.forEach((card) => {
        card.classList.add("animate-in");
      });
    }
  }

  initScrollIndicator() {
    // Hide scroll indicator if not scrollable
    if (this.projectsScroll && this.scrollIndicator) {
      // Check if scrollable on load
      this.checkScrollable();

      // Check again on window resize
      window.addEventListener("resize", () => {
        this.checkScrollable();
      });

      // Hide indicator when scrolled to end
      this.projectsScroll.addEventListener("scroll", () => {
        this.checkScrollEnd();
      });
    }
  }

  checkScrollable() {
    if (this.projectsScroll && this.scrollIndicator) {
      const isScrollable =
        this.projectsScroll.scrollWidth > this.projectsScroll.clientWidth;
      this.scrollIndicator.style.display = isScrollable ? "block" : "none";
    }
  }

  checkScrollEnd() {
    if (this.projectsScroll && this.scrollIndicator) {
      const isAtEnd =
        this.projectsScroll.scrollLeft + this.projectsScroll.clientWidth >=
        this.projectsScroll.scrollWidth - 50;
      this.scrollIndicator.style.opacity = isAtEnd ? "0" : "0.8";
    }
  }
}

// Initialize all components when DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Update tab links to use data attributes instead of inline onclick
  const tabLinks = document.getElementsByClassName("tab-links");
  for (let i = 0; i < tabLinks.length; i++) {
    const tab = tabLinks[i];
    const onclickValue = tab.getAttribute("onclick");
    if (onclickValue) {
      const tabName = onclickValue.replace("opentab('", "").replace("')", "");
      tab.setAttribute("data-tab", tabName);
      tab.removeAttribute("onclick");
    }
  }

  // Replace inline onclick attributes with proper event listeners
  const openMenuBtn = document.querySelector(
    '.menu-button[onclick="showSidebar()"]'
  );
  const closeMenuBtn = document.querySelector(
    '.menu-button[onclick="hideSidebar()"]'
  );

  if (openMenuBtn) {
    openMenuBtn.removeAttribute("onclick");
  }

  if (closeMenuBtn) {
    closeMenuBtn.removeAttribute("onclick");
  }

  // Initialize components
  new PortfolioTabs();
  new MobileNavigation();
  new ContactForm();
  new SmoothScroll();
  new ScrollAnimation();
  new ProjectAnimations();
});
