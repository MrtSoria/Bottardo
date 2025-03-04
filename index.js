require('dotenv').config();
const fs = require('fs');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { Player, useMainPlayer } = require('discord-player');
const { YoutubeiExtractor } = require('discord-player-youtubei');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates
    ]
});

//Coleccion para guardar los comandos
client.commands = new Collection();

//Creacion del reproductor
const player = new Player(client);

//Manejo de errores del player
player.events.on('error', (queue, error) => {
    console.error(`[Error de la cola]: ${error.message}`);
})

//Manejo de errores del player
player.events.on('playerError', (queue, error) => {
    console.error(`[Error del reproductor]: ${error.message}`);
})

//Creacion del extractor
player.extractors.register(YoutubeiExtractor, {});

//Cargar comandos
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    if ('data' in command && 'run' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[ADVERTENCIA]: el comando en ${filePath} no tiene la estructura correcta.`);
    }
}

//Ejecucion de comando
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;
    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) interaction.reply(`El comando ${interaction.commandName} no existe.`);

    await command.run(interaction).catch(async error => {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'Hubo un error al ejecutar el comando.', ephemeral: true });
        } else {
            await interaction.reply({ content: 'Hubo un error al ejecutar el comando.', ephemeral: true });
        }
    });
});

//Evento de inicio
client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.login(process.env.TOKEN);