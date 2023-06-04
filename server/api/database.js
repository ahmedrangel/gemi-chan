export default defineEventHandler(async(event) => {
    const ImgurDiscord = event.context.cloudflare.env.ImgurDiscord;
    const select = await ImgurDiscord.prepare(`SELECT * FROM imgur_discord`);
    const select_data = await select.all();
    return select_data;
  });