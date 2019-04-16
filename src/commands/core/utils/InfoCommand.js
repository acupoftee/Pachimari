"use strict";

const { Command, PachimariEmbed } = require("../../../models");
const pckg = require("../../../../package.json");

class InfoCommand extends Command {
  constructor() {
    super();

    this.name = "info";
    this.description = "Shares bot information.";
    this.usage = "info";
    this.aliases = ["botinfo"];
  }

  async execute(client, message, args) {
    let embed = new PachimariEmbed(client).setTitle("✨ Pachimari Bot Information");
    embed.setDescription("Thank you for using me as your friendly neighborhood Overwatch League pal!");
    embed.setThumbnail(client.user.avatarURL);

    embed.addFields("Version", pckg.version, true);
    // embed.addFields("Creator", "dustybutton#7350");
    embed.addFields("Users", client.users.size, true);
    embed.addFields(
        ":sos: Support Server",
        " https://discord.gg/KUg6rKz"
      );
    embed.addFields(
      ":signal_strength: Website",
      "https://acupoftee.github.io/Pachimari-Dashboard"
    );
    
    embed.addFields(
        ":heart_decoration: Invite me to your server ヾ(๑╹◡╹)ﾉ",
        "https://tinyurl.com/y48es8jw"
      );

    embed.buildEmbed().post(message.channel);
  }
}

module.exports = InfoCommand;