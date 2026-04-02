// 🔥 IMPORTS FIREBASE
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js"
import { getFirestore, addDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js"


// 🔥 CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyAL4jHz4Hj60DcDshABLdLZNBcM0G_TfUI",
  authDomain: "kairos---site.firebaseapp.com",
  projectId: "kairos---site",
  storageBucket: "kairos---site.appspot.com",
  messagingSenderId: "224167735459",
  appId: "1:224167735459:web:7a570ef0f6d71f96c6cf16"
}

// 🔥 INIT
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// ============================
// FLUXO DO APP
// ============================

window.salvarServico = function(servico){
  localStorage.setItem("servico", servico)
  window.location.href = "profissionais.html"
}

window.salvarProfissional = function(profissional){
  localStorage.setItem("profissional", profissional)
  window.location.href = "horarios.html"
}

window.salvarHorarios = function(horario){
  localStorage.setItem("horario", horario)
  window.location.href = "confirmacao.html"
}

window.carregarResumo = function(){
  const servico = localStorage.getItem("servico")
  const profissional = localStorage.getItem("profissional")
  const horario = localStorage.getItem("horario")

  document.getElementById("resumo").innerText =
`Serviço: ${servico}
Profissional: ${profissional}
Horário: ${horario}`
}

// ============================
// CLIENTE
// ============================

window.salvarCliente = function(){
  const nome = document.getElementById("nome").value.trim()
  const idade = document.getElementById("idade").value.trim()

  if (!nome || !idade){
    const erro = document.getElementById("erro")
    erro.innerText = "Preenche tudo aí 👊"
    erro.style.display = "block"

    setTimeout(() => {
      erro.style.display = "none"
    }, 2000)

    return
  }

  localStorage.setItem("nome", nome)
  localStorage.setItem("idade", idade)

  window.location.href = "servicos.html"
}

// ============================
// FIREBASE + HOÁRIOS + WHATS
// ============================

const datasContainer = document.getElementById("datasContainer")
let dataSelecionada = null

function gerarDatas() {
  const hoje = new Date()

  for (let i = 0; i < 7; i++) { // próximos 7 dias
    const data = new Date()
    data.setDate(hoje.getDate() + i)

    const dataFormatada = data.toISOString().split("T")[0]
    const dataBonita = data.toLocaleDateString("pt-BR")

    datasContainer.innerHTML += `
      <div class="card" onclick="selecionarData('${dataFormatada}')">
        <h3>${dataBonita}</h3>
      </div>
    `
  }
}

window.selecionarData = function(data) {
  dataSelecionada = data
  carregarHorarios()
}
  const inputData = document.getElementById("data")

  if (inputData) {
const hoje = new Date().toISOString().split("T")[0]
document.getElementById("data").min = hoje
  }

async function carregarHorarios() {
  const container = document.getElementById("horariosContainer")
  container.innerHTML = ""

  const horarios = ["08:00", "09:00", "10:00", "14:00", "15:00"]

  const querySnapshot = await getDocs(collection(db, "agendamentos"))

  const ocupados = []

  querySnapshot.forEach(doc => {
    const ag = doc.data()

    if (ag.data === dataSelecionada) {
      ocupados.push(ag.hora)
    }
  })

  horarios.forEach(hora => {
    const ocupado = ocupados.includes(hora)

    container.innerHTML += `
      <div class="card ${ocupado ? "ocupado" : ""}"
        ${ocupado ? "" : `onclick="salvarHorario('${dataSelecionada}', '${hora}')"`}>
        <h2>${hora}</h2>
        <p>${ocupado ? "Indisponível ❌" : "Disponível ✅"}</p>
      </div>
    `
  })
}

window.addEventListener("DOMContentLoaded", () => {
        gerarDatas()
})


window.salvarHorario = function(data, hora) {
    localStorage.setItem("data", data)
    localStorage.setItem("hora", hora)

    window.location.href = "confirmacao.html"
}

async function salvarAgendamento(){
  const nome = localStorage.getItem("nome")
  const servico = localStorage.getItem("servico")
  const profissional = localStorage.getItem("profissional")
  const data = localStorage.getItem("data")
  const hora = localStorage.getItem("hora")

  await addDoc(collection(db, "agendamentos"), {
    nome,
    servico,
    profissional,
    data,
    hora,
    criadoEm: new Date()
  })
}

window.carregarResumo = function () {
  const servico = localStorage.getItem("servico")
  const profissional = localStorage.getItem("profissional")
  const data = localStorage.getItem("data")
  const hora = localStorage.getItem("hora")

  document.getElementById("resumo").innerText = `
Serviço: ${servico}
Profissional: ${profissional}
Data: ${data}
Hora: ${hora}
  `
}

window.enviarWhats = async function(){
  const nome = localStorage.getItem("nome")
  const servico = localStorage.getItem("servico")
  const profissional = localStorage.getItem("profissional")
  const hora = localStorage.getItem("hora")
  const data = localStorage.getItem("data")

  const mensagem = `Olá, quero agendar:

Nome: ${nome}
Serviço: ${servico}
Profissional: ${profissional}
Data: ${data}
Horário: ${hora}`

  await salvarAgendamento()

  window.location.href =
    `https://wa.me/5581991999836?text=${encodeURIComponent(mensagem)}`
    window.open(URL,"_blank")
}

// ============================
// PAINEL BARBEIRO
// ============================
window.carregarPainel = async function () {

  const lista = document.getElementById("lista")
  lista.innerHTML = ""

  const snapshot = await getDocs(collection(db, "agendamentos"))

  let agendamentos = []

  snapshot.forEach((doc) => {
    agendamentos.push(doc.data())
  })

  // ordenar por data + hora
  agendamentos.sort((a, b) => {
    return new Date(a.data + " " + a.hora) - new Date(b.data + " " + b.hora)
  })

  let dataAtual = ""

  agendamentos.forEach((item) => {

    // quando muda o dia
    if (item.data !== dataAtual) {
      dataAtual = item.data

      lista.innerHTML += `
        <h2 style="margin-top:20px;">📅 ${dataAtual}</h2>
      `
    }

    lista.innerHTML += `
      <div class="card">
        <p class="nome">${item.nome}</p>
        <p>Serviço: ${item.servico}</p>
        <p>Profissional: ${item.profissional}</p>
        <p>Hora: ${item.hora || item.horario || "Sem Agendamento"}</p>
      </div>
    `
  })
}