class SettingsPanel extends HTMLElement {
    template;
    constructor() {
        super();
        this.template = document.createElement('template');
        this.template.innerHTML = /*html*/ `
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
        <style>
            .settings-panel {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                padding: 10px;
                background-color: #f9f9f9;
                border: 1px solid #ccc;
                border-radius: 8px;
                justify-content: space-between;
            }
        
            .settings-item {
                display: flex;
                flex-direction: column;
                align-items: center;
                width: 86px;
                text-align: center;
                cursor: pointer;
                padding-top: 10px;
                border-style: outset;
            }
        
            .settings-item .icon {
                font-size: 24px;
                margin-bottom: 10px;
            }
        
            .settings-item .title {
                font-size: 14px;
                color: #333;
            }
        
            .settings-item.push-button {
                border: 2px #ccc;
                border-style: outset;
                border-radius: 4px;
                transition: background-color 0.3s, transform 0.3s;
            }
        
            .settings-item.push-button.is-pressed {
                background-color: #ddd;
                border-style: inset;
                transform: translateY(2px);
            }
        
            .disabled {
                opacity: 0.2;
                /*  background-color: grey;*/
            }
        
            .dropdown-button {
                width: 100px;
                height: 100px;
                position: relative;
            }
        
            .dropdown-container {
                display: none;
                position: absolute;
                top: 100%;
                left: 0;
                width: 100px;
            }
        
            .dropdown-button:hover .dropdown-container {
                display: block;
            }
        
            .dropdown-settings-item {
                width: 100px;
                height: 100px;
                display: flex;
                align-items: center;
                justify-content: center;
                border: 1px solid #ccc;
                background-color: #fff;
            }
        </style>
        <div class="settings-panel">
            <!-- Items will be rendered here -->
        </div>
        `;
        this.attachShadow({
            mode: 'open'
        }).appendChild(this.template.content.cloneNode(true));
    }
    init(actions) {
        this.actions = actions;
        this.render()
    }

    connectedCallback() {
        this.render();
    }

    render() {
        if (this.actions == undefined) return
        console.log('rendering settings-panel')
        const items = this.actions;

        const panel = this.shadowRoot.querySelector('.settings-panel');
        panel.innerHTML = '';

        items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('settings-item');
            itemElement.id = item.id;

            if (item.type === 'disabled') {
                itemElement.classList.add('disabled');
            } else {
                itemElement.classList.add('push-button');
            }

            const iconElement = document.createElement('div');
            iconElement.className = 'icon';
            iconElement.innerHTML = item.icon;
            itemElement.appendChild(iconElement);

            const titleElement = document.createElement('div');
            titleElement.classList.add('title');
            titleElement.textContent = item.title;
            itemElement.appendChild(titleElement);

            let isPressed = false;
            if (item.type === 'push-button') {
                itemElement.addEventListener('click', () => {
                    isPressed = !itemElement.classList.contains('is-pressed')
                    itemElement.classList.toggle('is-pressed', isPressed);
                    console.log(`Clicked on ${item.id}, isPressed: ${isPressed}`);
                    // Handle click event here
                    this.dispatchItemClickEvent(item);
                });
            } else {
                itemElement.addEventListener('mousedown', () => {
                    isPressed = true;
                    itemElement.classList.add('is-pressed');
                    console.log(`Clicked on ${item.id}, isPressed: ${isPressed}`);
                });

                itemElement.addEventListener('mouseup', () => {
                    isPressed = false;
                    itemElement.classList.remove('is-pressed');
                    console.log(`Clicked on ${item.id}, isPressed: ${isPressed}`);
                    // Handle click event here
                    this.dispatchItemClickEvent(item);
                });
            }

            panel.appendChild(itemElement);
        });
    }
    dispatchItemClickEvent = (item) => {
        const event = new CustomEvent('item-click', {
            detail: {
                id: item.id
            },
            bubbles: true,
            composed: true
        });
        // if (item.type == 'push-button') {
        // toggles.toggle(item.id)
        // }
        this.dispatchEvent(event);
    };


    isPressed(id) {
        const itemElement = this.shadowRoot.querySelector(`#${id}`);
        if (itemElement) {
            return itemElement.classList.contains('is-pressed');
        }
        return false;
    }

    press(id, isPressed) {
        const itemElement = this.shadowRoot.querySelector(`#${id}`);
        if (itemElement) {
            if (isPressed) {
                itemElement.classList.add('is-pressed');
            } else {
                itemElement.classList.remove('is-pressed');
            }
        }
    }
}

customElements.define('settings-panel', SettingsPanel);

function setPromptType(context) {
    return
    if (context === 'context') {
        if (settingsPanel.isPressed('context')) {
            settingsPanel.press('history', false);
            settingsPanel.press('askatt', false);
            settingsPanel.press('wiki', false);
            settings.model = "context"
        } else settings.model = "llama3"
        settings.useContext = settingsPanel.isPressed('context')
    } else if (context === 'history') {
        if (settingsPanel.isPressed('history')) {
            settingsPanel.press('context', false);
            settingsPanel.press('askatt', false);
            settingsPanel.press('wiki', false);
            settings.model = "history"
        } else settings.model = "llama3"
        // askQuestion()
    } else if (context === 'askatt') {
        if (settingsPanel.isPressed('askatt')) {
            settingsPanel.press('history', false);
            settingsPanel.press('context', false);
            settingsPanel.press('wiki', false);
            settings.model = "askatt"
        } else settings.model = "llama3"
    } else if (context === 'wiki') {
        if (settingsPanel.isPressed('wiki')) {
            settingsPanel.press('history', false);
            settingsPanel.press('context', false);
            settingsPanel.press('askatt', false);
            settings.model = "wiki"
        } else settings.model = "llama3"
    }
    sendButton.textContent = settings.model
}