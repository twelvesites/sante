window.onload = function () {
    const modal = document.getElementById("welcomeModal");
    const closeBtn = document.getElementById("closeModal");
    const body = document.body;

    // Show modal on load
    modal.classList.add("show");
    body.classList.add("modal-active");

    // Close modal on click
    closeBtn.onclick = function () {
      modal.classList.remove("show");
      body.classList.remove("modal-active");
    };
  };

