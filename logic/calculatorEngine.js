/*
File carrying out the math for the calculator.
TO-DO:
Ensure the state of the return number contained the valid flags.
*/

// Imports
import { ScreenNumber } from "./calculatorState.js";

// Constants
const MAX_VALUE = 999999999999.999999999;
const MIN_VALUE = -999999999999.999999999;

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

    // What is the largest number of decimal places used?
    let firstHasDecimals = firstNum.getDecimalStatus();
    let secondHasDecimals = secondNum.getDecimalStatus();

    let firstDecimalCount = 0;
    let secondDecimalCount = 0;

    if (firstHasDecimals) {
        firstDecimalCount = numberOfDecimalPlaces(firstNum.getDecimalString);
    }

    if (secondHasDecimals) {
        secondDecimalCount = numberOfDecimalPlaces(secondNum.getDecimalString);
    }

    let maxDecimals = Math.max(firstDecimalCount, secondDecimalCount);

    let firstCalcNumber = constructCalcNumber(
        firstNum,
        maxDecimals,
        firstHasDecimals,
        firstDecimalCount
    );
    
    let secondCalcNumber = constructCalcNumber(
        secondNum,
        maxDecimals,
        secondHasDecimals,
        secondDecimalCount
    );

    let calcResult;

    if (op === "+") {
        calcResult = add(firstCalcNumber, secondCalcNumber);        
    } else if (op === "-") {
        calcResult = subtract(firstCalcNumber, secondCalcNumber);
    } else if (op === "*") {
        calcResult = multiply(firstCalcNumber, secondCalcNumber);
    } else if (op === "/") {
        calcResult = divide(firstCalcNumber, secondCalcNumber);
    }

    // This should return a number object, w.r.t. max and min values
    let result = convertResult(calcResult, maxDecimals);
    return result;
}

// Function to convert a BigInt result to a ScreenNumber object
function convertResult(bigIntValue, numDecimals) {
    let adjustedResult = bigIntValue / BigInt((10 ** numDecimals));

    if (adjustedResult > MAX_VALUE) {
        adjustedResult = MAX_VALUE;
    } else if (adjustedResult < MIN_VALUE) {
        adjustedResult = MIN_VALUE;
    }

    let isPositive = !(adjustedResult < 0);
    let hasDecimal = false;

    let stringResult = adjustedResult.toString();
    let resultArray = stringResult.split(".");

    if (resultArray.length > 1) {
        hasDecimal = true;        
    }

    let finalAnswer = new ScreenNumber();

    if (hasDecimal) {
        finalAnswer.addDecimal();
        finalAnswer.setDecimalDigits(resultArray[1]);
    }

    finalAnswer.setIntDigits(resultArray[0]);
    
    if (!isPositive) {
        finalAnswer.changeSign();
    }

    return finalAnswer;
}

function add(firstNum, secondNum) {
    return (firstNum + secondNum);
}

function subtract(firstNum, secondNum) {
    return (firstNum - secondNum);
}

function multiply(firstNum, secondNum) {
    return (firstNum * secondNum);
}

function divide(firstNum, secondNum) {
    return (firstNum / secondNum);
}

// Construct an "all-int" version of the input number ready for calcs.
function constructCalcNumber (
    numberObject,
    maxDecimalsInCalc,
    hasDecimals=false,
    numOfDecimals=0,
    ) {
        let intString = numberObject.getIntString();
        let intPart = constructInput(intString);

        if(!hasDecimals) {
            return (intPart * BigInt((10 ** maxDecimalsInCalc)));
        }
        
        let decimalString = numberObject.getDecimalString();
        let decPart = constructInput(decimalString);

        if (numOfDecimals === maxDecimalsInCalc) {
            return (intPart + decPart);
        } else {
            return (intPart + (decPart * BigInt((10 ** (maxDecimalsInCalc - numOfDecimals)))));
        }
}

// Convert a string of digits to BigInt format. 
function constructInput(givenString) {
    let givenInput = BigInt(givenString);
    return givenInput;
}

// Return number of d.p. used in expressing the number.
function numberOfDecimalPlaces(decimalString) {
    return decimalString.length;
}