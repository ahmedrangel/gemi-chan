export default ({     
  css: [
    "bootstrap/dist/css/bootstrap.min.css",
    "~/assets/css/gallery.css",
  ],
  
  js: [
    "bootstrap/dist/js/bootstrap.bundle.min.js"
  ],

  app: {
    head: {
      script: [{src: "https://cdnjs.cloudflare.com/ajax/libs/iconify/3.1.0/iconify.min.js"}]
    }
  }
})
