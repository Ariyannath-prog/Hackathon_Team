// Firebase configuration
const firebaseConfig = {
  apiKey:"AIzaSyDCJhNJhmdAVi36BdULh4nl2gPA-dqjN78",
  authDomain:"cool-coder-club.firebaseapp.com",
  projectId: "cool-coder-club",
  storageBucket: "cool-coder-club.appspot.com",
  messagingSenderId: "334363510872",
  appId:"1:334363510872:web:your-app-id"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

// DOM Elements
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');
const overlay = document.getElementById('overlay');
const authModal = document.getElementById('authModal');
const closeAuthModal = document.getElementById('closeAuthModal');
const authTabs = document.querySelectorAll('.auth-tab');
const cartSidebar = document.getElementById('cartSidebar');
const closeCart = document.getElementById('closeCart');
const cartIcon = document.getElementById('cartIcon');
const modal = document.getElementById('productModal');
const closeModal = document.getElementById('closeModal');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const filterButtons = document.querySelectorAll('.filter-btn');

// Product data
let products = [];

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Fetch products from backend and initialize app
document.addEventListener('DOMContentLoaded', function() {
  // Always re-load cart from localStorage on every page load
  cart = JSON.parse(localStorage.getItem('cart')) || [];
  updateCartUI();

  // Initialize auth state observer
  auth.onAuthStateChanged(user => {
    updateAuthUI(user);
  });

  // Fetch products from backend
  fetch('http://localhost:5000/api/products')
    .then(res => res.json())
    .then(data => {
      products = data;
      renderProducts();
    })
    .catch(err => {
      showNotification('Failed to load products from server', 'error');
    });

  // Initialize event listeners
  initEventListeners();
  
  // Initialize carousel
  initCarousel();
  
  // Setup profile dropdown
  setupProfileDropdown();
});

function initEventListeners() {
  // Debug: Check if the close button exists
const closeCartAddressBtn = document.getElementById('closeCartAddressModal');
console.log('closeCartAddressModal button:', closeCartAddressBtn);
if (!closeCartAddressBtn) {
  console.error('closeCartAddressModal button not found!');
}
  // Mobile menu toggle
  hamburger.addEventListener('click', toggleMobileMenu);
  overlay.addEventListener('click', closeAllModals);

  // Close modals
  closeAuthModal.addEventListener('click', closeAllModals);
  closeModal.addEventListener('click', closeAllModals);
  closeCart.addEventListener('click', closeAllModals);

  // Auth tabs
  authTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const tabName = this.getAttribute('data-tab');
      switchAuthTab(tabName);
    });
  });

  // Auth forms
  document.getElementById('loginFormElement').addEventListener('submit', handleLogin);
  document.getElementById('signupFormElement').addEventListener('submit', handleSignup);
  document.getElementById('resetFormElement').addEventListener('submit', handleResetPassword);

  // Google auth buttons
  document.getElementById('googleLoginBtn').addEventListener('click', signInWithGoogle);
  document.getElementById('googleSignupBtn').addEventListener('click', signInWithGoogle);

  // Search functionality
  searchButton.addEventListener('click', handleSearch);
  searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') handleSearch();
  });

  // Filter buttons
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      const filterValue = this.getAttribute('data-filter');
      renderProducts(filterValue);
    });
  });

  // Cart icon
  cartIcon.addEventListener('click', function() {
    cartSidebar.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  // Checkout button
  document.querySelector('.cart-checkout').addEventListener('click', handleCheckout);

  // Newsletter form
  document.getElementById('newsletterForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = this.querySelector('input').value;
    showNotification(`Thank you for subscribing with ${email}`, 'success');
    this.reset();
  });

  // Quantity controls
  document.getElementById('decreaseQty').addEventListener('click', decreaseQuantity);
  document.getElementById('increaseQty').addEventListener('click', increaseQuantity);
  document.getElementById('quantity').addEventListener('input', validateQuantity);

  // Modal actions
  document.getElementById('addToCartModal').addEventListener('click', addToCartFromModal);
  document.getElementById('buyNowModal').addEventListener('click', buyNowFromModal);

  // Close cart address modal
  document.getElementById('closeCartAddressModal').addEventListener('click', closeCartAddressModal);

  // Cart address form
  document.getElementById('cartAddressForm').addEventListener('submit', handleCartAddressForm);
}

