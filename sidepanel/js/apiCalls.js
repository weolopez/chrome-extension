



var otherMessage;
async function sendMessage(image) {
    // chatMessages.scrollTop = chatMessages.scrollHeight;

    if ( horizontalScrollPanels.getCurrentId() === 'group-list' ) {
        await newChat()
    }
    
    let userInput = (chatInput.value.trim() === 'undefined' || chatInput.value.trim === '') ? "Summarize: " : chatInput.value.trim();

    if (userInput || image) {
        const userMessage = userInput
        chatBubble.appendMessage(true, userInput, image)
        otherMessage = chatBubble.appendMessage(false, 'Thinking...');

        // Clear the input field
        chatInput.value = '';
        //if the first character in userInput is a '!' then eval it
        if (userInput.charAt(0) === '!') {
            let result = eval(userInput.substring(1));
            otherMessage.textContent = result;
            return;
        }

        // if (settings.useContext && imageURL.length == 0) {
        //     userInput += selectedText.innerHTML
        // }

        var rawContent = ''
        otherMessage.textContent = ''
        if (settings.model === "openai") {
            let imageUrl
            rawContent = await openai(userInput, imageUrl)
// .then(response => console.log(response))
// .catch(error => console.error(error));
        } else if (image) {
            rawContent = await llava(userInput, image, "CHAT")
        } else if (settings.model === "wiki")  {
            rawContent = await wiki(userInput)
        } else if (settings.model === "llama3")  {
            rawContent = await lamma3(userInput)
        } else if (settings.model === "askatt") {
            rawContent = await askatt(userInput, imageURL)
        } else if (settings.model === "history") {
            rawContent = await askHistory(userInput)
        } else if (settings.model === "rag") {
            rawContent = await askHistory(userInput)    
        } else if (settings.model === 'context') {
            rawContent = await addText(selectedText.innerHTML, PAGE_URL_STRING).then(async (result) => {
                rawContent = await askHistory(userInput, PAGE_URL_STRING)
                return rawContent
            })
        }
        if (rawContent === undefined) rawContent = otherMessage.textContent
        // otherMessage.textContent = ''
        rawContent = rawContent.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
        rawContent = rawContent.replace(/```(?:\w+\s)?(.*?)```/gs, '<div class="code-block">$1</div>');
        // if rawContent contains a URL convert it to an anchor tag
        rawContent = rawContent.replace(/(https?:\/\/[^\s,]+)/g, '<a href="$1" target="_blank">$1</a>');
        rawContent = rawContent.replace(/\n/g, '<br>');
        otherMessage.innerHTML = rawContent;
        chatBubble.add(true, userMessage)
        chatBubble.add(false, otherMessage.innerHTML)
    }
}
document.addEventListener('textReceived', (event) => {
    if (event.detail.type==='CHAT') 
        otherMessage.textContent += event.detail.text
    else if (event.detail.type==='UPDATE_GROUP_TITLE') 
        chatBubble.updateGroupTitle(event.detail.text, "title")
    else if (event.detail.type==='UPDATE_GROUP_DESCRIPTION') 
        chatBubble.updateGroupTitle(event.detail.text, "description")
    else if (event.detail.type==='PREVIEW_IMAGE') 
        imagePreviewElement.updateLabelText(event.detail.text)
})


