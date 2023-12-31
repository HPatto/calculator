/*
File carrying out the math for the calculator.
TO-DO:
Ensure the state of the return number contained the valid flags.
*/

// Imports
import { ScreenNumber } from "./calculatorState.js";

// Constants
const MAX_INT_VALUE = 999999999999;
const MIN_INT_VALUE = -999999999999;
const MAX_DEC_VALUE = 999999999;

class CalculationNumber {
    constructor (screenNumber) {
        // Initial object
        this.screenNumber = screenNumber;

        // Booleans related to input number
        this.hasDecimals = screenNumber.getDecimalStatus();
        this.isPositive = screenNumber.getPositive();

        // Figures related to input number
        this.decimalCount =  this.numberOfDecimalPlaces(screenNumber.getDecimalString())
        
        // BigInt representation of ScreenNumber input
        this.intIntermediateNumberBig = this.setIntIntermediateNumber();
        this.decimalIntermediateNumberBig = this.setDecimalIntermediateNumber();

        // BigInt representation of CalcNumber to use
        this.calcNumberBig = this.setCalculationNumber();

        // Was a delta used?
        this.delta = 0;
    }

    // Return number of d.p. used in expressing the number.
    numberOfDecimalPlaces(decimalString) {
        return decimalString.length;
    }

    getDecimalCount() {
        return this.decimalCount;
    }

    individualAdjuster() {
        return BigInt(10 ** (this.decimalCount));
    }

    overallAdjuster(delta) {
        return BigInt(10 ** delta);
    }

    adjustForOther(otherDecimalCount) {
        this.delta = otherDecimalCount - this.decimalCount;
        if (this.delta > 0) {
            this.adjustIntermediateProperties(this.overallAdjuster(this.delta));      
            this.calcNumberBig = this.setCalculationNumber();      
        }
    }

    setIntIntermediateNumber () {
        let intScreenBig = BigInt(this.screenNumber.getIntString());
        intScreenBig = intScreenBig * this.individualAdjuster();
        return intScreenBig;
    }

    adjustIntermediateProperties (adjustBig) {
        this.intIntermediateNumberBig = this.intIntermediateNumberBig * adjustBig;
        this.decimalIntermediateNumberBig = this.decimalIntermediateNumberBig * adjustBig;
    }

    setDecimalIntermediateNumber () {
        let decimalScreenBig = BigInt(this.screenNumber.getDecimalString());
        // decimalScreenBig  = decimalScreenBig * this.individualAdjuster();
        return decimalScreenBig;
    }

    setCalculationNumber () {
        return (
            this.intIntermediateNumberBig +
            this.decimalIntermediateNumberBig
        );
    }

    setSign() {
        if (!this.isPositive) {
            this.calcNumberBig = this.calcNumberBig * BigInt(-1);
        }
    }

    getCalculationNumber() {
        return this.calcNumberBig;
    }

    getPositive() {
        return this.isPositive;
    }
}

