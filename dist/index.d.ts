declare global {
    interface Window {
        Select: any;
    }
}
declare class Select {
    elemento?: HTMLSelectElement;
    opcoes: Array<Opcao>;
    constructor(elemento: HTMLSelectElement | string, opcoes: OpcoesSelect);
    private geraHTMLOpcoes;
}

export { Select as default };
