"use client"
"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  default: () => src_default
});
module.exports = __toCommonJS(src_exports);

// src/utils.ts
function addEvento(elemento, tipoEvento, callback, options) {
  elemento.addEventListener(tipoEvento, callback);
}

// src/index.ts
var Select = class {
  constructor(elemento, opcoes) {
    this.opcoes = [];
    // DOM do Select
    this.wrapper = document.createElement("div");
    this.controle = document.createElement("div");
    this.pesquisa = document.createElement("input");
    this.opcoesContainer = document.createElement("div");
    // Estado
    this.aberto = false;
    var _a;
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
    this.geraDOMSelect((_a = opcoes.placeholder) != null ? _a : " ");
    addEvento(this.controle, "mousedown", (e) => this.onControleClick(e));
    addEvento(this.pesquisa, "keydown", function(event) {
      const key = event.key;
      switch (key) {
        case "ArrowUp":
        case "ArrowDown":
          {
            const opcaoAtiva = document.querySelector(".select__dropdown span.ativo");
            let novaOpcaoSelecionada = key === "ArrowUp" ? opcaoAtiva == null ? void 0 : opcaoAtiva.previousElementSibling : opcaoAtiva == null ? void 0 : opcaoAtiva.nextElementSibling;
            if (novaOpcaoSelecionada) {
              opcaoAtiva == null ? void 0 : opcaoAtiva.classList.remove("ativo");
              novaOpcaoSelecionada.classList.add("ativo");
            }
          }
          break;
      }
    });
    this.pesquisa.addEventListener("keyup", function(event) {
      var _a2;
      const key = event.key;
      let opcoesEncontradas = 0;
      document.querySelectorAll(".select__dropdown span[data-nada]").forEach((span) => {
        span.remove();
      });
      document.querySelectorAll(".select__dropdown span").forEach((opcao) => {
        var _a3, _b, _c, _d;
        if (this.value.length > 0) {
          const stringOriginal = (_a3 = opcao.textContent) != null ? _a3 : "";
          const stringNormalizada = stringOriginal.normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), "");
          const pesquisaNormalizada = this.value.normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), "");
          const index = stringNormalizada.toUpperCase().indexOf(pesquisaNormalizada.toUpperCase());
          if (pesquisaNormalizada.length === 0) {
            opcao.innerHTML = (_b = opcao.dataset.texto) != null ? _b : "";
          }
          if (index > -1) {
            opcao.style.display = "inline-block";
            const token = stringOriginal.slice(index, index + this.value.length);
            const depois = stringOriginal.slice(stringOriginal.indexOf(token) + this.value.length);
            const antes = stringOriginal.slice(0, stringOriginal.indexOf(token));
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
    addEvento(this.pesquisa, "focus", (e) => this.onPesquisaFocus(e));
    addEvento(this.pesquisa, "focusout", () => {
      this.fecharOpcoes();
    });
  }
  geraDOMSelect(pesquisaPlaceholder) {
    var _a;
    this.wrapper.classList.add("select__wrapper");
    this.controle.classList.add("select__controle");
    this.pesquisa.setAttribute("type", "text");
    this.pesquisa.setAttribute("spellcheck", "false");
    this.pesquisa.setAttribute("placeholder", pesquisaPlaceholder);
    this.pesquisa.setAttribute("autocomplete", "off");
    this.pesquisa.setAttribute("tabindex", "0");
    this.pesquisa.setAttribute("role", "combobox");
    this.pesquisa.classList.add("select__controle__pesquisa");
    this.pesquisa.id = "select-pesquisa";
    this.controle.appendChild(this.pesquisa);
    this.wrapper.appendChild(this.controle);
    this.opcoesContainer.classList.add("select__dropdown");
    this.opcoesContainer.style.display = "none";
    this.geraDOMOpcoes(this.opcoesContainer);
    this.wrapper.appendChild(this.opcoesContainer);
    (_a = this.elemento) == null ? void 0 : _a.insertAdjacentElement("afterend", this.wrapper);
  }
  geraDOMOpcoes(opcoesContainer) {
    this.opcoes.forEach((opcao, index) => {
      const span = document.createElement("span");
      span.dataset.valor = opcao.valor;
      span.dataset.texto = opcao.texto;
      span.textContent = opcao.texto;
      span.addEventListener("mouseover", function() {
        var _a, _b, _c;
        const todasOpcoes = (_b = (_a = this.parentElement) == null ? void 0 : _a.children) != null ? _b : [];
        for (let i = 0; i < todasOpcoes.length; i++)
          (_c = todasOpcoes[i]) == null ? void 0 : _c.classList.remove("ativo");
        this.classList.add("ativo");
      });
      if (index === 0)
        span.classList.add("ativo");
      opcoesContainer.append(span);
    });
  }
  fecharOpcoes() {
    this.wrapper.classList.remove("focado");
    this.opcoesContainer.style.display = "none";
    this.pesquisa.blur();
    this.aberto = false;
    this.pesquisa.value = "";
  }
  abrirOpcoes() {
    this.wrapper.classList.add("focado");
    this.opcoesContainer.style.display = "flex";
    this.pesquisa.focus();
    this.aberto = true;
  }
  onPesquisaFocus(evento) {
    this.abrirOpcoes();
  }
  onControleClick(evento) {
    evento.preventDefault();
    if (this.pesquisa.value.length)
      return;
    if (this.aberto) {
      this.fecharOpcoes();
    } else {
      this.abrirOpcoes();
    }
  }
};
window.Select = Select;
var src_default = Select;
//# sourceMappingURL=index.js.map