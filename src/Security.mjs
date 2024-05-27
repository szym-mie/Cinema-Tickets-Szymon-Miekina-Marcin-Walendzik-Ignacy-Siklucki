import { randomBytes } from 'crypto';

class Security {
    /**
     * Create a secure token for use with sessions and UUIDs of required size.
     * @param {number} size Size in bytes of new token.
     * @returns {string} Secure token in hex format.
     */
    static createSecureToken(size) {
        return randomBytes(size).toString('hex');
    }

    /**
     * Test if token is secure.
     * @param {string} token Tested token.
     * @param {object} filter Filter options.
     * @param {number} filter.minSize Token must be equal or bigger in size.
     * @param {number} filter.exactSize Token must be equal in size.
     * @param {number} filter.minMix Token must not contain more than this amount of symbols in a row.
     * @returns {boolean} Is token secure.
     */
    static isTokenSecure(token, filter) {
        return Object.entries(filter)
            .map(([prop, value]) => [Security.filterProps[prop], value])
            .every(([cond, value]) => cond(token, value));
    }

    /**
     * @private
     */
    static filterProps = {
        minSize: Security.testMinSize,
        exactSize: Security.testExactSize,
        minMix: Security.testMinMix,
    };

    /**
     * Test if token has valid size.
     * @private
     * @param {string} token Tested token.
     * @param {number} minSize Minimal size of token.
     * @returns {boolean} Does token pass this test.
     */
    static testMinSize(token, minSize) {
        return token.length >= minSize * 2;
    }

    /**
     * Test if token has valid size.
     * @private
     * @param {string} token Tested token.
     * @param {number} minSize Exact size of token.
     * @returns {boolean} Does token pass this test.
     */
    static testMinSize(token, minSize) {
        return token.length === minSize * 2;
    }

    /**
     * Test if token has valid size.
     * @private
     * @param {string} token Tested token.
     * @param {number} minMix Minimal mix of token.
     * @returns {boolean} Does token pass this test.
     */
    static testMinMix(token, minMix) {
        const symbolSequenceCounts = [];
        let currentSequenceCount = 0;

        [...token].reduce((prev, char) => {
            if (prev !== char) {
                symbolSequenceCounts.push(currentSequenceCount);
                currentSequenceCount = 1;
            }
            else {
                currentSequenceCount++;
            }
            return char;
        });

        return symbolSequenceCounts.some(count => count > minMix);
    }
}

export { Security };
