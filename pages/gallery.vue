<script setup>
const { data: results } = await useFetch("/api/database");
const db = JSON.parse(JSON.stringify(results.value.results));

const CapitalizeFirstLetter = (string) => {
  if (string !== null) {
    const flc = string.replace(/^\w/, c => c.toUpperCase()); 
    return flc;
  }
};

const getDateFromTimeStamp = (timestamp) => {
  if (timestamp !== null) {
    timestamp = timestamp * 1000;
    const nombresMeses = [
        "enero", "febrero", "marzo", "abril", "mayo", "junio",
        "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
      ];
    const fecha = new Date(timestamp);
    let dia = fecha.getDate();
    const mes = fecha.getMonth() + 1;
    const anio = fecha.getFullYear();
    let horas = fecha.getHours();
    let minutos = fecha.getMinutes();

    const nombreMes = nombresMeses[mes - 1];
    
    const amPm = horas >= 12 ? "PM" : "AM";
    horas = horas > 12 ? horas - 12 : horas;

    dia = dia.toString().padStart(2, "0");
    horas = horas.toString().padStart(2, "0");
    minutos = minutos.toString().padStart(2, "0");
    
    const fechaFormateada = `${dia}-${nombreMes}-${anio}・${horas}:${minutos} ${amPm}`;
    return fechaFormateada;
  }
};

let filtroVariacion = false;
let filtroGeneracion = false;

