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
        : res.json({ msg: "Se borro usuario", results });
    }
  });
});

// --------------- Tabla Productos Publicados------------
app.get("/productos/publicados", (req, res) => {
  let query = `select idProductoPublicado,
  CVE_ART,
  DESCR,
  EXIST,
  LIN_PROD,
  UNI_MED,
  NUM_MON,
  FCH_ULTCOM,
  ULT_COSTO,
  CVE_IMAGEN,
  UUID,
  CVE_UNIDAD,
  CVE_ALT,
  CAMP_LIBRE1,
  CAMP_LIBRE2,
  CAMP_LIBRE3,
  CAMP_LIBRE4,
  CAMP_LIBRE5,
  CAMP_LIBRE6,
  CAMP_LIBRE7,
  PRECIO_VTA,
  PRECIO_VTA_ML,
  PRECIO_VTA_AMZ,
  PRECIO_VTA_WWC,
  P_ML,
  P_AMZ,
  P_WC,
  DESC_LARGA,
  STATUS,
  COSTO_PROM,
  STOCK_MIN,
  STOCK_MAX,
  FCH_ULTVTA,
  TIPO_ELE,
  PESO,
  VOLUMEN,
  BLK_CST_EXT,
  LINK_A_TIENDA,
  F_CREACION
from productos_publicados;`;

  pool.query(query, (error, results) => {
    if (error) {
      res.json(error);
    } else {
      res.json(results);
    }
  });
});

app.get("/productos/publicados/:id", (req, res) => {
  let { id } = req.params;
  let query = `
  select idProductoPublicado,
       CVE_ART,
       DESCR,
       EXIST,
       LIN_PROD,
       UNI_MED,
       NUM_MON,
       FCH_ULTCOM,
       ULT_COSTO,
       CVE_IMAGEN,
       UUID,
       CVE_UNIDAD,
       CVE_ALT,
       CAMP_LIBRE1,
       CAMP_LIBRE2,
       CAMP_LIBRE3,
       CAMP_LIBRE4,
       CAMP_LIBRE5,
       CAMP_LIBRE6,
       CAMP_LIBRE7,
       PRECIO_VTA,
       PRECIO_VTA_ML,
       PRECIO_VTA_AMZ,
       PRECIO_VTA_WWC,
       P_ML,
       P_AMZ,
       P_WC,
       DESC_LARGA,
       STATUS,
       COSTO_PROM,
       STOCK_MIN,
       STOCK_MAX,
       FCH_ULTVTA,
       TIPO_ELE,
       PESO,
       VOLUMEN,
       BLK_CST_EXT,
       LINK_A_TIENDA,
       F_CREACION
from productos_publicados where idProductoPublicado like ${id}`;

  pool.query(query, (error, results) => {
    if (error) {
      res.json(error);
    } else {
      res.json(results);
    }
  });
});

