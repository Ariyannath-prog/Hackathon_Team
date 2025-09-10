document.addEventListener('DOMContentLoaded', () => {
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const playButtons = document.querySelectorAll('.play-btn');

    // Mobile menu toggle
    mobileMenu.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });

    // Login form submission
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        alert(`Login attempted for ${username}`);
        // Add actual login logic here (e.g., API call)
    });

    // Signup form submission
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('signup-username').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        alert(`Sign Up attempted for ${username} with Email: ${email}`);
        // Add actual signup logic here (e.g., API call)
    });

    // Mock game play functionality
    playButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const game = e.target.dataset.game;
            alert(`Starting ${game}!`);
            // Simulate score update
            const score = Math.floor(Math.random() * 100) + 50; // Random score for demo
            updateLeaderboard('Player' + Math.floor(Math.random() * 1000), score);
        });
    });

    // Mock leaderboard update function
    function updateLeaderboard(player, score) {
        const tbody = document.querySelector('#leaderboard-table tbody');
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${tbody.children.length + 1}</td>
            <td>${player}</td>
            <td>${score}</td>
        `;
        tbody.appendChild(newRow);
        // Sort leaderboard by score
        const rows = Array.from(tbody.children);
        rows.sort((a, b) => parseInt(b.cells[2].textContent) - parseInt(a.cells[2].textContent));
        tbody.innerHTML = '';
        rows.forEach((row, index) => {
            row.cells[0].textContent = index + 1;
            tbody.appendChild(row);
        });
        // Keep only top 5
        while (tbody.children.length > 5) {
            tbody.removeChild(tbody.lastChild);
        }
    }
});