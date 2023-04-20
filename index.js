const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, GuildChannelManager } = require('discord.js');
const axios = require('axios')
require('dotenv').config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

client.once(Events.ClientReady, () => {
	console.log('Ready!');
});


client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isButton()) return;
	const message = await interaction.channel.messages.fetch(interaction.message.id);
	const date = new Date();
	const hour = date.getHours();
	const url = `https://api.openweathermap.org/data/2.5/weather?q=${message.content}&appid=${process.env.API_KEY}&units=metric&lang=fr`;
	const response = await axios.get(url);
	const data = response.data;
	const embed = {
		color: 0x9900FF,
		title: `Météo de ${data.name}`,
		description: `Il fait actuellement ${data.main.temp}°C à ${data.name}.`,
		fields: [
			{
				name: "Température ressentie",
				value: `${data.main.feels_like}°C`,
				inline: true
			},
			{
				name: "Température minimale",
				value: `${data.main.temp_min}°C`,
				inline: true
			},
			{
				name: "Température maximale",
				value: `${data.main.temp_max}°C`,
				inline: true
			}
		],
};
	if (interaction.customId === '8H') {
		url
		setInterval(()=> {
			if (hour === 8) {
				interaction.channel.send({ embeds: [embed] });
			}
		}, 1000 * 60 * 60)
		await interaction.reply({ content: 'Météo de 8h', ephemeral: true });
	} else if (interaction.customId === '12H') {
		setInterval(() => {
			if (hour === 12) {
			interaction.channel.send({ embeds: [embed] });
		}
		})
		await interaction.reply({ content: 'Météo de 12h', ephemeral: true });
	} else 
	if (interaction.customId === '16H') {
		setInterval(() => {
		
		if (hour === 16) {
			interaction.channel.send({ embeds: [embed] });
		}
		});
		await interaction.reply({ content: 'Météo de 16h', ephemeral: true });
	} else if (interaction.customId === '20H'){ 
		setInterval(()=> {
			if (hour === 20) {
				interaction.channel.send({ embeds: [embed] });
			}
		})
		await interaction.reply({ content: 'Météo de 20h', ephemeral: true });
	} else{
		return;
	}
});

client.login(process.env.TOKEN);