app.post("/productos/publicados", (req, res) => {
  let { id } = req.params;
  const {
    CVE_ART,
    DESCR,
    EXIST,
    LIN_PROD,
    UNI_MED,
    FCH_ULTCOM,
    NUM_MON,
    ULT_COSTO,
    CVE_IMAGEN,
    UUID,
    CVE_UNIDAD,
    CVE_ALT,
    CAMP_LIBRE1,
    CAMP_LIBRE2,
    CAMP_LIBRE3,
    CAMP_LIBRE4,
    CAMP_LIBRE5,
    CAMP_LIBRE6,
    CAMP_LIBRE7,
    PRECIO_VTA,
    PRECIO_VTA_ML,
    PRECIO_VTA_AMZ,
    PRECIO_VTA_WWC,
    P_ML,
    P_AMZ,
    P_WC,
    DESC_LARGA,
    STATUS,
    COSTO_PROM,
    STOCK_MIN,
    STOCK_MAX,
    FCH_ULTVTA,
    TIPO_ELE,
    PESO,
    VOLUMEN,
    BLK_CST_EXT,
    LINK_A_TIENDA,
  } = req.body;

  let query = `insert into productos_publicados (
    CVE_ART, DESCR, EXIST, LIN_PROD, UNI_MED, 
    NUM_MON, FCH_ULTCOM, ULT_COSTO, CVE_IMAGEN, 
    UUID, CVE_UNIDAD, CVE_ALT, CAMP_LIBRE1, 
    CAMP_LIBRE2, CAMP_LIBRE3, CAMP_LIBRE4, CAMP_LIBRE5,
    CAMP_LIBRE6, CAMP_LIBRE7, PRECIO_VTA, 
    PRECIO_VTA_ML, PRECIO_VTA_AMZ, PRECIO_VTA_WWC,
    P_ML, P_AMZ, P_WC, DESC_LARGA, STATUS, COSTO_PROM,
    STOCK_MIN, STOCK_MAX, FCH_ULTVTA, TIPO_ELE,
    PESO, VOLUMEN, BLK_CST_EXT,LINK_A_TIENDA) 
      values ( '${CVE_ART}', '${DESCR}', '${EXIST}', '${LIN_PROD}', '${UNI_MED}',
      '${NUM_MON}', '${FCH_ULTCOM}', '${ULT_COSTO}', '${CVE_IMAGEN}',
      '${UUID}', '${CVE_UNIDAD}', '${CVE_ALT}', '${CAMP_LIBRE1}', '${CAMP_LIBRE2}',
      '${CAMP_LIBRE3}', '${CAMP_LIBRE4}', '${CAMP_LIBRE5}', '${CAMP_LIBRE6}',
      '${CAMP_LIBRE7}', '${PRECIO_VTA}', '${PRECIO_VTA_ML}', '${PRECIO_VTA_AMZ}',
      '${PRECIO_VTA_WWC}', '${P_ML}', '${P_AMZ}', '${P_WC}', '${DESC_LARGA}', '${STATUS}',
      '${COSTO_PROM}', '${STOCK_MIN}', '${STOCK_MAX}', '${FCH_ULTVTA}', '${TIPO_ELE}',
      '${PESO}', '${VOLUMEN}', '${BLK_CST_EXT}', '${LINK_A_TIENDA}');`;
  pool.query(query, (error, results) => {
    if (error) {
      res.json(error);
    } else {
      res.json({ msg: "Se modifico producto publicado", results });
    }
  });
});

