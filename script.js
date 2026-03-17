// salvar serviço
function salvarServico(servico){
    localStorage.setItem("servico",servico)
    window.location.href="profissionais.html"
} 

// salvar Profissional
function salvarProfissional(profissional){
    localStorage.setItem("profissional",profissional)
    window.location.href="horarios.html"
}

// salvar horários
function salvarHorarios(horario){
localStorage.setItem("horario", horario)
window.location.href="confirmacao.html"
}

function carregarResumo() {
    const servico = localStorage.getItem("servico")
    const profissinal = localStorage.getItem("profissional") 
    const horario = localStorage.getItem("horario")

    document.getElementById("resumo").innerText = `Serviço: ${servico}
    Profissional: ${profissinal}
    Horário: ${horario}`
}

function enviarWhats() {
    const servico = localStorage.getItem("servico")
    const profissional = localStorage.getItem("profissional")
    const horario = localStorage.getItem("horario")

    const mensagem = `Olá, quero agendar:

    Serviço: ${servico}
    Profissional: ${profissional}
    Horário: ${horario}`

    localStorage.removeItem("servico")
    localStorage.removeItem("profissional")
    localStorage.removeItem("horario")

    window.location.href=`https://wa.me/5581999999999?text=${encodeURIComponent(mensagem)}`
}