/*
A JavaScript file collecting the primary functions of the calculator.
Imports make reference to classes and their methods within other files.

N.B. All inputs are handled as strings until actual math is required.
*/

// Imports

// ##### TESTING FUNCTIONS ##### Comment-out if in production.
import { 
    setAllToTrue,
    setAllToFalse
 } from '../test/testing.js';

/* TO-DO LIST
I'm sure there's a better way to do it, but for now, it's a list here.
-- Check all imports and functions being passed around.

*/

// Constants
const numeral = 'numeral';
const decimal = 'decimal';
const signage = 'signage';
const operator = 'operator';
const clearall = 'clearall';
const backspace = 'backspace';

// Update the content of the calculator windows.
function updateDisplay(event, bottomWindow, topWindow, calculatorObject) {
    /*
    Called upon each event registered on the parent element.
    General logic flow is as follows:

    1. Take the event. (DONE)
    2. Determine the button clicked. (DONE)
    3. Process request. (DONE)
    ...
    n-1. Receieve updated text content for the windows.
    n. Update the content of the windows.
    */

    // What element was clicked?
    const clickedElement = event.target;
    
    // What button was clicked?
    let typeClicked = determineButtonPressed(clickedElement);

    // Pass off information to allow updates.
    updateCalculatorState(calculatorObject, clickedElement, typeClicked);

    // Get back new window content. Make a call to the state object.
    let newLowerWindow = calculatorObject.getBottomWindowState();
    let newUpperWindow = calculatorObject.getTopWindowState();

    // Update the display
    setContent(bottomWindow, newLowerWindow);
    setContent(topWindow, newUpperWindow);
}

// Determine type of button pressed by the user.
function determineButtonPressed(element) {
    // Identifies the clicked button in the calculator.
    // Buttons are organized by CSS classes.

    let clickedElementClassList = element.classList;

    if (clickedElementClassList.contains(numeral)) {
        // Button clicked is a numeral.
        return numeral;
    } else if (clickedElementClassList.contains(decimal)) {
        // Button clicked is the decimal point.
        return decimal;
    } else if (clickedElementClassList.contains(signage)) {
        // Button clicked is the + / - alternator.
        return signage;
    } else if (clickedElementClassList.contains(operator)) {
        // Button clicked is an operator
        // +, -, *, /, =
        return operator;
    } else if (clickedElementClassList.contains(clearall)) {
        // Button clicked is the reset button.
        return clearall;
    } else if (clickedElementClassList.contains(backspace)) {
        // Button clicked is the backspace button.
        return backspace;
    }
    // If the click was anything else, take no action.
}

// Update the calculator
function updateCalculatorState(calcObject, element, typeClicked) {
    calcObject.determineUpdate(typeClicked, element);
}

// Set the text content of an element.
function setContent(element, stringContent) {
    element.textContent = stringContent;
}

// Wait until DOM loaded till it is accessible
document.addEventListener('DOMContentLoaded', function() {

    // ########## Code that runs ##########

    // Object representing the user window
    let userWindow = new UserWindow();

    // Get the objects corresponding to the lower and upper windows
    let lowerWindow = document.querySelector("#lower-window");
    let upperWindow = document.querySelector("#upper-window");

    // Get the object corresponding to the calculator
    let calculator = document.querySelector('.container');
    
    // Event listener for a button clicked in the calculator
    calculator.addEventListener('click', function(event) {
        updateDisplay(event, lowerWindow, upperWindow, userWindow)
    });
});