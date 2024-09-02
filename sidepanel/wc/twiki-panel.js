class TwikiPanel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    // Template for the component
    const template = document.createElement('template');
    template.innerHTML = `
      <style>
        .header-bar {
          display: flex;
          align-items: center;
          background-color: #f3f3f3;
          padding: 10px;
          border-bottom: 1px solid #ccc;
        }
        .header-bar button {
          margin-right: 10px;
          padding: 5px 10px;
          border: none;
          background-color: #0078d4;
          color: white;
          cursor: pointer;
        }
        .header-bar button:hover {
          background-color: #005a9e;
        }
        .content {
          padding: 10px;    
          overflow: scroll;
          max-height: 100vh;
        }
      </style>
      <div class="header-bar">
        <button id="Edit">Edit</button>
        <button id="page_id">PAGE ID</button>
        <button id="underline">Underline</button>
        <button id="save">Save</button>
      </div>
      <div class="content" contenteditable="true">
        <p>Edit your wiki content here...</p>
      </div>
    `;

    // Append the template content to the shadow DOM
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    // Event listeners for buttons
    this.shadowRoot.getElementById('Edit').addEventListener('click', () => this.format('bold'));
  //   this.shadowRoot.getElementById('italic').addEventListener('click', () => this.format('italic'));
  //   this.shadowRoot.getElementById('underline').addEventListener('click', () => this.format('underline'));
  //   this.shadowRoot.getElementById('save').addEventListener('click', () => this.saveContent());
  }

  format(command) {
    document.execCommand(command, false, null);
  }

  saveContent() {
    const content = this.shadowRoot.querySelector('.content').innerHTML;
    console.log('Saved content:', content);
    // Implement your save logic here
  }

  async updateContent(html, page_id) {
    //update #page_id button text
    this.shadowRoot.querySelector('#page_id').innerText = page_id;
    //create new element from html
    this.wikiContent = document.createElement('div');
    this.wikiContent.innerHTML = html;
    // hide id="main-header"
    this.wikiContent.querySelector('#main-header').style.display = 'none';
    // replace html in .content with html
    let airesponce = await lamma3(`[INST]Simplify[INST][CONTEXT]${this.wikiContent.querySelector('#content').innerText}[CONTEXT]`, 'WIKI');
    this.shadowRoot.querySelector('.content').innerText = this.wikiContent.querySelector('#content').innerText;
  }
}

// Register the custom element
customElements.define('twiki-panel', TwikiPanel);