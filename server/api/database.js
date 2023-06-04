export default defineEventHandler((event) => {
    // the type `KVNamespace` comes from the @cloudflare/workers-types package
    const ImgurDiscord = event.context.cloudflare.env.ImgurDiscord;
  
    return ImgurDiscord;
  });