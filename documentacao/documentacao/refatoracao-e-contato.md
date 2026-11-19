# Refatoração e funcionamento do contato

## Refatoração

Organizei o projeto em três arquivos principais: `index.html`, `style.css` e `script.js`.

O HTML contém a estrutura da página, o CSS cuida da aparência e o JavaScript controla as interações. Essa separação facilita a leitura do código e a realização de alterações.

## Funcionamento do contato

O formulário utiliza o serviço FormSubmit para encaminhar as mensagens para meu e-mail.

O JavaScript verifica se os campos obrigatórios foram preenchidos e utiliza o `fetch` para enviar os dados sem precisar recarregar a página.

Também existe um campo escondido que define automaticamente o assunto do e-mail que vou receber, sem que o visitante precise preencher.

Durante o envio, o botão fica desativado para evitar que a mesma mensagem seja enviada várias vezes enquanto o sistema está processando o pedido.

Ao finalizar, o formulário apresenta uma mensagem informando o resultado do envio.
