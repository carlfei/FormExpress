//! EJERCICIO 2
//! Genere un formulario de tipo cliente que valide los siguientes campos
//! • Nombre (10 caracteres)
//! • Apellido1 (10 caracteres)
//! • Apellido2 (10 caracteres)
//! • NIF/NIE/CIF (Valido)
//! Si es mandado por método POST, se debe enviar un ID obligatorio
//! Si es mandado por PUT, el ID debe estar vacio.

//! En caso de error se debe mandar un mensaje al cliente indicando el tipo de error
//! detectado.

// Importamos el framework de Express (necesario instalar el framework previamente)
const express = require('express');
// Importamos la libreria body-parser que nos permite analizar y decodificar el formato de documento
const bodyParser = require('body-parser');
// Definimos el puerto que utilizará nuestro servidor
const PORT = 3000;
// Creamos el objeto que definirá el comportamiento de los verbos/métodos de HTTP
const app = express({extended:true});
// Se utiliza el middleware body-parser para analizar datos codificados (propio de las solicitudes POST y PUT)
// utilizando el urlencoded para evitar estructuras anidadas, matrices y objetos complejos. 
// Sin parametros el método esta deprecated 
// Con parametro extended:false -> se utiliza la especificación querystring library https://www.npmjs.com/package/query-string
// Con parametro extended:true -> se utiliza la especificación qs library https://www.npmjs.com/package/qs
app.use(bodyParser.urlencoded({extended:false}));
// Especificamos el formato a través del método use() y nuestro objeto body-parser
app.use(bodyParser.json());

// Definimos el comportamiento (2º argumento) de nuesta aplicación cuando alguien accede 
// mediante el método POST al endpoint (1º argumento)
/* 
    Ejemplo: 
    app.post('/cliente/:id', (req,res) =>{
        console.log('Hola mundo');
    });
    http://localhost:3000/cliente/1 -> Hola mundo

*/
// Módelo del objeto
/* 
{
    'nombre':'Alvaro',
    'apellido1':'Gonzalez',
    'apellido2':'Martinez',
    'DNI':12434656J
} 
*/
// Creamos un array donde añadiremos los mensajes de error que se provoquen
var errors = [];

// Métodos de HTTP que establecen el endpoint y el controlador en el middleware
app.get('/', (req, res) =>{
    // usamos el sendFile para enviar el archivo html a la vista
    // definimos la ruta donde esta el archivo .html usando la variable global de node.js
    // __dirname y concatenandola al nombre del archivo

    res.sendFile(__dirname +'/index.html');
})

app.post('/cliente/:id', async (req, res) => { // Con la keyword async indicamos que queremos trabajar de forma asincrona
    try {
        // Recuperamos la información a través del objeto req (request)
        const { nombre, apellido1, apellido2, DNI } = req.body;
        const ID = Number.parseInt(req.params.id);
/*         if (!isNaN(ID) || ID<=0) {
            errors.push('El ID es incorrecto');
        } */
        // Esperamos (await) a que el método validarCampos() termine su proceso
        await validarCampos(nombre.trim(), apellido1.trim(), apellido2.trim(), DNI.trim());
        // Revisamos que se hayan añadido errores a nuestro array
        if(errors.length>0) throw new Error(errors.join('\n'));
        // Crear un objeto para emitir la respuesta
        const respuesta = {
            mensaje: "¡Formulario valido!",
            cliente: {
                ID: ID,
                nombre: nombre,
                apellido1: apellido1,
                apellido2: apellido2,
                DNI: DNI
            }
        }
        // Damos la respuesta en formato JSON
        res.json(respuesta);
        // En caso de error el bloque catch captura ese error
    } catch (error) {
        // Con el método status() establecemos un status code y mostramos el mensaje de error
        res.status(400).send(error.message);
    } finally {
        errors = [];
    }
});

app.put('/cliente', async (req, res) => {
    try {
        const { nombre, apellido1, apellido2, DNI } = req.body;
        await validarCampos(nombre.trim(), apellido1.trim(), apellido2.trim(), DNI.trim());
        if(errors.length>0) throw new Error(errors.join('\n'));

        const respuesta = {
            mensaje: "¡Formulario valido!",
            cliente: {
                nombre: nombre,
                apellido1: apellido1,
                apellido2: apellido2,
                DNI: DNI
            }
        }
        res.json(respuesta);
    } catch (error) {
        res.status(400).send(error.message);
    } finally {
        errors = [];
    }
});

// En este método validamos los datos
async function validarCampos(nombre, apellido1, apellido2, DNI) {
    if (nombre.length < 1 || nombre.length > 10) errors.push('El nombre no tiene el tamaño adecuado.');
    if (apellido1.length < 1 || apellido1.length > 10) errors.push('El apellido1 no tiene el tamaño adecuado.');
    if (apellido2.length < 1 || apellido2.length > 10) errors.push('El apellido2 no tiene el tamaño adecuado.');
    if (!/^[0-9]{8}[A-Z]$/.test(DNI)) errors.push('El DNI no es correcto');
}

// Levantamos el servidor 
app.listen(PORT, () => {
    console.log(`servidor Express escuchando el puerto ${PORT}`);
});

