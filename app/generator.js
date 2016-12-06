class Generator {
    getValue() {
        let rand = Math.random();
        return Math.round(rand * 100) / 100;
    }
}

module.exports = Generator;