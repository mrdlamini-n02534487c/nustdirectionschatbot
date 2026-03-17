// Chat functionality
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const chatMessages = document.getElementById('chatMessages');

// Conversation state
let conversationState = 'name'; // name -> position -> destination -> distance -> directions
let userName = '';
let userPosition = '';
let userDestination = '';
let userWantsDistance = '';

// Campus locations
const campusLocations = [
    'Main Gate',
    'Administration Block',
    'Library',
    'Lecture Theatre 1',
    'Lecture Theatre 2',
    'Lecture Theatre 3',
    'Engineering Faculty',
    'Science Faculty',
    'Commerce Faculty',
    'Student Centre',
    'Sports Complex',
    'Hostels',
    'Medical Centre',
    'Cafeteria',
    'Parking Area'
];

// Campus Graph - distances in meters between locations (fully connected)
const campusGraph = {
    'Main Gate': {
        'Administration Block': 50,
        'Parking Area': 30,
        'Library': 180,
        'Lecture Theatre 1': 200,
        'Student Centre': 200,
        'Medical Centre': 210,
        'Engineering Faculty': 350,
        'Science Faculty': 280,
        'Commerce Faculty': 220,
        'Cafeteria': 250,
        'Sports Complex': 400,
        'Hostels': 320,
        'Lecture Theatre 2': 230,
        'Lecture Theatre 3': 260
    },
    'Administration Block': {
        'Main Gate': 50,
        'Library': 150,
        'Lecture Theatre 1': 160,
        'Engineering Faculty': 250,
        'Student Centre': 180,
        'Parking Area': 70,
        'Medical Centre': 200,
        'Science Faculty': 220,
        'Commerce Faculty': 170,
        'Cafeteria': 200,
        'Sports Complex': 380,
        'Hostels': 300,
        'Lecture Theatre 2': 190,
        'Lecture Theatre 3': 210
    },
    'Library': {
        'Administration Block': 150,
        'Main Gate': 180,
        'Lecture Theatre 1': 50,
        'Science Faculty': 120,
        'Student Centre': 150,
        'Engineering Faculty': 200,
        'Medical Centre': 180,
        'Parking Area': 180,
        'Cafeteria': 150,
        'Commerce Faculty': 200,
        'Sports Complex': 320,
        'Hostels': 280,
        'Lecture Theatre 2': 80,
        'Lecture Theatre 3': 100
    },
    'Lecture Theatre 1': {
        'Library': 50,
        'Lecture Theatre 2': 40,
        'Lecture Theatre 3': 80,
        'Science Faculty': 100,
        'Student Centre': 130,
        'Engineering Faculty': 150,
        'Administration Block': 160,
        'Medical Centre': 160,
        'Cafeteria': 120,
        'Commerce Faculty': 140,
        'Main Gate': 200,
        'Parking Area': 200,
        'Sports Complex': 300,
        'Hostels': 260
    },
    'Lecture Theatre 2': {
        'Lecture Theatre 1': 40,
        'Lecture Theatre 3': 50,
        'Science Faculty': 80,
        'Engineering Faculty': 150,
        'Library': 80,
        'Student Centre': 120,
        'Medical Centre': 140,
        'Cafeteria': 100,
        'Commerce Faculty': 130,
        'Administration Block': 190,
        'Main Gate': 230,
        'Parking Area': 220,
        'Sports Complex': 280,
        'Hostels': 240
    },
    'Lecture Theatre 3': {
        'Lecture Theatre 1': 80,
        'Lecture Theatre 2': 50,
        'Science Faculty': 60,
        'Engineering Faculty': 120,
        'Library': 100,
        'Student Centre': 110,
        'Medical Centre': 120,
        'Cafeteria': 90,
        'Commerce Faculty': 100,
        'Administration Block': 210,
        'Main Gate': 260,
        'Parking Area': 250,
        'Sports Complex': 260,
        'Hostels': 220
    },
    'Engineering Faculty': {
        'Administration Block': 250,
        'Library': 200,
        'Lecture Theatre 2': 150,
        'Lecture Theatre 3': 120,
        'Science Faculty': 180,
        'Sports Complex': 300,
        'Parking Area': 280,
        'Student Centre': 280,
        'Lecture Theatre 1': 150,
        'Medical Centre': 300,
        'Main Gate': 350,
        'Cafeteria': 280,
        'Commerce Faculty': 260,
        'Hostels': 200
    },
    'Science Faculty': {
        'Library': 120,
        'Lecture Theatre 1': 100,
        'Lecture Theatre 2': 80,
        'Lecture Theatre 3': 60,
        'Engineering Faculty': 180,
        'Sports Complex': 200,
        'Student Centre': 220,
        'Administration Block': 220,
        'Medical Centre': 160,
        'Cafeteria': 200,
        'Commerce Faculty': 240,
        'Main Gate': 280,
        'Parking Area': 260,
        'Hostels': 280
    },
    'Commerce Faculty': {
        'Administration Block': 200,
        'Student Centre': 150,
        'Library': 250,
        'Parking Area': 180,
        'Lecture Theatre 1': 140,
        'Lecture Theatre 2': 130,
        'Lecture Theatre 3': 100,
        'Cafeteria': 120,
        'Medical Centre': 180,
        'Engineering Faculty': 260,
        'Science Faculty': 240,
        'Main Gate': 220,
        'Sports Complex': 300,
        'Hostels': 240
    },
    'Student Centre': {
        'Administration Block': 180,
        'Main Gate': 200,
        'Library': 150,
        'Lecture Theatre 1': 130,
        'Medical Centre': 100,
        'Cafeteria': 30,
        'Commerce Faculty': 150,
        'Parking Area': 200,
        'Lecture Theatre 2': 120,
        'Lecture Theatre 3': 110,
        'Engineering Faculty': 280,
        'Science Faculty': 220,
        'Sports Complex': 250,
        'Hostels': 260
    },
    'Sports Complex': {
        'Engineering Faculty': 300,
        'Science Faculty': 200,
        'Hostels': 250,
        'Parking Area': 350,
        'Main Gate': 400,
        'Student Centre': 250,
        'Library': 320,
        'Administration Block': 380,
        'Medical Centre': 300,
        'Cafeteria': 280,
        'Commerce Faculty': 300,
        'Lecture Theatre 1': 300,
        'Lecture Theatre 2': 280,
        'Lecture Theatre 3': 260
    },
    'Hostels': {
        'Sports Complex': 250,
        'Main Gate': 320,
        'Administration Block': 300,
        'Medical Centre': 200,
        'Parking Area': 280,
        'Engineering Faculty': 200,
        'Library': 280,
        'Lecture Theatre 2': 240,
        'Lecture Theatre 1': 260,
        'Lecture Theatre 3': 220,
        'Science Faculty': 280,
        'Student Centre': 260,
        'Cafeteria': 250,
        'Commerce Faculty': 240
    },
    'Medical Centre': {
        'Student Centre': 100,
        'Cafeteria': 80,
        'Administration Block': 210,
        'Main Gate': 210,
        'Hostels': 200,
        'Science Faculty': 160,
        'Library': 180,
        'Lecture Theatre 1': 160,
        'Lecture Theatre 2': 140,
        'Lecture Theatre 3': 120,
        'Engineering Faculty': 300,
        'Parking Area': 240,
        'Commerce Faculty': 180,
        'Sports Complex': 300
    },
    'Cafeteria': {
        'Student Centre': 30,
        'Medical Centre': 80,
        'Administration Block': 200,
        'Library': 150,
        'Lecture Theatre 1': 120,
        'Lecture Theatre 2': 100,
        'Lecture Theatre 3': 90,
        'Commerce Faculty': 120,
        'Main Gate': 250,
        'Parking Area': 220,
        'Engineering Faculty': 280,
        'Science Faculty': 200,
        'Sports Complex': 280,
        'Hostels': 250
    },
    'Parking Area': {
        'Main Gate': 30,
        'Administration Block': 70,
        'Hostels': 280,
        'Engineering Faculty': 280,
        'Sports Complex': 350,
        'Library': 180,
        'Lecture Theatre 1': 200,
        'Lecture Theatre 2': 220,
        'Lecture Theatre 3': 250,
        'Science Faculty': 260,
        'Student Centre': 200,
        'Medical Centre': 240,
        'Cafeteria': 220,
        'Commerce Faculty': 180
    }
};

