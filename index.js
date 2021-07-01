//Express
const express = require("express");
const app = express();

const cors = require("cors");
const bodyParser = require("body-parser");

const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default;

//Puerto del sistema
const port = process.env.PORT || 4002;

//Configuracion de la API de WooCommerce
const wc = new WooCommerceRestApi({
  url: "https://core.noobhuman.ninja/",
  consumerKey: "ck_e0a402b26b0cdcdfcfc6436512b2eaba73a0d1ef",
  consumerSecret: "cs_de15415916045ddfd809c5f71d2b1dd11e8243e0",
  version: "wc/v3",
});

//MySQL config
const mysql = require("mysql");
let pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "core",
  password: "papaya papaya",
  database: "core",
  port: "3306",
});

//Para aceptar origenes cruzados
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ---------------tabla usuario-----------------------
app.get("/usuarios/:id", (req, res) => {
  const { id } = req.params;

  let query = `select * from usuario where idUsuario like ${id}`;
  pool.query(query, (error, results) => {
    if (error) {
      res.json(error);
    } else {
      res.json({ user: results[0] });
    }
  });
});

app.get("/usuarios", (req, res) => {
  let query =
    "select idUsuario, nombre, apellidos, email, activo, creado from usuario";
  pool.query(query, (error, results) => {
    if (error) {
      res.json(error);
    } else {
      res.json({ results: results });
    }
  });
});

app.post("/usuarios", (req, res) => {
  const { nombre, apellidos, email, password } = req.body;

  //Ningun campo debe de estar vacio
  if (
    nombre === undefined ||
    apellidos === undefined ||
    email === undefined ||
    password === undefined
  ) {
    res.status(400).json({ msg: "Error, verifique los datos" }); //Error por que faltan datos
  } else {
    let query = `insert into usuario (nombre, apellidos, email, password) values ('${nombre}','${apellidos}','${email}', SHA1('${password}'))`;

    pool.query(query, (error, results) => {
      if (error) {
        //Si es un error de datos ya existentes
        error.errno == 1062
          ? res.status(406).json({ msg: "El correo ya existe" })
          : res.json(error); //En cualquier otro caso imprime el error
      } else {
        //Se da de alta el usuario
        res.json({ msg: `Se dio de alta el usuario ${nombre}`, results });
      }
    });
  }
});

/*
    nombre:Joe Miguel
    apellidos:Rdz Sierro
    email:joe@mail.co
    password:123
    activo: 1
*/
app.put("/usuarios/:id", (req, res) => {
  let { id } = req.params;
  const { nombre, apellidos, password, activo } = req.body;

  if (
    nombre === undefined ||
    apellidos === undefined ||
    password === undefined ||
    activo === undefined
  ) {
    res.status(400).json({ msg: "Error, verifique los datos" }); //Error por que faltan datos
  } else {
    let query = `update usuario set 
      nombre = '${nombre}', 
      apellidos = '${apellidos}', 
      password = '${password}', 
      activo = '${activo}' 
    where idUsuario like ${id}`;
    pool.query(query, (error, results) => {
      if (error) {
        res.json(error);
      } else {
        res.json({ results: results });
      }
    });
  }
});

app.delete("/usuarios/:id", (req, res) => {
  let { id } = req.params;

  let query = `delete
  from usuario
  where idUsuario like ${id}`;
  pool.query(query, (error, results) => {
    if (error) {
      res.json(error);
    } else {
      results.affectedRows == 0
        ? res.json({ msg: "No existe usuario" })
        : res.json({msg: 'Se borro usuario', results});
    }
  });
});

// --------------- Tabla Productos Publicados------------
app.get("/productos/publicados", (req, res) => {});

app.get("/productos/publicados/:id", (req, res) => {});

app.post("/productos/publicados", (req, res) => {});

app.put("/productos/publicados/:id", (req, res) => {});

app.delete("/productos/publicados/:id", (req, res) => {});

// --------------- Tabla Productos Publicados------------
app.get("/productos/aspel", (req, res) => {});

app.get("/productos/aspel/:id", (req, res) => {});

app.post("/productos/aspel", (req, res) => {});

app.put("/productos/aspel/:id", (req, res) => {});

app.delete("/productos/aspel/:id", (req, res) => {});

//                      [ WooCommerce ]

//--------------Consultar solo un producto------------------
app.get("/products-wc/:id", async (req, res) => {
  const { id } = req.params;
  const url = `products/${id}`;
  await wc
    .get(url)
    .then((response) => {
      res.json({ producto: response.data });
    })
    .catch((error) => {
      res.json(error.response.data);
    });
});

//---------Consultar todos los productos----------
app.get("/products-wc", async (req, res) => {
  await wc
    .get("products")
    .then((response) => {
      res.json(response.data);
    })
    .catch((error) => {
      res.json(error.response.data);
    });
});

/* -----------Actualizar producto ----------
  aca se le manda el parametro a actualizar
  por ejemplo:
      Si se desea actualizar la descripcion
      se manda la query con la key "description"
      con su respectivo valor... algo como:
          const data = {
            description: "Nueva descripcion"
          }

*/
app.put("/products-wc/:id", async (req, res) => {
  const { id } = req.params;
  const datosActualizados = req.query;

  console.log(datosActualizados);

  const url = `products/${id}`;

  await wc
    .put(url, datosActualizados)
    .then((response) => {
      res.json(response.data);
    })
    .catch((error) => {
      res.json(error.response.data);
    });
});

app.get("/nueva-orden", async (req, res) => {
  await wc
    .get("orders")
    .then((response) => {
      res.json({ ordenes: response.data });
    })
    .catch((error) => {
      res.json(error.response.data);
    });
});

app.listen(port, () => {
  console.log(`El servidor esta escuchando en http://localhost:${port}`);
});
