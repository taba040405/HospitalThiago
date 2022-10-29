const Admin = require("../models/myModel");
const PostModel = require("../models/postModel");
const moment = require("moment");
global.isLogin = 0;

//Ejemplo de respuesta a una petición de tipo GET
exports.inicio = (req, res) => {
    PostModel.find(function (err, data) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(data);
            res.status(200).render("index", {data:data});
        }
    });
};

const msg = new Admin({
    nombre: "admin",
    apellido: "1",
    usuario: "Admin1",
    contraseña: "administrador",
    avatar: "...",
    email: "adminhospital@gmail.com",
});

// msg.save()
//    .then(doc => {
//      console.log(doc)
//    })
//    .catch(err => {
//      console.error(err)
//   })
