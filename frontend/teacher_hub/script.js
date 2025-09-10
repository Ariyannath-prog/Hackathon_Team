document.addEventListener('DOMContentLoaded', () => {
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const createQuizBtn = document.getElementById('create-quiz');

    // Mobile menu toggle
    mobileMenu.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });

    // Login form submission
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        alert(`Login attempted with Email: ${email}`);
        // Add actual login logic here (e.g., API call)
    });

    // Signup form submission
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        alert(`Sign Up attempted for ${name} with Email: ${email}`);
        // Add actual signup logic here (e.g., API call)
    });

    // File upload handling
    const uploadInputs = [
        document.getElementById('video-upload'),
        document.getElementById('photo-upload'),
        document.getElementById('notes-upload')
    ];

    uploadInputs.forEach(input => {
        input.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                alert(`File selected: ${file.name}`);
                // Add actual file upload logic here (e.g., API call)
            }
        });
    });

    // Quiz builder button
    createQuizBtn.addEventListener('click', () => {
        alert('Quiz Builder opened! Implement your quiz creation interface here.');
        // Add logic to open a quiz builder interface
    });
});