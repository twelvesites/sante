import { AlluraFontBase64 } from "./AlluraFontBase64.js";
let userName = "";
let userId = ""; // Store the unique user ID from Firebase
let currentQuestionIndex = 0;
let score = 0;
const totalQuestions = 10; // Total number of questions
const questions = [
    {
        question: "What is the best way to prevent the spread of infections?",
        options: ["Washing your hands regularly", "Wearing gloves all the time", "Avoiding eating", "Sharing drinks"],
        correctAnswer: 0
    },
    {
        question: "How long should you wash your hands to remove germs effectively?",
        options: ["5 seconds", "10 seconds", "20 seconds", "1 minute"],
        correctAnswer: 2
    },
    {
        question: "When should you wash your hands?",
        options: ["Before eating", "After using the bathroom", "After touching public surfaces", "All of the above"],
        correctAnswer: 3
    },
    {
        question: "What should you do when you cough or sneeze to prevent the spread of germs?",
        options: ["Cough into your hands", "Cough into the air", "Cough into your elbow or a tissue", "None of the above"],
        correctAnswer: 2
    },
    {
        question: "What should you do if soap and water are not available to wash your hands?",
        options: ["Use water only", "Use any soap", "Use a hand sanitizer with at least 60% alcohol", "Nothing"],
        correctAnswer: 2
    },
    {
        question: "What should you do if you feel sick with flu-like symptoms?",
        options: ["Go to work or school", "Stay home and rest", "Go to a crowded place", "Ignore it and keep working"],
        correctAnswer: 1
    },
    {
        question: "Which of the following is an effective way to protect yourself from infections?",
        options: ["Avoid touching your face", "Washing your hands after touching surfaces", "Using hand sanitizer", "All of the above"],
        correctAnswer: 3
    },
    {
        question: "What should you do with used tissues to prevent the spread of infection?",
        options: ["Throw them in a regular trash can", "Leave them on the table", "Throw them in a closed trash bin", "Use them again later"],
        correctAnswer: 2
    },
    {
        question: "What is the proper way to dispose of a face mask after use?",
        options: ["Throw it on the ground", "Re-use it multiple times", "Dispose of it in a trash bin", "Wash it and reuse it immediately"],
        correctAnswer: 2
    },
    {
        question: "Why is it important to get vaccinated?",
        options: ["To protect yourself from serious illnesses", "To avoid infections", "To protect others from illnesses", "All of the above"],
        correctAnswer: 3
    }
];
function startQuiz() {
    userName = document.getElementById('userName').value.trim();
    if (userName === "") {
        alert("Please enter your name.");
        return;
    }

    // Sanitize the username to use as a Firebase key (remove unsupported characters)
    const sanitizedName = sanitizeUserName(userName);

    // Push initial user data to Firebase with the sanitized name
    const userData = {
        name: userName,
        correctAnswers: 0,
        score: 0,
        startTime: new Date().toLocaleString()
    };

    // Use the sanitized name as the node key in Firebase
    const userRef = firebase.database().ref('quizResults').child(sanitizedName);
    userRef.set(userData);

    userId = sanitizedName; // Save the sanitized name for later updates

    document.getElementById('nameModal').style.display = "none";
    document.getElementById('quizContainer').style.display = "block";
    showQuestion();
}
// Function to sanitize the user's name (remove unsupported Firebase characters)
function sanitizeUserName(name) {
    return name.replace(/[^a-zA-Z0-9]/g, '_'); // Replace non-alphanumeric characters with '_'
}

// Expose to global scope
window.startQuiz = startQuiz;

// Displays the current question
function showQuestion() {
    const question = questions[currentQuestionIndex];
    document.getElementById('questionNumber').innerHTML = `Question ${currentQuestionIndex + 1} of ${totalQuestions}`;
    document.getElementById('questionContainer').innerText = question.question;
    
    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = ""; // Clear previous options
    
    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.innerText = option;
        button.classList.add('option-button'); // Add a class for styling
        button.onclick = () => checkAnswer(index, button);
        optionsContainer.appendChild(button);
    });
}

