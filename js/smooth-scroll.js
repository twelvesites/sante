// Scroll to Hand Hygiene Section
document.getElementById('explore-button').addEventListener('click', function() {
      const targetSection = document.getElementById('handhygiene');
      
      if (targetSection) {
        window.scrollTo({
          top: targetSection.offsetTop,  // Scroll to the top of the section
          behavior: 'smooth'             // Smooth scroll effect
        });
      } else {
        console.error('The target section was not found.');
      }
    });
    