// Mobile menu functions
function toggleMobileMenu() {
  navLinks.classList.toggle('active');
  overlay.classList.toggle('active');
  document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : 'auto';
  
  // Toggle hamburger icon
  const icon = hamburger.querySelector('i');
  if (navLinks.classList.contains('active')) {
    icon.classList.replace('fa-bars', 'fa-times');
  } else {
    icon.classList.replace('fa-times', 'fa-bars');
  }
}

function closeAllModals() {
  navLinks.classList.remove('active');
  authModal.classList.remove('active');
  modal.classList.remove('active');
  cartSidebar.classList.remove('active');
  overlay.classList.remove('active');
  // Also close cart address modal if open
  const cartAddressModal = document.getElementById('cartAddressModal');
  if (cartAddressModal) cartAddressModal.classList.remove('active');
  document.body.style.overflow = 'auto';
  // Reset hamburger icon
  const icon = hamburger.querySelector('i');
  if (icon.classList.contains('fa-times')) {
    icon.classList.replace('fa-times', 'fa-bars');
  }
}

// Auth functions
function updateAuthUI(user) {
  const authButtons = document.querySelector('.auth-buttons');
  
  if (user) {
    authButtons.innerHTML = '';
    
    const profileDiv = document.createElement('div');
    profileDiv.className = 'user-profile';
    
    // Create profile content
    const initials = user.displayName 
      ? user.displayName.split(' ').map(n => n[0]).join('').toUpperCase()
      : user.email[0].toUpperCase();
    
    profileDiv.innerHTML = `
      <div class="profile-trigger">
        <div class="profile-avatar">
          ${user.photoURL ? 
            `<img src="${user.photoURL}" alt="Profile">` : 
            `<div class="initials">${initials}</div>`
          }
        </div>
        <span class="profile-name">${user.displayName || user.email.split('@')[0]}</span>
        <i class="fas fa-chevron-down"></i>
      </div>
      <div class="profile-dropdown">
        <div class="profile-dropdown-header">
          <h4>${user.displayName || 'User'}</h4>
          <p>${user.email}</p>
        </div>
        <a href="#" class="profile-dropdown-item">
          <i class="far fa-user"></i> My Account
        </a>
        <a href="#" class="profile-dropdown-item">
          <i class="far fa-heart"></i> Wishlist
        </a>
        <a href="#" class="profile-dropdown-item">
          <i class="far fa-clock"></i> Order History
        </a>
        <div class="profile-dropdown-footer">
          <button id="logoutBtn" class="btn btn-small btn-outline">
            <i class="fas fa-sign-out-alt"></i> Sign Out
          </button>
        </div>
      </div>
    `;
    
    authButtons.appendChild(profileDiv);
    
    // Add event listeners
    const profileTrigger = profileDiv.querySelector('.profile-trigger');
    const dropdown = profileDiv.querySelector('.profile-dropdown');
    
    profileTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('show');
    });
    
    document.getElementById('logoutBtn').addEventListener('click', (e) => {
      e.preventDefault();
      logoutUser();
    });
    

    
    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!profileDiv.contains(e.target)) {
        dropdown.classList.remove('show');
      }
    });
  } else {
    // User is logged out - show auth buttons
    authButtons.innerHTML = `
      <button class="btn btn-outline" id="loginBtn">Login</button>
      <button class="btn" id="signupBtn">Sign Up</button>
    `;
    
    // Add auth button event listeners
    document.getElementById('loginBtn').addEventListener('click', () => {
      authModal.classList.add('active');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
    
    document.getElementById('signupBtn').addEventListener('click', () => {
      authModal.classList.add('active');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      switchAuthTab('signup');
    });
  }
}

function setupProfileDropdown() {
  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.user-profile')) {
      const dropdowns = document.querySelectorAll('.profile-dropdown');
      dropdowns.forEach(dropdown => {
        dropdown.classList.remove('show');
      });
    }
  });
}
function switchAuthTab(tabName) {
  authTabs.forEach(tab => {
    if (tab.getAttribute('data-tab') === tabName) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });
  
  document.querySelectorAll('.auth-form').forEach(form => {
    if (form.id === `${tabName}Form`) {
      form.classList.add('active');
    } else {
      form.classList.remove('active');
    }
  });
}

