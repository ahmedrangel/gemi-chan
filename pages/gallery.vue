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

const esUrl = (cadena) => {
  const regex = /^(ftp|http|https):\/\/[^ "]+$/;
  return regex.test(cadena);
};

(async() => {
    db.forEach((data) => {
      let type;
      let icon;
      let title;
      switch (data.command) {
        case "generar":
          type = "generacion";
          title = data.title;
          icon = "ph:terminal-window-duotone";
          break;
        case "variar":
          type = "variacion";
          title = "Variación de: " + data.title;
          icon = "ph:cube-duotone";
          break;
        case "anime":
          type = "anime";
          title = data.title;
          icon = "ph:person-simple-duotone";
          break;
        case "anime-p18":
          type = "animep18";
          title = data.title;
          icon = "ph:person-simple-duotone";
          break;
        default:
          type = "";
          icon = "";
          title = "";
          break;
      }
      const html = `
      <div id="images" class="col-6 col-sm-6 col-md-6 col-lg-3 elem ${type}">
        <div class="card my-1 overflow-hidden text-white border-0">
          ${data.discordUser === null ? '' : `<div class="card-body card-head d-flex align-items-center"><img class="me-2 img-fluid" src="/images/discord-mark-white.svg" alt="Discord" style="max-width: 16px;"><small class="card-title m-0">${data.discordUser}</small>`}   
          ${data.discordUser === null ? '' : '</div>'}
          <div>
            <div class="type position-absolute d-flex justify-content-center align-items-center" data-bs-custom-class="custom-tooltip" data-bs-toggle="tooltip" data-bs-placement="left" data-bs-title="${type}">
              <span class="iconify" data-icon="${icon}" data-inline="false"></span>
            </div>
            <div class="${data.command}">
              ${type == "animep18" ? `<h5 class="p18">+18</h5>` : ``}
              <div class="overlay">
                <img src="https://i.imgur.com/${data.imgurId}.png" class="card-image-top" alt="${title}" style="width: 100%;">
              </div>
            </div>
          </div>
          <div class="card-body card-desc text-white">
            ${esUrl(data.title) === false ? `<h5 class="card-title">${CapitalizeFirstLetter(title)}</h5>` : `<h5 class="card-title">Variación de: <a href="Variación de: ${data.title}" target="_blank">${data.title.replace(/^.*[\\\/]/, '')}</a></h5>`}
            <small class="footer-card-color m-0">${getDateFromTimeStamp(data.timestamp)}</small>
          </div>
        </div>
      </div>
      `;
      document.querySelector("#gallery").insertAdjacentHTML("beforeend", html);
    });
  })();
</script>
<template>
  <main class="text-white">
    <div id="bg-img"></div>
    <div class="py-4">
      <div class="container">
          <div class="row justify-content-center">
              <div class="col-12">
                  <h2 id="titulo" class="mb-3 fw-bold">Galería de imágenes generadas por IA</h2>
                  <h5 id="descripcion" class="fw-light">Obtenido a través de peticiones de usuarios al interactuar con comandos con el bot de Discord Gemi-chan.</h5>
                  <div id="comandos">
                    <h5>
                      <span class="badge genf fw-normal">
                        <span class="iconify" data-icon="ph:terminal-window-duotone" data-inline="false"></span>
                      /generar
                      </span> <span class="badge varf fw-normal">
                        <span class="iconify" data-icon="ph:cube-duotone" data-inline="false"></span>
                      /variar
                      </span> <span class="badge anif fw-normal">
                        <span class="iconify" data-icon="ph:person-simple-duotone" data-inline="false"></span>
                      /animeia
                      </span>
                    </h5>
                  </div>
              </div>
              <div id="paginas-container-2" style="--clr:#ffb8fc;" class="row justify-content-center py-3"></div>
              <div id="gallery" class="row"></div>
              <div id="paginas-container" style="--clr:#ffb8fc;" class="row justify-content-center pt-3"></div>
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

      const contenedor = document.getElementById("gallery");
      const conjunto = contenedor.getElementsByTagName("div");
      const all_arr = Array.from(conjunto).filter(elemento => elemento.id === "images");
      const gen_arr = Array.from(conjunto).filter(elemento => elemento.classList.contains("generacion"));
      const var_arr = Array.from(conjunto).filter(elemento => elemento.classList.contains("variacion"));
      const ani_arr = Array.from(conjunto).filter(elemento => elemento.classList.contains("anime"));
      const elementosPorPagina = 16;
      let currentPage = 1;
      const mostrarElementosPagina = (pagina, elems) => {
        const inicio = (pagina - 1) * elementosPorPagina;
        const fin = inicio + elementosPorPagina;

        for (let i = 0; i < elems.length; i++) {
          if (i >= inicio && i < fin) {
            elems[i].style.display = "block";
          } else {
            elems[i].style.display = "none";
          }
        }
      };

      const PageButtonsClickEvents = (elems, datasetpage) => {
        const page = parseInt(datasetpage);
        currentPage = page;
        mostrarElementosPagina(currentPage, elems);
        const buttons = document.querySelectorAll(".page-button");
        buttons.forEach((button) => {
          const page = parseInt(button.textContent);
          if (page === currentPage) {
            button.classList.add("active");
          } else {
            button.classList.remove("active");
          }
        });
        const galleryElement = document.getElementById("titulo");
        galleryElement.scrollIntoView({ behavior: "smooth" });
      };

      const crearBotonesPagina = (elems) => {
        const paginasContainer = document.getElementById("paginas-container");
        const paginasContainer2 = document.getElementById("paginas-container-2");
        paginasContainer.innerHTML = "";
        paginasContainer2.innerHTML = "";
        const cantidadTotalPaginas = Math.ceil(elems.length / elementosPorPagina);
        for (let i = 1; i <= cantidadTotalPaginas; i++) {
          const button = document.createElement("button");
          button.classList.add("page-button");
          button.classList.add("col-1");
          button.classList.add("col-sm-2");
          button.classList.add("col-md-1");
          button.classList.add("col-lg-1");
          button.classList.add("d-flex");
          button.classList.add("justify-content-center");
          if (i == 1) {
            button.classList.add("active");
          }
          button.dataset.page = i;
          button.textContent = i;

          button.addEventListener("click", () => PageButtonsClickEvents(elems, button.dataset.page));

          paginasContainer.appendChild(button);
          paginasContainer2.appendChild(button.cloneNode(true));

          const clonedButton = paginasContainer2.lastElementChild;
          clonedButton.addEventListener("click", () => PageButtonsClickEvents(elems, clonedButton.dataset.page));
        }
      };
      
      mostrarElementosPagina(currentPage, all_arr);
      crearBotonesPagina(all_arr);
      const genfilter = document.querySelector(".genf");
      const varfilter = document.querySelector(".varf");
      const anifilter = document.querySelector(".anif");
      const elementos = document.getElementsByClassName("elem");
      const p18_filter = document.getElementsByClassName("anime-p18");
      const p18_over = document.querySelector(".p18");

      const filtrarElementos = (filtro, btn1, btn2, btn3, tipo) => {
        let divs;
        for (let i = 0; i < elementos.length; i++) {
          elementos[i].style.display = elementos[i].classList.contains(tipo) ? "block" : "none";
        }
        if (btn2.classList.contains("active") || btn3.classList.contains("active")) {
          btn2.classList.remove("active");
          btn3.classList.remove("active");
          btn1.classList.add("active");
          divs = filtro;
        } else if (btn1.classList.contains("active")) {
          btn1.classList.remove("active");
          divs = all_arr;
        } else {
          btn1.classList.add("active");
          divs = filtro;
        }
        mostrarElementosPagina(1, divs);
        crearBotonesPagina(divs);
      };

      genfilter.addEventListener("click", () => filtrarElementos(gen_arr, genfilter, varfilter, anifilter, "generacion"));
      varfilter.addEventListener("click", () => filtrarElementos(var_arr, varfilter, genfilter, anifilter, "variacion"));
      anifilter.addEventListener("click", () => filtrarElementos(ani_arr, anifilter, genfilter, varfilter, "anime"));

      for (let i = 0; i < p18_filter.length; i++) {
        p18_filter[i].addEventListener("click", () => {
          this.style.display = "none";
        });
      }
    }
  }
</script>