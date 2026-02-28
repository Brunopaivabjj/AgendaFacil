import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import {
  getAuth, setPersistence, browserLocalPersistence,
  signInWithEmailAndPassword, createUserWithEmailAndPassword,
  signOut, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";

import {
  getDatabase, ref, set, get, push, remove
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAxyovmqjNYIzOYYDZZnduquiJQeK4UIgc",
  authDomain: "agendei-d721e.firebaseapp.com",
  projectId: "agendei-d721e",
  storageBucket: "agendei-d721e.firebasestorage.app",
  messagingSenderId: "525023801595",
  appId: "1:525023801595:web:71a6d72e986e6e9e30005e",
  measurementId: "G-YQP41N6MJ3",
  databaseURL: "https://agendei-d721e-default-rtdb.firebaseio.com/"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
setPersistence(auth, browserLocalPersistence).catch(console.error);

document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("login-btn");
  const registerBtn = document.getElementById("register-btn");
  const logoutBtn = document.getElementById("logout-btn");
  const loginDiv = document.getElementById("login-div");
  const dashboardDiv = document.getElementById("dashboard-div");
  const saveStatus = document.getElementById("save-status");
  const appointmentsList = document.getElementById("appointments-list");
  const addAppointmentBtn = document.getElementById("add-appointment-btn");
  const dateInput = document.getElementById("appointment-date");
  const timeInput = document.getElementById("appointment-time");
  const serviceInput = document.getElementById("appointment-service");

  let currentUserUid = null;
  let editingKey = null;

  loginBtn?.addEventListener("click", () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    signInWithEmailAndPassword(auth, email, password)
      .then(cred => { currentUserUid = cred.user.uid; loginDiv.classList.add("hidden"); dashboardDiv.classList.remove("hidden"); loadAppointments(); })
      .catch(e => alert("Erro: " + e.message));
  });

  registerBtn?.addEventListener("click", () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    createUserWithEmailAndPassword(auth, email, password)
      .then(cred => { currentUserUid = cred.user.uid; loginDiv.classList.add("hidden"); dashboardDiv.classList.remove("hidden"); appointmentsList.innerHTML = ""; saveStatus.textContent = "Conta criada! Adicione seu primeiro agendamento."; })
      .catch(e => alert("Erro: " + e.message));
  });

  logoutBtn?.addEventListener("click", () => {
    signOut(auth).then(() => { loginDiv.classList.remove("hidden"); dashboardDiv.classList.add("hidden"); appointmentsList.innerHTML = ""; saveStatus.textContent = ""; currentUserUid = null; editingKey = null; });
  });

  onAuthStateChanged(auth, user => {
    if (user) { currentUserUid = user.uid; loginDiv.classList.add("hidden"); dashboardDiv.classList.remove("hidden"); loadAppointments(); } 
    else { loginDiv.classList.remove("hidden"); dashboardDiv.classList.add("hidden"); appointmentsList.innerHTML = ""; saveStatus.textContent = ""; currentUserUid = null; editingKey = null; }
  });

  addAppointmentBtn?.addEventListener("click", () => {
    if (!currentUserUid) return;
    const date = dateInput.value, time = timeInput.value, service = serviceInput.value.trim();
    if (!date || !time || !service) return alert("Preencha todos os campos");

    if (editingKey) {
      set(ref(database, `users/${currentUserUid}/appointments/${editingKey}`), { date, time, service })
        .then(() => { saveStatus.textContent = "Agendamento editado!"; resetForm(); loadAppointments(); })
        .catch(() => saveStatus.textContent = "Erro ao editar!");
    } else {
      const newRef = push(ref(database, `users/${currentUserUid}/appointments`));
      set(newRef, { date, time, service })
        .then(() => { saveStatus.textContent = "Agendamento salvo!"; resetForm(); loadAppointments(); })
        .catch(() => saveStatus.textContent = "Erro ao salvar!");
    }
  });

  function loadAppointments() {
    if (!currentUserUid) return;
    get(ref(database, `users/${currentUserUid}/appointments`)).then(snapshot => {
      appointmentsList.innerHTML = "";
      if (snapshot.exists()) {
        const data = snapshot.val();
        Object.keys(data).forEach(key => {
          const li = document.createElement("li");
          li.classList.add("appointment-card");
          li.innerHTML = `<span>${data[key].date} ${data[key].time} - ${data[key].service}</span>
            <button class="edit-btn" title="Editar"><i class="fas fa-edit"></i></button>
            <button class="delete-btn" title="Excluir"><i class="fas fa-trash-alt"></i></button>`;

          li.querySelector(".edit-btn").addEventListener("click", () => { dateInput.value = data[key].date; timeInput.value = data[key].time; serviceInput.value = data[key].service; editingKey = key; });
          li.querySelector(".delete-btn").addEventListener("click", () => { remove(ref(database, `users/${currentUserUid}/appointments/${key}`)).then(() => { saveStatus.textContent = "Agendamento excluído!"; loadAppointments(); }).catch(() => saveStatus.textContent = "Erro ao excluir!"); });

          appointmentsList.appendChild(li);
        });
      }
    }).catch(console.error);
  }

  function resetForm() { dateInput.value = ""; timeInput.value = ""; serviceInput.value = ""; editingKey = null; setTimeout(() => saveStatus.textContent = "", 2000); }
});