function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  
  if (!validateForm('login')) return;
  
  loginUser(email, password)
    .then(() => {
      showNotification('Login successful', 'success');
      closeAllModals();
    })
    .catch(error => {
      showNotification(getAuthErrorMessage(error.code), 'error');
    });
}

function handleSignup(e) {
  e.preventDefault();
  const name = document.getElementById('signupName').value;
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;
  
  if (!validateForm('signup')) return;
  
  signupUser(name, email, password)
    .then(() => {
      showNotification('Account created successfully', 'success');
      closeAllModals();
    })
    .catch(error => {
      showNotification(getAuthErrorMessage(error.code), 'error');
    });
}

function handleResetPassword(e) {
  e.preventDefault();
  const email = document.getElementById('resetEmail').value;
  
  if (!email) {
    showFormError('resetEmailError', 'Email is required');
    return;
  }
  
  if (!isValidEmail(email)) {
    showFormError('resetEmailError', 'Please enter a valid email');
    return;
  }
  
  resetPassword(email)
    .then(() => {
      showNotification('Password reset email sent', 'success');
      switchAuthTab('login');
      document.getElementById('resetFormElement').reset();
    })
    .catch(error => {
      showNotification(getAuthErrorMessage(error.code), 'error');
    });
}

function signInWithGoogle() {
  auth.signInWithPopup(provider)
    .then((result) => {
      showNotification('Signed in successfully', 'success');
      closeAllModals();
    })
    .catch((error) => {
      showNotification(getAuthErrorMessage(error.code), 'error');
    });
}

function loginUser(email, password) {
  return auth.signInWithEmailAndPassword(email, password);
}

function signupUser(name, email, password) {
  return auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      return userCredential.user.updateProfile({
        displayName: name
      });
    });
}

function resetPassword(email) {
  return auth.sendPasswordResetEmail(email);
}

function logoutUser() {
  auth.signOut()
    .then(() => {
      showNotification('Logged out successfully', 'success');
    })
    .catch((error) => {
      showNotification('Error signing out', 'error');
    });
}

function getAuthErrorMessage(errorCode) {
  switch(errorCode) {
    case 'auth/email-already-in-use':
      return 'Email already in use';
    case 'auth/invalid-email':
      return 'Invalid email address';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters';
    case 'auth/user-not-found':
      return 'User not found';
    case 'auth/wrong-password':
      return 'Incorrect password';
    case 'auth/too-many-requests':
      return 'Too many attempts. Try again later';
    case 'auth/popup-closed-by-user':
      return 'Sign in cancelled';
    case 'auth/cancelled-popup-request':
      return 'Sign in cancelled';
    default:
      return 'Authentication error';
  }
}

// Form validation
function validateForm(formType) {
  let isValid = true;
  
  if (formType === 'login') {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!email) {
      showFormError('loginEmailError', 'Email is required');
      isValid = false;
    } else if (!isValidEmail(email)) {
      showFormError('loginEmailError', 'Please enter a valid email');
      isValid = false;
    } else {
      hideFormError('loginEmailError');
    }
    
    if (!password) {
      showFormError('loginPasswordError', 'Password is required');
      isValid = false;
    } else {
      hideFormError('loginPasswordError');
    }
    
  } else if (formType === 'signup') {
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    
    if (!name) {
      showFormError('signupNameError', 'Name is required');
      isValid = false;
    } else {
      hideFormError('signupNameError');
    }
    
    if (!email) {
      showFormError('signupEmailError', 'Email is required');
      isValid = false;
    } else if (!isValidEmail(email)) {
      showFormError('signupEmailError', 'Please enter a valid email');
      isValid = false;
    } else {
      hideFormError('signupEmailError');
    }
    
    if (!password) {
      showFormError('signupPasswordError', 'Password is required');
      isValid = false;
    } else if (password.length < 6) {
      showFormError('signupPasswordError', 'Password must be at least 6 characters');
      isValid = false;
    } else {
      hideFormError('signupPasswordError');
    }
  }
  
  return isValid;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showFormError(elementId, message) {
  const element = document.getElementById(elementId);
  element.textContent = message;
  element.classList.add('active');
}

