// TESTING FUNCTIONS

// Need to import functions to make it work.
import {
    setAllowedActions
} from '../logic/main.js';

// Set all values in actionsObject to true
export function setAllToTrue(actionObject) {
    let initialActionsAllTrue = {
        numeral: true,
        decimal: true,
        signage: true,
        operator: true,
        clearall: true,
        backspace: true,
    }
    setAllowedActions(actionObject, initialActionsAllTrue);
}

// Set all values in actionsObject to false
export function setAllToFalse(actionObject) {
    let initialActionsAllFalse = {
        numeral: false,
        decimal: false,
        signage: false,
        operator: false,
        clearall: false,
        backspace: false,
    }
    setAllowedActions(actionObject, initialActionsAllFalse);
}