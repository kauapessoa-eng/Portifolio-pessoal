// Filtro dos projetos
const botoesFiltro = document.querySelectorAll(".filtro");
const projetos = document.querySelectorAll(".card-projeto");
const quantidade = document.querySelector("#quantidade-projetos");
const semProjetos = document.querySelector("#sem-projetos");

botoesFiltro.forEach(botao => {
    botao.addEventListener("click", () => {
        let encontrados = 0;

        botoesFiltro.forEach(item => {
            const ativo = item === botao;
            item.classList.toggle("ativo", ativo);
            item.setAttribute("aria-pressed", ativo);
        });

        projetos.forEach(projeto => {
            const mostrar = botao.dataset.filtro === "todos" ||
                projeto.dataset.tecnologia === botao.dataset.filtro;
            projeto.hidden = !mostrar;
            if (mostrar) encontrados++;
        });

        quantidade.textContent = `${encontrados} projeto${encontrados === 1 ? "" : "s"} encontrado${encontrados === 1 ? "" : "s"}.`;
        semProjetos.hidden = encontrados > 0;
    });
});

// Campos do formulário
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

function tamanho(valor) {
    return valor.trim().length;
}

function atualizarContador() {
    contador.textContent = `${tamanho(mensagem.value)} / 1000 caracteres`;
}

function limparErro(campo) {
    document.querySelector(`#erro-${campo.id}`).textContent = "";
    campo.removeAttribute("aria-invalid");
}

function mostrarErro(campo, texto) {
    document.querySelector(`#erro-${campo.id}`).textContent = texto;
    campo.setAttribute("aria-invalid", "true");
}

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

function validarFormulario() {
    const erros = [];
    campos.forEach(limparErro);

    if (tamanho(nome.value) < 3 || tamanho(nome.value) > 80) {
        mostrarErro(nome, "O nome deve ter de 3 a 80 caracteres.");
        erros.push("Confira o campo Nome.");
    }

    if (!email.value.trim() || !email.validity.valid) {
        mostrarErro(email, "Digite um e-mail em formato válido.");
        erros.push("Confira o campo E-mail.");
    }

    if (!motivo.value) {
        mostrarErro(motivo, "Selecione o motivo do contato.");
        erros.push("Selecione o Motivo do contato.");
    }

    if (motivo.value === "Outro" && (tamanho(assunto.value) < 5 || tamanho(assunto.value) > 100)) {
        mostrarErro(assunto, "O assunto deve ter de 5 a 100 caracteres.");
        erros.push("Confira o Assunto adicional.");
    }

    if (tamanho(mensagem.value) < 30 || tamanho(mensagem.value) > 1000) {
        mostrarErro(mensagem, "A mensagem deve ter de 30 a 1000 caracteres.");
        erros.push("Confira o campo Mensagem.");
    }

    resumo.hidden = erros.length === 0;
    resumo.textContent = erros.length ? "Não foi possível enviar. " + erros.join(" ") : "";

    if (erros.length) {
        formulario.querySelector('[aria-invalid="true"]').focus();
        return false;
    }
    return true;
}

function lerDados() {
    const dados = {
        nome: nome.value.trim(),
        email: email.value.trim(),
        motivo: motivo.value,
        mensagem: mensagem.value.trim()
    };

    if (motivo.value === "Outro") dados.assunto = assunto.value.trim();
    return dados;
}

function limparFormulario() {
    formulario.reset();
    campos.forEach(limparErro);
    atualizarAssunto();
    atualizarContador();
}

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

        if (!resposta.ok) throw new Error("Falha no envio.");
        const resultado = await resposta.json();
        if (resultado.success !== true && resultado.success !== "true") {
            throw new Error("O serviço não confirmou o envio.");
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

atualizarAssunto();
atualizarContador();
