/*
Collection of the classes and functions facilitating the updates to
the calculator.
*/

// Abstraction of the computation object, to be passed for calcs
class CalculationObject {
    constructor(firstNumber, operator, secondNumber) {
        this.firstNumber = null;
        this.operator = null;
        this.secondNumber = null;
    }

    getState() {
        return (
            this.firstNumber, 
            this.operator,
            this.secondNumber
        );
    }

    setState(firstObj, op, secondObj) {
        this.firstNumber = firstObj;
        this.operator = op;
        this.secondNumber = secondObj;
    }
}

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
        if (this.spaceAvailable()) {
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

        // console.log("Number of current decimal digits:");
        // console.log(this.digitCount(this.decimalDigits));

        // console.log("Number of current integer digits:");
        // console.log(this.digitCount(this.intDigits));

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

    // Get the int string
    getIntString() {
        return this.intDigits;
    }

    // Get the decimal string
    getDecimalString() {
        return this.decimalDigits;
    }

    // Get the decimal status
    getDecimalStatus() {
        return this.hasDecimal;
    }

}

// Abstraction of the top window
class TopWindow {
    constructor() {
        this.firstNumberObject = null;
        this.operator = "";
        this.secondNumberObject = null;
        this.evaluated = false;
    }

    getFirstNumber() {
        return this.firstNumberObject;
    }

    setFirstNumber(screenNumberObject) {
        this.firstNumberObject = screenNumberObject.getFullNumber();
    }

    getSecondNumber() {
        return this.secondNumberObject;
    }

    setSecondNumber(screenNumberObject) {
        this.secondNumberObject = screenNumberObject.getFullNumber();
    }

    getOperator() {
        return this.operator;
    }

    setOperator(operatorString) {
        this.operator = operatorString;
    }

    setEvaluated() {
        this.evaluated = true;
    }

    holdsFirstNumber() {
        return (this.firstNumberObject !== null);
    }

    holdsSecondNumber() {
        return (this.secondNumberObject !== null);
    }

    getWindowState() {
        let windowState = "";

        windowState = (
            windowState
            + this.firstNumberObject.getFullNumber()
            + " "
            + this.operator
            );
        
        if (this.evaluated) {
            windowState = (
                windowState
                + " "
                + this.secondNumber.getFullNumber()
                + " ="
            );
        }

        return windowState;
    }

}

// Abstraction of the bottom window
class BottomWindow {
    constructor() {
        this.currentNumberObject = null;
    }

    getCurrentNumber() {
        return this.currentNumberObject;
    }

    setCurrentNumber(screenNumberObject) {
        this.currentNumberObject = screenNumberObject;
    }

    holdsCurrentNumber() {
        return (this.currentNumberObject !== null);
    }

    getWindowState() {
        return this.currentNumberObject.getFullNumber();
    }
}

// Abstraction of the full window
class UserWindow {
    constructor() {
        // Instantiate the active number
        this.activeNumber = new ScreenNumber();

        // Instantiate the window objects
        this.topWindow = new TopWindow();
        this.bottomWindow = new BottomWindow();
    }

    determineUpdate(arrayOfStrings) {
        // Which update function to run?
    }

    // Update current number as appropriate with numeral
    addNumeral(numeralString) {
        this.activeNumber.addDigit(numeralString);
        this.updateBottomWindow();
    }

    // Update current number as appropriate with decimal
    addDecimal() {
        this.activeNumber.addDecimal();
        this.updateBottomWindow();
    }

    // Update current number as appropriate with character removal
    deleteChar() {
        this.activeNumber.removeChar();
        this.updateBottomWindow();
    }

    // Update the current number as appropriate with signage
    flipSign() {
        this.activeNumber.changeSign();
        this.updateBottomWindow();
    }