// Dijkstra's Algorithm Implementation
class Dijkstra {
    constructor(graph) {
        this.graph = graph;
    }

    findShortestPath(start, end) {
        const distances = {};
        const previous = {};
        const unvisited = new Set(Object.keys(this.graph));

        // Initialize distances
        for (let node of unvisited) {
            distances[node] = Infinity;
            previous[node] = null;
        }
        distances[start] = 0;

        while (unvisited.size > 0) {
            let current = null;
            let minDistance = Infinity;

            // Find unvisited node with minimum distance
            for (let node of unvisited) {
                if (distances[node] < minDistance) {
                    minDistance = distances[node];
                    current = node;
                }
            }

            if (current === null || distances[end] === Infinity) {
                break;
            }

            unvisited.delete(current);

            // Update distances to neighbors
            if (this.graph[current]) {
                for (let neighbor in this.graph[current]) {
                    if (unvisited.has(neighbor)) {
                        const alt = distances[current] + this.graph[current][neighbor];
                        if (alt < distances[neighbor]) {
                            distances[neighbor] = alt;
                            previous[neighbor] = current;
                        }
                    }
                }
            }
        }

        // Reconstruct path
        const path = [];
        let current = end;
        while (current !== null) {
            path.unshift(current);
            current = previous[current];
        }

        return {
            distance: distances[end],
            path: path.length > 1 ? path : [start, end]
        };
    }
}

