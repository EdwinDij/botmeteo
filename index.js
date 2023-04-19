const { Client, Events, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
	const channel = client.channels.cache.find(channel => channel.name === 'meteo')
	if (channel) {
		channel.send('Bonjour ! Je vous dirais la météo ! ')
	}
	
});

client.login(process.env.TOKEN);