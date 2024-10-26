const toggle =  document.querySelector("input");
const onMessage = document.querySelector("h1");

var highlightedWords = [];

toggle.addEventListener("click", () => {
    if(!toggle.checked){
        onMessage.textContent = "Paused";
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { action: 'unselectWords', selectedWords: highlightedWords });
        });
    }
    else{
        onMessage.textContent = "On";
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { action: 'highlightRandomWords' }, (response) => {
                highlightedWords = response.randomWords
            })
        });
    } 

})