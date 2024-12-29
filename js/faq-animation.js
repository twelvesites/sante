const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    item.addEventListener('click', () => {
        const answer = item.querySelector('.faq-answer');

        // Check if the answer is already shown
        if (answer.classList.contains('show')) {
            // If shown, slide it up (close it)
            answer.classList.remove('show');
        } else {
            // If not shown, slide it down (open it)
            answer.classList.add('show');
        }
    });
});
