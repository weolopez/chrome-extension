function DOMtoString(selector) {
  const element = selector ? document.querySelector(selector) : document.documentElement;
  if (!element) {
    throw new Error("ERROR: querySelector failed to find node");
  }
  const main = element.querySelector('main') || document.documentElement;
  return {
    head: document.head.innerHTML,
    body: main.innerHTML
  };
}
function getData(tab) {
  const PAGE_URL_STRING = window.location.href.replace(/[^a-zA-Z0-9]/g, '').slice(0, 63);
  const twiki = document.querySelector('twiki-panel');

  chrome.tabs.query({ active: true, currentWindow: true })
    .then(([activeTab]) => chrome.scripting.executeScript({
      target: { tabId: activeTab.id },
      func: DOMtoString,
      args: ['body']
    }))
    .then(([result]) => {
      const event = new CustomEvent('PAGE_CHANGE', { detail: result.result });
      twiki.dispatchEvent(event);
    })
    .catch(error => {
      selection.innerText = 'There was an error injecting script : \n' + error.message;
    });
}

if (chrome && chrome.storage) {
  // chrome.storage.session.get(["selectedText"]).then((result) => {
  //   chat.value = (!result.selectedText) ? "Summarize: " : result.selectedText;
  // });

  chrome.storage.onChanged.addListener((changes, namespace) => {
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
      console.log(
        `Storage key "${key}" in namespace "${namespace}" changed.`,
        `Old value was "${oldValue}", new value is "${newValue}".`
      );
      chat.value = (newValue === 'undefined') ? "Summarize: " : newValue;
    }
  });
  chrome.tabs.onActivated.addListener(function (activeInfo) {
    console.log("sidepanel script onActivated")
    document.chromePlugin = true
    getData(activeInfo)
  });
  chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    console.log("sidepanel script onUpdated")
    document.chromePlugin = true
    getData(tab)

  });
  getData()
}

if (chrome.runtime.onMessage)
chrome.runtime.onMessage.addListener(async function(message, sender, sendResponse) {
  if (message.action === 'INPUT_ENTERED') {
  // if (message.action === 'tabPressed') {
  alert('INPUT_ENTERED by sidepanel js:', message.value);
    console.log('Tab was pressed, recieved by extension:', message.value);
    let airesponse = await getRecommendation(message.value);
    // Handle the message
    sendResponse({ status: 'aiResponse', value: airesponse});
  }
});

// chrome.runtime.onMessage.sendMessage({ action: 'tabPressed', value: 'from sidepanel js' }, function(response) {
//   console.log('Response from extension:', response);
// })