function hideFormError(elementId) {
  const element = document.getElementById(elementId);
  element.textContent = '';
  element.classList.remove('active');
}

// Product functions
// Simple Levenshtein distance for fuzzy search
function levenshtein(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

function isFuzzyMatch(str, term) {
  str = str.toLowerCase();
  term = term.toLowerCase();
  if (str.includes(term)) return true;
  // Split into words and check each word for fuzzy match
  const words = str.split(/\s+/);
  for (let word of words) {
    if (levenshtein(word, term) <= (term.length > 5 ? 2 : 1)) return true;
  }
  // Allow up to 2 typos for short terms, 3 for longer (full string)
  const maxDistance = term.length > 5 ? 3 : 2;
  return levenshtein(str, term) <= maxDistance;
}

function renderProducts(filter = 'all', searchTerm = '') {
  const productsGrid = document.querySelector('.products-grid');
  productsGrid.innerHTML = '';

  let filteredProducts = filter === 'all' ? products : products.filter(product => product.category === filter);
  
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filteredProducts = filteredProducts.filter(product => 
      isFuzzyMatch(product.title, term) || 
      isFuzzyMatch(product.description, term)
    );
  }

  if (filteredProducts.length === 0) {
    productsGrid.innerHTML = '<p class="no-products">No products found matching your criteria.</p>';
    return;
  }

  filteredProducts.forEach(product => {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    productCard.innerHTML = `
      <div class="product-img">
        <img src="${product.image}" alt="${product.title}" loading="lazy">
      </div>
      <div class="product-info">
        <h3 class="product-title">${product.title}</h3>
        <div class="product-price">${product.price}</div>
        <div class="product-actions">
          <button class="add-to-cart" data-id="${product.id}" ${product.stock <= 0 ? 'disabled' : ''}>
            ${product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
          
        </div>
      </div>
    `;
    productsGrid.appendChild(productCard);
  });

  // Add event listeners to new buttons
  addProductEventListeners();
}

function handleSearch() {
  const term = searchInput.value.trim();
  renderProducts('all', term);
}

function initCarousel() {
  const slides = document.querySelectorAll('.hero-slide');
  if (!slides.length) return;
  let current = 0;
  function showSlide(idx) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === idx);
    });
  }
  showSlide(current);
  setInterval(() => {
    current = (current + 1) % slides.length;
    showSlide(current);
  }, 4000);
}

function addProductEventListeners() {
  // Quick view (modal open)
  document.querySelectorAll('.product-img').forEach(img => {
    img.onclick = null; // Remove previous
    img.addEventListener('click', function() {
      const productId = this.closest('.product-card').querySelector('.add-to-cart').getAttribute('data-id');
      const product = products.find(p => p.id == productId);
      if (product) {
        console.log('Opening modal for product:', product); // Debug
        openProductModal(product);
      } else {
        console.error('Product not found for id:', productId);
      }
    });
  });
  // Add to cart
  document.querySelectorAll('.add-to-cart').forEach(button => {
    const newBtn = button.cloneNode(true);
    button.parentNode.replaceChild(newBtn, button);
    newBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      const productId = this.getAttribute('data-id');
      addToCart(productId, 1);
    });
  });
  // Buy now
  document.querySelectorAll('.buy-now').forEach(button => {
    const newBtn = button.cloneNode(true);
    button.parentNode.replaceChild(newBtn, button);
    newBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      const productId = this.getAttribute('data-id');
      buyNow(productId, 1);
    });
  });
}

