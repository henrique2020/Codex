function loadConversation(language) {
    let codeContent = '';

    switch (language) {
        case 'c':
            codeContent =
                `#include <stdio.h>

int main()
{
    int i;
    for(i = 1; i <= 50; i++){
        printf("%d\\n", i*2);
    }
}`;
            break;
        case 'php':
            codeContent =
                `<?php
    echo "Hello, World!";
?>`;
            break;
        case 'js':
            codeContent =
                `var phrase = 'LIFE IS NOT A PROBLEM TO BE SOLVED';
var input = require('fs').readFileSync('/dev/stdin', 'utf8');
var lines = input.split('\\n');
var len = parseInt(lines.shift());

console.log(phrase.substring(0, len));`;
            break;
        case 'python':
            codeContent =
                `while True:
    try: treinos = int(input())
    except: break

    media = 0
    dias = []
    for dia in range(1, treinos+1):
        tem, dis = map(int, input().split())
        med = dis/tem
        if(med > media):
            media = med
            dias.append(str(dia))

    print('\\n'.join(dias))`;
            break;
        case 'sql':
            codeContent =
                `SELECT t.name, 
    (mt1.matches + mt2.matches) AS matches, 
    (mt1.victories + mt2.victories) AS victories, 
    (mt1.defeats + mt2.defeats) AS defeats, 
    (mt1.draws + mt2.draws) AS draws,
    ((mt1.victories + mt2.victories)*3 + (mt1.draws + mt2.draws)) AS score
FROM teams t
JOIN (
    SELECT team_1 AS id, COUNT(1) AS matches,
        SUM(CASE WHEN team_1_goals > team_2_goals THEN 1 ELSE 0 END) AS victories,
        SUM(CASE WHEN team_1_goals < team_2_goals THEN 1 ELSE 0 END) AS defeats,
        SUM(CASE WHEN team_1_goals = team_2_goals THEN 1 ELSE 0 END) AS draws
    FROM matches
    GROUP BY team_1
) mt1 ON mt1.id = t.id
JOIN (
    SELECT team_2 AS id, COUNT(1) AS matches,
        SUM(CASE WHEN team_1_goals < team_2_goals THEN 1 ELSE 0 END) AS victories,
        SUM(CASE WHEN team_1_goals > team_2_goals THEN 1 ELSE 0 END) AS defeats,
        SUM(CASE WHEN team_1_goals = team_2_goals THEN 1 ELSE 0 END) AS draws
    FROM matches
    GROUP BY team_2
) mt2 ON mt2.id = t.id
ORDER BY score DESC`;
            break;
        default:
            codeContent = 'Seleciona uma conversa.';
    }

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