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

    // Add a digit to the number object.
    addDigit(digitChar) {
        // If there is space (either total or decimal).
        if (this.spaceAvailable) {
            if (this.hasDecimal) {
                this.decimalDigits = this.decimalDigits.concat(digitChar);
            } else {
                this.intDigits = this.intDigits.concat(digitChar);
            }
        }
        // console.log("Integer part:")
        // console.log(this.intDigits);
        // console.log("Decimal part:")
        // console.log(this.decimalDigits);
    }

    // Remove a digit from the digit string.
    removeDigit(digitString) {
        return digitString.slice(0, -1);
    }

    // Add a decimal to the number.
    addDecimal() {
        // If a decimal is called before any ints are input,
        // the calculator will assume "0." as the intention.
        if (this.digitCount(this.intDigits) === 0) {
            this.addDigit("0");
        }
        // Adds a decimal if it is missing. Technically not needed,
        // but I like making the condition explicit.
        if (!(this.hasDecimal)) {
            this.hasDecimal = true;
        }        
    }

    // Remove a decimal from the number.
    removeDecimal() {
        this.hasDecimal = false;
    }

    // Flip the positive / negative status of the number object.
    changeSign() {
        if (this.isPositive) {
            this.isPositive = false;
        } else {
            this.isPositive = true;
        }
    }

    // Check conditions for adding decimals.
    spaceAvailable() {
        // Get total number of digits input.
        let totalDigits = this.digitCount(this.decimalDigits)
                        + this.digitCount(this.intDigits);

        return ((totalDigits < this.totalDigitLimit) &&
            (this.digitCount(this.decimalDigits) < this.decimalDigitLimit));
    }

    // Number of digit entries.
    digitCount(digitString) {
        return digitString.length;
    }

    // Remove a character from the number object.
    removeChar() {
        // If there is nothing to remove, do nothing.
        let areDecimals = this.digitCount(this.decimalDigits) > 0;
        let areIntegers = this.digitCount(this.intDigits) > 0;

        if (areDecimals) {
            // If there are decimalDigits, remove the last one.
            this.decimalDigits = this.removeDigit(this.decimalDigits);
        } else if ((!(areDecimals)) && this.hasDecimal) {
            // If no decimalDigits but yes decFlag, turn it off.
            this.removeDecimal();
        } else if (areIntegers) {
            // If there are only intDigits, remove the last one.
            this.intDigits = this.removeDigit(this.intDigits);
        }
    }

    // Return current state of the object.
    getFullNumber() {
        // Define an empty string, then add to it sequentially.
        let fullNumber = "";

        // Add the sign iregardless.
        // Will need to ensure math is not done on "-";
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