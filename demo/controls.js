const getElement = function getElement(name) {
    return document.querySelector(`.controls__item.${name}`)
}

/**
 * @param {EffectCollection} effectCollection
 */
export function initControls(effectCollection) {
    let restore = getElement('restore');
    restore.addEventListener('click', () => effectCollection.run('restore'));

    let collapse = getElement('collapse');
    collapse.addEventListener('click', () => effectCollection.run('collapse'));

    let spread = getElement('spread');
    spread.addEventListener('click', () => effectCollection.run('spread'));

    let chain = getElement('chain');
    chain.addEventListener('click', () => effectCollection.runChain());
}
