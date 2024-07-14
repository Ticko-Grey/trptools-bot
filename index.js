// Required Modules
import { Client, Events, GatewayIntentBits } from 'discord.js'
import 'dotenv/config'

// Custom Modules
import * as time from "./modules/time.js"

// Setup
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