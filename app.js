import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  updateDoc 
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_AUTH_DOMAIN",
  projectId: "SEU_PROJECT_ID",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);


// =========================
// 🌙 DARK MODE
// =========================
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  document.body.classList.add("dark");
}

window.toggleDark = function() {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme",
    document.body.classList.contains("dark") ? "dark" : "light"
  );
};


// =========================
// 🚪 LOGOUT
// =========================
window.logout = async function() {
  await signOut(auth);
  location.reload();
};


// =========================
// 👩‍💼 FUNCIONÁRIOS
// =========================
window.addFuncionario = async function() {

  const nome = document.getElementById("funcNome").value;
  const whatsapp = document.getElementById("funcWhatsapp").value;

  if (!nome) return alert("Digite o nome");

  await addDoc(collection(db, "funcionarios"), {
    nome,
    whatsapp,
    ativo: true
  });

  document.getElementById("funcNome").value = "";
  document.getElementById("funcWhatsapp").value = "";

  loadFuncionarios();
};

window.deleteFuncionario = async function(id){
  await deleteDoc(doc(db, "funcionarios", id));
  loadFuncionarios();
};

window.editFuncionario = async function(id, nomeAtual, whatsappAtual){

  const novoNome = prompt("Editar nome:", nomeAtual);
  if (!novoNome) return;

  const novoWhatsapp = prompt("Editar WhatsApp:", whatsappAtual);

  await updateDoc(doc(db, "funcionarios", id), {
    nome: novoNome,
    whatsapp: novoWhatsapp
  });

  loadFuncionarios();
};

async function loadFuncionarios(){

  const container = document.getElementById("listaFuncionarios");
  container.innerHTML = "";

  const snapshot = await getDocs(collection(db, "funcionarios"));

  snapshot.forEach((docSnap)=>{

    const data = docSnap.data();

    container.innerHTML += `
      <div class="card">
        <strong>${data.nome}</strong><br>
        ${data.whatsapp || ""}
        <br><br>
        <button onclick="editFuncionario('${docSnap.id}','${data.nome}','${data.whatsapp || ""}')">Editar</button>
        <button onclick="deleteFuncionario('${docSnap.id}')">Excluir</button>
      </div>
    `;
  });
}


// =========================
// 💇 SERVIÇOS
// =========================
window.addServico = async function(){

  const nome = document.getElementById("servNome").value;
  const valor = parseFloat(document.getElementById("servValor").value);
  const duracao = parseInt(document.getElementById("servDuracao").value);

  if (!nome || !valor || !duracao)
    return alert("Preencha todos os campos");

  await addDoc(collection(db, "servicos"), {
    nome,
    valor,
    duracao,
    ativo: true
  });

  document.getElementById("servNome").value = "";
  document.getElementById("servValor").value = "";
  document.getElementById("servDuracao").value = "";

  loadServicos();
};

window.deleteServico = async function(id){
  await deleteDoc(doc(db, "servicos", id));
  loadServicos();
};

window.toggleServico = async function(id, statusAtual){
  await updateDoc(doc(db, "servicos", id), {
    ativo: !statusAtual
  });
  loadServicos();
};

window.editServico = async function(id, nomeAtual, valorAtual, duracaoAtual){

  const novoNome = prompt("Editar nome:", nomeAtual);
  if (!novoNome) return;

  const novoValor = prompt("Editar valor:", valorAtual);
  if (!novoValor) return;

  const novaDuracao = prompt("Editar duração:", duracaoAtual);
  if (!novaDuracao) return;

  await updateDoc(doc(db, "servicos", id), {
    nome: novoNome,
    valor: parseFloat(novoValor),
    duracao: parseInt(novaDuracao)
  });

  loadServicos();
};

async function loadServicos(){

  const container = document.getElementById("listaServicos");
  container.innerHTML = "";

  const snapshot = await getDocs(collection(db, "servicos"));

  snapshot.forEach((docSnap)=>{

    const data = docSnap.data();

    container.innerHTML += `
      <div class="card">
        <strong>${data.nome}</strong><br>
        R$ ${data.valor} • ${data.duracao} min<br>
        Status: ${data.ativo ? "Ativo" : "Inativo"}
        <br><br>
        <button onclick="toggleServico('${docSnap.id}',${data.ativo})">
          ${data.ativo ? "Desativar" : "Ativar"}
        </button>
        <button onclick="editServico('${docSnap.id}','${data.nome}',${data.valor},${data.duracao})">
          Editar
        </button>
        <button onclick="deleteServico('${docSnap.id}')">
          Excluir
        </button>
      </div>
    `;
  });
}


// =========================
// 🚀 AUTO LOAD
// =========================
loadFuncionarios();
loadServicos();
