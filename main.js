<script>
  document.addEventListener("DOMContentLoaded", function() {
    const menuToggle = document.querySelector(".menu-toggle");
    const navMenu = document.querySelector(".nav-menu");

    menuToggle.addEventListener("click", function() {
      navMenu.classList.toggle("active");
    });
  });

document.addEventListener("DOMContentLoaded", function () {
  // Load Header
  fetch('header.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('header-placeholder').innerHTML = data;
    })
    .catch(error => console.log('Error loading header:', error));

  // Load Footer
  fetch('footer.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('footer-placeholder').innerHTML = data;
    })
    .catch(error => console.log('Error loading footer:', error));
});
fetch('header.html')
  .then(response => {
    console.log(response);  // Tambahkan ini untuk melihat respons
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.text();
  })
  .then(data => {
    document.getElementById('header-placeholder').innerHTML = data;
  })
  .catch(error => console.error('Error fetching header:', error));

</script>
