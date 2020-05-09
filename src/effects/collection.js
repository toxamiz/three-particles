import BaseEffect from "./baseEffect";

/**
 * Base shader code
 *
 * @param header
 * @param body
 * @return {string}
 */
const shaderCode = function shaderCode(header, body) {
    return `
        ${header}
        varying vec3 vPosition;
        varying vec4 vecPosition;

        void main() {
            vec3 newPosition = position;
            ${body}

            vPosition = newPosition;
            vec4 mvPosition = modelViewMatrix * vec4( newPosition, 1.0 );
            gl_Position = projectionMatrix * mvPosition;
            vecPosition = gl_Position;
        }
    `;
}

class EffectCollection {
    constructor() {
        this.effects = [];
        this.activeEffects = [];
    }

    /**
     * @param {BaseEffect} effect
     */
    add(effect) {
        this.effects.push(effect);
        this.isStarted = false;
    }

    /**
     *
     * @param {Points} mesh
     * @return {*}
     */
    applyEffects(mesh) {
        this.effects.forEach(effect => effect.applyTo(mesh));
        let head = this.effects.map(effect => effect.shaderHeader).join('\n');
        let body = this.effects.map(effect => effect.shaderBody).join('\n');

        mesh.material.vertexShader = shaderCode(head, body);

        return mesh;
    }

    /**
     * Animate effects
     */
    update() {
        if (!this.isStarted) {
            return;
        }

        const currentEffect = this.activeEffects.find(effect => !effect.isFinished());
        if (!currentEffect) {
            this.stop();
            return;
        }

        currentEffect.run();
    }

    /**
     * Run effect by name
     *
     * @param name
     */
    run(name) {
        this.stop();
        const effect = this.effects.find(effect => effect.name === name);
        if (!effect) {
            return;
        }

        this.isStarted = true;
        this.activeEffects = [effect];
        effect.run();
    }

    /**
     * Run effect chain
     */
    runChain()
    {
        this.stop();
        this.activeEffects = this.effects.filter(effect => effect.isChainable());

        this.activeEffects.forEach(effect => effect.enableChain())

        if (this.activeEffects.length > 0) {
            this.isStarted = true;
            this.activeEffects[0].run();
        }
    }

    /**
     * Stop all active effects
     */
    stop() {
        this.isStarted = false;
        this.effects.forEach(effect => effect.stop())
    }
}

export {EffectCollection};
