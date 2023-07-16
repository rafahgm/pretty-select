"use client"
"use strict";
(() => {
  // src/index.ts
  var Select = class {
    constructor(elemento, opcoes) {
      this.opcoes = [];
      var _a, _b;
      if (typeof elemento === "string" && document.querySelector(elemento)) {
        this.elemento = document.querySelector(elemento);
      } else if (elemento instanceof HTMLSelectElement) {
        this.elemento = elemento;
      } else {
        throw new Error("elemento precisa ser um HTMLSelectElement ou um seletor CSS");
      }
      this.elemento.classList.add("select--escondido");
      [...this.elemento.options].forEach((opcao) => {
        this.opcoes.push({
          valor: opcao.value,
          texto: opcao.label
        });
      });
      this.elemento.insertAdjacentHTML("afterend", `<div class="select__wrapper">
        <div class="select__controle">
            <input type="text" class="select__controle__pesquisa" spellcheck="false" placeholder="${(_a = opcoes.placeholder) != null ? _a : " "}" autocomplete="off" tabindex="0" role="combobox" id="select-pesquisa" />
        </div>
        <div class="select__dropdown">
        ${this.geraHTMLOpcoes()}
        </div>
        </div>`);
      (_b = document.querySelector("#select-pesquisa")) == null ? void 0 : _b.addEventListener("input", function() {
        var _a2;
        let opcoesEncontradas = 0;
        document.querySelectorAll(".select__dropdown span[data-nada]").forEach((span) => {
          span.remove();
        });
        document.querySelectorAll(".select__dropdown span").forEach((opcao) => {
          var _a3, _b2, _c, _d;
          if (this.value.length > 0) {
            const stringOriginal = (_a3 = opcao.textContent) != null ? _a3 : "";
            const stringNormalizada = stringOriginal.normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), "");
            const pesquisaNormalizada = this.value.normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), "");
            const index = stringNormalizada.toUpperCase().indexOf(pesquisaNormalizada.toUpperCase());
            if (pesquisaNormalizada.length === 0) {
              opcao.innerHTML = (_b2 = opcao.dataset.texto) != null ? _b2 : "";
            }
            if (index > -1) {
              opcao.style.display = "inline-block";
              const token = stringOriginal.slice(index, index + this.value.length);
              const depois = stringOriginal.slice(stringOriginal.indexOf(token) + this.value.length);
              const antes = stringOriginal.slice(0, stringOriginal.indexOf(token));
              console.log({ antes, depois });
              opcao.innerHTML = antes + `<mark>${token}</mark>` + depois;
              opcoesEncontradas++;
            } else {
              opcao.style.display = "none";
              opcao.innerHTML = (_c = opcao.dataset.texto) != null ? _c : "";
            }
          } else {
            opcao.style.display = "inline-block";
            opcao.innerHTML = (_d = opcao.dataset.texto) != null ? _d : "";
          }
        });
        if (opcoesEncontradas === 0 && this.value.length > 0) {
          (_a2 = document.querySelector(".select__dropdown")) == null ? void 0 : _a2.insertAdjacentHTML("beforeend", "<span data-nada>Nenhuma op\xE7\xE3o encontrada</span>");
        }
      });
    }
    geraHTMLOpcoes() {
      let html = "";
      this.opcoes.forEach((opcao) => {
        html += `<span data-valor="${opcao.valor}" data-texto="${opcao.texto}">${opcao.texto}</span>`;
      });
      return html;
    }
  };
  window.Select = Select;
  var src_default = Select;
})();
//# sourceMappingURL=index.global.js.map