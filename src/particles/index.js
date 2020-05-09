import {BufferGeometry, BufferAttribute, Vector3, ShaderMaterial, Points} from "three";
import {random} from '../helpers';


/**
 * @param {BufferGeometry | Geometry} geometry
 * @return {BufferGeometry}
 */
const convertToBufferGeometry = function convertToBufferGeometry(geometry) {
    return !geometry.isBufferGeometry ? new BufferGeometry().fromGeometry(geometry) : geometry;
}

/**
 *
 * @param {BufferGeometry} geometry
 * @param {Matrix4} matrixWorld
 */
const computeEdges = function computeEdges(geometry, matrixWorld) {
    const vertices = geometry.attributes.position.array;
    const verticesCount = geometry.attributes.position.count;

    const edges = new Map();

    /**
     * Make edge from vertices
     *
     * @param indexOne
     * @param indexTwo
     */
    const makeEdge = function makeEdge(indexOne, indexTwo) {
        const key = `${indexOne}_${indexTwo}`;
        if (edges.has(key)) {
            return;
        }

        const startVertex = (new Vector3(
            vertices[indexOne * 3],
            vertices[indexOne * 3 + 1],
            vertices[indexOne * 3 + 2]
        )).applyMatrix4(matrixWorld);

        const endVertex = (new Vector3(
            vertices[indexTwo * 3],
            vertices[indexTwo * 3 + 1],
            vertices[indexTwo * 3 + 2]
        )).applyMatrix4(matrixWorld);

        const edgeVertex = (new Vector3()).subVectors(endVertex, startVertex);

        edges.set(key, {
            startVertex,
            endVertex,
            edgeVertex,
            edgeLength: edgeVertex.length(),
            edgeNormal: edgeVertex.normalize(),
        });
    }

    // make edges
    for (let i = 0; i < verticesCount; i += 3) {
        let first = i;
        let second = i + 1;
        let third = i + 2;

        makeEdge(first, second);
        makeEdge(first, third);
        makeEdge(second, third);
    }
    // console.log(edgesSum);

    return edges;
}

/**
 * @param {Map} edges
 * @return {int}
 */
const getEdgesSummaryLength = function getEdgesSummaryLength(edges) {
    let summary  = 0;
    edges.forEach(({edgeLength}) => (summary += edgeLength));
    return summary;
}

/**
 * @param {Mesh} mesh
 * @param config
 */
function createParticleMesh(mesh, config = {}) {
    const resultVertices = [];
    const geometry = convertToBufferGeometry(mesh.geometry);

    const edges = computeEdges(geometry, mesh.matrixWorld);

    const edgesSummaryLength = getEdgesSummaryLength(edges);

    const particlesCount = (config.particlesCount || 10000);
    const particlesDensity = Math.abs((config.particlesDensity || 1.5) / 2);

    // Fill edges by particles
    edges.forEach(({startVertex, edgeLength, edgeNormal}) => {
        // step to fill edge
        let step = edgesSummaryLength / (edgeLength * particlesCount);
        for (let i = 0; i <= 1; i += step) {
            // Start + normal*length*offset
            let resultVertex = (new Vector3()).addVectors(startVertex, edgeNormal.clone().multiplyScalar(edgeLength * i));
            let randomVector = new Vector3(
                random(-particlesDensity, particlesDensity),
                random(-particlesDensity, particlesDensity),
                random(-particlesDensity, particlesDensity)
            );
            resultVertex.add(randomVector);
            resultVertices.push(...resultVertex.toArray());
        }
    });

    let bufferGeometry = new BufferGeometry();
    bufferGeometry.setAttribute('position', new BufferAttribute(new Float32Array(resultVertices), 3));

    let shaderMaterial = new ShaderMaterial({
        transparent: true,
        depthTest: false,
    });
    bufferGeometry.computeBoundingBox();

    return new Points(bufferGeometry, shaderMaterial)
}

export {createParticleMesh};
