import * as configFile from "./config.js"
const config = configFile.get()

let custom = []

export function getAllShifts() {
    return config.shiftTimes.concat(custom)
}

export function getCustomShifts() {
    return custom
}

export function removeCustomShift(id) {
    const shiftObjectIndex = custom.findIndex((sh) => sh.UID == id)
    custom.splice(shiftObjectIndex, 1)
}

function getNearestShift(ignoreUID) {
    // join the config times with the times set during runtimes
    let shiftTimes = config.shiftTimes.concat(custom)

    // get the current date
    const currentDate = new Date()
    const currentDayOfWeek = currentDate.getUTCDay()
    const currentHours = currentDate.getUTCHours()

    // sort to find the next day a shift is hosted 
    let nextshift = shiftTimes.find((shift) => shift.dayOfWeek >= currentDayOfWeek && shift.UID != ignoreUID)
    if (!nextshift) { // if its the end of the week, no future shifts in the cycle will be found, so just select the first one 
        nextshift = shiftTimes.reduce((prev, curr) => prev.dayOfWeek < curr.dayOfWeek ? prev : curr);
    }

    // recursive function for trying again if a shift already happened on the selected day
    if (nextshift.dayOfWeek == currentDayOfWeek && nextshift.timeUTC.split(':')[0] <= currentHours) {
        nextshift = getNearestShift(nextshift.UID)
    }
    return JSON.stringify(nextshift)
}

export function getShiftTime(shiftObject) {
    const currentDate = new Date()

    while (true) {
        if (currentDate.getUTCDay() != shiftObject.dayOfWeek) {
            currentDate.setUTCDate(currentDate.getUTCDate() + 1)
        } else {
            break
        }
    }

    currentDate.setUTCHours(shiftObject.timeUTC.split(':')[0])
    currentDate.setUTCMinutes(shiftObject.timeUTC.split(':')[1])

    return currentDate
}

export function getNextShift() {
    return getNearestShift(0)
}

export function addCustomShift(day, time, id) {
    const shiftObject = {
        dayOfWeek : day,
        timeUTC : time,
        UID : id || "Shift " + (Math.ceil(Math.random() * (100 - 16) + 16)).toString()
    }

    const runTime = getShiftTime(shiftObject)
    shiftObject.expires = runTime

    custom.push(shiftObject)
    return shiftObject
}