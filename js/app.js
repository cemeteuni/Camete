// Import and configure Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, query, where, onSnapshot, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCSMyNSYZ-31NGHUxch4AmkwpNwCvw-ybg",
    authDomain: "camateapp.firebaseapp.com",
    projectId: "camateapp",
    storageBucket: "camateapp.appspot.com",
    messagingSenderId: "1:219286026906:web:498d85c4a7fb63e7c8fd23",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Check if elements exist before adding event listeners
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");

    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            console.log("Login form submitted"); // Debugging log
            const email = loginForm["login-email"].value;
            const password = loginForm["login-password"].value;

            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    console.log("Login successful"); // Debugging log
                    window.location.href = "chat.html";
                })
                .catch((error) => {
                    console.error("Error in login:", error);
                });
        });
    }

    if (registerForm) {
        registerForm.addEventListener("submit", (e) => {
            e.preventDefault();
            console.log("Register form submitted"); // Debugging log
            const email = registerForm["register-email"].value;
            const password = registerForm["register-password"].value;

            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    console.log("Registration successful"); // Debugging log
                    window.location.href = "chat.html";
                })
                .catch((error) => {
                    console.error("Error in registration:", error);
                });
        });
    }

    // Ensure onAuthStateChanged is set up correctly
    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log("User is authenticated"); // Debugging log
            if (window.location.pathname === '/chat.html') {
                loadChats();
            }
        } else {
            console.log("User is not authenticated"); // Debugging log
            if (window.location.pathname !== '/index.html') {
                window.location.href = "index.html";
            }
        }
    });
});

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

// Function to add a friend
const searchFriendForm = document.getElementById("search-friend-form");
if (searchFriendForm) {
    searchFriendForm.addEventListener("submit", (e) => {
        e.preventDefault();
        console.log("Search friend form submitted"); // Debugging log
        const friendEmail = document.getElementById("friend-email").value;
        const user = auth.currentUser;

        const q = query(collection(db, "users"), where("email", "==", friendEmail));
        
        getDocs(q).then((querySnapshot) => {
            if (!querySnapshot.empty) {
                const friendDoc = querySnapshot.docs[0];
                const friendId = friendDoc.id;

                setDoc(doc(db, "users", user.uid, "friends", friendId), {
                    email: friendEmail
                });

                loadFriends();
            } else {
                console.error("Friend not found");
            }
        }).catch((error) => {
            console.error("Error searching for friend:", error);
        });
    });
}

// Function to load friends
function loadFriends() {
    const user = auth.currentUser;
    const friendsList = document.getElementById("friends");
    const friendsCol = collection(db, "users", user.uid, "friends");
    
    onSnapshot(friendsCol, (snapshot) => {
        friendsList.innerHTML = "";
        snapshot.forEach((doc) => {
            const friend = doc.data();
            const friendLi = document.createElement("li");
            friendLi.textContent = friend.email;
            friendsList.appendChild(friendLi);
        });
    });
}
