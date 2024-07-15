import * as configFile from "./config.js"
const config = configFile.get()

function getNearestShift(ignoreUID) {
    // get the current date
    const currentDate = new Date()
    const currentDayOfWeek = currentDate.getUTCDay()
    const currentHours = currentDate.getUTCHours()

    // sort to find the next day a shift is hosted 
    let nextshift = config.shiftTimes.find((shift) => shift.dayOfWeek >= currentDayOfWeek && shift.UID != ignoreUID)
    if (!nextshift) { // if its the end of the week, no future shifts in the cycle will be found, so just select the first one 
        nextshift = config.shiftTimes.reduce((prev, curr) => prev.dayOfWeek < curr.dayOfWeek ? prev : curr);
    }

    // recursive function for trying again if a shift already happened on the selected day
    if (nextshift.dayOfWeek == currentDayOfWeek && nextshift.timeUTC.split(':')[0] <= currentHours) {
        nextshift = getNearestShift(nextshift.UID)
    }
    return JSON.stringify(nextshift)
}

export function getNextShift() {
    return getNearestShift(0)
}