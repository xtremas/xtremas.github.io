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
