const express = require("express")
const app = express()
const fs = require("fs");
const {
    v4: uuidv4
} = require('uuid');

app.use(express.json());
const port = 3015

//Integrar Handlebars
const hbs = require("hbs")
app.set("view engine", "hbs")
app.set("views", `${__dirname}/views`)
hbs.registerPartials(`${__dirname}/views/partials`)

//Middleware para tener disponibles los archivos de Bootstrap en el Front
app.use("/bootstrap", express.static(`${__dirname}/node_modules/bootstrap/dist`))
//Middleware para tener disponibles los archivos de acceso público del proyecto (css, js, img, etc)
app.use(express.static(`${__dirname}/public`))

app.listen(port, () => console.log(`Servidor ejecutando en el puerto ${port}`))

const itemsMenu = [{
        label: 'Inicio',
        url: "/",
        active: false
    },
    {
        label: 'Animes',
        url: "/animes",
        active: false
    },

]



app.get("/", (req, resp) => {
    itemsMenu.map(item => {
        item.active = item.url === '/'
        return item
    })
    const itemsBreadcrumbs = ["Inicio"]
    resp.render("index", {
        itemsMenu,
        itemsBreadcrumbs
    })
})

app.get("/animes", (req, resp) => {
    itemsMenu.map(item => {
        item.active = item.url === '/animes'
        return item
    })
    const itemsBreadcrumbs = ["Inicio", "Animes"]
    resp.render("animes", {
        itemsMenu,
        itemsBreadcrumbs
    })
})



const animesDataPath = './anime.json';


// Obtener un anime por su ID
app.get('/anime/:id', (req, res) => {
    const animeId = req.params.id;
    fs.readFile(animesDataPath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error al leer los datos de animes.');
        } else {
            const animes = JSON.parse(data);
            const anime = animes[animeId];
            if (anime) {
                res.json(anime);
            } else {
                res.status(404).send('Anime no encontrado.');
            }
        }
    });
});


// Obtener todos los animes
app.get('/animes', (req, res) => {
    fs.readFile(animesDataPath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error al leer los datos de animes.');
        } else {
            const animes = JSON.parse(data);
            res.json(animes);
        }
    });
});

// Obtener un anime por su ID
app.get('/animes/:id', (req, res) => {
    const animeId = req.params.id;
    fs.readFile(animesDataPath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error al leer los datos de animes.');
        } else {
            const animes = JSON.parse(data);
            const anime = animes[animeId];
            if (anime) {
                res.json(anime);
            } else {
                res.status(404).send('Anime no encontrado.');
            }
        }
    });
});

// Crear un nuevo anime
app.post('/animes', (req, res) => {
    const anime = req.body;
    const animeId = uuidv4();

    fs.readFile(animesDataPath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error al leer los datos de animes.');
        } else {
            const animes = JSON.parse(data);
            animes[animeId] = anime;

            fs.writeFile(animesDataPath, JSON.stringify(animes, null, 2), (err) => {
                if (err) {
                    console.error(err);
                    res.status(500).send('Error al escribir los datos de animes.');
                } else {
                    res.send(`Anime creado con ID: ${animeId}`);
                }
            });
        }
    });
});

// Actualizar un anime existente
app.put('/animes/:id', (req, res) => {
    const animeId = req.params.id;
    const updatedAnime = req.body;

    fs.readFile(animesDataPath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error al leer los datos de animes.');
        } else {
            const animes = JSON.parse(data);
            if (animes[animeId]) {
                animes[animeId] = updatedAnime;

                fs.writeFile(animesDataPath, JSON.stringify(animes, null, 2), (err) => {
                    if (err) {
                        console.error(err);
                        res.status(500).send('Error al escribir los datos de animes.');
                    } else {
                        res.send(`Anime actualizado con ID: ${animeId}`);
                    }
                });
            } else {
                res.status(404).send('Anime no encontrado.');
            }
        }
    });
});

// Eliminar un anime existente
app.delete('/animes/:id', (req, res) => {
    const animeId = req.params.id;

    fs.readFile(animesDataPath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error al leer los datos de animes.');
        } else {
            const animes = JSON.parse(data);
            if (animes[animeId]) {
                delete animes[animeId];

                fs.writeFile(animesDataPath, JSON.stringify(animes, null, 2), (err) => {
                    if (err) {
                        console.error(err);
                        res.status(500).send('Error al escribir los datos de animes.');
                    } else {
                        res.send(`Anime eliminado con ID: ${animeId}`);
                    }
                });
            } else {
                res.status(404).send('Anime no encontrado.');
            }
        }
    });
});