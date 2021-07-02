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
  host: "198.199.83.125",
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

app.get("/", (req, res) => {
  res.send("API THE CORE");
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  let query = `select nombre, apellidos, email, password from usuario where email like '${email}';`;

  pool.query(query, (error, results) => {
    if (error) {
      res.json(error);
    } else {
      results[0].password === password
        ? res.json({ acceso: true, results })
        : res.json({ acceso: false });
    }
  });
});

// ---------------tabla usuario---------------------------------------------------------------------------------------------------

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
    let query = `insert into usuario (nombre, apellidos, email, password) values ('${nombre}','${apellidos}','${email}', '${password}')`;

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

// --------------- Tabla Productos Publicados----------------------------------------------------------------------------------------
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

// --------------- Tabla Productos ASPEL----------------------------------------------------------------------------------------
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

//---------------  ORDENES ---------------------------------------------------------------------------------------------------------

app.get("/ordenes", (req, res) => {
  let query = `
  select idOrdenesDeCompra,
       folio_en_tienda,
       productos,
       fecha,
       total,
       link_orden,
       monto,
       cantidad,
       descripcion_corta,
       registrada
from ordenesdecompra`;

  pool.query(query, (error, results) => {
    if (error) {
      res.json(error);
    } else {
      res.json(results);
    }
  });
});

app.get("/ordenes/:id", (req, res) => {
  let { id } = req.params;
  let query = `
  select idOrdenesDeCompra,
       folio_en_tienda,
       productos,
       fecha,
       total,
       link_orden,
       monto,
       cantidad,
       descripcion_corta,
       registrada
  from ordenesdecompra where idOrdenesDeCompra like ${id}`;
  pool.query(query, (error, results) => {
    if (error) {
      res.json(error);
    } else {
      res.json(results);
    }
  });
});

app.post("/ordenes/", (req, res) => {
  const {
    folio,
    productos,
    fecha,
    total,
    link_orden,
    monto,
    cantidad,
    descripcion_corta,
    registrada,
    idventasResgistradas,
  } = req.body;
  let query = `
  insert into ordenesdecompra (folio_en_tienda, 
    productos, 
    fecha, 
    total, 
    link_orden, 
    monto, 
    cantidad, 
    descripcion_corta,
    registrada
  values ('${folio}',
          '${productos}',
          '${fecha}',
          '${total}',
          '${link_orden}',
          '${monto}',
          '${cantidad}',
          '${descripcion_corta}',
          '${registrada}'`;
  pool.query(query, (error, results) => {
    if (error) {
      res.json(error);
    } else {
      res.json(results);
    }
  });
});

app.put("/ordenes/:id", (req, res) => {
  let { id } = req.params;
  const {
    folio,
    productos,
    fecha,
    total,
    link_orden,
    monto,
    cantidad,
    descripcion_corta,
    registrada,
  } = req.body;
  let query = `
  update ordenesdecompra
  set folio_en_tienda = '${folio}',
    productos= '${productos}',
    fecha= '${fecha}',
    total= '${total}',
    link_orden= '${link_orden}',
    monto= '${monto}',
    cantidad= '${cantidad}',
    descripcion_corta= '${descripcion_corta}',
    registrada= '${registrada}'
  where idOrdenesDeCompra like ${id}`;

  pool.query(query, (error, results) => {
    if (error) {
      res.json(error);
    } else {
      res.json(results);
    }
  });
});

app.delete("/ordenes/:id", (req, res) => {
  let { id } = req.params;
  let query = `delete from ordenesdecompra where idOrdenesDeCompra like ${id}`;
  pool.query(query, (error, results) => {
    if (error) {
      res.json(error);
    } else {
      res.json(results);
    }
  });
});

//---------------  NOTIFICACIONES ---------------------------------------------------------------------------------------------------

