
document.addEventListener('DOMContentLoaded', function () {
  const mySwitch = document.getElementById('mySwitch');
  const body = document.body;
  
  // Check if dark mode preference is set
  const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  // Set initial state of the switch based on the current theme preference
  mySwitch.checked = prefersDarkMode;

  // Toggle dark mode when switch is clicked
  mySwitch.addEventListener('change', function (event) {
      if (event.target.checked) {
          console.log("dark mode");
          body.classList.remove('bg-light');
          body.classList.add('bg-dark');
      } else {
          console.log("light mode");
          body.classList.remove('bg-dark');
          body.classList.add('bg-light');
      }
  });
});

  