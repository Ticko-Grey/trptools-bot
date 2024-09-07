import * as configFile from "../config.js";
import storage from 'node-persist';
const config = configFile.get();
import { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from 'discord.js';

async function updateEmbed(message, storage) {
    let fields = []
    Object.keys(storage.positions).forEach((k) => { // need to update the embed fields
        let slotValue = null
        if (storage.vacancy[k]) {
            slotValue = `<@${storage.vacancy[k]}>`
        } else {
            slotValue = "Empty"
        }
        fields.push({name: k, value: slotValue, inline: false})
    })

    const embed = new EmbedBuilder()
        .setColor(storage.color)
        .setTitle(storage.strings.title)
        .setDescription(storage.strings.description)
        .addFields(fields)


    message.edit({
        embeds : [ embed ]
    })
}

function responseEmbed(interaction, title, color, message) {
    const embedResponse = new EmbedBuilder()
    .setColor(color)
    .setTitle(title)
    .setDescription(message)

    interaction.reply({
        embeds : [ embedResponse ],
        ephemeral: true
    })
}

export async function staffsignup(interaction, client) {
    // define things and grab values
    const selection = interaction.values[0]
    const interactionStorage = await storage.getItem(interaction.message.id + '_interaction')
    const vacancy = interactionStorage.vacancy[selection]

    // check if the current slot is occupied (and by who)
    if (vacancy) {
        if (interactionStorage.vacancy[selection] == interaction.user.id) { // remove slot
            interactionStorage.vacancy[selection] = null
            storage.setItem(interaction.message.id + '_interaction', interactionStorage)

            updateEmbed(interaction.message, interactionStorage)
            responseEmbed(interaction, "Removed from shift slot", interactionStorage.color, `Removed from slot **${selection}**`)
        } else { // slot taken by someone else
            responseEmbed(interaction, "Slot already taken", interactionStorage.color, `Slot **${selection}** is already taken by <@${vacancy}>`)
        }
        return
    }

    // check if the current user is signed up for any other slot
    let haveslot = null
    Object.keys(interactionStorage.vacancy).forEach((k) => {
        if (interactionStorage.vacancy[k] == interaction.user.id) {
            haveslot = k
        }
    })
    if (haveslot) {
        responseEmbed(interaction, "Slot already taken", interactionStorage.color, `You have already taken the **${haveslot}** slot, select it again to remove yourself`)
        return
    }

    // set this slot as occupied
    interactionStorage.vacancy[selection] = interaction.user.id
    storage.setItem(interaction.message.id + '_interaction', interactionStorage)

    // edit embed
    updateEmbed(interaction.message, interactionStorage)
    responseEmbed(interaction, "Signed up for shift", interactionStorage.color, `Signed up for **${selection}** slot`)
}