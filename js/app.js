// Importa e configura Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

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
