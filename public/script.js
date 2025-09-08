// Firebase configuration and initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signInWithPopup, 
    GoogleAuthProvider, 
    sendPasswordResetEmail,
    onAuthStateChanged,
    signOut 
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

// Firebase configuration - Replace with your actual config
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD1ZBKGtGBBQNPXezS-kv3DxU5BH0C4ef8",
  authDomain: "ecotech-6d533.firebaseapp.com",
  projectId: "ecotech-6d533",
  storageBucket: "ecotech-6d533.firebasestorage.app",
  messagingSenderId: "336213804618",
  appId: "1:336213804618:web:741d2a262319f21ec0c8b3",
  measurementId: "G-2SJGD4J5K2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Global variables
let currentUser = null;
let current_mode = "light";

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    updateCircleSizes();
    addFormValidation();
    setupMobileNavigation();
    
    // Add some delay for better visual effect
    setTimeout(animateProgressCircles, 300);
});

// Authentication state observer
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in
        currentUser = user;
        updateNavBar(true);
        
        // Update profile image if available
        const profileImg = document.getElementById('profileImg');
        if (profileImg && user.photoURL) {
            profileImg.src = user.photoURL;
        }
        
        // Close any open modals
        closeLoginModal();
        closeSignupModal();
        closeResetPasswordModal();
    } else {
        // User is signed out
        currentUser = null;
        updateNavBar(false);
    }
});

// Update navigation bar based on auth status
function updateNavBar(isAuthenticated) {
    const navAuth = document.getElementById('navAuth');
    const navProfile = document.getElementById('navProfile');
    
    if (isAuthenticated && currentUser) {
        if (navAuth) navAuth.style.display = 'none';
        if (navProfile) navProfile.style.display = 'flex';
    } else {
        if (navAuth) navAuth.style.display = 'flex';
        if (navProfile) navProfile.style.display = 'none';
    }
}

// Modal functions
function openLoginModal() {
    document.getElementById('loginModal').style.display = 'block';
}

function closeLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
    if (document.getElementById('loginForm')) {
        document.getElementById('loginForm').reset();
    }
}

function openSignupModal() {
    document.getElementById('signupModal').style.display = 'block';
}

function closeSignupModal() {
    document.getElementById('signupModal').style.display = 'none';
    if (document.getElementById('signupForm')) {
        document.getElementById('signupForm').reset();
    }
}

function openResetPasswordModal() {
    closeLoginModal();
    document.getElementById('resetPasswordModal').style.display = 'block';
}

function closeResetPasswordModal() {
    document.getElementById('resetPasswordModal').style.display = 'none';
}

// Close modals when clicking outside
window.onclick = function(event) {
    const loginModal = document.getElementById('loginModal');
    const signupModal = document.getElementById('signupModal');
    const resetModal = document.getElementById('resetPasswordModal');
    
    if (event.target === loginModal) {
        closeLoginModal();
    }
    if (event.target === signupModal) {
        closeSignupModal();
    }
    if (event.target === resetModal) {
        closeResetPasswordModal();
    }
};

// Login form handler
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Logged in successfully
                currentUser = userCredential.user;
                updateNavBar(true);
                closeLoginModal();
                showNotification('Login successful!', 'success');
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                showNotification(`Login error: ${errorMessage}`, 'error');
            });
    });
}

// Signup form handler
if (document.getElementById('signupForm')) {
    document.getElementById('signupForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        
        // Basic validation
        if (password.length < 6) {
            showNotification('Password must be at least 6 characters long', 'error');
            return;
        }
        
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed up successfully
                currentUser = userCredential.user;
                updateNavBar(true);
                closeSignupModal();
                showNotification('Account created successfully!', 'success');
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                showNotification(`Signup error: ${errorMessage}`, 'error');
            });
    });
}

// Reset password handler
if (document.getElementById('resetPasswordForm')) {
    document.getElementById('resetPasswordForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = document.getElementById('resetEmail').value;
        
        sendPasswordResetEmail(auth, email)
            .then(() => {
                showNotification('Password reset email sent!', 'success');
                closeResetPasswordModal();
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                showNotification(`Password reset error: ${errorMessage}`, 'error');
            });
    });
}

// Google OAuth login
window.loginWithGoogle = function() {
    signInWithPopup(auth, provider)
        .then((result) => {
            // Google login successful
            currentUser = result.user;
            updateNavBar(true);
            showNotification('Google login successful!', 'success');
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            showNotification(`Google login error: ${errorMessage}`, 'error');
        });
};

// Logout function
window.logout = function() {
    signOut(auth).then(() => {
        currentUser = null;
        updateNavBar(false);
        showNotification('Logged out successfully', 'success');
        
        // Redirect to home if on profile page
        if (window.location.pathname === '/profile' || window.location.pathname.endsWith('/profile.html')) {
            window.location.href = 'index.html';
        }
    }).catch((error) => {
        console.error('Logout error:', error);
        showNotification('An error occurred during logout', 'error');
    });
};

// Navigate to profile page
window.goToProfile = function() {
    window.location.href = 'profile.html';
};

// Profile dropdown toggle
window.toggleProfileDropdown = function() {
    const dropdown = document.getElementById('profileDropdown');
    if (dropdown) {
        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    }
};

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('profileDropdown');
    
    if (dropdown && !e.target.closest('.profile-dropdown') && dropdown.style.display === 'block') {
        dropdown.style.display = 'none';
    }
});

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

// Handle window resize
window.addEventListener('resize', updateCircleSizes);

