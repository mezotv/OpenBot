// main.js
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, REST, Routes } = require("discord.js");
const client = new Client({ intents: 33281 });
const keep_alive = require("./keep-alive.js");

// Slash commands support - add commands into the ./commands/ folder
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
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

// Event: Run slash commands
client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);
	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await console.log({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await console.log({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

// List of statuses
const statusList = [
  { type: 'PLAYING', name: 'GitHub' },
  { type: 'PLAYING', name: 'Nothing' },
  { type: 'STREAMING', name: 'Nothing' },
  { type: 'PLAYING', name: 'aerOS' },
  { type: 'PLAYING', name: 'Terminal' }
];

// Event: Run once when ready
client.on('ready', () => {
  console.log('Bot is online');

  setInterval(() => {
    const randomStatus = statusList[Math.floor(Math.random() * statusList.length)];
    client.user.setPresence({
      activity: { name: randomStatus.name },
      status: 'online',
      type: randomStatus.type
    })
      .then(console.log)
      .catch(console.error);
  }, 30 * 60 * 1000); // 30 minutes interval
}); 

// Event: Bot is ready
client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});


// Event: Reply "Hello!" if pinged
client.on("messageCreate", (message) => {
  if (message.content === "<@1141365284968607758>") {
    message.reply("Hello!");
  }
});


// Login as the bot
client.login(process.env['BOT_TOKEN']);
