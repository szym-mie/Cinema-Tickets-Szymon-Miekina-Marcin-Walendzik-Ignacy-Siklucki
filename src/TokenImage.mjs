class TokenImage {
    constructor(token, width) {
        this.token = token;
        this.width = width;
    }

    toImageString() {
        const l = this.token.length;
        const w = this.width * 2;
        const s = [];

        for (let i = 0; i < l; i++) {
            const char = parseInt(this.token[i], 16);
            const lowerHalf = char & 0x3;
            const upperHalf = (char >> 2) & 0x3;

            s.push(TokenImage.imageChars[lowerHalf]);
            s.push(TokenImage.imageChars[upperHalf]);

            if (i % w === w - 1)
                s.push('\n');
        }

        return s.reduce((a, c) => a + c, '');
    }

    static imageChars = [' ', '▐', '▌', '█'];
}

export { TokenImage };
