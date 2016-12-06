module.exports = function Generator() {
    this.getValue = function () {
        let number = Math.random();
        let roundedNumber = Math.round(number * 100) / 100;
        return roundedNumber;
    };
};
