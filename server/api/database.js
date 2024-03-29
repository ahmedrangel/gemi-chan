export default defineEventHandler(async() => {
  const ImgurDiscord = process.env.ImgurDiscord;
  const select = await ImgurDiscord.prepare("SELECT * FROM imgur_discord ORDER BY timestamp DESC");
  const select_data = await select.all();
  return select_data;
});