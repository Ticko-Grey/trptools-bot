import { EmbedBuilder } from 'discord.js'
import { addCustomShift, getShiftTime } from '../time.js'

const timeValidator = /^(?:[01]\d|2[0-3]):[0-5]\d$/;

const daymap = [
    { "names" : ['sun', 'sunday'], "num" : 0 },
    { "names" : ['mon', 'monday'], "num" : 1 },
    { "names" : ['tue', 'tuesday'], "num" : 2 },
    { "names" : ['wed', 'wednesday'], "num" : 3 },
    { "names" : ['thu', 'thursday'], "num" : 4 },
    { "names" : ['fri', 'friday'], "num" : 5 },
    { "names" : ['sat', 'saturday'], "num" : 6 }
]

export async function createshift(interaction) {
    const time = interaction.fields.getTextInputValue('time');
    const dow = interaction.fields.getTextInputValue('dayofweek');
    const uid = interaction.fields.getTextInputValue('name');

    let dayOfWeek = daymap.find((day) => day.names.find((name) => name == dow.toLowerCase()))
    const timeValid = timeValidator.test(time)

    if (!dayOfWeek || !timeValid) {
        const embedResponse = new EmbedBuilder()
        .setColor(0xa83232)
        .setTitle('Error')
        .setDescription('The input you provided is invalid')
    
        interaction.reply({
            embeds : [ embedResponse ],
            ephemeral: true
        })

        return
    }
    
    const shiftObject = addCustomShift(dayOfWeek.num, time, uid)
    const shiftTime = getShiftTime(shiftObject)

    const embedResponse = new EmbedBuilder()
    .setColor(0x69f079)
    .setTitle('Shift scheduled successfully')
    .setDescription(`Shift **${shiftObject.UID}** has been scheduled for <t:${Math.floor(shiftTime.getTime() / 1000)}:f>`)

    interaction.reply({
        embeds : [ embedResponse ]
    })
}