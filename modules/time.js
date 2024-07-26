import * as configFile from "./config.js"
import storage from 'node-persist';
const config = configFile.get()

export async function getAllShifts() {
    let custom = await storage.getItem('shifts')
    if (custom) {
        custom = config.shiftTimes.concat(custom)
    } else {
        custom = config.shiftTimes
    }
    return custom
}

export async function getCustomShifts() {
    let custom = await storage.getItem('shifts')
    if (!custom) {custom = []}
    return custom
}

export async function removeCustomShift(id) {
    let custom = await storage.getItem('shifts')
    if (!custom) {custom = []}
    const shiftObjectIndex = custom.findIndex((sh) => sh.UID == id)
    custom.splice(shiftObjectIndex, 1)
    storage.setItem('shifts', custom)
}

export function getShiftTime(shiftObject, offset) {
    const currentDate = new Date()

    currentDate.setUTCDate(currentDate.getUTCDate() + (offset || 0))

    while (true) {
        if (currentDate.getUTCDay() != shiftObject.dayOfWeek) {
            currentDate.setUTCDate(currentDate.getUTCDate() + 1)
        } else {
            break
        }
    }

    currentDate.setUTCHours(shiftObject.timeUTC.split(':')[0])
    currentDate.setUTCMinutes(shiftObject.timeUTC.split(':')[1])

    // check if the shift was hosted more than 30 minutes ago, if so return a recursive function where the offset is by 1 day (to get the next occurance of it)
    const timestamp = Math.floor(currentDate.getTime() / 1000)
    const distance = timestamp - Math.floor(new Date().getTime() / 1000)

    if (distance != Math.abs(distance)) {
        if (Math.abs(distance) > 1800) {
            return getShiftTime(shiftObject, 1) 
        }
    }

    return currentDate
}

async function getNearestShift(ignoreUID, futureOnly) {
    // join the config times with the times set during runtimes
    let custom = await storage.getItem('shifts')
    if (!custom) {custom = []}
    let shiftTimes = config.shiftTimes.concat(custom)

    // get the current date
    const currentDate = new Date()
    
    // loop through to find the nearest shift
    let closest = Number.MAX_VALUE
    let nextshift = null
    shiftTimes.forEach((shift) => {
        // define variables
        const time = getShiftTime(shift)
        const timestamp = Math.floor(time.getTime() / 1000)
        const distance = timestamp - Math.floor(currentDate.getTime() / 1000)
        const absDistance = Math.abs(distance)

        if (absDistance < closest) {
            // check if this shift qualifies
            if (shift.UID == ignoreUID) return
            if (futureOnly == true) {
                if (distance != absDistance) {
                    return
                }
            }

            // if it does, apply the shift as the new closest
            closest = absDistance
            nextshift = shift
        }
    })

    // replacement shift
    const replacement = custom.find((shift) => shift.override == nextshift.UID)
    if (replacement) {
        nextshift = replacement
    }

    return nextshift
}

/* 
GetNextShift documentation:

This function returns a shift object
if futureOnly == true:
only the nearest shift hosted in the future is returned

if futureOnly == false:
includes the true nearest shift (shifts from up to an hour ago included)
this is useful for something like the begin command, which may be ran a few minutes late depending on the operator
*/
export async function getNextShift(futureOnly) {
    return await getNearestShift(0, futureOnly)
}

export async function addCustomShift(day, time, id) {
    let custom = await storage.getItem('shifts')
    if (!custom) {custom = []}
    let overrideShift = config.shiftTimes.find((shift) => shift.dayOfWeek == day && shift.timeUTC == time) || null
    if (overrideShift) {
        overrideShift = overrideShift.UID
    }

    const shiftObject = {
        dayOfWeek : day,
        timeUTC : time,
        UID : id || "Shift " + (Math.ceil(Math.random() * 1000)).toString(),
        override: overrideShift
    }

    const runTime = getShiftTime(shiftObject)
    shiftObject.expires = runTime

    custom.push(shiftObject)
    await storage.setItem('shifts', custom)
    return shiftObject
}