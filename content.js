const HIGHLIGHT_COLOR = "#a2d2ff";
const TRANSPARENT = "transparent";

function highlightRandomWords() {
    const bodyText = document.body.innerText;
    const words = bodyText.split(/\s+/).filter(word => word.length > 4);

    if (words.length === 0) {
        console.log("No words found.");
        return;
    }

    const wordsToHighlight = 5;
    const randomWords = [];

    while (randomWords.length < wordsToHighlight && words.length > 0) {
        const randomIndex = Math.floor(Math.random() * words.length);
        if (randomWords.indexOf(words[randomIndex]) == -1) {
            randomWords.push(words[randomIndex]);
            // words.splice(randomIndex, 1);
        }
    }

    randomWords.forEach(word => {
        highlightWordInDocument(word);
    });

    console.log("Highlighted words:", randomWords);
    return randomWords;
}

function highlightWordInDocument(word) {
    const body = document.body;
    const regex = new RegExp(`\\b${word}\\b`, 'gi'); // Expresión regular para encontrar la palabra completa

    // Usamos TreeWalker para buscar nodos de texto
    const walker = document.createTreeWalker(body, NodeFilter.SHOW_TEXT, null, false);
    let node;

    while ((node = walker.nextNode())) {
        // Si el nodo contiene la palabra
        if (regex.test(node.nodeValue)) {
            const range = document.createRange();
            const matchIndex = node.nodeValue.search(regex);
            range.setStart(node, matchIndex);
            range.setEnd(node, matchIndex + word.length);

            const fragment = document.createDocumentFragment();
            const highlightedNode = document.createElement('mark');
            highlightedNode.style.backgroundColor = HIGHLIGHT_COLOR;
            highlightedNode.textContent = word;

            // Inserta el nodo resaltado sin eliminar el texto alrededor
            range.surroundContents(highlightedNode);
        }
    }
}

function unselectWords(randomWords) {
    randomWords.forEach(word => {
        const body = document.body;
        const walker = document.createTreeWalker(body, NodeFilter.SHOW_ELEMENT, null, false);
        const nodesToRemove = []; // Array para acumular nodos <mark> que coinciden con la palabra

        let node;
        while ((node = walker.nextNode())) {
            if (node.tagName === 'MARK' && node.textContent.toLowerCase() === word.toLowerCase()) {
                nodesToRemove.push(node); // Añadir el nodo <mark> al array
            }
        }

        // Reemplazar todos los nodos acumulados en nodesToRemove
        nodesToRemove.forEach(markNode => {
            const textNode = document.createTextNode(markNode.textContent);
            markNode.parentNode.replaceChild(textNode, markNode);
        });
    });
}



// Comunicación con el background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'highlightRandomWords') {
        const result = highlightRandomWords();
        sendResponse({ randomWords: result });
    } else if (message.action === 'unselectWords') {
        unselectWords(message.selectedWords);
    }
});
