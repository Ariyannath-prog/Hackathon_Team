// Update the progress bar based on completed boxes
function updateProgressBar() {
    const contents = document.querySelectorAll('.content');
    let completed = 0;
    contents.forEach(box => {
        if (box.classList.contains('completed')) {
            completed++;
        }
    });
    const percent = Math.round((completed / contents.length) * 100);
    const fill = document.getElementById('progress-bar-fill');
    const percentage = document.getElementById('progress-percentage');
    fill.style.width = percent + '%';
    percentage.textContent = percent + '%';
}

// Toggle completed state on click
const contents = document.querySelectorAll('.content');
contents.forEach(box => {
    box.addEventListener('click', function() {
        box.classList.toggle('completed');
        updateProgressBar();
    });
});

// Initial update
updateProgressBar();

// Optional: style completed boxes
const style = document.createElement('style');
style.textContent = `.content.completed { background: #2dce89; color: #fff; box-shadow: 0 4px 16px rgba(45,206,137,0.15), 0 1.5px 4px rgba(0,0,0,0.08); }`;
document.head.appendChild(style);