app.put("/productos/publicados/:id", (req, res) => {
  let { id } = req.params;
  const {
    CVE_ART,
    DESCR,
    EXIST,
    LIN_PROD,
    UNI_MED,
    NUM_MON,
    FCH_ULTCOM,
    ULT_COSTO,
    CVE_IMAGEN,
    UUID,
    CVE_UNIDAD,
    CVE_ALT,
    CAMP_LIBRE1,
    CAMP_LIBRE2,
    CAMP_LIBRE3,
    CAMP_LIBRE4,
    CAMP_LIBRE5,
    CAMP_LIBRE6,
    CAMP_LIBRE7,
    PRECIO_VTA,
    PRECIO_VTA_ML,
    PRECIO_VTA_AMZ,
    PRECIO_VTA_WWC,
    P_ML,
    P_AMZ,
    P_WC,
    DESC_LARGA,
    STATUS,
    COSTO_PROM,
    STOCK_MIN,
    STOCK_MAX,
    FCH_ULTVTA,
    TIPO_ELE,
    PESO,
    VOLUMEN,
    BLK_CST_EXT,
    LINK_A_TIENDA,
    F_CREACION,
  } = req.body;

  if (
    CVE_ART === undefined ||
    DESCR === undefined ||
    EXIST === undefined ||
    LIN_PROD === undefined ||
    UNI_MED === undefined ||
    NUM_MON === undefined ||
    FCH_ULTCOM === undefined ||
    ULT_COSTO === undefined ||
    CVE_IMAGEN === undefined ||
    UUID === undefined ||
    CVE_UNIDAD === undefined ||
    CVE_ALT === undefined ||
    CAMP_LIBRE1 === undefined ||
    CAMP_LIBRE2 === undefined ||
    CAMP_LIBRE3 === undefined ||
    CAMP_LIBRE4 === undefined ||
    CAMP_LIBRE5 === undefined ||
    CAMP_LIBRE6 === undefined ||
    CAMP_LIBRE7 === undefined ||
    PRECIO_VTA === undefined ||
    PRECIO_VTA_ML === undefined ||
    PRECIO_VTA_AMZ === undefined ||
    PRECIO_VTA_WWC === undefined ||
    P_ML === undefined ||
    P_AMZ === undefined ||
    P_WC === undefined ||
    DESC_LARGA === undefined ||
    STATUS === undefined ||
    COSTO_PROM === undefined ||
    STOCK_MIN === undefined ||
    STOCK_MAX === undefined ||
    FCH_ULTVTA === undefined ||
    TIPO_ELE === undefined ||
    PESO === undefined ||
    VOLUMEN === undefined ||
    BLK_CST_EXT === undefined ||
    LINK_A_TIENDA === undefined ||
    F_CREACION === undefined
  ) {
    res.json("Verifique los datos");
  } else {
    let query = `update productos_publicados
    set CVE_ART = '${CVE_ART}',
        DESCR = '${DESCR}',
        EXIST = '${EXIST}',
        LIN_PROD = '${LIN_PROD}',
        UNI_MED = '${UNI_MED}',
        NUM_MON = '${NUM_MON}',
        FCH_ULTCOM = '${FCH_ULTCOM}',
        ULT_COSTO = '${ULT_COSTO}',
        CVE_IMAGEN = '${CVE_ALT}',
        UUID = '${UUID}',
        CVE_UNIDAD = '${CVE_UNIDAD}',
        CVE_ALT = '${CVE_ALT}',
        CAMP_LIBRE1 = '${CAMP_LIBRE1}',
        CAMP_LIBRE2 = '${CAMP_LIBRE2}',
        CAMP_LIBRE3 = '${CAMP_LIBRE3}',
        CAMP_LIBRE4 = '${CAMP_LIBRE4}',
        CAMP_LIBRE5 = '${CAMP_LIBRE5}',
        CAMP_LIBRE6 = '${CAMP_LIBRE6}',
        CAMP_LIBRE7 = '${CAMP_LIBRE7}',
        PRECIO_VTA = '${PRECIO_VTA}',
        PRECIO_VTA_ML = '${PRECIO_VTA_ML}',
        PRECIO_VTA_AMZ = '${PRECIO_VTA_AMZ}',
        PRECIO_VTA_WWC = '${PRECIO_VTA_WWC}',
        P_ML = '${P_ML}',
        P_AMZ = '${P_AMZ}',
        P_WC = '${P_WC}',
        DESC_LARGA = '${DESC_LARGA}',
        STATUS = '${STATUS}',
        COSTO_PROM = '${COSTO_PROM}',
        STOCK_MIN = '${STOCK_MIN}',
        STOCK_MAX = '${STOCK_MAX}',
        FCH_ULTVTA = '${FCH_ULTVTA}',
        TIPO_ELE = '${TIPO_ELE}',
        PESO = '${PESO}',
        VOLUMEN = '${VOLUMEN}',
        BLK_CST_EXT = '${BLK_CST_EXT}',
        LINK_A_TIENDA = '${LINK_A_TIENDA}',
        F_CREACION = '${F_CREACION}'
    where ${id};`;
    pool.query(query, (error, results) => {
      if (error) {
        res.json(error);
      } else {
        res.json({ msg: "Se modifico producto publicado", results });
      }
    });
  }
});

app.delete("/productos/publicados/:id", (req, res) => {
  let { id } = req.params;

  let query = `delete from productos_publicados where idProductoPublicado like ${id};`;
  pool.query(query, (error, results) => {
    if (error) {
      res.json(error);
    } else {
      results.affectedRows == 0
        ? res.json({ msg: "No existe producto" })
        : res.json({ msg: "Se borro producto", results });
    }
  });
});

// --------------- Tabla Productos ASPEL------------
app.get("/productos/aspel", (req, res) => {
  let query = `select idProducto,
    CVE_ART,
    DESCR,
    EXIST,
    LIN_PROD,
    UNI_MED,
    NUM_MON,
    FCH_ULTCOM,
    ULT_COSTO,
    CVE_IMAGEN,
    UUID,
    CVE_UNIDAD,
    CVE_ALT,
    CAMPLIB3,
    CAMPLIB4,
    CAMPLIB5,
    PRECIO6,
    CAMPO_LIBRE7,
    CAMPO_LIBRE8
from aspel`;
  pool.query(query, (error, results) => {
    if (error) {
      res.json(error);
    } else {
      res.json(results);
    }
  });
});

