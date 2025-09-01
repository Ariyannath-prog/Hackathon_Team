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
        function updateCircleSizes() {
            const circles = document.querySelectorAll('.progress-ring__circle');
            const rings = document.querySelectorAll('.progress-ring');
            const progressCircles = document.querySelectorAll('.progress-circle');
            
            if (window.innerWidth <= 480) {
                // Mobile size
                circles.forEach(circle => {
                    circle.setAttribute('r', '32');
                    circle.setAttribute('cx', '40');
                    circle.setAttribute('cy', '40');
                });
                rings.forEach(ring => {
                    ring.setAttribute('width', '80');
                    ring.setAttribute('height', '80');
                });
                progressCircles.forEach(pc => {
                    pc.style.width = '80px';
                    pc.style.height = '80px';
                });
            } else if (window.innerWidth <= 768) {
                // Tablet size
                circles.forEach(circle => {
                    circle.setAttribute('r', '42');
                    circle.setAttribute('cx', '50');
                    circle.setAttribute('cy', '50');
                });
                rings.forEach(ring => {
                    ring.setAttribute('width', '100');
                    ring.setAttribute('height', '100');
                });
                progressCircles.forEach(pc => {
                    pc.style.width = '100px';
                    pc.style.height = '100px';
                });
            } else {
                // Desktop size
                circles.forEach(circle => {
                    circle.setAttribute('r', '52');
                    circle.setAttribute('cx', '60');
                    circle.setAttribute('cy', '60');
                });
                rings.forEach(ring => {
                    ring.setAttribute('width', '120');
                    ring.setAttribute('height', '120');
                });
                progressCircles.forEach(pc => {
                    pc.style.width = '120px';
                    pc.style.height = '120px';
                });
            }
            
            // Recalculate and animate circles with new sizes
            setTimeout(animateProgressCircles, 100);
        }

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