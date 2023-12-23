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
        if (decimalSpace && totalSpace) {
            if (this.hasDecimal) {
                this.decimalDigits.concat(digitChar);
            } else {
                this.intDigits.concat(digitChar);
            }
        }

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
            fullNumber.concat("-");
        }

        // Add the integer portion.
        fullNumber.concat(this.intDigits);

        // If it is a decimal, add that content in.
        if (this.hasDecimal) {
            fullNumber.concat(".");
            fullNumber.concat(this.decimalDigits);
        }

        return fullNumber;
    }
}

let firstNumber = new ScreenNumber();