const pathfinder = new Dijkstra(campusGraph);

// Directions database
const directions = {
    'Main Gate': {
        'Administration Block': 'From the Main Gate, walk straight ahead for about 50 meters. The Administration Block is the large building on your right with the NUST flag.',
        'Library': 'From the Main Gate, walk straight ahead past the Administration Block, then turn left at the first junction. The Library is the 3-story building ahead.',
        'Lecture Theatre 1': 'From the Main Gate, walk straight ahead and turn left at the fountain. Lecture Theatre 1 is in the Academic Building on the ground floor.',
        'Engineering Faculty': 'From the Main Gate, walk straight past the Administration Block, then turn right at the roundabout. The Engineering Faculty is the modern building with lab equipment.',
        'Science Faculty': 'From the Main Gate, walk straight past the Administration Block, turn left at the fountain, then continue to the back of campus. The Science Faculty is the building with laboratory windows.',
        'Commerce Faculty': 'From the Main Gate, turn left immediately and walk along the pathway. The Commerce Faculty is the building with business-related signage.',
        'Student Centre': 'From the Main Gate, walk straight ahead and turn right at the fountain. The Student Centre is the building with student organization offices.',
        'Sports Complex': 'From the Main Gate, walk to the back of campus and turn left. The Sports Complex includes gym, tennis courts, and football field.',
        'Hostels': 'From the Main Gate, turn left and walk along the perimeter road for about 200 meters. The hostels are on the west side of campus.',
        'Medical Centre': 'From the Main Gate, walk straight ahead and turn right at the fountain. The Medical Centre is next to the Student Centre.',
        'Cafeteria': 'From the Main Gate, walk straight ahead and turn right at the fountain. The Cafeteria is located in the Student Centre building.',
        'Parking Area': 'Parking is available right near the Main Gate entrance area.'
    },
    'Administration Block': {
        'Main Gate': 'From the Administration Block, walk straight back towards the entrance. The Main Gate is about 50 meters ahead.',
        'Library': 'From the Administration Block, walk past the fountain and turn left. The Library is the 3-story building ahead.',
        'Lecture Theatre 1': 'From the Administration Block, walk towards the fountain and turn left. Lecture Theatre 1 is in the Academic Building.',
        'Engineering Faculty': 'From the Administration Block, continue straight and turn right at the roundabout. The Engineering Faculty is ahead.',
        'Science Faculty': 'From the Administration Block, walk past the fountain, turn left, then continue to the back. The Science Faculty is the building with labs.',
        'Commerce Faculty': 'From the Administration Block, turn right and walk along the pathway. The Commerce Faculty is on the east side.',
        'Student Centre': 'From the Administration Block, walk towards the fountain and turn right. The Student Centre is nearby.',
        'Sports Complex': 'From the Administration Block, walk to the back of campus and turn left. The Sports Complex is at the southern end.',
        'Hostels': 'From the Administration Block, turn left and walk along the perimeter road. Hostels are on the west side.',
        'Medical Centre': 'From the Administration Block, walk towards the fountain and turn right. The Medical Centre is next to the Student Centre.',
        'Cafeteria': 'From the Administration Block, walk towards the fountain and turn right. The Cafeteria is in the Student Centre.',
        'Parking Area': 'From the Administration Block, walk back towards the Main Gate. Parking is available near the entrance.'
    },
    'Library': {
        'Main Gate': 'From the Library, walk back towards the Administration Block, then continue straight to the Main Gate.',
        'Administration Block': 'From the Library, walk back towards the fountain. The Administration Block is on your right.',
        'Lecture Theatre 1': 'From the Library, walk towards the Academic Building entrance. Lecture Theatre 1 is on the ground floor.',
        'Engineering Faculty': 'From the Library, walk back to the main path, turn right at the roundabout. Engineering Faculty is ahead.',
        'Science Faculty': 'From the Library, continue to the back of campus. The Science Faculty is the next building.',
        'Commerce Faculty': 'From the Library, walk back to the main path, turn right, then left along the pathway. Commerce Faculty is on the east side.',
        'Student Centre': 'From the Library, walk back towards the fountain and turn right. The Student Centre is nearby.',
        'Sports Complex': 'From the Library, walk to the back of campus and turn left. The Sports Complex is further south.',
        'Hostels': 'From the Library, walk back to the main path, turn left, and follow the perimeter road. Hostels are on the west side.',
        'Medical Centre': 'From the Library, walk back towards the fountain and turn right. The Medical Centre is next to the Student Centre.',
        'Cafeteria': 'From the Library, walk back towards the fountain and turn right. The Cafeteria is in the Student Centre.',
        'Parking Area': 'From the Library, walk back towards the Administration Block and Main Gate. Parking is near the entrance.'
    }
};

