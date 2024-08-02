//funcion que al cliquear sobre una fila se queda seleccionada
function selectRow() {
    let table = document.querySelector("#postsTable");
    let rows = table.getElementsByTagName("tr");

    for (let i = 0; i < rows.length; i++) {
        rows[i].addEventListener("click", function () {
            // Elimina la clase 'selected' de todas las filas
            for (let row of rows) {
                row.classList.remove("selected");
            }
            // Añade la clase 'selected' solo a la fila clicada
            this.classList.add("selected");

            // Obtén la información de la fila clicada
            //como se hace clic sobre un elemento tr se puede obtener el valor de un atributo data-description y demas
            const description = this.getAttribute("data-description"); 
            const image = this.getAttribute("data-image");

            // Actualiza la fila de descripción
            document.getElementById("descriptionText").textContent = description;
            document.getElementById("descriptionImage").src = image;

            //tambien hay que preparar el boton de actualizar para que sepa que post actualizar
            //obtenemos el id del post
            const id = this.getAttribute("data-id");
            //el boton que confirma la actualizacion es un form get y dentro esta el boton de submit
            //obtenemos el form
            const form = document.getElementById("updateBtn");
            //actualizamos el action del form
            form.action = "/updatePost/" + id;
        });
    }
}


//funcion para cambiar la imagen de un post y mostrarla en el contenedor y en el input
$(document).ready(function() { 
    var $changeImageButton = $('#changeImageButton'); // Selecciona el botón de cambiar imagen
    var $imageInput = $('#imageInput'); // Selecciona el input de archivo
    var $image = $('.postDescriptionContImage img'); // Selecciona la imagen en el contenedor

    $changeImageButton.on('click', function() {
        $imageInput.click(); // Simula un clic en el input de archivo al clicar el botón de cambiar imagen
    });

    $imageInput.on('change', function(event) { // Cuando cambia el archivo del input
        var file = event.target.files[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function(e) {
                $image.attr('src', e.target.result); // Actualiza el src de la imagen
            };
            reader.readAsDataURL(file); // Lee el archivo como una URL de datos
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Obtén una referencia al botón y al formulario
    var confirmButton = document.getElementById('confirmCreation');
    var form = document.getElementById('creationForm');

    // Agrega un evento de clic al botón
    confirmButton.addEventListener('click', function() {
        if (validateForm()) {
            form.submit(); // Envía el formulario si la validación es exitosa
        }
    });
});

// Función para validar que los campos del formulario no estén en blanco
function validateForm() {
    var title = document.getElementById('title').value.trim();
    var category = document.getElementById('category').value.trim();
    var date = document.getElementById('date').value.trim();
    var description = document.getElementById('description').value.trim();

    // Verifica si alguno de los campos está vacío
    if (title === "" || category === "" || date === "" || description === "") {
        alert("Please fill out all fields before submitting.");
        return false;
    }

    return true;
}

selectRow();
