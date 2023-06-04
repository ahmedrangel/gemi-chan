export async function onRequest(context) {
    const ps = context.env.ImgurDiscord.prepare('SELECT * imgur_discord');
    const data = await ps.first(); 
    return Response.json(data);
  }