function openProductModal(product) {
  document.getElementById('modalProductImg').src = product.image;
  document.getElementById('modalProductTitle').textContent = product.title;
  document.getElementById('modalProductPrice').textContent = product.price;
  document.getElementById('modalProductDescription').textContent = product.description;
  
  const featuresList = document.getElementById('modalProductFeatures');
  featuresList.innerHTML = '';
  product.features.forEach(feature => {
    const li = document.createElement('li');
    li.textContent = feature;
    featuresList.appendChild(li);
  });
  
  document.getElementById('addToCartModal').setAttribute('data-id', product.id);
  document.getElementById('buyNowModal').setAttribute('data-id', product.id);
  document.getElementById('quantity').value = 1;

  // Reset address form and buttons
  const addressForm = document.getElementById('addressForm');
  addressForm.style.display = 'none';
  addressForm.reset && addressForm.reset();
  document.getElementById('addToCartModal').style.display = '';
  document.getElementById('buyNowModal').style.display = '';

  // Buy Now button shows the address form
  const buyNowBtn = document.getElementById('buyNowModal');
  buyNowBtn.onclick = function() {
    document.getElementById('addToCartModal').style.display = 'none';
    buyNowBtn.style.display = 'none';
    addressForm.style.display = 'block';
    document.getElementById('addressName').focus();
    console.log('[DEBUG] Address form shown in product modal');
  };

  // Always attach the submit event handler for addressForm
  addressForm.onsubmit = function(e) {
    e.preventDefault();
    const address = {
      name: document.getElementById('addressName').value,
      phone: document.getElementById('addressPhone').value,
      line1: document.getElementById('addressLine1').value,
      line2: document.getElementById('addressLine2').value,
      city: document.getElementById('addressCity').value,
      state: document.getElementById('addressState').value,
      zip: document.getElementById('addressZip').value
    };
    console.log('[DEBUG] Product modal address form submitted:', address);
    if (!address.name || !address.phone || !address.line1 || !address.city || !address.state || !address.zip) {
      showNotification('Please fill all required address fields', 'error');
      return;
    }
    sessionStorage.setItem('shippingAddress', JSON.stringify(address));
    addressForm.style.display = 'none';
    const productId = document.getElementById('buyNowModal').getAttribute('data-id');
    const quantity = parseInt(document.getElementById('quantity').value);
    console.log('[DEBUG] Calling startPayment from product modal with:', productId, quantity, address);
    startPayment(productId, quantity, address);
    // Do NOT closeAllModals here; let Razorpay handler close it on success
  };

  modal.classList.add('active');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

// Quantity functions
function decreaseQuantity() {
  const quantityInput = document.getElementById('quantity');
  let value = parseInt(quantityInput.value) || 1;
  if (value > 1) {
    quantityInput.value = value - 1;
  }
}

function increaseQuantity() {
  const quantityInput = document.getElementById('quantity');
  let value = parseInt(quantityInput.value) || 1;
  quantityInput.value = value + 1;
}

function validateQuantity() {
  const quantityInput = document.getElementById('quantity');
  let value = parseInt(this.value) || 1;
  if (value < 1) value = 1;
  this.value = value;
}

// Cart functions
function addToCart(productId, quantity) {
  const product = products.find(p => p.id == productId);
  if (!product) return;

  if (product.stock <= 0) {
    showNotification('This product is out of stock', 'error');
    return;
  }

  const existingItem = cart.find(item => item.id == productId);
  
  if (existingItem) {
    if (existingItem.quantity + quantity > product.stock) {
      showNotification(`Only ${product.stock} items available`, 'error');
      return;
    }
    existingItem.quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: quantity
    });
  }

  updateCartUI();
  showNotification(`${quantity} ${product.title} added to cart`, 'success');
}

