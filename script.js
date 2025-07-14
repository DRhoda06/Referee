// App State
let currentView = 'matchList';
let timerActive = false;
let watchTimerActive = false;
let elapsedTime = 0;
let timerInterval = null;
let currentEventType = null;

// Sample match data
const matches = [
    {
        id: 1,
        homeTeam: 'Team A',
        awayTeam: 'Team B',
        homeScore: 2,
        awayScore: 1,
        half: 1,
        isActive: true,
        events: [
            { id: 1, type: 'goal', team: 'Team A', player: 'Player #10', timestamp: 1425, notes: '' },
            { id: 2, type: 'yellowCard', team: 'Team B', player: 'Player #7', timestamp: 1880, notes: '' },
            { id: 3, type: 'goal', team: 'Team A', player: 'Player #9', timestamp: 4035, notes: '' },
            { id: 4, type: 'goal', team: 'Team B', player: 'Player #11', timestamp: 4950, notes: '' }
        ]
    },
    {
        id: 2,
        homeTeam: 'Liverpool',
        awayTeam: 'Arsenal',
        homeScore: 3,
        awayScore: 2,
        half: 2,
        isActive: false,
        events: []
    }
];

let currentMatch = matches[0];

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    showView('matchList');
    updateTimer();
});

// Navigation functions
function showView(viewName) {
    document.querySelectorAll('.view').forEach(view => {
        view.classList.add('hidden');
    });
    document.getElementById(viewName).classList.remove('hidden');
    currentView = viewName;
}

function startNewMatch() {
    const newMatch = {
        id: Date.now(),
        homeTeam: 'New Team A',
        awayTeam: 'New Team B',
        homeScore: 0,
        awayScore: 0,
        half: 1,
        isActive: true,
        events: []
    };
    matches.unshift(newMatch);
    updateMatchList();
    showToast('New match created!');
}

function openMatch(matchId) {
    currentMatch = matches.find(m => m.id === matchId) || matches[0];
    updateMatchDetail();
    showView('matchDetail');
}

function goBack() {
    showView('matchList');
}

// Timer functions
function toggleTimer() {
    timerActive = !timerActive;
    const btn = document.getElementById('timerBtn');
    
    if (timerActive) {
        btn.textContent = 'Stop';
        btn.className = 'btn btn-warning';
        startTimer();
    } else {
        btn.textContent = 'Start';
        btn.className = 'btn btn-success';
        stopTimer();
    }
}

function pauseTimer() {
    timerActive = false;
    stopTimer();
    document.getElementById('timerBtn').textContent = 'Start';
    document.getElementById('timerBtn').className = 'btn btn-success';
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
    
    const timeDisplay = document.getElementById('timeDisplay');
    if (timeDisplay) {
        timeDisplay.textContent = timeString;
    }
    
    // Update watch timer too
    const watchTime = document.querySelector('.watch-time');
    if (watchTime) {
        watchTime.textContent = timeString;
    }
}

// Watch functions
function toggleWatchTimer() {
    watchTimerActive = !watchTimerActive;
    const btn = document.getElementById('watchTimerText');
    
    if (watchTimerActive) {
        btn.textContent = 'Stop';
        // Sync with main timer
        toggleTimer();
    } else {
        btn.textContent = 'Start';
        pauseTimer();
    }
}

// Event functions
function addEvent(eventType) {
    currentEventType = eventType;
    document.getElementById('eventType').value = eventType;
    showModal();
}

function saveEvent() {
    const eventType = document.getElementById('eventType').value;
    const team = document.getElementById('eventTeam').value;
    const player = document.getElementById('eventPlayer').value;
    const notes = document.getElementById('eventNotes').value;
    
    const newEvent = {
        id: Date.now(),
        type: eventType,
        team: team,
        player: player || 'Unknown Player',
        timestamp: elapsedTime,
        notes: notes
    };
    
    currentMatch.events.push(newEvent);
    
    // Update score if it's a goal
    if (eventType === 'goal') {
        if (team === currentMatch.homeTeam) {
            currentMatch.homeScore++;
        } else {
            currentMatch.awayScore++;
        }
    }
    
    updateMatchDetail();
    closeModal();
    showToast(`${getEventDisplayName(eventType)} recorded!`);
    
    // Clear form
    document.getElementById('eventPlayer').value = '';
    document.getElementById('eventNotes').value = '';
}

