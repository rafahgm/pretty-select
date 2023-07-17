/**
 * Adiciona um evento a um elemento HTML
 * @param elemento 
 * @param tipoEvento 
 * @param callback 
 * @param options 
 */
export function addEvento(
    elemento: HTMLElement,
    tipoEvento: keyof HTMLElementEventMap,
    callback: EventListenerOrEventListenerObject,
    options?: Object
): void {
    elemento.addEventListener(tipoEvento, callback);
}