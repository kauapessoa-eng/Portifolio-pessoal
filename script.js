
// FILTRO DOS PROJETOS
const botoes = document.querySelectorAll(".filtro");
const projetos = document.querySelectorAll(".card-projeto");
const quantidade = document.querySelector("#quantidade-projetos");
const semProjetos = document.querySelector("#sem-projetos");

botoes.forEach(botao => {
    botao.addEventListener("click", () => {
        let total = 0;

        botoes.forEach(item => {
            const ativo = item === botao;
            item.classList.toggle("ativo", ativo);
            item.setAttribute("aria-pressed", ativo);
        });

        projetos.forEach(projeto => {
            const mostrar = botao.dataset.filtro === "todos" ||
                projeto.dataset.tecnologia === botao.dataset.filtro;

            projeto.hidden = !mostrar;

            if (mostrar) total++;
        });

        quantidade.textContent = `${total} projeto${total !== 1 ? "s" : ""} encontrado${total !== 1 ? "s" : ""}.`;
        semProjetos.hidden = total > 0;
    });
});


// CAMPOS DO FORMULARIO
const formulario = document.querySelector("#form-contato");
const nome = document.querySelector("#nome");
const email = document.querySelector("#email");
const motivo = document.querySelector("#motivo");
const grupoAssunto = document.querySelector("#grupo-assunto");
const assunto = document.querySelector("#assunto");
const mensagem = document.querySelector("#mensagem");

const contador = document.querySelector("#contador-mensagem");
const resumo = document.querySelector("#resumo-erros");
const status = document.querySelector("#status-formulario");
const botaoEnviar = document.querySelector("#botao-enviar");

const campos = [nome, email, motivo, assunto, mensagem];

let enviando = false;
let tentouEnviar = false;


// CONTADOR DE CARACTERES
function tamanho(campo) {
    return campo.value.trim().length;
}

function atualizarContador() {
    contador.textContent = `${tamanho(mensagem)} / 1000 caracteres`;
}


// MOSTRAR E LIMPAR ERROS
function limparErro(campo) {
    document.querySelector(`#erro-${campo.id}`).textContent = "";
    campo.removeAttribute("aria-invalid");
}

function mostrarErro(campo, texto) {
    document.querySelector(`#erro-${campo.id}`).textContent = texto;
    campo.setAttribute("aria-invalid", "true");
}


// CAMPO ASSUNTO ADICIONAL
function atualizarAssunto() {
    const mostrar = motivo.value === "Outro";

    grupoAssunto.hidden = !mostrar;
    assunto.disabled = !mostrar;
    assunto.required = mostrar;

    if (!mostrar) {
        assunto.value = "";
        limparErro(assunto);
    }
}


// VALIDACAO DO FORMULARIO
function validarFormulario() {
    const erros = [];

    campos.forEach(limparErro);

    if (tamanho(nome) < 3 || tamanho(nome) > 80) {
        mostrarErro(nome, "O nome deve ter de 3 a 80 caracteres.");
        erros.push("Confira o campo Nome.");
    }

    if (!email.value.trim() || !email.validity.valid) {
        mostrarErro(email, "Digite um e-mail válido.");
        erros.push("Confira o campo E-mail.");
    }

    if (!motivo.value) {
        mostrarErro(motivo, "Selecione o motivo do contato.");
        erros.push("Selecione o motivo do contato.");
    }

    if (motivo.value === "Outro" &&
        (tamanho(assunto) < 5 || tamanho(assunto) > 100)) {
        mostrarErro(assunto, "O assunto deve ter de 5 a 100 caracteres.");
        erros.push("Confira o Assunto adicional.");
    }

    if (tamanho(mensagem) < 30 || tamanho(mensagem) > 1000) {
        mostrarErro(mensagem, "A mensagem deve ter de 30 a 1000 caracteres.");
        erros.push("Confira o campo Mensagem.");
    }

    resumo.hidden = erros.length === 0;
    resumo.textContent = erros.length
        ? "Não foi possível enviar. " + erros.join(" ")
        : "";

    if (erros.length > 0) {
        formulario.querySelector('[aria-invalid="true"]').focus();
        return false;
    }

    return true;
}


// PEGAR DADOS DO FORMULARIO
function lerDados() {
    const dados = {
        nome: nome.value.trim(),
        email: email.value.trim(),
        motivo: motivo.value,
        mensagem: mensagem.value.trim()
    };

    if (motivo.value === "Outro") {
        dados.assunto = assunto.value.trim();
    }

    return dados;
}


// LIMPAR FORMULARIO
function limparFormulario() {
    formulario.reset();
    campos.forEach(limparErro);
    atualizarAssunto();
    atualizarContador();
}


// ATUALIZAR CAMPOS AO DIGITAR
campos.forEach(campo => {
    campo.addEventListener("input", () => {
        status.textContent = "";

        if (tentouEnviar) validarFormulario();

        if (campo === mensagem) atualizarContador();
    });
});

motivo.addEventListener("change", () => {
    atualizarAssunto();

    if (tentouEnviar) validarFormulario();
});


// ENVIAR FORMULARIO
formulario.addEventListener("submit", async evento => {
    evento.preventDefault();

    if (enviando) return;

    tentouEnviar = true;

    if (!validarFormulario()) return;

    enviando = true;
    botaoEnviar.disabled = true;
    botaoEnviar.textContent = "Enviando...";
    status.textContent = "Mensagem em processamento.";

    try {
        const resposta = await fetch(formulario.action, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(lerDados())
        });

        if (!resposta.ok) throw new Error();

        const resultado = await resposta.json();

        if (resultado.success !== true &&
            resultado.success !== "true") {
            throw new Error();
        }

        status.textContent = "Mensagem enviada com sucesso! Obrigado pelo contato.";

        limparFormulario();
        tentouEnviar = false;

    } catch (erro) {
        status.textContent = "Não foi possível enviar agora. Seus dados foram mantidos. Verifique a conexão e tente novamente.";

    } finally {
        enviando = false;
        botaoEnviar.disabled = false;
        botaoEnviar.textContent = "Enviar mensagem";
    }
});


// INICIALIZACAO
atualizarAssunto();
atualizarContador();