function getEventDisplayName(eventType) {
    const names = {
        goal: 'Goal',
        yellowCard: 'Yellow Card',
        redCard: 'Red Card',
        substitution: 'Substitution'
    };
    return names[eventType] || eventType;
}

function getEventColor(eventType) {
    const colors = {
        goal: '#27ae60',
        yellowCard: '#f39c12',
        redCard: '#e74c3c',
        substitution: '#3498db'
    };
    return colors[eventType] || '#6c757d';
}

// Modal functions
function showModal() {
    document.getElementById('eventModal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('eventModal').classList.add('hidden');
}

// Toast function
function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    toastMessage.textContent = message;
    toast.classList.remove('hidden');
    
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

// Update functions
function updateMatchList() {
    const matchList = document.querySelector('.match-list');
    matchList.innerHTML = '';
    
    matches.forEach(match => {
        const matchItem = document.createElement('div');
        matchItem.className = 'match-item';
        matchItem.onclick = () => openMatch(match.id);
        
        matchItem.innerHTML = `
            <div class="match-teams">${match.homeTeam} vs ${match.awayTeam}</div>
            <div class="match-status ${match.isActive ? 'active' : 'completed'}">
                ${match.isActive ? 'Active' : 'Completed'}
            </div>
        `;
        
        matchList.appendChild(matchItem);
    });
}

function updateMatchDetail() {
    document.getElementById('matchTitle').textContent = `${currentMatch.homeTeam} vs ${currentMatch.awayTeam}`;
    document.getElementById('homeScore').textContent = currentMatch.homeScore;
    document.getElementById('awayScore').textContent = currentMatch.awayScore;
    document.getElementById('currentHalf').textContent = currentMatch.half;
    
    // Update team options in modal
    const teamSelect = document.getElementById('eventTeam');
    teamSelect.innerHTML = `
        <option value="${currentMatch.homeTeam}">${currentMatch.homeTeam}</option>
        <option value="${currentMatch.awayTeam}">${currentMatch.awayTeam}</option>
    `;
    
    // Update events list
    updateEventsList();
}

function updateEventsList() {
    const eventsList = document.getElementById('eventsList');
    eventsList.innerHTML = '';
    
    const sortedEvents = [...currentMatch.events].sort((a, b) => a.timestamp - b.timestamp);
    
    sortedEvents.forEach(event => {
        const eventItem = document.createElement('div');
        eventItem.className = `event-item ${event.type}`;
        
        const minutes = Math.floor(event.timestamp / 60);
        const seconds = event.timestamp % 60;
        const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        eventItem.innerHTML = `
            <span class="event-time">${timeString}</span>
            <span class="event-type">${getEventDisplayName(event.type)}</span>
            <span class="event-team">${event.team}</span>
            <span class="event-player">${event.player}</span>
        `;
        
        eventsList.appendChild(eventItem);
    });
}

// Report generation
function generateReport() {
    showToast('Match report generated! (PDF functionality simulated)');
    
    // Simulate PDF generation
    setTimeout(() => {
        const reportData = {
            match: currentMatch,
            timestamp: new Date().toISOString(),
            events: currentMatch.events.length,
            goals: currentMatch.events.filter(e => e.type === 'goal').length,
            cards: currentMatch.events.filter(e => e.type === 'yellowCard' || e.type === 'redCard').length
        };
        
        console.log('Match Report Generated:', reportData);
        showToast('Report ready for download!');
    }, 2000);
}

// Close modal when clicking outside
document.getElementById('eventModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (currentView === 'matchDetail') {
        switch(e.key) {
            case 'g':
                addEvent('goal');
                break;
            case 'y':
                addEvent('yellowCard');
                break;
            case 'r':
                addEvent('redCard');
                break;
            case 's':
                addEvent('substitution');
                break;
            case ' ':
                e.preventDefault();
                toggleTimer();
                break;
        }
    }
    
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Initialize with sample data
updateMatchList();
updateMatchDetail();