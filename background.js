async function askChatGPT(query) {
    const observer = new MutationObserver(function (mutations, mutationInstance) {
        const someDiv = document.getElementsByTagName("h1")[0]
        if (someDiv) {
            document.getElementsByTagName("textarea")[0].textContent = query;
            submit = document.getElementsByClassName("absolute p-1 rounded-md text-gray-500 bottom-1.5 md:bottom-2.5 hover:bg-gray-100 enabled:dark:hover:text-gray-400 dark:hover:bg-gray-900 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent right-1 md:right-2 disabled:opacity-40")[0]
            submit.disabled = false
            submit.click()

            mutationInstance.disconnect();
        }
    });
    
    observer.observe(document, {
        childList: true,
        subtree:   true
    });
}
chrome.omnibox.onInputEntered.addListener(async function(text) {
    var url = 'https://chat.openai.com/';
    chrome.tabs.update({url: url}, function() {
        chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
            if (changeInfo.status === 'complete') {
                chrome.scripting
                .executeScript({
                target : {tabId : tabId},
                func : askChatGPT,
                args : [ text ],
                })
                .then(() => console.log("injected a function"));
              }
         });
    });
});