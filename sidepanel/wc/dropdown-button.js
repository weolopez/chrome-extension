// Define the template for the combo button
const template = document.createElement('template');
template.innerHTML = /*html*/ `
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
<style>
    :host {
        display: inline-flex;
    }

    .combo-button,
    .options {
        width: inherit;
        padding: revert-layer;
    }

    .combo-button {
        display: inline-flex;
        align-items: center;
        background-color: #0057b8;
        color: white;
        border: none;
        padding: 10px;
        cursor: pointer;
        border-radius: 5px;
    }

    .combo-button:hover {
        background-color: #0057b8;
    }

    .chevron-button {
        background-color: #0057b8;
        border: none;
        color: white;
        padding: 10px;
        cursor: pointer;
        position: absolute;
        right: 12px;
    }

    .chevron-button:hover {
        background-color: #007ae2;
    }

    .options {
        display: none;
        position: absolute;
        background-color: #0057b8;
        color: white;
        list-style: none;
        margin: 0;
        padding: 0;
        border: 1px solid #0057b8;
        z-index: 10000;
        width: 123px;
    }

    .options li {
        padding: 10px;
        padding-right: 32px;
        cursor: pointer;
    }

    .options li:hover {
        background-color: #007ae2;
    }
</style>
<div class="combo-button">
    <span class="selected-action">llama</span>
    <button class="chevron-button"><i class="fas fa-chevron-up"></i></button>
</div>
<ul class="options">
    <li>history</li>
    <li>page</li>
    <li>wiki</li>
    <li>askatt</li>
    <li>llama</li>
    <li>openai</li>
</ul>
`;

class DropdownButton extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({
            mode: 'open'
        });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.chevronButton = this.shadowRoot.querySelector('.chevron-button');
        this.options = this.shadowRoot.querySelector('.options');
        this.selectedAction = this.shadowRoot.querySelector('.selected-action');
        this.comboButton = this.shadowRoot.querySelector('.combo-button');

        // Event listeners
        this.chevronButton.addEventListener('click', this.toggleOptions.bind(this));
        this.comboButton.addEventListener('click', this.performAction.bind(this));
        this.options.addEventListener('click', this.selectAction.bind(this));
    }

    toggleOptions(event) {
        event.stopPropagation();
        const options = this.options;
        const selectedAction = this.selectedAction.textContent.trim();

        // Filter out the selected option
        Array.from(options.children).forEach(option => {
            if (option.textContent.trim() === selectedAction) {
                option.style.display = 'none';
            } else {
                option.style.display = 'block';
            }
        });

        options.style.display = options.style.display === 'block' ? 'none' : 'block';

        if (options.style.display === 'block') {
            const rect = options.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            if (rect.bottom > viewportHeight) {
                if (document.chromePlugin === true) options.style.top = `-116px`;
                else options.style.top = `-134px`;
            } else {
                if (document.chromePlugin === true) options.style.top = `-116px`;
                else options.style.top = `-134px`;
            }
        }
    }

    selectAction(event) {
        this.selectedAction.textContent = event.target.textContent;
        this.options.style.display = 'none';
        settings.model = event.target.textContent
    }

    performAction(event) {
        if (event.target !== this.chevronButton) {
            sendMessage()
        }
    }
}

window.customElements.define('dropdown-button', DropdownButton);

// Close options menu when clicking outside
document.addEventListener('click', () => {
    document.querySelectorAll('dropdown-button').forEach(comboButton => {
        comboButton.shadowRoot.querySelector('.options').style.display = 'none';
    });
});