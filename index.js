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
	const cityName = message.content;
	const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${process.env.API_KEY}&units=metric&lang=fr`;

	const schedules = {
		'8H': { text: 'Météo de 8h', hour: 8 },
		'12H': { text: 'Météo de 12h', hour: 12 },
		'16H': { text: 'Météo de 16h', hour: 16 },
		'20H': { text: 'Météo de 20h', hour: 20 },
	};

	const schedule = schedules[interaction.customId];

	if (schedule) {
		const intervalId = setInterval(async () => {
			const date = new Date();
			const hour = date.getHours();

			if (hour === schedule.hour) {
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

				console.log(`[INFO] Sending ${schedule.text} at ${hour}h`);
				interaction.channel.send({ embeds: [embed] });
			} else {
				console.log(`[INFO] Skipping ${schedule.text} at ${hour}h`);
			}
		}, 1000 * 60 * 30);

		await interaction.reply({ content: `Météo de ${cityName.charAt(0).toUpperCase() + cityName.slice(1) } programmée à ${schedule.hour}h`, ephemeral: true });

		const intervalMap = interaction.client.intervalMap || new Map();
		const guildId = interaction.guildId || interaction.channelId;
		const intervalIds = intervalMap.get(guildId) || new Map();
		intervalIds.set(schedule.hour, intervalId);
		intervalMap.set(guildId, intervalIds);


	} else {
		return;
	}

});

client.login(process.env.TOKEN);