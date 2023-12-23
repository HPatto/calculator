/*
A JavaScript file collecting the primary functions of the calculator.
Imports make reference to classes and their methods within other files.

N.B. All inputs are handled as strings until actual math is required.
*/

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
function updateDisplay(event, actionObject) {
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

    // What button was clicked?
    let buttonClicked = determineButtonPressed(event);
    
    // What buttons are currently valid inputs?
    let validButtons = getAllowedActions(actionObject);

    // Is the button allowed?
    let isButtonClickValid = validButtons[buttonClicked];

    // If disallowed, return a warning value and do nothing.
    if (!isButtonClickValid) {
        // Not sure about best practice here. Feels neater than putting
        // everything inside a if(true) loop.
        return -1;
    }

    // Update allowed functions

}

// Determine type of button pressed by the user.
function determineButtonPressed(event) {
    // Identifies the clicked button in the calculator.
    // Buttons are organized by CSS classes.

    // Get the clicked element and it's classes.
    let clickedElement = event.target;
    let clickedElementClassList = clickedElement.classList;

    if (clickedElementClassList.contains('numeral')) {
        // Button clicked is a numeral.
    } else if (clickedElementClassList.contains('decimal')) {
        // Button clicked is the decimal point.
    } else if (clickedElementClassList.contains('signage')) {
        // Button clicked is the + / - alternator.
    } else if (clickedElementClassList.contains('operator')) {
        // Button clicked is an operator
        // +, -, *, /, =
    } else if (clickedElementClassList.contains('clear-all')) {
        // Button clicked is the reset button.
    } else if (clickedElementClassList.contains('delete')) {
        // Button clicked is the backspace button.
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
function setAllowedActions(actionsObject) {
    // Vibe.
    actionsObject.setState();
}

// Initializes all the code upon start-up.
function initialize() {
    // What should the initial state of permissions be?
    let initialActions = {
        "numeral": true,
        "decimal": true,
        "signage": false,
        "operator": false,
        "clear-all": true,
        "delete": true,
    }

    return initialActions;
}

// ########## Code that runs ##########

// Object holding allowed actions for the session
let currentlyAllowedActions = new AllowedActions(initialize());

// Event listener for a button clicked in the calculator
addEventListener('click', updateDisplay(e, currentlyAllowedActions));
