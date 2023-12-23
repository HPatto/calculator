/*
Collection of the classes and functions facilitating the updates to
the calculator.
*/

class ScreenNumber {
    constructor() {
        this.intDigits = "";
        this.decimalDigits = "";
        this.isPositive = true;
        this.hasDecimal = false;
        this.totalLength = 0;
    }

    addDigit(digitChar) {
        // If there is space (either total or decimal).
        // console.log(digitChar);
        if (this.hasDecimal) {
            // console.log("I think it has decimals");
            this.decimalDigits = this.decimalDigits.concat(digitChar);
        } else {
            // console.log("I do not think it has decimals");
            this.intDigits = this.intDigits.concat(digitChar);
        }

        console.log("Integer part:")
        console.log(this.intDigits);
        console.log("Decimal part:")
        console.log(this.decimalDigits);
    }

    changeSign() {
        if (this.isPositive) {
            this.isPositive = false;
        } else {
            this.isPositive = true;
        }
    }

    addDecimal() {
        if (!(this.hasDecimal)) {
            this.hasDecimal = true;
        }        
    }

    getFullNumber() {
        // Define an empty string, then add to it sequentially.
        let fullNumber = "";

        // Add the sign.
        if (!(this.isPositive)) {
            fullNumber = fullNumber.concat("-");
        }

        // Add the integer portion.
        fullNumber = fullNumber.concat(this.intDigits);

        // If it is a decimal, add that content in.
        if (this.hasDecimal) {
            fullNumber = fullNumber.concat(".");
            fullNumber = fullNumber.concat(this.decimalDigits);
        }

        return fullNumber;
    }
}

// export default ScreenNumber;

// let firstNumber = new ScreenNumber();
// firstNumber.addDigit("1");
// console.log(firstNumber);