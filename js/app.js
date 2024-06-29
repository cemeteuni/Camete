// Import and configure Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCSMyNSYZ-31NGHUxch4AmkwpNwCvw-ybg",
    authDomain: "camateapp.firebaseapp.com",
    projectId: "camateapp",
    storageBucket: "camateapp.appspot.com",
    messagingSenderId: "1:219286026906:web:498d85c4a7fb63e7c8fd23",
    appId: "G-YLMP8N75ZJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
    const messageDiv = document.createElement("div");
    messageDiv.id = "message";
    document.body.appendChild(messageDiv);

    if (loginForm) {
        loginForm.addEventListener("submit", handleLogin);
    }

    if (registerForm) {
        registerForm.addEventListener("submit", handleRegister);
    }

    // Ensure onAuthStateChanged is set up correctly
    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log("User is authenticated"); // Debugging log
            if (window.location.pathname === '/chat.html') {
                loadChats();
            } else {
                window.location.href = "chat.html";
            }
        } else {
            console.log("User is not authenticated"); // Debugging log
            if (window.location.pathname !== '/index.html') {
                window.location.href = "index.html";
            }
        }
    });
});

function handleLogin(e) {
    e.preventDefault();
    const email = e.target["login-email"].value;
    const password = e.target["login-password"].value;
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log("Login successful"); // Debugging log
            window.location.href = "chat.html";
        })
        .catch((error) => {
            console.error("Error in login:", error);
            displayMessage(`Login error: ${error.message}`, "error");
        });
}

function handleRegister(e) {
    e.preventDefault();
    const email = e.target["register-email"].value;
    const password = e.target["register-password"].value;
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log("Registration successful"); // Debugging log
            // Save user data to Firestore
            addDoc(collection(db, "users"), {
                email: email
            }).then(() => {
                console.log("User data saved to Firestore");
                window.location.href = "chat.html";
            }).catch((error) => {
                console.error("Error saving user data:", error);
                displayMessage(`Error saving user data: ${error.message}`, "error");
            });
        })
        .catch((error) => {
            console.error("Error in registration:", error);
            displayMessage(`Registration error: ${error.message}`, "error");
        });
}

function displayMessage(message, type) {
    const messageDiv = document.getElementById("message");
    messageDiv.textContent = message;
    messageDiv.className = type;
    setTimeout(() => {
        messageDiv.textContent = "";
        messageDiv.className = "";
    }, 5000);
}

// Function to load chats
function loadChats() {
    const messagesDiv = document.getElementById("messages");
    const q = query(collection(db, "messages"));
    
    onSnapshot(q, (snapshot) => {
        messagesDiv.innerHTML = "";
        snapshot.forEach((doc) => {
            const message = doc.data();
            const messageDiv = document.createElement("div");
            messageDiv.textContent = `${message.email}: ${message.text}`;
            messagesDiv.appendChild(messageDiv);
        });
    });
}

// Function to send a message
document.addEventListener("DOMContentLoaded", () => {
    const messageForm = document.getElementById("message-form");
    if (messageForm) {
        messageForm.addEventListener("submit", (e) => {
            e.preventDefault();
            console.log("Message form submitted"); // Debugging log
            const messageInput = document.getElementById("message-input");
            const text = messageInput.value;
            const user = auth.currentUser;

            addDoc(collection(db, "messages"), {
                email: user.email,
                text: text,
                timestamp: new Date()
            });

            messageInput.value = "";
        });
    }
});