// Checks if the selected answer is correct
function checkAnswer(selectedIndex, button) {
    const question = questions[currentQuestionIndex];
    const optionsContainer = document.getElementById('optionsContainer');

    // Disable all options after the first click
    const allButtons = optionsContainer.querySelectorAll('button');
    allButtons.forEach((btn) => {
        btn.disabled = true; // Disable the buttons
    });

    // Highlight the selected option
    if (selectedIndex !== question.correctAnswer) {
        button.style.backgroundColor = "red";
        const wrongSound = new Audio('wrong.mp3');
        wrongSound.play();

        const correctButton = optionsContainer.children[question.correctAnswer];
        correctButton.style.backgroundColor = "green";
    } else {
        score++;
        button.style.backgroundColor = "green";
        const correctSound = new Audio('correct.mp3');
        correctSound.play();
    }

    // Update the user's score in Firebase
    const percentage = ((score / totalQuestions) * 100).toFixed(2);
    const userRef = firebase.database().ref('quizResults').child(userId); // Use sanitized name as reference
    userRef.update({
        correctAnswers: score,
        score: percentage
    });

    setTimeout(() => {
        fadeOut(button);
    }, 1000);
}

// Fades out the button after selection
function fadeOut(button) {
    button.style.transition = "opacity 0.5s ease-out";
    button.style.opacity = 0;
    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            showQuestion();
        } else {
            showResult();
        }
    }, 500); // Wait for fade-out to complete
}

// Show the results after completing the quiz
function showResult() {
    document.getElementById('quizContainer').style.display = "none";
    document.getElementById('resultContainer').style.display = "block";

    // Calculate the percentage score
    const percentage = ((score / totalQuestions) * 100).toFixed(2);
    document.getElementById('score').innerText = `${percentage}%`;

    // Collect user data and store it in Firebase
    const userData = {
        name: userName,
        correctAnswers: score,
        score: percentage,
        time: new Date().toLocaleString() // Store the time and date of completion
    };

    // Store user data in Firebase with the sanitized name
    const userRef = firebase.database().ref('quizResults').child(userId); // Use sanitized name as reference
    userRef.update(userData)
        .then(() => {
            console.log("User data updated successfully.");
        })
        .catch((error) => {
            console.error("Error updating user data: ", error);
        });

    // Enable the download certificate button
    document.getElementById('downloadCertificateButton').style.display = "block";
}

function capitalizeName(name) {
    return name
        .split(' ')  // Split the name into words
        .map(word => 
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()  // Capitalize the first letter of each word
        )
        .join(' ');  // Join the words back together
}

function downloadCertificate() {
    const { jsPDF } = window.jspdf;

    const doc = new jsPDF('landscape');
    doc.addFileToVFS("Allura-Regular.ttf", AlluraFontBase64);
    doc.addFont("Allura-Regular.ttf", "Allura", "normal");

    const img = new Image();
    img.onload = () => {
        doc.addImage(img, 'PNG', 0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height);

        doc.setFont("Allura");
        doc.setFontSize(60);
        doc.setTextColor(71, 46, 24);

        const capitalizedUserName = capitalizeName(userName);
        const nameWidth = doc.getTextWidth(capitalizedUserName);
        const centerX = doc.internal.pageSize.width / 2;
        doc.text(capitalizedUserName, centerX - nameWidth / 2, 100);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(15);
        doc.setTextColor(0, 0, 0);

        const percentage = ((score / totalQuestions) * 100).toFixed(2);
        doc.text(`Score: ${percentage}%`, centerX, 135, { align: "center" });

        // Generate the PDF as a Blob URL
        const pdfBlob = doc.output('blob');
        const blobURL = URL.createObjectURL(pdfBlob);

        // Detect if the device is iOS
        const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

        if (isIOS) {
            // Redirect to Blob URL for iOS devices
            window.location.href = blobURL;
        } else {
            // For non-iOS devices, trigger download
            const link = document.createElement('a');
            link.href = blobURL;
            link.download = 'Twelve-Certificate.pdf';
            link.rel = 'noopener';
            link.style.display = 'none';

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(blobURL); // Free up memory
        }
    };

    img.src = 'https://twelvesites.github.io/ipc/images/certificate_template.png'; // Path to your certificate template image
}



// Expose to global scope
window.downloadCertificate = downloadCertificate;