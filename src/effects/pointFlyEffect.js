import BaseEffect from "./baseEffect";
import {BufferAttribute, Vector3} from "three";

/**
 * Flying point effect from start to target
 */
export default class PointFlyEffect extends BaseEffect {
    /**
     * @param name
     * @param {number} duration
     */
    constructor(name, duration) {
        super();
        this.name = name;
        this.duration = duration;
        this.time = {value: 0};
        this.chainable = {value: false};
    }

    /**
     * Shader header with attributes, uniforms etc.
     *
     * @return {string}
     */
    get shaderHeader() {
        return `
            attribute vec3 ${this.targetVertexAttribute};
            attribute vec3 ${this.startVertexAttribute};
            
            uniform float ${this.timeUniform};
            uniform float ${this.durationUniform};
            uniform bool ${this.chainFlagUniform};
        `;
    }

    /**
     * Main shader logic
     *
     * @return {string}
     */
    get shaderBody() {
        const offsetVertex = `${this.name}OffsetVertex`;
        const step = `${this.name}Step`;
        return `
            if (${this.timeUniform} > 0.0) {
                newPosition = ${this.chainFlagUniform} ? newPosition : ${this.startVertexAttribute};
                vec3 ${offsetVertex} = ${this.targetVertexAttribute} - newPosition;
                float ${step} = (1.0 / (length(${offsetVertex})) * 0.01) + ${this.timeUniform} / ${this.durationUniform};
                newPosition = newPosition + length(${offsetVertex}) * normalize(${offsetVertex}) * ${step};
            }
        `
    }

    /**
     * Target vertex attribute in shader
     *
     * @return {string}
     */
    get targetVertexAttribute() {
        return `${this.name}TargetVertex`;
    }

    /**
     * Start vertex attribute in shader
     *
     * @return {string}
     */
    get startVertexAttribute() {
        return `${this.name}StartVertex`;
    }

    /**
     * Time uniform in shader
     *
     * @return {string}
     */
    get timeUniform() {
        return `${this.name}Time`;
    }

    /**
     * Duration uniform in shader
     *
     * @return {string}
     */
    get durationUniform() {
        return `${this.name}Duration`;
    }

    /**
     * Chain flag uniform
     *
     * @return {string}
     */
    get chainFlagUniform() {
        return `${this.name}Chain`
    }

    /**
     * @inheritDoc
     */
    run() {
        this.time.value++;
    }

    /**
     * @inheritDoc
     */
    stop() {
        this.time.value = 0;
        this.chainable.value = false;
    }

    /**
     * @inheritDoc
     *
     * @return {boolean}
     */
    isFinished() {
        return this.time.value === this.duration;
    }

    /**
     * @inheritDoc
     *
     * @return {boolean}
     */
    isChainable () {
        return true;
    }

    /**
     * @inheritDoc
     */
    enableChain() {
        this.chainable.value = true;
    }

    /**
     * @inheritDoc
     */
    applyTo(mesh) {
        const startBufferAttribute = this.getStartBufferAttribute(mesh);
        const targetBufferAttribute = this.getTargetBufferAttribute(mesh);

        mesh.geometry.setAttribute(this.startVertexAttribute, startBufferAttribute);
        mesh.geometry.setAttribute(this.targetVertexAttribute, targetBufferAttribute);
        mesh.material.uniforms = {
            ...mesh.material.uniforms,
            [this.timeUniform]: this.time,
            [this.durationUniform]: {value: this.duration},
            [this.chainFlagUniform]: this.chainable
        }
    }

    /**
     * @param {Points} mesh
     * @return {BufferAttribute}
     */
    getStartBufferAttribute(mesh) {
        throw new Error('Must implement method `getStartBufferAttribute`');
    }

    /**
     * @param {Points} mesh
     * @return {BufferAttribute}
     */
    getTargetBufferAttribute(mesh) {
        throw new Error('Must implement method `getTargetBufferAttribute`');
    }

    /**
     * Generate vertices from BufferAttribute array
     *
     * @param attribute
     * @return {Generator<Vector3>}
     */
    * verticesFromAttribute(attribute) {
        for (let i = 0; i < attribute.array.length; i += 3) {
            yield new Vector3(
                attribute.array[i],
                attribute.array[i + 1],
                attribute.array[i + 2]
            )
        }
    }
}
