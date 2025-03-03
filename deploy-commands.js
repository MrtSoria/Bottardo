require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { REST, Routes } = require('discord.js');

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log(`Comenzaron a actualizarse ${commands.length} comandos (/).`);

        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands }
        ).then(() => {
            console.log(`Se actualizaron con exito ${commands.length} comandos (/).`);
        })
    } catch (error) {
        console.error(error);
    }  
})();