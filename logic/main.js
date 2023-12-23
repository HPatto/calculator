/*
A JavaScript file collecting the primary functions of the calculator.
Imports make reference to classes and their methods within other files.

N.B. All inputs are handled as strings until actual math is required.
*/

// Constants
const NUMERAL = 'numeral';
const DECIMAL = 'decimal';
const SIGNAGE = 'signage';
const OPERATOR = 'operator';
const CLEARALL = 'clear-all';
const DELETE = 'delete';

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
    let clickedElement = event.target;

    // What button was clicked?
    let typeClicked = determineButtonPressed(clickedElement);
    
    // What buttons are currently valid inputs?
    let validButtons = getAllowedActions(actionObject);

    // Is the button allowed?
    let isButtonClickValid = validButtons[typeClicked];

    // If disallowed, return a warning value and do nothing.
    if (!isButtonClickValid) {
        // Not sure about best practice here. Feels neater than putting
        // everything inside a if(true) loop.
        return -1;
    }

    // Pass off information to allow updates.
    updateCalculatorState(clickedElement, typeClicked);

    // Get back new window content. Make a call to the state object.
    let newLowerWindow = false;
    let newUpperWindow = false;

    // Get updated status of permitted buttons.
    let newAllowedActions = false;

    // Update the allowed actions
    setAllowedActions(newAllowedActions);

    // Update the display
    setContent(bottomWindow, newLowerWindow);
    setContent(topWindow, newUpperWindow);
}

// Determine type of button pressed by the user.
function determineButtonPressed(element) {
    // Identifies the clicked button in the calculator.
    // Buttons are organized by CSS classes.

    let clickedElementClassList = element.classList;

    if (clickedElementClassList.contains(NUMERAL)) {
        // Button clicked is a numeral.
        return NUMERAL;
    } else if (clickedElementClassList.contains(DECIMAL)) {
        // Button clicked is the decimal point.
        return DECIMAL;
    } else if (clickedElementClassList.contains(SIGNAGE)) {
        // Button clicked is the + / - alternator.
        return SIGNAGE;
    } else if (clickedElementClassList.contains(OPERATOR)) {
        // Button clicked is an operator
        // +, -, *, /, =
        return OPERATOR;
    } else if (clickedElementClassList.contains(CLEARALL)) {
        // Button clicked is the reset button.
        return CLEARALL;
    } else if (clickedElementClassList.contains(DELETE)) {
        // Button clicked is the backspace button.
        return DELETE;
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

// Set the text content of an element.
function setContent(element, stringContent) {
    element.textContent = stringContent;
}

// Initializes all the code upon start-up.
function initialize() {
    // What should the initial state of permissions be?
    let initialActions = {
        NUMERAL: true,
        DECIMAL: true,
        SIGNAGE: false,
        OPERATOR: false,
        CLERALL: true,
        DELETE: true,
    }

    return initialActions;
}

// ########## Code that runs ##########

// Object holding allowed actions for the session
let currentlyAllowedActions = new AllowedActions(initialize());

// Get the objects corresponding to the lower and upper windows
let lowerWindow = document.querySelector("#lower-window");
let upperWindow = document.querySelector("#upper-window");

// Event listener for a button clicked in the calculator
// Should wait until DOM loaded till it is accessible
addEventListener('click', updateDisplay(e, currentlyAllowedActions,
    lowerWindow, upperWindow));