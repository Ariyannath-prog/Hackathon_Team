        // Function to animate progress circles
        function animateProgressCircles() {
            const circles = document.querySelectorAll('.progress-ring__progress');
            const circumference = 2 * Math.PI * 52; // r = 52
            
            circles.forEach(circle => {
                const percentage = parseInt(circle.dataset.percentage);
                const offset = circumference - (percentage / 100) * circumference;
                
                // Set initial state
                circle.style.strokeDasharray = circumference;
                circle.style.strokeDashoffset = circumference;
                
                // Animate to final state
                setTimeout(() => {
                    circle.style.strokeDashoffset = offset;
                }, 500);
            });
        }

        // Function to handle responsive circle sizes
        

        function renderGames(gamesArray) {
            const gamesGrid = document.getElementById('gamesGrid');
            gamesGrid.innerHTML = '';
            
            if (gamesArray.length === 0) {
                gamesGrid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; padding: 2rem;">No games found matching your search.</p>';
                return;
            }
            
            gamesArray.forEach(game => {
                const gameCard = document.createElement('div');
                gameCard.className = 'game-card';
                gameCard.innerHTML = `
                    <a href="${game.link}" class="game-img">${game.emoji}</a>
                    <div class="game-content">
                        <h3 class="game-title">${game.title}</h3>
                        <p class="game-desc">${game.description}</p>
                        <div class="game-meta">
                            <span>${game.genre}</span>
                            <span>${game.rating}</span>
                        </div>
                    </div>
                `;
                gamesGrid.appendChild(gameCard);
            });
        }

        // Initialize everything when DOM is loaded
        document.addEventListener('DOMContentLoaded', () => {
            updateCircleSizes();
            setupLoginModal();
            setupGameSearch();
            
            // Add some delay for better visual effect
            setTimeout(animateProgressCircles, 300);
        });

        // Handle window resize
        window.addEventListener('resize', updateCircleSizes);

        // Add hover effects for better interactivity
        document.querySelectorAll('.stat-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                const circle = card.querySelector('.progress-ring__progress');
                circle.style.filter = 'brightness(1.1)';
            });
            
            card.addEventListener('mouseleave', () => {
                const circle = card.querySelector('.progress-ring__progress');
                circle.style.filter = 'brightness(1)';
            });
        });
