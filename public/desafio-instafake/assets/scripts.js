// Acá parte la Magia!

async function init() {
  const token = localStorage.getItem("token");
  if (token == null) {
    return;
  }
  // en el caso de que token SI exista en localStorage, entonces
  // vamos a pasar altiro a la tabla de posteos

  // Ahora vamos a buscar los Posteos
  getPosts(token);
}
// init();

$("#salir").on("click", function () {
  localStorage.removeItem("token");
  // Escondemos el formulario
  $("#div-form").removeClass("d-none").addClass("d-block");
  // Mostramos la tabla
  $("#div-tabla").removeClass("d-block").addClass("d-none");
});

$("#js-form").on("submit", async function (ev) {
  // primero evitamos que se recargue la pagina
  ev.preventDefault();
  // obtenemos el email y el password
  const email = $("#js-input-email").val();
  const password = $("#js-input-password").val();

  // ahora vamos a solicitar el Token
  const data = await fetch("/api/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  const jwt = await data.json();

  // guardamos el token en una variable
  const token = jwt.token;
  console.log(token);
  localStorage.setItem("token", token);

  getPhotos(token);
});

async function getPhotos(token) {
  // Ahora vamos a buscar los Posteos
  const data2 = await fetch("/api/photos", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  console.log(data2);

  const respuesta = await data2.json();

  console.log(respuesta);

  const photos = respuesta.data;

  llenarTabla(photos);
}

function llenarTabla(photos) {
  // primero llenamos la tabla con la info de los POSTS

  for (let photo of photos) {
    console.log(photo);

    $("#photos").append(`
      <div class="card col-4 offset-4 my-1">
        <img src="${photo.download_url}" class="card-img-top" alt="...">
        <div class="card-body">
          <p class="card-text"> Autor: ${photo.author}
          </p>
        </div>
      </div>`);
  }

  // Escondemos el formulario
  $("#formulario").removeClass("d-block").addClass("d-none");
  // Mostramos la tabla
  $("#photos").removeClass("d-none").addClass("d-block");
}
