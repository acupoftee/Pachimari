const { Command, PachimariEmbed } = require('../../../models');
const { MessageUtil } = require('../../../utils');

class HelpCommand extends Command {
    constructor() {
        super();
        this.name = 'help';
        this.description = 'List available commands.';
        this.usage = 'help [command]';
        this.aliases = [];
    }

    async execute(client, message, args) {
        let embed = new PachimariEmbed(client);
        message.channel.startTyping();

        if (args.length <= 0) {
            embed.setTitle('Commands');
            embed.setDescription(`Use The Command Format \`\`!help <command>\`\` for more information.`);
            let cmds = [];

            client.commands.forEach(command => {
                cmds.push(`**!${command.name}**:\t${command.description}`);
            });
            embed.addFields('Descriptions', cmds);
            embed.buildEmbed().post(message.channel);
            message.channel.stopTyping();
        } else {
            const command = args[0].toLowerCase();
            if (!client.commands.has(command))
                return;
            const cmd = client.commands.get(command);
            embed.setTitle(MessageUtil.capitalize(cmd.name) + ' Command');
            embed.setDescription(cmd.description);
            embed.addFields('Usage', `!${cmd.usage}`);
            embed.buildEmbed().post(message.channel);
            message.channel.stopTyping();
        }
    }
}
module.exports = HelpCommand;