// Handle signup form submission
document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault();
    let username = document.getElementById('username').value.trim();
    let email = document.getElementById('email').value.trim();
    let password = document.getElementById('password').value;

    if(username === "" || email === "" || password === "") {
        alert("Please fill all fields!");
        return;
    }
    // Optionally, add email and password validation here

    // Simulate successful signup
    alert("Account created successfully for " + username + "! 🌍");
    // Perform actual signup logic with backend here
});

function googleSignUp() {
    alert("Google Sign Up feature coming soon!");
    // Integrate Google authentication as needed
}