export function calculate(calculationObject) {
    /*
    A calculation object contains:

    - 2x ScreenNumber objects
    - 1x Operator

    Operator considers which evaluation to run.
    Define constants for the max / min values.

    Integers and decimals considered specifically. Each math function
    may demand separate or complete co-operation.
    */

    // Grab all the relevant objects
    let [firstNum, op, secondNum] = calculationObject.getState();

    // Initialize the objects to hold the calc numbers
    let firstCalc = new CalculationNumber(firstNum);
    let secondCalc = new CalculationNumber(secondNum);

    // Adjust to ensure the calculation OoM works
    // firstCalc.adjustForOther(secondCalc.getDecimalCount());
    // secondCalc.adjustForOther(firstCalc.getDecimalCount());

    // Set the number of decimals expected
    let decimalsInResult = decimalsRequired(firstCalc, secondCalc, op);

    // Initialize variable to hold sign for product operations
    let resultIsPositive;

    // Initialize variable to hold BigInt calculation result.
    let calcResult;

    // Send the objects off to be calculated
    if (op === "+") {
        // Perform the addition on the two inputs
        // Adjust to ensure the calculation OoM works
        firstCalc.adjustForOther(secondCalc.getDecimalCount());
        secondCalc.adjustForOther(firstCalc.getDecimalCount());
        adjustSign(firstCalc, secondCalc);
        calcResult = add(firstCalc, secondCalc);        
    } else if (op === "-") {
        // Perform the subtraction on the two inputs
        // Adjust to ensure the calculation OoM works
        firstCalc.adjustForOther(secondCalc.getDecimalCount());
        secondCalc.adjustForOther(firstCalc.getDecimalCount());
        adjustSign(firstCalc, secondCalc);
        calcResult = subtract(firstCalc, secondCalc);
    } else if (op === "*") {
        // Perform the multiplication on the two inputs
        resultIsPositive = finalSignPositive(firstCalc, secondCalc);
        calcResult = multiply(firstCalc, secondCalc);
    } else if (op === "/") {
        // Perform the division on the two inputs
        firstCalc.adjustForOther(secondCalc.getDecimalCount());
        secondCalc.adjustForOther(firstCalc.getDecimalCount());
        resultIsPositive = finalSignPositive(firstCalc, secondCalc);
        return divide(firstCalc, secondCalc, resultIsPositive);
    }

    /*
    What do we pass in to calculate the final number?
    - BigInt number
    - Number of decimals required
    - op
    - resultIsPositive

    If it was add / subtract, the result will contain the correct sign.
    If negative, that will need to be removed and a flag added to change
    the sign.
    If positive, all good.

    If it was a product, the result will not contain the correct sign.
    It will, however, contain the correct values.
    Add the flag, all good.
    */

    // Return a number object, w.r.t. max and min values
    let result = convertResult(
        calcResult,
        decimalsInResult,
        op,
        resultIsPositive);
    
    return result;
}

// Function to convert a BigInt value + other parameters
// to a ScreenNumber object for return.
function convertResult(bigIntValue, numDecimals, operation, positive) {

    if (operation === "+" || operation === "-") {
        return convertLinear(bigIntValue, numDecimals);
    } else {
        return convertProduct(bigIntValue, numDecimals, positive);
    }
}

function convertLinear(bigIntValue, numDecimals) {
    let resultString = bigIntValue.toString();
    let decimalString = resultString.slice(resultString.length - numDecimals);
    let intString = resultString.slice(0, resultString.length - numDecimals);

    let decimalsFound = decimalString.length;
    let needToAddDecimalZeroes = (decimalsFound < numDecimals);

    if (needToAddDecimalZeroes) {
        let decimalsToAdd = numDecimals - decimalsFound;
        let extraString = "";

        for (let i = 0; i < decimalsToAdd; i++) {
            extraString = extraString.concat("0");
        }
        decimalString = extraString + decimalString;
    }

    if (intString.length === 0 || (
        intString.length === 1 &&
        intString[0] === "-")) {
            intString = intString + "0";
    }

    let intValue = parseInt(intString);

    let isPositive = (intString[0] !== "-");
    let hasDecimals = (numDecimals > 0);
    
    if (intValue > MAX_INT_VALUE) {
        intString = "" + MAX_INT_VALUE;
        decimalString = "" + MAX_DEC_VALUE;
        hasDecimals = true;
    } else if (intValue < MIN_INT_VALUE) {
        intString = "" + MIN_INT_VALUE;
        decimalString = "" + MAX_DEC_VALUE;
        hasDecimals = true;
    }

    let resultObject = new ScreenNumber();

    if (isPositive) {
        resultObject.setIntDigits(intString);
    } else {
        // Remove the negative character from the string
        intString = intString.slice(1);
        resultObject.setIntDigits(intString);
        // Change the boolean in the object
        resultObject.changeSign();
    }

    if (hasDecimals) {
        resultObject.addDecimal();
    }

    resultObject.setDecimalDigits(decimalString);
    return resultObject;
}

