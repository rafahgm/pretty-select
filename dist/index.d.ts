declare global {
    interface Window {
        Select: any;
    }
}
declare class Select {
    private elemento?;
    private opcoes;
    private wrapper;
    private controle;
    private pesquisa;
    private opcoesContainer;
    private aberto;
    constructor(elemento: HTMLSelectElement | string, opcoes: OpcoesSelect);
    private geraDOMSelect;
    private geraDOMOpcoes;
    private fecharOpcoes;
    private abrirOpcoes;
    private onPesquisaFocus;
    private onControleClick;
}

export { Select as default };
