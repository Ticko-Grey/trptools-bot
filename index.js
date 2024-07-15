// Required Modules
import { Client, Events, GatewayIntentBits } from 'discord.js'
import 'dotenv/config'
import fs from 'fs'

// Custom Modules
import * as time from "./modules/time.js"
import * as configFile from "./modules/config.js"

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

// Establish connection
client.login(process.env.API_DISCORD)