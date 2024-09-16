
// Function to handle voice recording
let mediaRecorder;
let audioChunks = [];

function startRecording() {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.ondataavailable = event => audioChunks.push(event.data);
            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                const audioUrl = URL.createObjectURL(audioBlob);
                const audio = new Audio(audioUrl);
                audio.play();
                audioChunks = []; // Clear the chunks for the next recording
            };
            mediaRecorder.start();
        });
}

function stopRecording() {
    if (mediaRecorder) {
        mediaRecorder.stop();
    }
}

// Handle record button click
document.getElementById('record-btn').addEventListener('mousedown', startRecording);
document.getElementById('record-btn').addEventListener('mouseup', stopRecording);

// Function to store user data in localStorage
function storeUser(username, password) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    users.push({ username, password });
    localStorage.setItem('users', JSON.stringify(users));
}

// Function to validate user credentials
function validateUser(username, password) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    return users.some(user => user.username === username && user.password === password);
}

// Handle signup form submission
document.getElementById('signup-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;
    storeUser(username, password);
    alert('Sign up successful! Please log in.');
    document.getElementById('signup-form').reset();
});

// Handle login form submission
document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    if (validateUser(username, password)) {
        document.getElementById('landing-page').style.display = 'none';
        document.getElementById('main-page').style.display = 'flex';
        loadGroups(); // Load groups after login
    } else {
        alert('Invalid credentials. Please try again.');
        document.getElementById('login-username').value = '';
        document.getElementById('login-password').value = '';
    }
});

// Handle logout button click
document.getElementById('logout-btn').addEventListener('click', () => {
    document.getElementById('main-page').style.display = 'none';
    document.getElementById('landing-page').style.display = 'flex';
});

// Load groups from localStorage and display them
function loadGroups() {
    const groups = JSON.parse(localStorage.getItem('groups')) || [];
    const groupList = document.getElementById('group-list');
    groupList.innerHTML = ''; // Clear existing groups

    groups.forEach((group, index) => {
        const groupElement = document.createElement('li');
        groupElement.textContent = `${index + 1}. ${group.name} - ${group.members.length} members - Created on ${group.creationDate}`;
        groupElement.dataset.group = group.name;
        groupElement.addEventListener('click', () => openChat(group.name));
        groupList.appendChild(groupElement);
    });
}

// Function to open the chat section
function openChat(groupName) {
    document.getElementById('hot-destinations').style.display = 'none';
    document.getElementById('chat-section').style.display = 'block';
    document.getElementById('chat-group-name').textContent = `Chat - ${groupName}`;
}

// Back button to return to the groups list
document.getElementById('back-btn').addEventListener('click', () => {
    document.getElementById('chat-section').style.display = 'none';
    document.getElementById('hot-destinations').style.display = 'block';
});

// Send message in chat
document.getElementById('send-btn').addEventListener('click', () => {
    const message = document.getElementById('message-input').value;
    if (message.trim() !== '') {
        const chatMessages = document.getElementById('chat-messages');
        const messageElement = document.createElement('div');
        messageElement.textContent = message;
        chatMessages.appendChild(messageElement);
        document.getElementById('message-input').value = '';
    }
});

// Create a new group
document.getElementById('create-group-btn').addEventListener('click', () => {
    const groupName = prompt('Enter group name:');
    if (groupName) {
        let groups = JSON.parse(localStorage.getItem('groups')) || [];
        
        // Check if the group name already exists
        const existingGroup = groups.find(group => group.name === groupName);
        if (existingGroup) {
            // Find the next available name variant
            const newGroupName = `${groupName}${groups.filter(group => group.name.startsWith(groupName)).length + 1}`;
            groups.push({ name: newGroupName, members: [getCurrentUsername()], creationDate: new Date().toLocaleDateString(), admins: [getCurrentUsername()] });
        } else {
            groups.push({ name: groupName, members: [getCurrentUsername()], creationDate: new Date().toLocaleDateString(), admins: [getCurrentUsername()] });
        }
        
        // Store updated groups and reload the list
        localStorage.setItem('groups', JSON.stringify(groups));
        loadGroups(); // Refresh group list
    }
});

// Dummy function to get current username
function getCurrentUsername() {
    // Replace with actual logic to get the current logged-in user
    return 'exampleUser'; // Placeholder username
}

// Additional Options for the navigation bar
document.getElementById('profile-btn').addEventListener('click', () => {
    alert('Profile page functionality is not implemented yet.');
});

document.getElementById('settings-btn').addEventListener('click', () => {
    alert('Settings page functionality is not implemented yet.');
});
