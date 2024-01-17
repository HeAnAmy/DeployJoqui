import biblioteca from "../JS/biblioteca.js";

addEventListener("DOMContentLoaded", () => {

const parqueSelect = document.getElementById("parqueSelect");
const autorSelect = document.getElementById("autorSelect");
const searchInput = document.getElementById("searchInput");

//	Piro: Un path que se agrega a la url, para menor dependencia
const Ruta = "https://braincloud.com.mx/parque";
const BotonBusca  = document.getElementById("Busca");
//	Piro: Cuando se seleccione un Autor, hacer click en el botón "Busca" 
autorSelect.addEventListener("change", function () {
BotonBusca.click();
});
//	Piro: Hacer click en el botón "Buscar" pasado un segundo del inicio del script
window.setTimeout(function() {
BotonBusca.click();
}, 1000);
//	Piro: función para poner el color del bullet del acuerdo al tipo de producción
function ColorParaTipo(tipo)   
	{
	//	0: Todos(NEGRO), 1:Monografía(ROJO), 2:Investigación(VERDE), 3:Relato(AZUL), 4:Otros(NARANJA)
	let Colores = ["black", "red", "green", "blue", "orange"];
	let t = parseInt(tipo);
	return Colores[t % 5];
	} 

    // FunciÃ³n para cargar los datos en los selectores
    function loadOptions() {
        // Cargar los parques en el selector de parques
        for (const parque in biblioteca) {
            const option = document.createElement("option");
            option.value = parque;
            option.textContent = parque.replace(/_/g, " ");		//	Piro: remplazar "_" por " "
            parqueSelect.appendChild(option);
        }

        // Cargar los autores del primer parque en el selector de autores
        const primerParque = parqueSelect.options[parqueSelect.selectedIndex].value;
        updateAutorSelect(primerParque);
    }
    // FunciÃ³n para actualizar el selector de autores cuando se cambia el parque seleccionado
    function updateAutorSelect(selectedParque) {
        // Limpiar el selector de autores
        autorSelect.innerHTML = "";

        // Obtener los autores del parque seleccionado
        const autores = biblioteca[selectedParque];
        for (const autor in autores) {
            const option = document.createElement("option");
            option.value = autor;
            option.textContent = autor.replace(/_/g, " ");	//	Piro: remplazar "_" por " "
            autorSelect.appendChild(option);
        }
    }

    // Cargar los datos en los selectores al cargar la pÃ¡gina
    loadOptions();

    // Actualizar los autores cada vez que se selecciona un parque
    parqueSelect.addEventListener("change", function () {
        const selectedParque = parqueSelect.options[parqueSelect.selectedIndex].value;
        updateAutorSelect(selectedParque);
//	Piro: Cuando se carga la lista de autores de un parque mostrar las obras del seleccionado 	
BotonBusca.click();
    });

    function searchLinks(parque, autor, query) {
        // Obtener los enlaces correspondientes al parque y autor seleccionado
        const enlaces = biblioteca[parque][autor];
    
        query = query.toLowerCase();
        return enlaces.filter(link => link.name.toLowerCase().includes(query));
    }

    function displayResults(results) {
        const resultsContainer = document.getElementById("results");
        resultsContainer.innerHTML = "";
    
        if (results.length === 0) {
            resultsContainer.innerHTML = "No se encontraron resultados.";
            return;
        }
    
        const ul = document.createElement("ul");
        results.forEach(result => {
            const li = document.createElement("li");
li.style.color = ColorParaTipo(result.tipo);
            const nameLink = document.createElement("a");
            nameLink.href = Ruta + result.url;
            nameLink.textContent = result.name;
			nameLink.target = '_blank';		//	Piro: para que se abra en una nueva pestaña
            nameLink.classList.add("text-decoration-none");
            li.appendChild(nameLink);
    
    
            const languageP = document.createElement("p");
            languageP.textContent = `Idioma: ${result.language}`;
            languageP.classList.add("m-1")
languageP.style.color = "black";
            li.appendChild(languageP);
    
            const sizeP = document.createElement("p");
            sizeP.textContent = `TamaÃ±o: ${result.size}`;
            sizeP.classList.add("mb-1");
sizeP.style.color = "black";
            li.appendChild(sizeP);
    
            ul.appendChild(li);
        });
    
        resultsContainer.appendChild(ul);
    }
    
    document.getElementById("searchForm").addEventListener("submit", function (e) {
        e.preventDefault();
        const selectedParque = parqueSelect.options[parqueSelect.selectedIndex].value;
        const selectedAutor = autorSelect.options[autorSelect.selectedIndex].value;
        const searchQuery = searchInput.value;
        const searchResults = searchLinks(selectedParque, selectedAutor, searchQuery);
        displayResults(searchResults);
    });

});