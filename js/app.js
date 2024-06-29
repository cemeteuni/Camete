// Importa e configura Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, query, where, onSnapshot, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Configura il tuo progetto Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBzhnYaRS9oGY-FzrAMBrVjOj9NKTqVAq0",
    authDomain: "catmete-bfe80.firebaseapp.com",
    projectId: "catmete-bfe80",
    storageBucket: "catmete-bfe80.appspot.com",
    messagingSenderId: "150648245166",
    appId: "1:150648245166:web:c12f6324794934ec16563f"
};

// Inizializza Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Gestione del login
const loginForm = document.getElementById("login-form");
loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = loginForm["login-email"].value;
    const password = loginForm["login-password"].value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Login avvenuto con successo
            window.location.href = "chat.html";
        })
        .catch((error) => {
            console.error("Errore nel login:", error);
        });
});

// Gestione della registrazione
const registerForm = document.getElementById("register-form");
registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = registerForm["register-email"].value;
    const password = registerForm["register-password"].value;

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Registrazione avvenuta con successo
            window.location.href = "chat.html";
        })
        .catch((error) => {
            console.error("Errore nella registrazione:", error);
        });
});

// Gestione dell'autenticazione persistente
onAuthStateChanged(auth, (user) => {
    if (user) {
        // Utente autenticato, carica le chat
        if (window.location.pathname === '/chat.html') {
            loadChats();
        }
    } else {
        // Utente non autenticato, reindirizza al login
        window.location.href = "index.html";
    }
});

// Funzione per caricare le chat
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

// Funzione per inviare un messaggio
const messageForm = document.getElementById("message-form");
messageForm.addEventListener("submit", (e) => {
    e.preventDefault();
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

// Funzione per aggiungere un amico
const searchFriendForm = document.getElementById("search-friend-form");
searchFriendForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const friendEmail = document.getElementById("friend-email").value;
    const user = auth.currentUser;

    // Cerca l'email dell'amico nel database
    const q = query(collection(db, "users"), where("email", "==", friendEmail));
    
    getDocs(q).then((querySnapshot) => {
        if (!querySnapshot.empty) {
            // Aggiungi l'amico alla lista degli amici dell'utente
            const friendDoc = querySnapshot.docs[0];
            const friendId = friendDoc.id;

            setDoc(doc(db, "users", user.uid, "friends", friendId), {
                email: friendEmail
            });

            // Aggiorna la lista degli amici
            loadFriends();
        } else {
            console.error("Amico non trovato");
        }
    }).catch((error) => {
        console.error("Errore nella ricerca dell'amico:", error);
    });
});

// Funzione per caricare la lista degli amici
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
