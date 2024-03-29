  const { describe, expect, test } = require('@jest/globals');
const { Client, GatewayIntentBits  } = require('discord.js');
require('dotenv').config();

describe('Client', () => {
  let client;

  beforeEach(() => {
    client = new Client({ intents: [GatewayIntentBits.Guilds] });
  });


  it('shoudl log in and emit ready evant', async () => {
    const readyPromise = new Promise((resolve) => {
      client.once('ready', () => {
   
        resolve();
      });
    });

    await client.login(process.env.TOKEN);
    await readyPromise;

    expect(client.user?.tag).toBeDefined();
    console.log(`Logged in as ${client.user?.tag}`)
  });

  afterAll(async () => {
    await client.destroy();
  })
});