// Add hover effects for better interactivity
document.querySelectorAll('.stat-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        const circle = card.querySelector('.progress-ring__progress');
        if (circle) circle.style.filter = 'brightness(1.1)';
    });
    
    card.addEventListener('mouseleave', () => {
        const circle = card.querySelector('.progress-ring__progress');
        if (circle) circle.style.filter = 'brightness(1)';
    });
});

// Dark/light mode toggle
const mode = document.querySelector("#theme-toggle");
if (mode) {
    mode.addEventListener("click", () => {
        if (current_mode === "light") {
            mode.innerText = "☀️";
            current_mode = "Dark";
            document.querySelector("body").style.backgroundColor = "#181a20";
            
            const navBar = document.querySelector("#nav_bar");
            if (navBar) navBar.style.backgroundColor = "#23272f";
            
            mode.style.backgroundColor = "#23272f";
            mode.style.color = "#eaf6f6";
            
            document.querySelectorAll(".data").forEach(function(element){
                element.style.backgroundColor = "#23272f";
                element.style.boxShadow = "0 2px 8px rgba(0,0,0,0.18)";
            });
            
            document.querySelectorAll("h5").forEach(function(element){
                element.style.backgroundColor = "#23272f";
                element.style.color = "#eaf6f6";
            });
            
            const slides = document.querySelector(".slides");
            if (slides) slides.style.backgroundColor = "#23272f";
            
            const footer = document.querySelector("#footer");
            if (footer) footer.style.backgroundColor = "#23272f";
            
            document.querySelectorAll(".section-title").forEach(function(element){
                element.style.color = "#eaf6f6";
            });
            
            document.querySelectorAll(".responsive-image").forEach(function(img){
                img.style.boxShadow = "0 2px 8px rgba(0,0,0,0.18)";
            });
            
            document.querySelectorAll('.link_style').forEach(function(link){
                link.style.color = 'white';
            });
        } else {
            mode.innerText = "🌙";
            current_mode = "light";
            document.querySelector("body").style.backgroundColor = "#c7f8f8";
            
            const navBar = document.querySelector("#nav_bar");
            if (navBar) navBar.style.backgroundColor = "#eaf6f6";
            
            mode.style.backgroundColor = "#008080";
            mode.style.color = "#fff";
            
            document.querySelectorAll(".data").forEach(function(element){
                element.style.backgroundColor = "#ffffffff";
            });
            
            document.querySelectorAll("h5").forEach(function(element){
                element.style.backgroundColor = "#ffffffff";
                element.style.color = "black";
            });
            
            const slides = document.querySelector(".slides");
            if (slides) slides.style.backgroundColor = "#ffffffff";
            
            const footer = document.querySelector("#footer");
            if (footer) footer.style.backgroundColor = "#ffffffff";
            
            document.querySelectorAll('.link_style').forEach(function(link){
                link.style.color = 'black';
            });
        }
    });
}

// Mobile navigation setup
function setupMobileNavigation() {
    const hamburger = document.getElementById('hamburger');
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            const navMenu = document.getElementById('navMenu');
            if (navMenu) navMenu.classList.toggle('active');
            
            // Also show auth buttons at bottom on mobile if user is not logged in
            const navAuth = document.getElementById('navAuth');
            if (navAuth && window.innerWidth <= 768 && navAuth.style.display !== 'none') {
                navAuth.classList.toggle('mobile-visible');
            }
        });
    }

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            const navMenu = document.getElementById('navMenu');
            if (navMenu) navMenu.classList.remove('active');
            
            const navAuth = document.getElementById('navAuth');
            if (navAuth) navAuth.classList.remove('mobile-visible');
        });
    });
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove any existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#007bff'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 3000;
        animation: slideInRight 0.3s ease-out;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    // Add animation keyframes if not already added
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 4000);
    
    // Allow manual dismissal by clicking
    notification.addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    });
}

// Form validation helpers
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}

// Enhanced form validation
function addFormValidation() {
    const loginEmail = document.getElementById('loginEmail');
    const signupEmail = document.getElementById('signupEmail');
    const signupPassword = document.getElementById('signupPassword');
    
    // Real-time email validation
    [loginEmail, signupEmail].forEach(input => {
        if (input) {
            input.addEventListener('blur', function() {
                if (this.value && !validateEmail(this.value)) {
                    this.style.borderColor = '#dc3545';
                    showFieldError(this, 'Please enter a valid email address');
                } else {
                    this.style.borderColor = '#ddd';
                    removeFieldError(this);
                }
            });
        }
    });
    
    // Real-time password validation
    if (signupPassword) {
        signupPassword.addEventListener('blur', function() {
            if (this.value && !validatePassword(this.value)) {
                this.style.borderColor = '#dc3545';
                showFieldError(this, 'Password must be at least 6 characters long');
            } else {
                this.style.borderColor = '#ddd';
                removeFieldError(this);
            }
        });
    }
}

function showFieldError(field, message) {
    removeFieldError(field);
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = 'color: #dc3545; font-size: 0.8rem; margin-top: 0.25rem;';
    field.parentNode.appendChild(errorDiv);
}

function removeFieldError(field) {
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

// Handle keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Close modals with Escape key
    if (e.key === 'Escape') {
        closeLoginModal();
        closeSignupModal();
        closeResetPasswordModal();
    }
    
    // Quick login with Ctrl/Cmd + L
    if ((e.ctrlKey || e.metaKey) && e.key === 'l' && !currentUser) {
        e.preventDefault();
        openLoginModal();
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Add loading states to buttons
function addLoadingState(button, text = 'Loading...') {
    const originalText = button.textContent;
    button.textContent = text;
    button.disabled = true;
    button.style.opacity = '0.7';
    
    return () => {
        button.textContent = originalText;
        button.disabled = false;
        button.style.opacity = '1';
    };
}

// Make auth available globally
window.auth = auth;