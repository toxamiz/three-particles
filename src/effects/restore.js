import PointFlyEffect from "./pointFlyEffect";
import {randomUnitVector3, random} from "../helpers";
import {BufferAttribute} from "three";

/**
 * Restores mesh from randomized points
 */
export default class Restore extends PointFlyEffect {
    /**
     * @inheritDoc
     */
    getStartBufferAttribute(mesh) {
        const vertices = [];

        for (let baseVertex of this.verticesFromAttribute(mesh.geometry.attributes.position)) {
            const vertex = baseVertex.add(randomUnitVector3()).multiplyScalar(random(1, 5));
            vertices.push(...vertex.toArray());
        }

        return new BufferAttribute(new Float32Array(vertices), 3);
    }

    /**
     * @inheritDoc
     */
    getTargetBufferAttribute(mesh) {
        return (new BufferAttribute()).copy(mesh.geometry.attributes.position);
    }
}
