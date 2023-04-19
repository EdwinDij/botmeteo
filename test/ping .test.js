const { Client, Intents, FLAGS, GatewayIntentBits } = require('discord.js');
const pingCommand = require('../commands/fun/ping');

describe('ping command', () => {
  it('should respond with "Pong!"', async () => {
    const client = new Client({ intents: [GatewayIntentBits.GuildMessages ] });
    const interaction = {
      isCommand: () => true,
      commandName: 'ping',
      reply: 'Pong'
    };

    await pingCommand.execute(interaction, client);

    expect(interaction.reply).toHaveBeenCalledWith('Pong!');
  });
});

