export default defineEventHandler((event) => {
    // the type `KVNamespace` comes from the @cloudflare/workers-types package
    const ImgurDiscord = event.context.cloudflare.env.ImgurDiscord;
    (async() => {
    const select = await ImgurDiscord.prepare(`SELECT * FROM imgur_discord`);
    const select_data = await select.all();
    return select_data;
    });
  });