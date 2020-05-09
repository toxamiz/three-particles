import PointFlyEffect from "./pointFlyEffect";
import {random, randomUnitVector3} from "../helpers";
import {BufferAttribute} from "three";

/**
 * Collapse into small sphere
 */
export default class Collapse extends PointFlyEffect {
    /**
     * @inheritDoc
     */
    getStartBufferAttribute(mesh) {
        return (new BufferAttribute()).copy(mesh.geometry.attributes.position);
    }

    /**
     * @inheritDoc
     */
    getTargetBufferAttribute(mesh) {
        const vertices = [];

        for (let baseVertex of this.verticesFromAttribute(mesh.geometry.attributes.position)) {
            const vertex = baseVertex.add(randomUnitVector3()).normalize().multiplyScalar(random(0.1, 0.4));
            vertices.push(...vertex.toArray());
        }

        return new BufferAttribute(new Float32Array(vertices), 3);
    }
}