app.get("/notificaciones", (req, res) => {
  let query = `select idNotificicaciones, titulo, descripcion, tiempo, ordenesDeCompra_idordenesDeCompra from notificicaciones`;

  pool.query(query, (error, results) => {
    if (error) {
      res.json(error);
    } else {
      res.json(results);
    }
  });
});
app.post("/notificaciones/", (req, res) => {
  const { titulo, descripcion, tiempo, ordenesDeCompra_idordenesDeCompra } =
    req.body;
  let query = `insert into notificicaciones (titulo, descripcion, tiempo, ordenesDeCompra_idordenesDeCompra)
  values ('${titulo}','${descripcion}','${tiempo}', '${ordenesDeCompra_idordenesDeCompra}');`;

  pool.query(query, (error, results) => {
    if (error) {
      res.json(error);
    } else {
      res.json(results);
    }
  });
});
app.put("/notificaciones/:id", (req, res) => {
  let { id } = req.params;
  const { titulo, descripcion } = req.body;

  let query = `update notificicaciones
  set titulo = '${titulo}', descripcion = '${descripcion}'
  where idNotificicaciones like ${id};`;

  pool.query(query, (error, results) => {
    if (error) {
      res.json(error);
    } else {
      res.json(results);
    }
  });
});
app.delete("/notificaciones/:id", (req, res) => {
  const { id } = req.params;
  let query = `delete from notificicaciones where idNotificicaciones like '${id}'`;

  pool.query(query, (error, results) => {
    if (error) {
      res.json(error);
    } else {
      res.json(results);
    }
  });
});

//---------------  WC-KEYS ---------------------------------------------------------------------------------------------------
app.get("/wc-keys", (req, res) => {
  let query =
    "select idapiKey, key_id, user_id, consumer_key, consumer_secret, key_permissions from `wc-keys`";

  pool.query(query, (error, results) => {
    if (error) {
      res.json(error);
    } else {
      res.json(results);
    }
  });
});

app.post("/wc-keys", (req, res) => {
  const { key_id, user_id, consumer_key, consumer_secret, key_permissions } =
    req.body;

  let query =
    "insert into `wc-keys` (key_id, user_id, consumer_key, consumer_secret, key_permissions)" +
    `values ('${key_id}','${user_id}','${consumer_key}','${consumer_secret}','${key_permissions}')`;

  pool.query(query, (error, results) => {
    if (error) {
      res.json(error);
    } else {
      res.json(results);
    }
  });
});

app.put("/wc-keys/:id", (req, res) => {
  const { id } = req.params;
  const { key_id, user_id, consumer_key, consumer_secret, key_permissions } =
    req.body;

  let query =
    "update `wc-keys`" +
    `set  key_id = '${key_id}', 
  user_id = '${user_id}', 
  consumer_key = '${consumer_key}', 
  consumer_secret = '${consumer_secret}', 
  key_permissions ='${key_permissions}'
  where idapiKey like  '${id}'`;

  pool.query(query, (error, results) => {
    if (error) {
      res.json(error);
    } else {
      res.json(results);
    }
  });
});
app.delete("/wc-keys/:id", (req, res) => {});

//---------------  ML-KEYS ---------------------------------------------------------------------------------------------------
app.get("/ml-keys", (req, res) => {
  let query =
    "select idMLKeys, access_token, token_type, expires_in, scope, user_id, refresh_token from `ml-keys`";

  pool.query(query, (error, results) => {
    if (error) {
      res.json(error);
    } else {
      res.json(results);
    }
  });
});
app.post("/ml-keys", (req, res) => {
  const {
    access_token,
    token_type,
    expires_in,
    scope,
    user_id,
    refresh_token,
  } = req.body;

  let query =
    "insert into `ml-keys` (access_token, token_type, expires_in, scope, user_id, refresh_token)" +
    `values ('${access_token}','${token_type}','${expires_in}','${scope}','${user_id}','${refresh_token}')`;

  pool.query(query, (error, results) => {
    if (error) {
      res.json(error);
    } else {
      res.json(results);
    }
  });
});
app.put("/ml-keys/:id", (req, res) => {
  const { id } = req.params;

  const {
    access_token,
    token_type,
    expires_in,
    scope,
    user_id,
    refresh_token,
  } = req.body;

  let query =
    "update `ml-keys`" +
    `set access_token = '${access_token}', 
        token_type = '${token_type}', 
        expires_in = '${expires_in}', 
        scope = '${scope}', 
        user_id = '${user_id}', 
        refresh_token = '${refresh_token}'
    where idMLKeys like ${id}`;

  pool.query(query, (error, results) => {
    if (error) {
      res.json(error);
    } else {
      res.json(results);
    }
  });
});
app.delete("/ml-keys/:id", (req, res) => {
  const { id } = req.params;

  let query = "delete from `ml-keys`" + `where idMLKeys like ${id}`;

  pool.query(query, (error, results) => {
    if (error) {
      res.json(error);
    } else {
      res.json(results);
    }
  });
});

//                                                          [ WooCommerce ]

//--------------Consultar solo un producto----------------------------------------------------------------------------------------------
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

//---------Consultar todos los productos--------------------------------------------------------------------------------------
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

/* -----------Actualizar producto --------------------------------------------------------------------------------------
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
