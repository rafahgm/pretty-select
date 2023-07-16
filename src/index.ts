declare global {
    interface Window { Select: any; }
}

class Select {
    elemento?: HTMLSelectElement;
    opcoes: Array<Opcao> = [];

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


        this.elemento.insertAdjacentHTML('afterend', `<div class="select__wrapper">
        <div class="select__controle">
            <input type="text" class="select__controle__pesquisa" spellcheck="false" placeholder="${opcoes.placeholder ?? " "}" autocomplete="off" tabindex="0" role="combobox" id="select-pesquisa" />
        </div>
        <div class="select__dropdown">
        ${this.geraHTMLOpcoes()}
        </div>
        </div>`);

        // Configura eventos

        document.querySelector<HTMLInputElement>('#select-pesquisa')?.addEventListener('input', function () {
            let opcoesEncontradas = 0;
            
            // Remove o texto de nada encontrado
            document.querySelectorAll<HTMLSpanElement>(".select__dropdown span[data-nada]").forEach(span => {
                span.remove();
            });

            // Percorre pelas opções procurando o texto digitado
            document.querySelectorAll<HTMLSpanElement>(".select__dropdown span").forEach(opcao => {
                if(this.value.length > 0) {
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
                        console.log({antes, depois});
                        opcao.innerHTML = antes + `<mark>${token}</mark>` + depois;
                        opcoesEncontradas++;
                    } else {
                        opcao.style.display = "none";
                        opcao.innerHTML = opcao.dataset.texto ?? '';
                    }
                }else {
                    // Restaura todos
                    opcao.style.display = 'inline-block';
                    opcao.innerHTML = opcao.dataset.texto ?? '';
                }
            });

            if(opcoesEncontradas === 0 && this.value.length > 0) {
                document.querySelector(".select__dropdown")?.insertAdjacentHTML('beforeend', '<span data-nada>Nenhuma opção encontrada</span>');
            } 
        })
    }

    private geraHTMLOpcoes(): string {
        let html = '';
        this.opcoes.forEach(opcao => {
            html += `<span data-valor="${opcao.valor}" data-texto="${opcao.texto}">${opcao.texto}</span>`
        });

        return html;
    }
}

window.Select = Select;
export default Select;