function updateCartUI() {
  // Update cart count
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  document.querySelector('.cart-count').textContent = totalItems;
  document.getElementById('cartTotalItems').textContent = totalItems;
  
  // Update cart items
  const cartItemsContainer = document.getElementById('cartItems');
  
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p class="empty-cart-message">Your cart is empty</p>';
    document.getElementById('cartTotalPrice').textContent = '₹0';
  } else {
    cartItemsContainer.innerHTML = '';
    
    let totalPrice = 0;
    
    cart.forEach(item => {
      const priceNumber = parseInt(item.price.replace(/[^0-9]/g, ''));
      totalPrice += priceNumber * item.quantity;
      
      const cartItem = document.createElement('div');
      cartItem.className = 'cart-item';
      cartItem.innerHTML = `
        <div class="cart-item-img">
          <img src="${item.image}" alt="${item.title}" loading="lazy">
        </div>
        <div class="cart-item-info">
          <h4 class="cart-item-title">${item.title}</h4>
          <div class="cart-item-price">${item.price}</div>
          <div class="cart-item-quantity">
            <button class="decrease-item" data-id="${item.id}" aria-label="Decrease quantity">-</button>
            <span>${item.quantity}</span>
            <button class="increase-item" data-id="${item.id}" aria-label="Increase quantity">+</button>
          </div>
          <button class="cart-item-remove" data-id="${item.id}">Remove</button>
        </div>
      `;
      cartItemsContainer.appendChild(cartItem);
    });
    
    document.getElementById('cartTotalPrice').textContent = `₹${totalPrice.toLocaleString('en-IN')}`;
    
    // Add event listeners to cart item buttons
    document.querySelectorAll('.decrease-item').forEach(button => {
      button.addEventListener('click', function() {
        const productId = this.getAttribute('data-id');
        const item = cart.find(item => item.id == productId);
        
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          cart = cart.filter(item => item.id != productId);
        }
        
        updateCartUI();
      });
    });
    
    document.querySelectorAll('.increase-item').forEach(button => {
      button.addEventListener('click', function() {
        const productId = this.getAttribute('data-id');
        const item = cart.find(item => item.id == productId);
        const product = products.find(p => p.id == productId);
        
        if (item.quantity >= product.stock) {
          showNotification(`Only ${product.stock} items available`, 'error');
          return;
        }
        
        item.quantity += 1;
        updateCartUI();
      });
    });
    
    document.querySelectorAll('.cart-item-remove').forEach(button => {
      button.addEventListener('click', function() {
        const productId = this.getAttribute('data-id');
        cart = cart.filter(item => item.id != productId);
        updateCartUI();
        showNotification('Item removed from cart', 'error');
      });
    });
  }
  
  // Save cart to localStorage
  localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCartFromModal() {
  const productId = this.getAttribute('data-id');
  const quantity = parseInt(document.getElementById('quantity').value);
  addToCart(productId, quantity);
  closeAllModals();
}

function buyNowFromModal() {
  const productId = this.getAttribute('data-id');
  const quantity = parseInt(document.getElementById('quantity').value);
  showAddressForm(productId, quantity);
}

// Show address form before payment
function showAddressForm(productId, quantity) {
  const addressForm = document.getElementById('addressForm');
  addressForm.style.display = 'block';
  addressForm.onsubmit = function(e) {
    e.preventDefault();
    // Collect address data
    const address = {
      name: document.getElementById('addressName').value,
      phone: document.getElementById('addressPhone').value,
      line1: document.getElementById('addressLine1').value,
      line2: document.getElementById('addressLine2').value,
      city: document.getElementById('addressCity').value,
      state: document.getElementById('addressState').value,
      zip: document.getElementById('addressZip').value
    };
    // Save address in session for payment
    sessionStorage.setItem('shippingAddress', JSON.stringify(address));
    addressForm.style.display = 'none';
    // Continue to payment
    startPayment(productId, quantity, address);
  };
}

