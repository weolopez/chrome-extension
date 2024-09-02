class Toggle {
    constructor(){}
    toggles = {}
    add(Name, option_one, option_two) {
        this.toggles[Name] = {option_one, option_two}
    }
    toggle(Name) {
        this.toggles[Name].currentValue = 
            this.toggles[Name].currentValue === this.toggles[Name].option_one 
            ? this.toggles[Name].option_two 
            : this.toggles[Name].option_one;
        return this.toggles[Name].currentValue;
    }
}