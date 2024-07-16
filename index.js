// Required Modules
import { Client, Events, GatewayIntentBits, Routes, REST } from 'discord.js'
import 'dotenv/config'
import fs from 'fs'

// Custom Modules
import * as time from "./modules/time.js"
import * as configFile from "./modules/config.js"
import * as commands from "./modules/commands/index.js"
import * as interactionHandlers from "./modules/interactions/index.js"

// Setup
const config = configFile.get()

const client = new Client({
     intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessagePolls,
        GatewayIntentBits.GuildMessageReactions,
    ] 
});

const rest = new REST({ version: '10' }).setToken(process.env.API_DISCORD);
rest.put(Routes.applicationCommands(process.env.CID_DISCORD), { body: config.commands });

// Connect slash commands
client.on("interactionCreate", (interaction) => {
  if (interaction.isChatInputCommand()) {
    // load command
    const func = commands[interaction.commandName]
    if (!func) { // handle error if command doesnt exist
      interaction.reply({
        content: "Could not fetch command",
        ephemeral: true
      })
      return
    }

    // run command
    func(interaction)
  } else if (interaction.isModalSubmit) {
    // load interaction handler
    const func = interactionHandlers[interaction.customId]
    if (!func) { // handle error if command doesnt exist
      interaction.reply({
        content: "Could not fetch interaction handler",
        ephemeral: true
      })
      return
    }

    // handle interaction
    func(interaction)
  }
});

// Establish connection
client.login(process.env.API_DISCORD)