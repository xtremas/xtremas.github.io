$(document).ready(function() {
  // Load header
  $("#header-placeholder").load("header.html", function(response, status, xhr) {
    if (status == "error") {
      console.error("Error loading header: " + xhr.status + " " + xhr.statusText);
    }
  });

  // Load footer
  $("#footer-placeholder").load("footer.html", function(response, status, xhr) {
    if (status == "error") {
      console.error("Error loading footer: " + xhr.status + " " + xhr.statusText);
    }
  });
});
  document.addEventListener("DOMContentLoaded", function() {
    const menuToggle = document.querySelector(".menu-toggle");
    const navMenu = document.querySelector(".nav-menu");

    menuToggle.addEventListener("click", function() {
      navMenu.classList.toggle("active");
    });
  });