    // Apply the chosen operator. Variety of outcomes possible
    applyOperator(operatorString) {
        /*
        Considerations:

        - If !top and !bottom, do nothing
        - If top and bottom, eval and then apply op.
        - If bottom and !top, send that info to the top window.
        - If !bottom and top, update the op in the top window.

        Does bottom window have a number?
        Does top window have 0 / 1 / 2 numbers?
        */
       
        if (this.isCurrent() && (!this.isFirstSet() && !this.isSecondSet())) {
            // Apply operation to un-executed calculation
            
            // Send current number to the topWindow
            this.topWindow.setFirstNumber(this.currentNumberObject);

            // Send current operation to the topWindow
            this.topWindow.setOperator(operatorString);

            // Build a new currentObject number
            this.currentNumberObject = new ScreenNumber();

            // Build a new bottomWindow object
            this.bottomWindow = new BottomWindow();
        } else if (!this.isCurrent() && this.isFirstSet() && !this.isSecondSet()) {
            // Update operation for unexecuted calculation

            // Send current operation to the topWindow
            this.topWindow.setOperator(operatorString);
        } else if (this.isCurrent() && this.isFirstSet() && !this.isSecondSet()) {
            // Carry out set calculation, update with new input

            // Build calculation object with currentNum & firstNum
            let calcObject = this.buildCalcObject(this.topWindow, this.bottomWindow);

            // Get the result of the calculation
            let resultNumber = this.evaluateCalc(calcObject);

            // Create new topWindow
            this.topWindow = new TopWindow();

            // Populate it with data
            this.topWindow.setFirstNumber(resultNumber);
            this.topWindow.setOperator(operatorString);

            // Create new bottomWindow & currentNumber
            this.bottomWindow = new BottomWindow();
            this.activeNumber = new ScreenNumber();
        } else if (this.isCurrent() && this.isFirstSet() && this.isSecondSet()) {
            // Top window has the full summary
            // Bottom window has the result

            // Build a new topWindow
            this.topWindow = new TopWindow();

            // Update the top window with the result
            this.topWindow.setFirstNumber(this.bottomWindow.getCurrentNumber());

            // Build a new bottomWindow and currentNumber
            this.bottomWindow = new BottomWindow();
            this.activeNumber = new ScreenNumber();
        }
    }

    // Apply the equals operator.
    applyEquals() {
        /* 
        Equals can be applied in the following scenarios:
        1. One number up top and one number down below
        */

        // Is the current state suitable to be evaluated?
        if (this.isFirstSet() && this.isCurrent() && !this.isSecondSet()) {
            // Build the relevant calculation object
            let calcObject = this.buildCalcObject(this.topWindow, this.bottomWindow);
            
            // Get the result
            let result = this.evaluateCalc(calcObject);

            // Update the top window
            this.topWindow.setSecondNumber(this.bottomWindow.getCurrentNumber());
            this.topWindow.setEvaluated();

            // Assign new currentNumber and bottomWindow
            this.activeNumber = result;
            this.bottomWindow = new BottomWindow();

            // Update the bottom window
            this.updateBottomWindow();
        }
    }

    // Build the relevant calculation object
    buildCalcObject(topWindow, bottomWindow) {
        // Build calculation object with currentNum & firstNum
        let calculationObject = new CalculationObject(
            this.topWindow.getFirstNumber(),
            this.topWindow.getOperator(),
            this.bottomWindow.getCurrentNumber()
        );

        return calculationObject;
    }

    // Evaluate the calculation object
    evaluateCalc(calcObject) {
        
        // If not allowed, warn the user
        if (this.isDivideByZero(calcObject)) {
            snarkyMessage();
            return -1;
        }

        // Get back a resultNumber object
        return calculate(calcObject);
    }

    // Check if the firstNum in top window is set.
    isFirstSet() {
        return this.topWindow.holdsFirstNumber();
    }

    // Check if the secondNum in top window is set.
    isSecondSet() {
        return this.topWindow.holdsSecondNumber();
    }

    // Check if there is valid content in the bottom window.
    isCurrent() {
        return this.bottomWindow.holdsCurrentNumber();
    }

    // Check a calculation object for a divide by zero request
    isDivideByZero(calcObject) {
        let [op, value] = calcObject.getState().slice(1);

        // Are we dividing? If not, false
        if (!(op === "/")) {
            return false;
        }

        // Is the number 0? If not, false
        if (!(this.isZero(value))) {
            return false;
        }

        return true;
    }

    // Check if a screenNumber object is equal to 0
    isZero(numberObject) {
        // Is the int portion only zeroes?
        // Is there a decimal portion?
        // Is the decimal portion only zeroes?

        if (!(this.hasOnlyZeroes(numberObject.getIntString))) {
            return false;
        }

        if (numberObject.getDecimalStatus()) {
            if (!(this.hasOnlyZeroes(numberObject.getDecimalString))) {
                return false;
            }
        }

        return true;
    }

    // Check if a string has only 0's
    hasOnlyZeroes(digitString) {
        let digitArray = digitString.split("");

        return digitArray.every(function(digit) {
            let num = parseInt(digit);
            return (num === 0);
        })
    }

    // Reset the calculator to the default state
    resetCalc() {
        // Instantiate the active number
        this.activeNumber = new ScreenNumber();

        // Instantiate the window objects
        this.topWindow = new TopWindow();
        this.bottomWindow = new BottomWindow();
    }

    // Update status of the bottom window with current number
    updateBottomWindow() {
        this.bottomWindow.setCurrentNumber(this.activeNumber);
    }

    // Get string representation of top window
    getTopWindowState() {
        return this.topWindow.getWindowState();
    }

    // Get string representation of bottom window
    getBottomWindowState() {
        return this.bottomWindow.getWindowState();
    }
}