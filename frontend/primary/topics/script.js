
// Progress chart for YouTube video
const progressRing = document.getElementById('progress-ring');
const progressLabel = document.getElementById('progress-label');

function updateProgressChart(percent) {
    const circumference = 2 * Math.PI * 52;
    const offset = circumference - (percent / 100) * circumference;
    progressRing.setAttribute('stroke-dashoffset', offset);
    progressLabel.textContent = Math.round(percent) + '%';
}

let player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('ytplayer', {
        height: '100%',
        width: '100%',
        videoId: 'Whz0leipCoI',
        events: {
            'onStateChange': onPlayerStateChange
        }
    });
}

let progressInterval = null;
function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.PLAYING) {
        if (!progressInterval) {
            progressInterval = setInterval(() => {
                const duration = player.getDuration();
                const current = player.getCurrentTime();
                if (duration > 0) {
                    const percent = (current / duration) * 100;
                    updateProgressChart(percent);
                }
            }, 500);
        }
    } else {
        if (progressInterval) {
            clearInterval(progressInterval);
            progressInterval = null;
        }
    }
}
