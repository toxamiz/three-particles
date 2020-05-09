/**
 * Base effect class
 */
export default class BaseEffect {
    /**
     * @param {Points} mesh
     */
    applyTo(mesh) {
        throw new Error('Must implement method `applyTo`');
    }

    /**
     * Run effect
     */
    run() {
        throw new Error('Must implement method `run`');
    }

    /**
     * Stop effect
     */
    stop() {
        throw new Error('Must implement method `stop`');
    }

    /**
     * Effect is finished
     *
     * @return {boolean}
     */
    isFinished() {
        throw new Error('Must implement method `isFinished`. Return value must be boolean');
    }

    /**
     * Effect is chainable
     *
     * @return {boolean}
     */
    isChainable() {
        throw new Error('Must implement method `isChainable`. Return value must be boolean');
    }

    /**
     * Enable chain
     */
    enableChain() {
        if (this.isChainable()) {
            throw new Error('Must implement method `enableChain`')
        }
    }
}
