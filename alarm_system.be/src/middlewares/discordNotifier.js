const axios = require("axios");

const sendDiscordNotification = async (message) => {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn("DISCORD_WEBHOOK_URL is not set in environment variables");
    return;
  }

  try {
    await axios.post(webhookUrl, {
      content: message,
    });
  } catch (error) {
    console.error("Error sending Discord notification:", error.message);
  }
};

module.exports = { sendDiscordNotification };