// Function to add message to chat
function addMessage(text, isUser = false, isOptions = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;

    if (isOptions) {
        messageDiv.innerHTML = text;
    } else {
        const messageParagraph = document.createElement('p');
        messageParagraph.textContent = text;
        messageDiv.appendChild(messageParagraph);
    }

    chatMessages.appendChild(messageDiv);

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Function to show location selection buttons
function showLocationOptions(title, callback) {
    let optionsHtml = `<p>${title}</p><div class="location-options">`;

    campusLocations.forEach(location => {
        optionsHtml += `<button class="location-btn" onclick="selectLocation('${location}', '${callback}')">${location}</button>`;
    });

    optionsHtml += '</div>';
    addMessage(optionsHtml, false, true);
}

// Function to show yes/no options for distance
function showDistanceQuestion() {
    let optionsHtml = `<p>Would you like to know the shortest distance to be covered?</p><div class="location-options">`;
    optionsHtml += `<button class="location-btn" onclick="selectDistance('yes')">Yes</button>`;
    optionsHtml += `<button class="location-btn" onclick="selectDistance('no')">No</button>`;
    optionsHtml += '</div>';
    addMessage(optionsHtml, false, true);
}

// Function to handle distance selection
function selectDistance(choice) {
    const lastMessage = chatMessages.lastElementChild;
    if (lastMessage && lastMessage.innerHTML.includes('location-options')) {
        lastMessage.remove();
    }

    userWantsDistance = choice;
    addMessage(choice === 'yes' ? 'Yes' : 'No', true);

    setTimeout(() => {
        provideDirections();
    }, 500);
}

// Function to handle location selection
function selectLocation(location, callback) {
    // Remove the options message and add user's selection
    const lastMessage = chatMessages.lastElementChild;
    if (lastMessage && lastMessage.innerHTML.includes('location-options')) {
        lastMessage.remove();
    }

    addMessage(location, true);

    if (callback === 'position') {
        userPosition = location;
        conversationState = 'destination';
        setTimeout(() => {
            showLocationOptions(`Great, ${userName}! Now where would you like to go?`, 'destination');
        }, 500);
    } else if (callback === 'destination') {
        userDestination = location;
        conversationState = 'distance';
        setTimeout(() => {
            showDistanceQuestion();
        }, 500);
    }
}

// Function to provide directions
function provideDirections() {
    let directionText = '';
    let distanceInfo = '';

    if (directions[userPosition] && directions[userPosition][userDestination]) {
        directionText = directions[userPosition][userDestination];
    } else if (userPosition === userDestination) {
        directionText = `You're already at ${userDestination}! Is there somewhere else you'd like to go?`;
    } else {
        directionText = `From ${userPosition}, follow the main pathways towards ${userDestination}. Look for signage along the way.`;
    }

    // Calculate distance using Dijkstra's algorithm
    if (userWantsDistance === 'yes' && userPosition !== userDestination) {
        const result = pathfinder.findShortestPath(userPosition, userDestination);
        const distanceMeters = result.distance === Infinity ? 'N/A' : result.distance;
        const distanceKm = result.distance === Infinity ? 'N/A' : (result.distance / 1000).toFixed(2);
        
        distanceInfo = `\n\n📍 Distance: ${distanceMeters} meters (${distanceKm} km)\n📍 Route: ${result.path.join(' → ')}`;
    } else if (userWantsDistance === 'yes' && userPosition === userDestination) {
        distanceInfo = '\n\n📍 You are already at this location!';
    }

    addMessage(directionText + distanceInfo, false);

    // Reset conversation for next user
    setTimeout(() => {
        addMessage(`Need directions to another location, ${userName}? Just let me know where you are now!`, false);
        conversationState = 'position';
        userPosition = '';
        userDestination = '';
        userWantsDistance = '';
    }, 3000);
}

// Function to handle user input based on conversation state
function handleUserInput(message) {
    switch (conversationState) {
        case 'name':
            userName = message.trim();
            if (userName) {
                addMessage(`Nice to meet you, ${userName}!`, false);
                conversationState = 'position';
                setTimeout(() => {
                    showLocationOptions(`Where are you currently located on campus, ${userName}?`, 'position');
                }, 500);
            } else {
                addMessage('Please tell me your name so I can assist you better!', false);
            }
            break;

        case 'position':
        case 'destination':
            addMessage('Please use the buttons above to select your location.', false);
            break;

        case 'distance':
            addMessage('Please use the buttons above to answer the distance question.', false);
            break;

        case 'directions':
            // If user types something after getting directions, assume they want new directions
            conversationState = 'position';
            userPosition = '';
            userDestination = '';
            userWantsDistance = '';
            showLocationOptions(`Where are you currently located now, ${userName}?`, 'position');
            break;
    }
}

// Event listeners for send button
sendBtn.addEventListener('click', () => {
    const message = userInput.value.trim();
    if (message) {
        addMessage(message, true);
        userInput.value = '';
        handleUserInput(message);
    }
});

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const message = userInput.value.trim();
        if (message) {
            addMessage(message, true);
            userInput.value = '';
            handleUserInput(message);
        }
    }
});

// Initialize the conversation
setTimeout(() => {
    addMessage('Welcome to NUST Zimbabwe Campus Guide! What\'s your name?', false);
}, 500);
