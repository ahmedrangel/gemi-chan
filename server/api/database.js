export default defineEventHandler((event) => {
    const ImgurDiscord = event.context.cloudflare.env.ImgurDiscord;
    (async() => {
    const select = await ImgurDiscord.prepare(`SELECT * FROM imgur_discord`);
    const select_data = await select.all();
    return select_data;
    });
  });