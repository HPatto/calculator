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
- The following functions rely on a backend that does not exist.
-- updateCalculatorState()
-- newLowerWindow()
-- newUpperWindow()
-- newAllowedActions()

Happy with the structure of this so far.
*/

// Constants
const numeral = 'numeral';
const decimal = 'decimal';
const signage = 'signage';
const operator = 'operator';
const clearall = 'clearall';
const backspace = 'backspace';

// Actions allowed within the button pad.
class AllowedActions {
    constructor(object) {
        this.allowedActions = object;
    }

    getState() {
        return this.allowedActions;
    }

    setState(object) {
        this.allowedActions = object;
    }
}

// Update the content of the calculator windows.
function updateDisplay(event, actionObject, bottomWindow, topWindow) {
    /*
    Called upon each event registered on the parent element.
    General logic flow is as follows:

    1. Take the event.

    2. Determine the button clicked.

    3. Get the allowed functions (stored in an object here?).
    I'd like this to be an object with button classes as keys,
    and a boolean value on if they are allowed.

    4. Get which button clicks are allowed.
    5. If button clicked is allowed, process request.
    ...
    n-2. Receieve updated text content for the windows.
    n-1. Set which functions are allowed to occur.
    n. Update the content of the windows.
    */

    // What element was clicked?
    const clickedElement = event.target;
    // console.log(clickedElement);


    // What button was clicked?
    let typeClicked = determineButtonPressed(clickedElement);
    
    // What buttons are currently valid inputs?
    let validButtons = getAllowedActions(actionObject);
    // console.log("Valid buttons below:");
    // console.log(validButtons);

    // let numeralStatus = validButtons[numeral];
    // console.log(numeralStatus);
    // console.log("Type clicked is " + typeClicked);
    // console.log(validButtons[typeClicked]);

    // Is the button allowed?
    let isButtonClickValid = validButtons[typeClicked];

    // If disallowed, return a warning value and do nothing.
    if (!isButtonClickValid) {
        // Not sure about best practice here. Feels neater than putting
        // everything inside a if(true) loop.
        // return -1;
        console.log("Invalid baby!");
    } else {
        console.log("Valid!");
    }

    // Pass off information to allow updates.
    // updateCalculatorState(clickedElement, typeClicked);

    // Get back new window content. Make a call to the state object.
    let newLowerWindow = false;
    let newUpperWindow = false;

    // Get updated status of permitted buttons.
    let newAllowedActions = false;

    // Update the allowed actions
    // setAllowedActions(newAllowedActions);

    // Update the display
    // setContent(bottomWindow, newLowerWindow);
    // setContent(topWindow, newUpperWindow);
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
        // console.log(DECIMAL);
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

// Get allowed actions based on current (prior to button push) state
function getAllowedActions(actionsObject) {
    // Call a function inside the userWindow class that returns
    // an object with the button values and a boolean.
    return actionsObject.getState();
}

// Set allowed actions based on current (after last button push) state
// Remove the export when testing is concluded.
 export function setAllowedActions(actionsObject, newStatus) {
    // Vibe.
    actionsObject.setState(newStatus);
}

// Set the text content of an element.
function setContent(element, stringContent) {
    element.textContent = stringContent;
}

// Initializes all the code upon start-up.
function initialize() {
    // What should the initial state of permissions be?
    let initialActions = {
        numeral: true,
        decimal: true,
        signage: false,
        operator: false,
        clearall: true,
        backspace: true,
    }

    return initialActions;
}


// Wait until DOM loaded till it is accessible
document.addEventListener('DOMContentLoaded', function() {

    // ########## Code that runs ##########

    // Object holding allowed actions for the session
    let currentlyAllowedActions = new AllowedActions(initialize());

    // Get the objects corresponding to the lower and upper windows
    let lowerWindow = document.querySelector("#lower-window");
    let upperWindow = document.querySelector("#upper-window");

    // Get the object corresponding to the calculator
    let calculator = document.querySelector('.container');

    // TESTING ELEMENTS
    let allTrue = document.querySelector('#alltrue');
    let allFalse = document.querySelector('#allfalse');

    allTrue.addEventListener('click', function () {
        setAllToTrue(currentlyAllowedActions);
    });

    allFalse.addEventListener('click', function () {
        setAllToFalse(currentlyAllowedActions);
    });
    
    // Event listener for a button clicked in the calculator
    calculator.addEventListener('click', function(event) {
        updateDisplay(event, currentlyAllowedActions,
        lowerWindow, upperWindow)
    });
});