function loadCodeFile(language, fileName) {
    const apiUrl = `https://api.github.com/repos/henrique2020/URI/contents/${language}/${fileName}`;

    let codeContent = '';
	$.ajax({
		url: apiUrl,
		method: 'GET',
		dataType: 'json',
		success: function (data) {
			codeContent = atob(data.content); // O conteúdo está codificado em base64
            const utf8Decoder = new TextDecoder('utf-8');
            const decodedContent = utf8Decoder.decode(new Uint8Array([...codeContent].map(char => char.charCodeAt(0))));
            displayCode(language, decodedContent);
		},
		error: function () {
			alert('Erro ao carregar o código.');
		}
	});   
}

function displayCode(language, codeContent) {
	const codeElement = document.getElementById('code-content');
    codeElement.innerHTML = codeContent;
    codeElement.className = `language-${language} line-numbers`; // Adicionando as classes line-numbers e language-${language}

    Prism.highlightElement(codeElement);

    // Adicionando o botão de cópia apenas se o plugin copy-to-clipboard estiver carregado
    if (Prism.plugins['copy-to-clipboard']) {
        addCopyButton(codeElement);
    }
}


function addCopyButton(element) {
    const toolbar = document.querySelector('.code-toolbar .toolbar');

    const copyButton = document.createElement('button');
    copyButton.className = 'btn btn-secondary btn-sm copy-button';
    copyButton.textContent = 'Copiar';
    copyButton.addEventListener('click', () => {
        copyToClipboard(element.textContent);
        copyButton.textContent = 'Copiado!';
        setTimeout(() => {
            copyButton.textContent = 'Copiar';
        }, 2000);
    });

    toolbar.innerHTML = ''; // Limpar o conteúdo do toolbar
    toolbar.appendChild(copyButton);
}

function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text || document.getElementById('code-content').textContent;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
}