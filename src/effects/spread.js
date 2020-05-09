import PointFlyEffect from "./pointFlyEffect";
import {BufferAttribute} from "three";
import {randomUnitVector3} from "../helpers";

/**
 * Spreads mesh points in random directions
 */
export default class Spread extends PointFlyEffect {
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
        const targetVertices = [];

        for (let vertex of this.verticesFromAttribute(mesh.geometry.attributes.position)) {
            const targetVertex = vertex.sub(randomUnitVector3());
            targetVertices.push(...targetVertex.toArray());
        }

        return new BufferAttribute(new Float32Array(targetVertices), 3);
    }
}
