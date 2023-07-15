declare global {
    interface Window { Select: Select; }
}

class Select {
    constructor(element: HTMLSelectElement) {
        console.log("PrettySelect");
    }
}

window.Select = Select;
export default Select;