(async() => {
  console.log(db);
    db.forEach((data) => {
      const esUrl = (cadena) => {
        const regex = /^(ftp|http|https):\/\/[^ "]+$/;
        return regex.test(cadena);
      };
        const html = `
        <div id="images" class="col-6 col-sm-6 col-md-6 col-lg-3 ${esUrl(data.title) === true ? "variacion" : "generacion"}">
          <div class="card my-1 overflow-hidden text-white border-0">
            ${data.discordUser === null ? '' : `<div class="card-body card-head d-flex align-items-center"><img class="me-2 img-fluid" src="/images/discord-mark-white.svg" alt="Discord" style="max-width: 16px;"><small class="card-title m-0">${data.discordUser}</small>`}   
            ${data.discordUser === null ? '' : '</div>'}
            <div>
              <div class="type position-absolute d-flex justify-content-center align-items-center" data-bs-custom-class="custom-tooltip" data-bs-toggle="tooltip" data-bs-placement="left" data-bs-title=
                ${esUrl(data.title) === true ? '"variación"><span class="iconify" data-icon="ph:cube-duotone" data-inline="false"></span>' : '"generación"><span class="iconify" data-icon="ph:terminal-window-duotone" data-inline="false"></span>'}
              </div>
              <img src="https://i.imgur.com/${data.imgurId}.png" class="card-image-top" alt="${data.title}" style="width: 100%;">
            </div>
            <div class="card-body card-desc text-white">
              ${esUrl(data.title) === false ? `<h5 class="card-title">${CapitalizeFirstLetter(data.title)}</h5>` : `<h5 class="card-title">Variación de: <a href="${data.title}" target="_blank">${data.title.replace(/^.*[\\\/]/, '')}</a></h5>`}
              <small class="footer-card-color m-0">${getDateFromTimeStamp(data.timestamp)}</small>
            </div>
          </div>
        </div>
        `;
        document.querySelector("#gallery").insertAdjacentHTML("beforeend", html);
    });
    (() => {
        const contenedor = document.getElementById("gallery");
        const conjunto = contenedor.getElementsByTagName("div");
        const divs = Array.from(conjunto).filter(elemento => elemento.id === "images");
        const elementosPorPagina = 16;
        let currentPage = 1;
      
        const mostrarElementosPagina = (pagina) => {
          const inicio = (pagina - 1) * elementosPorPagina;
          const fin = inicio + elementosPorPagina;
          let elementosFiltrados = divs;

          if (filtroVariacion) {
            elementosFiltrados = elementosFiltrados.filter((elemento) =>
              elemento.classList.contains("variacion")
            );
          } else if (filtroGeneracion) {
            elementosFiltrados = elementosFiltrados.filter((elemento) =>
              elemento.classList.contains("generacion")
            );
          }

          for (let i = 0; i < elementosFiltrados.length; i++) {
            if (i >= inicio && i < fin) {
              elementosFiltrados[i].style.display = "block";
            } else {
              elementosFiltrados[i].style.display = "none";
            }
          }
          const galleryElement = document.getElementById("gallery");
          galleryElement.scrollIntoView({ behavior: "smooth" });
        };

        const crearBotonesPagina = () => {
          const paginasContainer = document.getElementById("paginas-container");
          paginasContainer.innerHTML = "";
          let elementosFiltrados = divs;
          if (filtroVariacion) {
            elementosFiltrados = elementosFiltrados.filter((elemento) =>
              elemento.classList.contains("variacion")
            );
          } else if (filtroGeneracion) {
            elementosFiltrados = elementosFiltrados.filter((elemento) =>
              elemento.classList.contains("generacion")
            );
          }

          const cantidadTotalPaginas = Math.ceil(
            elementosFiltrados.length / elementosPorPagina
          );
          for (let i = 1; i <= cantidadTotalPaginas; i++) {
            const button = document.createElement("button");
            button.classList.add("page-button");
            button.classList.add("col-2");
            button.classList.add("col-sm-2");
            button.classList.add("col-md-1");
            button.classList.add("col-lg-1");
            if (i == 1) {
              button.classList.add("active");
            }
            button.dataset.page = i;
            button.textContent = i;

            button.addEventListener("click", function () {
              const page = parseInt(this.dataset.page);
              currentPage = page;
              mostrarElementosPagina(currentPage);
              const buttons = document.querySelectorAll(".page-button");
              buttons.forEach((button) => {
                const page = parseInt(button.textContent);
                if (page === currentPage) {
                  button.classList.add("active");
                } else {
                  button.classList.remove("active");
                }
              });
            });

            paginasContainer.appendChild(button);
          }
        };
        document.querySelectorAll(".v-btn").forEach((btn) => {
          btn.addEventListener("click", function () {
            filtroVariacion = true;
            filtroGeneracion = false;
            currentPage = 1;
            mostrarElementosPagina(currentPage);
            crearBotonesPagina();
          });
        });

        document.querySelectorAll(".g-btn").forEach((btn) => {
          btn.addEventListener("click", function () {
            filtroVariacion = false;
            filtroGeneracion = true;
            currentPage = 1;
            mostrarElementosPagina(currentPage);
            crearBotonesPagina();
          });
        });
        })();
  })();
</script>
<template>
  <main class="text-white">
    <div id="bg-img"></div>
    <div class="py-4">
      <div class="container">
          <div class="row justify-content-center">
              <div class="col-12">
                  <h2 id="titulo" class="mb-3 fw-bold">Galería de imágenes generadas por IA DALL-E (OpenAI)</h2>
                  <h5 id="descripcion" class="fw-light">Obtenido a través de peticiones de usuarios al interactuar con comandos con el bot de Discord Gemi-chan.</h5>
                  <h5 id="comandos" class="fw-light">Comandos: 
                    <span class="badge g-btn fw-normal">
                      <span class="iconify" data-icon="ph:terminal-window-duotone" data-inline="false"></span>
                    /generar
                    </span> <span class="badge v-btn fw-normal">
                      <span class="iconify" data-icon="ph:cube-duotone" data-inline="false"></span>
                    /variar
                    </span>
                  </h5>
              </div>
              <div id="gallery" class="row pb-3"></div>
              <div id="paginas-container" style="--clr:#ffb8fc;" class="row justify-content-center"></div>
          </div>
      </div>
    </div>
</main>
</template>
<script>
  export default {
    mounted() {
      const tooltipTriggerList = document.querySelectorAll("[data-bs-toggle=\"tooltip\"]");
      const tooltipList = [...tooltipTriggerList].map((tooltipTriggerEl) => {
        return new this.$nuxt.$Tooltip(tooltipTriggerEl, {
          boundary: "window"
        });
      });
    }
  }
</script>