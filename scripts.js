// Toggle extra bio
function toggleBio() {
  const extraBio = document.querySelector('.extra-bio');
  extraBio.style.display = (extraBio.style.display === 'block') ? 'none' : 'block';
}

// Theme toggle
function toggleTheme() {
  const body = document.body;
  const btn = document.getElementById('themeToggle');
  body.classList.toggle('dark-theme');

  btn.textContent = body.classList.contains('dark-theme') ? '🌞' : '🌙';
}

// Main DOMContentLoaded
document.addEventListener("DOMContentLoaded", function() {

  // Load header
  fetch('header.html')
    .then(res => res.text())
    .then(data => {
      document.getElementById('header-placeholder').innerHTML = data;

      // Highlight active nav link after header is loaded
      const navLinks = document.querySelectorAll("nav a");
      const currentPage = location.pathname.split("/").pop();
      navLinks.forEach(link => {
        if (link.getAttribute("href") === currentPage) {
          link.classList.add("active");
        }
      });
    });

  // Load footer
  fetch('footer.html')
    .then(res => res.text())
    .then(data => {
      document.getElementById('footer-placeholder').innerHTML = data;
    });

  // Custom cursor
  const cursor = document.querySelector('.cursor');
  document.addEventListener('mousemove', (e) => {
    cursor.style.left = `${e.pageX}px`;
    cursor.style.top = `${e.pageY}px`;
  });

});



  const links = document.querySelectorAll("nav a");
  const content = document.getElementById("content");

  links.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const page = link.getAttribute("data-page");

      fetch(page)
        .then(res => res.text())
        .then(html => {
          content.innerHTML = html;
          // highlight active tab
          links.forEach(l => l.classList.remove("active"));
          link.classList.add("active");
        });
    });
  });

// load home by default
fetch("home.html")
  .then(res => res.text())
  .then(html => (content.innerHTML = html));



// Function to attach Abstract toggle functionality
function attachAbstractToggle() {
  const toggles = document.querySelectorAll(".abstract-toggle");
  toggles.forEach(btn => {
    btn.removeEventListener("click", toggleAbstract); // Remove previous listener to avoid duplicates
    btn.addEventListener("click", toggleAbstract);
  });
}

// Toggle function
function toggleAbstract() {
  const abstractBox = this.closest(".paper").querySelector(".abstract-box");
  if (abstractBox) abstractBox.classList.toggle("show");
}

// Open link in new tab
function openLink(url) {
  window.open(url, "_blank");
}

// Load paper HTML and attach listeners
function loadPapers(containerId, filePath) {
  fetch(filePath)
    .then(response => response.text())
    .then(data => {
      document.getElementById(containerId).innerHTML = data;
      attachAbstractToggle(); // Attach after content is loaded
    })
    .catch(error => console.error(`Error loading ${filePath}:`, error));
}

// Run after DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  loadPapers("job", "papers/job.html");
  loadPapers("published", "papers/published.html");
  loadPapers("working", "papers/working.html");
  loadPapers("wip", "papers/wip.html");
  loadPapers("review", "papers/review.html");
});



window.openLink = function(url) {
  window.open(url, "_blank");
};