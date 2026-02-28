// app.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAxyovmqjNYIzOYYDZZnduquiJQeK4UIgc",
  authDomain: "agendei-d721e.firebaseapp.com",
  projectId: "agendei-d721e",
  storageBucket: "agendei-d721e.firebasestorage.app",
  messagingSenderId: "525023801595",
  appId: "1:525023801595:web:71a6d72e986e6e9e30005e",
  measurementId: "G-YQP41N6MJ3"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Persistência para manter o login ativo
setPersistence(auth, browserLocalPersistence)
  .then(() => console.log("Persistência configurada: usuário permanecerá logado"))
  .catch((error) => console.error("Erro na persistência:", error));

document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("login-btn");
  const logoutBtn = document.getElementById("logout-btn");
  const loginDiv = document.getElementById("login-div");
  const dashboardDiv = document.getElementById("dashboard-div");

  // Função de Login
  loginBtn?.addEventListener("click", () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("Usuário logado:", userCredential.user.uid);
        loginDiv.classList.add("hidden");
        dashboardDiv.classList.remove("hidden");
      })
      .catch((error) => {
        console.error("Erro ao logar:", error.message);
        alert("Erro: " + error.message);
      });
  });

  // Função de Logout
  logoutBtn?.addEventListener("click", () => {
    signOut(auth)
      .then(() => {
        console.log("Usuário deslogado");
        loginDiv.classList.remove("hidden");
        dashboardDiv.classList.add("hidden");
      })
      .catch((error) => console.error("Erro ao deslogar:", error));
  });

  // Detecta estado do usuário (mantém login ativo)
  onAuthStateChanged(auth, (user) => {
    if (user) {
      loginDiv.classList.add("hidden");
      dashboardDiv.classList.remove("hidden");
      console.log("Usuário logado:", user.uid);
    } else {
      loginDiv.classList.remove("hidden");
      dashboardDiv.classList.add("hidden");
      console.log("Nenhum usuário logado");
    }
  });
});
