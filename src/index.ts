import { addEvento } from "./utils";

declare global {
    interface Window { Select: any; }
}

class Select {
    private elemento?: HTMLSelectElement;
    private opcoes: Array<Opcao> = [];

    // DOM do Select
    private wrapper: HTMLDivElement = document.createElement('div');;
    private controle: HTMLDivElement = document.createElement('div');
    private pesquisa: HTMLInputElement = document.createElement('input');
    private opcoesContainer: HTMLDivElement = document.createElement('div');

    // Estado
    private aberto: boolean = false;

    constructor(elemento: HTMLSelectElement | string, opcoes: OpcoesSelect) {
        if (typeof (elemento) === "string" && document.querySelector(elemento)) {
            this.elemento = document.querySelector(elemento) as HTMLSelectElement;
        } else if (elemento instanceof HTMLSelectElement) {
            this.elemento = elemento;
        } else {
            throw new Error('elemento precisa ser um HTMLSelectElement ou um seletor CSS');
        }

        // Esconde select original
        this.elemento.classList.add('select--escondido');

        // Verifica se o select original possui opções
        [...this.elemento.options].forEach(opcao => {
            this.opcoes.push({
                valor: opcao.value,
                texto: opcao.label
            });
        })

        // Cria HTML do Select
        this.geraDOMSelect(opcoes.placeholder ?? ' ');

        // Configura eventos
        addEvento(this.controle, 'mousedown', (e) => this.onControleClick(e as MouseEvent));
    
        addEvento(this.pesquisa, 'keydown', function (event) {
            const key = (event as KeyboardEvent).key;

            switch (key) {
                case 'ArrowUp':
                case 'ArrowDown': {
                    const opcaoAtiva = document.querySelector<HTMLSpanElement>('.select__dropdown span.ativo');

                    let novaOpcaoSelecionada = key === 'ArrowUp' ? opcaoAtiva?.previousElementSibling : opcaoAtiva?.nextElementSibling;

                    if (novaOpcaoSelecionada) {
                        opcaoAtiva?.classList.remove('ativo');
                        novaOpcaoSelecionada.classList.add('ativo');
                    }

                } break;
            }
        });

        this.pesquisa.addEventListener('keyup', function (event) {
            const key = (event as KeyboardEvent).key;

            let opcoesEncontradas = 0;

            // Remove o texto de nada encontrado
            document.querySelectorAll<HTMLSpanElement>(".select__dropdown span[data-nada]").forEach(span => {
                span.remove();
            });

            // Percorre pelas opções procurando o texto digitado
            document.querySelectorAll<HTMLSpanElement>(".select__dropdown span").forEach(opcao => {
                if (this.value.length > 0) {
                    const stringOriginal = opcao.textContent ?? '';
                    const stringNormalizada = stringOriginal.normalize('NFD').replace(/\p{Diacritic}/gu, '');
                    const pesquisaNormalizada = this.value.normalize('NFD').replace(/\p{Diacritic}/gu, '');

                    const index = stringNormalizada.toUpperCase().indexOf(pesquisaNormalizada.toUpperCase());

                    if (pesquisaNormalizada.length === 0) {
                        // Restaura os textos
                        opcao.innerHTML = opcao.dataset.texto ?? '';
                    }

                    if (index > -1) {
                        opcao.style.display = "inline-block";

                        //Substitui o conteudo do span pelo highlight
                        const token = stringOriginal.slice(index, index + this.value.length);
                        const depois = stringOriginal.slice(stringOriginal.indexOf(token) + this.value.length);
                        const antes = stringOriginal.slice(0, stringOriginal.indexOf(token));
                        opcao.innerHTML = antes + `<mark>${token}</mark>` + depois;
                        opcoesEncontradas++;
                    } else {
                        opcao.style.display = "none";
                        opcao.innerHTML = opcao.dataset.texto ?? '';
                    }
                } else {
                    // Restaura todos
                    opcao.style.display = 'inline-block';
                    opcao.innerHTML = opcao.dataset.texto ?? '';
                }
            });

            if (opcoesEncontradas === 0 && this.value.length > 0) {
                document.querySelector(".select__dropdown")?.insertAdjacentHTML('beforeend', '<span data-nada>Nenhuma opção encontrada</span>');
            }

        })

        addEvento(this.pesquisa, 'focus', (e) => this.onPesquisaFocus(e as FocusEvent));
        
        addEvento(this.pesquisa, 'focusout', () => {
            this.fecharOpcoes();
        });
    }

    private geraDOMSelect(pesquisaPlaceholder: string): void {
        // Wrapper
        this.wrapper.classList.add('select__wrapper');

        // Controle
        this.controle.classList.add('select__controle');

        // Pesquisa
        this.pesquisa.setAttribute('type', 'text');
        this.pesquisa.setAttribute('spellcheck', 'false');
        this.pesquisa.setAttribute('placeholder', pesquisaPlaceholder);
        this.pesquisa.setAttribute('autocomplete', 'off');
        this.pesquisa.setAttribute('tabindex', '0');
        this.pesquisa.setAttribute('role', 'combobox');
        this.pesquisa.classList.add('select__controle__pesquisa');
        this.pesquisa.id = "select-pesquisa";

        this.controle.appendChild(this.pesquisa);
        this.wrapper.appendChild(this.controle);

        // Opcoes
        this.opcoesContainer.classList.add('select__dropdown');
        this.opcoesContainer.style.display = 'none';
        this.geraDOMOpcoes(this.opcoesContainer);
        this.wrapper.appendChild(this.opcoesContainer);
       
        this.elemento?.insertAdjacentElement('afterend', this.wrapper);
    }

    private geraDOMOpcoes(opcoesContainer: HTMLDivElement): void {

        this.opcoes.forEach((opcao, index) => {
            const span = document.createElement('span');
            span.dataset.valor = opcao.valor;
            span.dataset.texto = opcao.texto;
            span.textContent = opcao.texto;

            span.addEventListener('mouseover', function () {
                const todasOpcoes = this.parentElement?.children ?? [];

                // Limpa todos as outras opções
                for (let i = 0; i < todasOpcoes.length; i++) todasOpcoes[i]?.classList.remove('ativo');

                // Marca a opção atual como ativa
                this.classList.add('ativo');
            });

            if(index === 0) span.classList.add('ativo');

            opcoesContainer.append(span);
        });
    }

    private fecharOpcoes() {
        this.wrapper.classList.remove('focado');
        this.opcoesContainer.style.display = 'none';
        this.pesquisa.blur();
        this.aberto = false;
        this.pesquisa.value = '';
    }

    private abrirOpcoes() {
        this.wrapper.classList.add('focado');
        this.opcoesContainer.style.display = 'flex';
        this.pesquisa.focus();
        this.aberto = true;
    }


    private onPesquisaFocus(evento: FocusEvent) {
        this.abrirOpcoes();
    }

    private onControleClick(evento: MouseEvent) {
        evento.preventDefault();

        if(this.pesquisa.value.length) return;

        if(this.aberto) {
            // Se está aberto, FECHAR
            this.fecharOpcoes();
            
        }else {
            // Se está fechado, ABRIR
            this.abrirOpcoes();
        }
    }
}

window.Select = Select;
export default Select;