// Example payment function (replace with your Razorpay logic)
function startPayment(productId, quantity, address) {
  const product = products.find(p => p.id == productId);
  const orderAmount = parseInt(product.price.replace(/[^0-9]/g, '')) * quantity * 100; // in paise

  const options = {
    key: "rzp_test_NvkahITXc49fA5", // Razorpay live test key from .env
    amount: orderAmount,
    currency: 'INR',
    name: 'Rongali Threads',
    description: product.title,
    image: product.image,
    handler: function (response) {
      const orderData = {
        productId,
        quantity,
        address,
        product,
        paymentId: response.razorpay_payment_id
      };
      fetch('https://rongali-backend.onrender.com/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      })
      .then(res => res.json())
      .then(data => {
        showNotification('Order placed successfully!', 'success');
        closeAllModals();
      })
      .catch(() => showNotification('Order failed', 'error'));
    },
    prefill: {
      name: address.name,
      email: auth.currentUser ? auth.currentUser.email : '',
      contact: address.phone
    },
    notes: {
      address: `${address.line1}, ${address.line2}, ${address.city}, ${address.state}, ${address.zip}`
    },
    theme: {
      color: '#9e2b2b'
    }
  };
  if (typeof Razorpay !== 'undefined') {
    const rzp = new Razorpay(options);
    rzp.open();
    console.log('[DEBUG] Razorpay opened with key:', options.key);
  } else {
    showNotification('Razorpay SDK not loaded', 'error');
    console.error('[DEBUG] Razorpay SDK not loaded');
  }
}

// Cart checkout handler for Razorpay integration
function handleCheckout() {
  if (cart.length === 0) {
    showNotification('Your cart is empty', 'error');
    return;
  }
  showCartAddressModal();
}

// Show cart address modal
function showCartAddressModal() {
  document.getElementById('cartAddressModal').classList.add('active');
  document.getElementById('overlay').classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeCartAddressModal() {
  console.log('closeCartAddressModal called');
  document.getElementById('cartAddressModal').classList.remove('active');
  document.getElementById('overlay').classList.remove('active');
  document.body.style.overflow = 'auto';
}
// Handle cart address form submit
function handleCartAddressForm(e) {
  e.preventDefault();
  const address = {
    name: document.getElementById('cartAddressName').value,
    phone: document.getElementById('cartAddressPhone').value,
    line1: document.getElementById('cartAddressLine1').value,
    line2: document.getElementById('cartAddressLine2').value,
    city: document.getElementById('cartAddressCity').value,
    state: document.getElementById('cartAddressState').value,
    zip: document.getElementById('cartAddressZip').value
  };
  console.log('[DEBUG] Cart address form submitted:', address);
  if (!address.name || !address.phone || !address.line1 || !address.city || !address.state || !address.zip) {
    showNotification('Please fill all required address fields', 'error');
    return;
  }
  closeCartAddressModal();
  console.log('[DEBUG] Calling startCartPayment with address:', address);
  startCartPayment(address);
}

// Cart payment with Razorpay
function startCartPayment(address) {
  let totalAmount = 0;
  cart.forEach(item => {
    const priceNumber = parseInt(item.price.replace(/[^0-9]/g, ''));
    totalAmount += priceNumber * item.quantity;
  });
  totalAmount = totalAmount * 100; // in paise
  console.log('[DEBUG] Starting Razorpay for cart, amount:', totalAmount, 'address:', address, 'cart:', cart);
  const options = {
    key: 'rzp_test_NvkahITXc49fA5', // Replace with your Razorpay key
    amount: totalAmount,
    currency: 'INR',
    name: 'Rongali Threads',
    description: 'Cart Checkout',
    handler: function (response) {
      const orderData = {
        cart,
        address,
        paymentId: response.razorpay_payment_id
      };
      fetch('https://rongali-backend.onrender.com/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      })
      .then(res => res.json())
      .then(data => {
        showNotification('Order placed successfully!', 'success');
        cart = [];
        updateCartUI();
        closeAllModals();
      })
      .catch(() => showNotification('Order failed', 'error'));
    },
    prefill: {
      name: address.name,
      contact: address.phone
    },
    notes: {
      address: `${address.line1}, ${address.city}, ${address.state}, ${address.zip}`
    },
    theme: {
      color: '#9e2b2b'
    }
  };
  if (typeof Razorpay !== 'undefined') {
    const rzp = new Razorpay(options);
    rzp.open();
    console.log('[DEBUG] Razorpay opened');
  } else {
    showNotification('Razorpay SDK not loaded', 'error');
    console.error('[DEBUG] Razorpay SDK not loaded');
  }
}

// Notification function
function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'fadeOut 0.3s forwards';
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

// Window resize handler
window.addEventListener('resize', function() {
  if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
    closeAllModals();
  }
});

