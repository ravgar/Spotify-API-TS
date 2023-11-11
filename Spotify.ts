const { Client, Message, Intents } = "discord.js";
const { SpotifyAPI } = "spotify-web-api-node";
const { Redis } = "ioredis";

const spotifyClient = new SpotifyAPI({
  clientId: "SpotifyAPI İD",
  clientSecret: "SpotifyAPI Secret",
});


const redis = new Redis({
  host: "localhost",
  port: 6379,
});

client.on("message", async (message: Message) => {
  if (message.content.startsWith("!rgeç")) {
    await spotifyClient.playNextTrack();
  } else if (message.content.startsWith("!rgeri")) {
    await spotifyClient.playPreviousTrack();
  } else if (message.content.startsWith("!rdurdur")) {
    await spotifyClient.pause();
  } else if (message.content.startsWith("!rşarkı")) {
    const parça = await spotifyClient.searchTracks(message.content);
    message.channel.send(parça.items[0].name);
  }
});

client.on("message", async (message: Message) => {
  const parça = await spotifyClient.getTrack(message.content);

  const anahtar = `${message.author.id}:dinlenilentümşarkılar`;
  redis.set(anahtar, JSON.stringify(parça));

  let rtop5 = await redis.get("ençokdinlenen5parça");
  if (rtop5 === null) {
    rtop5 = [];
  }
  rtop5.push(parça);
  rtop5.sort((a, b) => b.playedAt - a.playedAt);
  redis.set("ençokdinlenen5parça", JSON.stringify(rtop5));

  message.channel.send(
    "En Çok Dinlenilen 5 Şarkı\n" +
    rtop5
      .map((parça) => parça.name)
      .join("\n")
  );
});