app.get("/productos/aspel/:id", (req, res) => {
  let { id } = req.params;

  let query = `select idProducto,
  CVE_ART,
  DESCR,
  EXIST,
  LIN_PROD,
  UNI_MED,
  NUM_MON,
  FCH_ULTCOM,
  ULT_COSTO,
  CVE_IMAGEN,
  UUID,
  CVE_UNIDAD,
  CVE_ALT,
  CAMPLIB3,
  CAMPLIB4,
  CAMPLIB5,
  PRECIO6,
  CAMPO_LIBRE7,
  CAMPO_LIBRE8
from aspel where idProducto like ${id};`;
  pool.query(query, (error, results) => {
    if (error) {
      res.json(error);
    } else {
      res.json(results);
    }
  });
});

app.post("/productos/aspel", (req, res) => {
  const {
    CVE_ART,
    DESCR,
    EXIST,
    LIN_PROD,
    UNI_MED,
    NUM_MON,
    FCH_ULTCOM,
    ULT_COSTO,
    CVE_IMAGEN,
    UUID,
    CVE_UNIDAD,
    CVE_ALT,
    CAMPLIB3,
    CAMPLIB4,
    CAMPLIB5,
    PRECIO6,
    CAMPO_LIBRE7,
    CAMPO_LIBRE8,
  } = req.body;

  let query = `
  insert into aspel (CVE_ART
    DESCR,
    EXIST,
    LIN_PROD,
    UNI_MED,
    NUM_MON,
    FCH_ULTCOM,
    ULT_COSTO,
    CVE_IMAGEN,
    UUID,
    CVE_UNIDAD,
    CVE_ALT,
    CAMPLIB3,
    CAMPLIB4,
    CAMPLIB5,
    PRECIO6,
    CAMPO_LIBRE7,
    CAMPO_LIBRE8)
      values (
      '${CVE_ART}',
      '${DESCR}',
      '${EXIST}',
      '${LIN_PROD}',
      '${UNI_MED}',
      '${NUM_MON}',
      '${FCH_ULTCOM}',
      '${ULT_COSTO}',
      '${CVE_IMAGEN}',
      '${UUID}',
      '${CVE_ALT}',
      '${CAMPLIB3}',
      '${CAMPLIB4}',
      '${CAMPLIB5}',
      '${PRECIO6}',
      '${CAMPO_LIBRE7}',
      '${CAMPO_LIBRE8}');`;
  pool.query(query, (error, results) => {
    if (error) {
      res.json(error);
    } else {
      res.json({ msg: "Se ha dado de alta", results });
    }
  });
});

app.put("/productos/aspel/:id", (req, res) => {
  let { id } = req.params;

  const {
    CVE_ART,
    DESCR,
    EXIST,
    LIN_PROD,
    UNI_MED,
    NUM_MON,
    FCH_ULTCOM,
    ULT_COSTO,
    CVE_IMAGEN,
    UUID,
    CVE_UNIDAD,
    CVE_ALT,
    CAMPLIB3,
    CAMPLIB4,
    CAMPLIB5,
    PRECIO6,
    CAMPO_LIBRE7,
    CAMPO_LIBRE8,
  } = req.body;
  let query = `
  update aspel
  set
    CVE_ART = '${CVE_ART}',
    DESCR = '${DESCR}',
    EXIST = '${EXIST}',
    LIN_PROD = '${LIN_PROD}',
    UNI_MED = '${UNI_MED}',
    NUM_MON = '${NUM_MON}',
    FCH_ULTCOM = '${FCH_ULTCOM}',
    ULT_COSTO = '${ULT_COSTO}',
    CVE_IMAGEN = '${CVE_IMAGEN}',
    UUID = '${UUID}',
    CVE_UNIDAD = '${CVE_UNIDAD}',
    CVE_ALT = '${CVE_ALT}',
    CAMPLIB3 = '${CAMPLIB3}',
    CAMPLIB4 = '${CAMPLIB4}',
    CAMPLIB5 = '${CAMPLIB5}',
    PRECIO6 = '${PRECIO6}',
    CAMPO_LIBRE7 = '${CAMPO_LIBRE7}',
    CAMPO_LIBRE8 = '${CAMPO_LIBRE8}'
  where idProducto like '${id}';`;

  pool.query(query, (error, results) => {
    if (error) {
      res.json(error);
    } else {
      res.json({ msg: "Se modifico producto aspel", results });
    }
  });
});

app.delete("/productos/aspel/:id", (req, res) => {
  const { id } = req.params;
  let query = `delete
  from aspel
  where idProducto like ${id}`;

  pool.query(query, (error, results) => {
    if (error) {
      res.json(error);
    } else {
      res.json({ msg: "Se elimino producto", results });
    }
  });
});

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
