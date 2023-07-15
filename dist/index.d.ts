declare global {
    interface Window {
        PrettySelect: PrettySelect;
    }
}
declare class PrettySelect {
    constructor(element: HTMLSelectElement);
}

export { PrettySelect as default };
