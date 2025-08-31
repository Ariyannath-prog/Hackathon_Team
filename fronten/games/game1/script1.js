  // Game State
        let gameState = {
            score: 0,
            currentLevel: 1,
            gems: 0,
            unlockedLevels: 1,
            currentProblem: null
        };

        // Level Data with Problems
        const levels = [
            {
                id: 1,
                title: "Number Magic",
                icon: "🔢",
                subject: "Basic Arithmetic",
                problem: {
                    text: "A magical number machine multiplies any number by 7 and then adds 15. If you put in the number 8, what comes out?",
                    answer: 71,
                    hint: "First multiply 8 × 7, then add 15 to the result!",
                    visual: "8 → ×7 → +15 → ?"
                },
                reward: "🎈 Unlocked: Algebra Kingdom!"
            },
            {
                id: 2,
                title: "Algebra Kingdom",
                icon: "👑",
                subject: "Linear Equations",
                problem: {
                    text: "In the Royal Garden, there are roses and tulips. If there are 3 times as many roses as tulips, and together they total 48 flowers, how many tulips are there?",
                    answer: 12,
                    hint: "Let tulips = x, then roses = 3x. So x + 3x = 48",
                    visual: "Tulips: 🌷 × ? <br> Roses: 🌹 × (3 × ?) <br> Total: 48 flowers"
                },
                reward: "🧮 Unlocked: Geometry Galaxy!"
            },
            {
                id: 3,
                title: "Geometry Galaxy",
                icon: "🌌",
                subject: "Areas & Perimeters",
                problem: {
                    text: "A rectangular spaceship has a length of 15 meters and width of 8 meters. What is the area of this spaceship?",
                    answer: 120,
                    hint: "Area of rectangle = length × width",
                    visual: "🚀 Spaceship: 15m × 8m = ? m²"
                },
                reward: "📊 Unlocked: Statistics Station!"
            },
            {
                id: 4,
                title: "Statistics Station",
                icon: "📊",
                subject: "Mean & Median",
                problem: {
                    text: "The test scores of 5 students are: 78, 85, 92, 88, 77. What is the mean (average) score?",
                    answer: 84,
                    hint: "Add all scores and divide by the number of students (5)",
                    visual: "Scores: 78 + 85 + 92 + 88 + 77 = ? ÷ 5"
                },
                reward: "🔬 Unlocked: Physics Lab!"
            },
            {
                id: 5,
                title: "Physics Lab",
                icon: "🔬",
                subject: "Speed & Distance",
                problem: {
                    text: "A racing car travels 240 kilometers in 3 hours. What is its average speed in km/h?",
                    answer: 80,
                    hint: "Speed = Distance ÷ Time",
                    visual: "🏎️ 240 km ÷ 3 hours = ? km/h"
                },
                reward: "🎉 Quest Complete! You're a Math Master!"
            }
        ];

        // Initialize Game
        function initGame() {
            updateScoreboard();
            generateLevelMap();
            createFloatingParticles();
        }

        function updateScoreboard() {
            document.getElementById('score').textContent = gameState.score;
            document.getElementById('current-level').textContent = gameState.currentLevel;
            document.getElementById('gems').textContent = gameState.gems;
            
            const progress = (gameState.unlockedLevels / levels.length) * 100;
            document.getElementById('progress-fill').style.width = progress + '%';
        }

        function generateLevelMap() {
            const levelMap = document.getElementById('level-map');
            levelMap.innerHTML = '';

            levels.forEach(level => {
                const levelCard = document.createElement('div');
                levelCard.className = 'level-card';
                
                if (level.id <= gameState.unlockedLevels) {
                    levelCard.classList.add('unlocked');
                    levelCard.onclick = () => openProblem(level);
                } else {
                    levelCard.classList.add('locked');
                }

                if (level.id < gameState.currentLevel) {
                    levelCard.classList.add('completed');
                }

                levelCard.innerHTML = `
                    <div class="level-icon">${level.icon}</div>
                    <div class="level-number">Level ${level.id}</div>
                    <div class="level-title">${level.title}</div>
                    <div style="color: rgba(255,255,255,0.8); font-size: 0.9rem; margin-top: 10px;">
                        ${level.subject}
                    </div>
                `;

                levelMap.appendChild(levelCard);
            });
        }

        function openProblem(level) {
            if (level.id > gameState.unlockedLevels) return;

            gameState.currentProblem = level;
            const modal = document.getElementById('problem-modal');
            
            document.getElementById('problem-title').textContent = `${level.icon} ${level.title}`;
            document.getElementById('problem-text').textContent = level.problem.text;
            document.getElementById('problem-visual').innerHTML = `
                <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 15px; font-size: 1.3rem; color: #FFE082;">
                    ${level.problem.visual}
                </div>
            `;
            
            document.getElementById('answer-input').value = '';
            document.getElementById('feedback').innerHTML = '';
            document.getElementById('hint-text').style.display = 'none';
            
            modal.style.display = 'flex';
            
            // Focus on input with slight delay for better UX
            setTimeout(() => {
                document.getElementById('answer-input').focus();
            }, 300);
        }

        function closeProblem() {
            document.getElementById('problem-modal').style.display = 'none';
        }

        function showHint() {
            const hintElement = document.getElementById('hint-text');
            hintElement.textContent = gameState.currentProblem.problem.hint;
            hintElement.style.display = 'block';
            
            // Add some points for using hint
            gameState.score += 5;
            updateScoreboard();
        }

        function checkAnswer() {
            const userAnswer = parseInt(document.getElementById('answer-input').value);
            const correctAnswer = gameState.currentProblem.problem.answer;
            const feedback = document.getElementById('feedback');

            if (userAnswer === correctAnswer) {
                // Correct Answer!
                feedback.innerHTML = `
                    <div class="success-feedback">
                        🎉 Excellent! You've mastered ${gameState.currentProblem.title}! 
                        <div class="level-reward">${gameState.currentProblem.reward}</div>
                    </div>
                `;
                
                // Update game state
                gameState.score += 100;
                gameState.gems += 10;
                gameState.currentLevel++;
                gameState.unlockedLevels = Math.max(gameState.unlockedLevels, gameState.currentLevel);
                
                // Show celebration
                showCelebration("🎉 AMAZING! 🎉");
                
                // Close modal after celebration
                setTimeout(() => {
                    closeProblem();
                    generateLevelMap();
                    updateScoreboard();
                }, 2000);
                
            } else {
                // Wrong Answer
                feedback.innerHTML = `
                    <div class="error-feedback">
                        🤔 Not quite right! The correct answer is ${correctAnswer}. 
                        <br>Take your time and try to understand the solution!
                    </div>
                `;
                
                // Small consolation points
                gameState.score += 10;
                updateScoreboard();
            }
        }

        function showCelebration(text) {
            const celebration = document.getElementById('celebration');
            celebration.textContent = text;
            celebration.style.opacity = '1';
            celebration.style.animation = 'celebrate 1.5s ease-out forwards';
            
            setTimeout(() => {
                celebration.style.opacity = '0';
            }, 1500);
        }

        function createFloatingParticles() {
            setInterval(() => {
                if (Math.random() < 0.3) {
                    const particle = document.createElement('div');
                    particle.className = 'floating-particles';
                    particle.style.left = Math.random() * 100 + '%';
                    particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
                    particle.style.background = ['#FFD700', '#FF6B6B', '#4facfe', '#a8edea'][Math.floor(Math.random() * 4)];
                    
                    document.body.appendChild(particle);
                    
                    setTimeout(() => {
                        particle.remove();
                    }, 5000);
                }
            }, 1000);
        }

        // Event Listeners
        document.getElementById('answer-input').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                checkAnswer();
            }
        });

        // Initialize game when page loads
        window.addEventListener('load', initGame);

        // Add some interactive sound effects (visual feedback)
        function addClickEffect(element) {
            element.style.transform = 'scale(0.95)';
            setTimeout(() => {
                element.style.transform = 'scale(1)';
            }, 150);
        }

        // Enhanced level card interactions
        document.addEventListener('click', function(e) {
            if (e.target.closest('.level-card.unlocked')) {
                addClickEffect(e.target.closest('.level-card'));
            }
        });

        // Random encouraging messages
        const encouragingMessages = [
            "🌟 You're doing great!",
            "🎯 Keep up the excellent work!",
            "🔥 You're on fire!",
            "💪 Math champion in the making!",
            "🚀 Reaching for the stars!"
        ];

        function showRandomEncouragement() {
            if (gameState.score > 0 && gameState.score % 200 === 0) {
                const message = encouragingMessages[Math.floor(Math.random() * encouragingMessages.length)];
                showCelebration(message);
            }
        }

        // Update the checkAnswer function to include encouragement
        const originalCheckAnswer = checkAnswer;
        checkAnswer = function() {
            originalCheckAnswer();
            showRandomEncouragement();
        };