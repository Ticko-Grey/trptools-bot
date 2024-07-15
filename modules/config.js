import fs from 'fs'

try {
    var config = JSON.parse(fs.readFileSync('./config.json'));
} catch {
    throw new Error("could not read config.json")
}

export function get() {
    return config
}