function convertProduct(bigIntValue, numDecimals, isPositive) {
    let resultString = bigIntValue.toString();
    let intString = "";
    let decimalString;

    if (numDecimals >= resultString.length) {
        decimalString = resultString;
        for (let i = 0; i < numDecimals - resultString.length; i++) {
            decimalString = "0" + decimalString;
        }
    } else {
        decimalString = resultString.slice(resultString.length - numDecimals);
        intString = resultString.slice(0, resultString.length - numDecimals);
    }

    if (intString.length === 0 || (
        intString.length === 1 &&
        intString[0] === "-")) {
            intString = intString + "0";
    }

    let intValue = parseInt(intString);

    let hasDecimals = (numDecimals > 0);
    
    if (intValue > MAX_INT_VALUE) {
        intString = "" + MAX_INT_VALUE;
        decimalString = "" + MAX_DEC_VALUE;
        hasDecimals = true;
    } else if (intValue < MIN_INT_VALUE) {
        intString = "" + MIN_INT_VALUE;
        decimalString = "" + MAX_DEC_VALUE;
        hasDecimals = true;
    }

    let resultObject = new ScreenNumber();

    resultObject.setIntDigits(intString);

    if (!isPositive) {
        resultObject.changeSign();
    }

    if (hasDecimals) {
        resultObject.addDecimal();
    }

    resultObject.setDecimalDigits(decimalString);
    return resultObject;
}

function add(firstNum, secondNum) {
    return (
        firstNum.getCalculationNumber() +
        secondNum.getCalculationNumber()
        );
}

function subtract(firstNum, secondNum) {
    return (
        firstNum.getCalculationNumber() -
        secondNum.getCalculationNumber()
        );
}

function multiply(firstNum, secondNum) {
    return (
        firstNum.getCalculationNumber() *
        secondNum.getCalculationNumber()
        );
}

function divide(firstNum, secondNum, isPositive) {
    // Dividing is === multiplying * (1 / divisor)
    let quotient = (
        firstNum.getCalculationNumber() /
        secondNum.getCalculationNumber()
    );

    let remainder = (
        firstNum.getCalculationNumber() %
        secondNum.getCalculationNumber()
    );

    let remainderDecimal = (
        parseFloat(remainder) /
        parseFloat(secondNum.getCalculationNumber())
    );

    // Build the parameters for a ScreenNumber object
    let intString = quotient.toString();
    let unalteredDecimalString = remainderDecimal.toString();
    let decimalString = unalteredDecimalString.slice(2, Math.min(
        unalteredDecimalString.length,
        11 // Magic number bad - 9 maximum + the slice off the front.
    ));

    let hasDecimals = (decimalString.length > 0);

    if (quotient > MAX_INT_VALUE) {
        intString = "" + MAX_INT_VALUE;
        decimalString = "" + MAX_DEC_VALUE;
        hasDecimals = true;
    } else if (quotient < MIN_INT_VALUE) {
        intString = "" + MIN_INT_VALUE;
        decimalString = "" + MAX_DEC_VALUE;
        hasDecimals = true;
    }

    let resultObject = new ScreenNumber();

    resultObject.setIntDigits(intString);

    if (!isPositive) {
        resultObject.changeSign();
    }

    if (hasDecimals) {
        resultObject.addDecimal();
    }

    resultObject.setDecimalDigits(decimalString);
    return resultObject;
}

function adjustSign(firstCalcNumber, secondCalcNumber) {
    firstCalcNumber.setSign();
    secondCalcNumber.setSign();
}

function finalSignPositive(firstCalcNumber, secondCalcNumber) {
    let firstSignPositive = firstCalcNumber.getPositive();
    let secondSignPositive = secondCalcNumber.getPositive();

    if (firstSignPositive === secondSignPositive) {
        return true;
    } else {
        return false;
    }
}

function decimalsRequired(firstObj, secondObj, operation) {
    let firstCount = firstObj.getDecimalCount();
    let secondCount = secondObj.getDecimalCount();

    if (operation === "+" || operation === "-") {
        return Math.max(firstCount, secondCount);
    } else if (operation === "*" || operation === "/") {
        return (firstCount + secondCount);
    }
}