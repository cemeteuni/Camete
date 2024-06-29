// Importa e configura Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Configura il tuo progetto Firebase
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
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
