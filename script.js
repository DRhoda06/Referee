// Watch App State
let timerActive = false;
let elapsedTime = 2730; // Start at 45:30 for demo
let timerInterval = null;
let eventCount = 0;

// Initialize the watch interface
document.addEventListener('DOMContentLoaded', function() {
    updateTimer();
    
    // Simulate some initial activity
    setTimeout(() => {
        showHapticFeedback();
    }, 1000);
});

// Timer Functions
function toggleTimer() {
    timerActive = !timerActive;
    const btn = document.getElementById('timerBtn');
    const text = document.getElementById('timerText');
    
    if (timerActive) {
        text.textContent = 'Stop';
        btn.classList.add('active');
        startTimer();
        showHapticFeedback();
    } else {
        text.textContent = 'Start';
        btn.classList.remove('active');
        stopTimer();
        showHapticFeedback();
    }
}

function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        elapsedTime += 1;
        updateTimer();
    }, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function updateTimer() {
    const minutes = Math.floor(elapsedTime / 60);
    const seconds = elapsedTime % 60;
    const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    const timeDisplay = document.getElementById('matchTime');
    if (timeDisplay) {
        timeDisplay.textContent = timeString;
    }
    
    // Update half based on time
    const half = elapsedTime < 2700 ? 1 : 2; // 45 minutes = 2700 seconds
    document.getElementById('currentHalf').textContent = half;
}

// Event Recording Functions
function recordEvent(eventType) {
    eventCount++;
    
    // Show haptic feedback
    showHapticFeedback();
    
    // Add visual feedback to button
    const button = document.querySelector(`.event-btn.${eventType}`);
    button.classList.add('pulse');
    setTimeout(() => {
        button.classList.remove('pulse');
    }, 300);
    
    // Log the event
    logEvent(eventType);
    
    // Simulate sending to iPhone via WatchConnectivity
    simulateWatchConnectivity(eventType);
}

function logEvent(eventType) {
    const logContent = document.getElementById('logContent');
    const noEvents = logContent.querySelector('.no-events');
    
    if (noEvents) {
        noEvents.remove();
    }
    
    const eventEntry = document.createElement('div');
    eventEntry.className = `event-entry ${eventType}`;
    
    const minutes = Math.floor(elapsedTime / 60);
    const seconds = elapsedTime % 60;
    const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    const eventNames = {
        goal: 'Goal',
        yellow: 'Yellow Card',
        red: 'Red Card',
        substitution: 'Substitution'
    };
    
    eventEntry.innerHTML = `
        <span class="event-type">${eventNames[eventType]}</span>
        <span class="event-time">${timeString}</span>
    `;
    
    logContent.insertBefore(eventEntry, logContent.firstChild);
    
    // Keep only last 5 events visible
    const entries = logContent.querySelectorAll('.event-entry');
    if (entries.length > 5) {
        entries[entries.length - 1].remove();
    }
}

function simulateWatchConnectivity(eventType) {
    // Simulate the WatchConnectivity framework sending data to iPhone
    console.log(`📱 Sending to iPhone via WatchConnectivity:`, {
        type: 'event',
        eventType: eventType,
        timestamp: elapsedTime,
        watchId: 'AppleWatch_Series9',
        sessionId: 'match_' + Date.now()
    });
    
    // Show a subtle indication that data was sent
    const watchScreen = document.querySelector('.watch-screen');
    watchScreen.style.boxShadow = 'inset 0 0 20px rgba(0, 122, 255, 0.3)';
    setTimeout(() => {
        watchScreen.style.boxShadow = 'inset 0 0 20px rgba(0,0,0,0.5)';
    }, 200);
}

function showHapticFeedback() {
    const feedback = document.getElementById('hapticFeedback');
    feedback.classList.add('active');
    
    // Simulate haptic feedback with a subtle vibration effect
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }
    
    setTimeout(() => {
        feedback.classList.remove('active');
    }, 300);
}

// Digital Crown Simulation
document.querySelector('.digital-crown').addEventListener('click', function() {
    // Simulate digital crown press - could scroll through different views
    showHapticFeedback();
    
    // Cycle through different time displays or views
    const currentHalf = parseInt(document.getElementById('currentHalf').textContent);
    const newHalf = currentHalf === 1 ? 2 : 1;
    document.getElementById('currentHalf').textContent = newHalf;
    
    console.log('🔄 Digital Crown pressed - switched to half', newHalf);
});

// Side Button Simulation
document.querySelector('.side-button').addEventListener('click', function() {
    // Simulate side button press - could return to watch face or show menu
    showHapticFeedback();
    
    // Flash the screen to simulate going to watch face
    const screen = document.querySelector('.watch-screen');
    screen.style.opacity = '0.3';
    setTimeout(() => {
        screen.style.opacity = '1';
    }, 150);
    
    console.log('⚡ Side button pressed - simulating return to watch face');
});

// Keyboard shortcuts for testing
document.addEventListener('keydown', function(e) {
    switch(e.key.toLowerCase()) {
        case 'g':
            recordEvent('goal');
            break;
        case 'y':
            recordEvent('yellow');
            break;
        case 'r':
            recordEvent('red');
            break;
        case 's':
            recordEvent('substitution');
            break;
        case ' ':
            e.preventDefault();
            toggleTimer();
            break;
    }
});

// Simulate realistic match progression
function simulateMatchProgression() {
    // Add some random events during the match
    const events = ['goal', 'yellow', 'substitution'];
    const randomEvent = events[Math.floor(Math.random() * events.length)];
    
    if (Math.random() < 0.1 && timerActive) { // 10% chance per interval
        recordEvent(randomEvent);
    }
}

// Run simulation every 10 seconds when timer is active
setInterval(() => {
    if (timerActive) {
        simulateMatchProgression();
    }
}, 10000);

// Add some demo events after page load
setTimeout(() => {
    if (!timerActive) {
        recordEvent('goal');
        setTimeout(() => recordEvent('yellow'), 2000);
    }
}, 3000);