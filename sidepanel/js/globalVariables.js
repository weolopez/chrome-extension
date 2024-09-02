


const settingsPanel = document.querySelector('settings-panel');

const selection = document.querySelector('#selected-text');

const horizontalScrollPanels = document.getElementById('horizontal-scroll-panel');
const imagePreviewElement = document.querySelector('image-preview');
const chatHeader = document.querySelector('chat-header');
const twiki = document.querySelector('twiki-panel');
const chatGroupList = document.querySelector('chat-group-list');
const chatMessages = document.querySelector('.chat-messages');
const chatContainer = document.querySelector('.chat-container');
const imageLabel = document.querySelector('.image-label');
const selectedText = document.getElementById('selected-text')
const sendButton = document.getElementById('chat-button');
const chatInput = document.getElementById('chat-input');
const context = document.getElementById('context')
const contextRefresh = document.getElementById('context-refresh')
// Create and append the popover element
const popover = document.querySelector('copy-popover');

const chatBubble = document.querySelector('chat-bubble');
var PAGE_URL_STRING=''

let spinner = document.getElementById('spinner')
spinner.show = () => spinner.style.display = 'flex'
spinner.hide = () => spinner.style.display = 'none'

toggles.add('prompt', 'selected-text','group-list')
toggles.add('context', true, false)
settingsPanel.init(settings.actions) 
// class Toggle(Name, toToggle, option_one, option_two) 

