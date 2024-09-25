// Load header
fetch('header.html')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.text();
  })
  .then(data => {
    document.getElementById('header-placeholder').innerHTML = data;
  })
  .catch(error => console.error('Error loading header:', error));

// Load footer
fetch('footer.html')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.text();
  })
  .then(data => {
    document.getElementById('footer-placeholder').innerHTML = data;
  })
  .catch(error => console.error('Error loading footer:', error));
