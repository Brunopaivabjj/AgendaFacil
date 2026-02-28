// 🔥 Firebase já configurado
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAxyovmqjNYIzOYYDZZnduquiJQeK4UIgc",
  authDomain: "agendei-d721e.firebaseapp.com",
  projectId: "agendei-d721e",
  storageBucket: "agendei-d721e.firebasestorage.app",
  messagingSenderId: "525023801595",
  appId: "1:525023801595:web:71a6d72e986e6e9e30005e",
  measurementId: "G-YQP41N6MJ3"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// 🌙 Dark Mode persistente
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  document.body.classList.add("dark");
}

window.toggleDark = function() {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
};

// 🚪 Logout
window.logout = async function() {
  await signOut(auth);
  location.reload();
};

// 👩‍💼 Adicionar Funcionário
window.addFuncionario = async function() {
  const nome = document.getElementById("funcNome").value;
  const whatsapp = document.getElementById("funcWhatsapp").value;

  if (!nome) return alert("Digite o nome");

  await addDoc(collection(db, "funcionarios"), {
    nome,
    whatsapp,
    ativo: true
  });

  alert("Funcionário salvo");
  loadFuncionarios();
};

// 🗑️ Excluir Funcionário
window.deleteFuncionario = async function(id) {
  await deleteDoc(doc(db, "funcionarios", id));
  loadFuncionarios();
};

// 🔄 Carregar Funcionários
async function loadFuncionarios() {
  const container = document.getElementById("listaFuncionarios");
  container.innerHTML = "";

  const querySnapshot = await getDocs(collection(db, "funcionarios"));
  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    container.innerHTML += `
      <div class="card">
        <strong>${data.nome}</strong><br>
        ${data.whatsapp || ""}
        <br><br>
        <button onclick="deleteFuncionario('${docSnap.id}')">Excluir</button>
      </div>
    `;
  });
}

window.loadFuncionarios = loadFuncionarios;
