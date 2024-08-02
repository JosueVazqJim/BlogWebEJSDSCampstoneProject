import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import multer from 'multer'; //to upload files
import ejs from "ejs";

const app = express();
const port = 3000;

let posts = []; //array to store the posts 'cause we don't have a database. But we have to add a new post to this array to practice
posts.push({ id: 0, title: "Post 1", category: "theory", date: "2021-09-01", description: "Description 1", image: "0.jpg" });
let id = 1; //id to assign to the posts

let firstLoad = true //to know if it's the first time the user goes to the website

// Configura el almacenamiento de multer para guardar archivos en disco
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads/'); // Directorio donde se guardarán los archivos
    },
    filename: function (req, file, cb) {
        const uniqueName = Math.random().toString(36).substring(2, 15); // Genera un UUID aleatorio
        const ext = file.originalname.split('.').pop(); // Obtén la extensión del archivo
        cb(null, `${uniqueName}.${ext}`); // Usa el UUID como nombre del archivo
    }
});
const upload = multer({ storage: storage }); // Crea un middleware de multer con la configuración de almacenamiento

app.use(morgan("combined"));

app.use(bodyParser.urlencoded({ extended: true })); //to parse the data from the form, but false is to parse only strings

app.use(express.static("public"));

//when the user goes to the root of the website or when is the first time the user goes to the website
app.get("/", (req, res) => {
    //render the index.ejs file
    res.render("index.ejs", { posts: posts, firstLoad: firstLoad } );
    firstLoad = false;
});

//when the user press the Create Post button
app.get("/createPost", (req, res) => {
    res.render("createPost.ejs");
});

//post request sendind the data to the server to create a new post
app.post("/submitCreatePost", upload.single('image'), (req, res) => { //upload.single('image') is to upload the image, pasa por el middleware de multer
    const { title, category, date, description } = req.body;
    const image = req.file ? req.file.filename : null;

    //now we have to save this post in the posts array, but this new post needs to be an object with an
    //id to be able to delete it later or to edit it or to show it in a different page
    const newPost = {
        id: id,
        title,
        category,
        date,
        description,
        image //this is the image name non the image itself parce que c'est un fichier
    };
    id++;
    posts.unshift(newPost);
    //now to test if the post was saved correctly
    console.log(posts);
    //res.send("Data received");

    //now, we have to redirect the user to the home page
    res.redirect("/");
});

//this is for cancel the post creation
app.get("/cancelCreatePost", (req, res) => {
    console.log("Post creation canceled");
    res.redirect("/");
});

//endpoint to update the post
app.get("/updatePost/:id", (req, res) => {
    //el usar :id significa que se va a recibir un parametro en la url
    //por ejemplo, si la url es http://localhost:3000/updatePost/1
    //el valor 1 sera capturado como el parametro id de req.params.id
    const { id } = req.params; //extraer el id de la url
    const post = posts.find((post) => {
        return post.id == id; //buscar el post con el id que se recibio
    }); //es una expresion lambda que recibe un post y compara el id del post con el id que se recibio
    if (post) {
        res.render("updatePost.ejs", { post: post }); //recordar que si no se encuentra el post, se envia un objeto vacio
        //por eso se debe usar local.post en el archivo updatePost.ejs para manejar el objeto vacio
    } else {
        // console.log("Post not found");
        // res.send("Post not found");
        res.redirect("/");
    }
});

//endpoint to confirm the update of the post
app.post("/submitUpdatePost/:id", upload.single('image'), (req, res) => {
    const { id } = req.params;
    const post = posts.find((post) => {
        return post.id == id;
    });
    if (post) {
        //si se encontro el post
        const { title, category, date, description } = req.body;
        let image = req.file ? req.file.filename : post.image; //si se subio una imagen, se usa la nueva, sino se usa la existente
        post.title = title;
        post.category = category;
        post.date = date;
        post.description = description;
        post.image = image;
        res.redirect("/");
    } else {
        console.log("Post not found");
        res.redirect("/");
    }
});

//now this is the endpoint to delete the post
app.get("/deletePost/:id", (req, res) => {
    const { id } = req.params;
    const index = posts.findIndex((post) => {
        //findIndex retorna el indice del primer elemento que cumple con la condicion
        return post.id == id; //en caso de no encontrar el elemento, retorna -1
    });
    if (index != -1) {
        posts.splice(index, 1);
        //splice elimina un elemento del array, el primer parametro es el indice y el segundo es la cantidad de elementos a eliminar
        //crea un array con los elementos eliminados y el array original queda modificado
        res.redirect("/");

    } else {
        console.log("Post not found");
        res.redirect("/");
    }
});

//to lift the server on the port 3000
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
