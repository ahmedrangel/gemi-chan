(async() => {
    const json_fetch = await fetch(`https://dev.ahmedrangel.com/imgur/me/gallery`);
    const json = await json_fetch.json();
    let contador = 0;
    let primercard = false;
    json.forEach((data) => {
        const html = `
        <div id="images" class="col-6 col-sm-6 col-md-6 col-lg-3">
            <div class="card my-2 overflow-hidden">
                ${!primercard && data.discordUser === "" ? '' : `<div class="card-body d-flex align-items-center"><img class="me-2 img-fluid" src="./svg/discord-mark-white.svg" alt="Discord" style="max-width: 16px;"><small class="card-title m-0">${data.discordUser}</small>`}   
                ${!primercard && data.discordUser === "" ? '' : '</div>'}
                <img src="https://i.imgur.com/${data.id}.png" class="card-image-top" alt="${data.title}">
                <div class="card-body">
                    <h5 class="card-title">${CapitalizeFirstLetter(data.title)}</h5>
                    <small class="footer-color m-0">${getDateFromTimeStamp(data.datetime)}</small>
                </div>
            </div>
        </div>
        `;
        if (!primercard && data.discordUser === "") {
          isFirstCardBodyRemoved = true;
        }
        document.querySelector("#gallery").insertAdjacentHTML('beforeend', html);
        contador++;
    });
    (() => {
        const contenedor = document.getElementById('gallery');
        const mostrarMasBtn = document.getElementById('mostrar-mas');
        mostrarMasBtn.style.display = '';
        const conjunto = contenedor.getElementsByTagName('div');
        const divs = Array.from(conjunto).filter(elemento => elemento.id === 'images');
        console.log(divs);
        const cantidadMostradosInicial = 16;
        const cantidadMostradosPorClick = 16;
        let cantidadMostrados = cantidadMostradosInicial;
        console.log(divs);
      
        // Ocultar todos los elementos <div> después del índice cantidadMostradosInicial
        for (let i = cantidadMostradosInicial; i < divs.length; i++) {
          divs[i].style.display = 'none';
        }
      
        // Agregar evento click al botón "Mostrar más"
        mostrarMasBtn.addEventListener('click', function() {
          const cantidadRestante = divs.length - cantidadMostrados;
      
          // Mostrar los siguientes elementos <div> ocultos
          for (let i = cantidadMostrados; i < cantidadMostrados + cantidadMostradosPorClick; i++) {
            if (i < divs.length) {
              divs[i].style.display = 'block';
            }
          }
      
          // Actualizar cantidadMostrados
          cantidadMostrados += cantidadMostradosPorClick;
      
          // Ocultar el botón "Mostrar más" si no quedan más elementos por mostrar
          if (cantidadRestante <= cantidadMostradosPorClick) {
            mostrarMasBtn.style.display = 'none';
          }
        });
      })();
  })();

const CapitalizeFirstLetter = (string) => {
    const flc = string.replace(/^\w/, c => c.toUpperCase()); 
    return flc;
};

const getDateFromTimeStamp = (timestamp) => {
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
    const minutos = fecha.getMinutes();
    
    dia = dia.toString().padStart(2, '0');
    horas = horas.toString().padStart(2, '0');

    const nombreMes = nombresMeses[mes - 1];
    
    const amPm = horas >= 12 ? 'p.m.' : 'a.m.';
    horas = horas > 12 ? horas - 12 : horas;
    
    const fechaFormateada = `${dia} de ${nombreMes} de ${anio}・${horas}:${minutos} ${amPm}`;
    return fechaFormateada;

};
  