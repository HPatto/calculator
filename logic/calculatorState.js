/*
Collection of the classes and functions facilitating the updates to
the calculator.
*/

// Abstraction of the inputted user numbers
class ScreenNumber {
    constructor() {
        this.intDigits = "";
        this.decimalDigits = "";
        this.isPositive = true;
        this.hasDecimal = false;
        this.totalDigitLimit = 21;
        this.decimalDigitLimit = 9;
    }

    addDigit(digitChar) {
        // If there is space (either total or decimal).
        if (this.spaceAvailable) {
            if (this.hasDecimal) {
                if (this.intDigits.length === 0) {
                    this.intDigits = this.intDigits.concat("0");
                }
                this.decimalDigits = this.decimalDigits.concat(digitChar);
            } else {
                this.intDigits = this.intDigits.concat(digitChar);
            }
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

    spaceAvailable() {
        let totalDigits = this.decimalDigits.length
                        + this.intDigits.length;

        return ((totalDigits < this.totalDigitLimit) &&
            (this.decimalDigits.length < this.decimalDigitLimit));
    }

    numeralsAdded() {
        return (this.intDigits.length > 0);
    }

    getFullNumber() {
        // Define an empty string, then add to it sequentially.
        let fullNumber = "";

        // Add the sign if content has been input.
        // Might be confusing, in that no (-) will show up till first
        // number is pressed, even though the state has changed.
        // Put in a highlight option?
        if (this.numeralsAdded()) {
            if (!(this.isPositive)) {
                fullNumber = fullNumber.concat("-");
            }
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

// Abstraction of the userWindow objects
class inputWindow {

}