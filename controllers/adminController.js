const OneModel = require("../models/myModel");
const PostModel = require("../models/postModel");
const moment = require("moment");
const bcrypt = require("bcrypt");
const { hash } = require("bcrypt");
const imgbbUploader = require("imgbb-uploader");

global.isLogin = 0;
global.login = false;
let id = 0;
//respuesta a una petición de tipo post

exports.vista = (req, res) => {
    res.status(200).render("login", { isLogin: isLogin, login: login });
};

//vista kinesiologia
exports.kinesiologia = (req, res) => {
    res.status(200).render("kinesiologia");
};

//vista salud mental
exports.saludMental = (req, res) => {
    res.status(200).render("saludMental");
};

//vista neumonologia
exports.neumonologia = (req, res) => {
    res.status(200).render("neumonologia");
};

//error404
exports.error404 = (req, res) => {
    res.status(200).render("error404");
};

exports.logine = (req, res) => {
    if (req.body.usuario == "Doctor") {
        OneModel.find({ usuario: req.body.usuario }, (err, docs) => {
            bcrypt.compare(
                req.body.contraseña,
                bcrypt.hashSync(docs[0].contraseña, 5),
                (err, resul) => {
                    console.log(docs[0].contraseña);
                    if (err) throw err;
                    if (resul) {
                        res.session = true;
                        login = res.session;
                        isLogin = 1;
                        res.status(200).render("index", { login: login });
                    } else {
                        isLogin = 2;
                        res.status(200).render("login", {
                            isLogin: isLogin,
                            login: login,
                        });
                    }
                }
            );
        });
    } else {
        isLogin = 3;
        res.status(200).render("login", { isLogin: isLogin, login: login });
    }
};

exports.logout = (req, res) => {
    if (login) {
        res.redirect("/");
        req.session.destroy();
        login = false;
    } else {
        res.redirect("/");
    }
};

exports.postear = (req, res) => {
    if(login) {
        res.status(200).render("postPrueba", { isLogin: isLogin, login:login });
        PostModel.findOne().sort({ id: -1 }).exec(function (err, post) {
            console.log("Ultimo Id:" + post.id.toString());
            idPosts = post.id;
        });
    }
    else {
        res.status(200).render("index", { isLogin: 4, login: req.session.login, cerrar: 0 });
    };
}

exports.postear2 = (req, res) => {
    if (login) {
        res.status(200).render("postPrueba", {
            isLogin: isLogin,
            login: login,
        });
    } else {
        isLogin = 4;
        res.redirect("/"); //Hacer vista o algo con esto
    }
};


exports.seccionAdmin = (req, res) => {
    PostModel.find(function (err, data) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(data);
            res.status(200).render("edicionPosteos", { data: data });
        }
    });
};

exports.config = (req, res) => {
    res.status(200).render("config");
};

exports.user = (req, res) => {
    if (login) {
        res.status(200).render("user", { data: OneModel.find().limit(6) });
    } else {
        isLogin = 4;
        res.redirect("/"); //Hacer vista o algo con esto
    }
};

OneModel.find({ nombre: "admin" }).exec(function (err, books) {
    if (err) throw err;

    console.log(books);
});

//cambiamos la contraseña con la Query findOneAndUpdate.
exports.ChangePassword = (req, res) => {
    if (login) {
        OneModel.findOneAndUpdate(
            { nombre: "admin" },
            { $set: { contraseña: req.body.contraseña } },
            { new: true },
            function (err, doc) {
                if (err) console.log("Error ", err);
                console.log("Updated Doc -> ", doc);
                res.status(200).render("login", {
                    isLogin: isLogin,
                    login: login,
                });
            }
        );
    }
};

exports.ChangeUser = (req, res) => {
    if (login) {
        OneModel.findOneAndUpdate(
            { nombre: "admin" },
            { $set: { usuario: req.body.usuario } },
            { new: true },
            function (err, doc) {
                if (err) console.log("Error ", err);
                console.log("Updated Doc -> ", doc);
                res.status(200).render("login", {
                    isLogin: isLogin,
                    login: login,
                });
            }
        );
    }
};

exports.uploadImage = (req, res) => {
    if (!req.files) {
        return res.status(400).send("No files were uploaded.");
    }
    const file = req.files.foto;
    const path = "./public/files/" + file.name;
    file.mv(path, (err) => {
        if (err) {
            return res.status(500).send(err);
        }
        imgbbUploader("04facdbd2e755d55e56fdc0f9e422f92", "./public/files/" + file.name).then((res) => console.log(res.url)).catch((error) => console.log(error));
        return res.send({ status: "success", path: path })
    })
}

exports.subirPost = (req, res) => {
    let fecha = req.body.fecha;
    let titulo = req.body.titulo;
    let descripcion = req.body.descripcion;
    let imagen;
    let enlace = req.body.enlace;
    let tag = req.body.tag;
    let cloudinary_image = cloudinary.uploader.upload(req.file.path, { folder: "fotos", }).then(result => {
        PostModel.findOne().sort({ id: -1 }).exec(function (err, post) {
            ifdPosts = post.id;
            let posteo = new PostModel({
                id: idPosts + 1,
                fecha: fecha,
                titulo: titulo,
                descripcion: descripcion,
                imagen: result.url,
                enlace: enlace,
                tags: tag,
            });
            posteo.save((err, db) => {
                if (err) {
                    console.log(err);
                    res.status(200).render("index", { isLogin: 8, login: req.session.login, cerrar: 0 });
                }
                else {
                    res.status(200).render("index", { isLogin: 7, login: req.session.login, cerrar: 0 });
                }
            })
        });
    });
};


exports.edicion = (req, res) => {
    let id = req.params.id;
    PostModel.find({ id: id }, (err, post) => {
        res.status(200).render("editPosteo", { data: post });
    });
    PostModel.findOneAndUpdate({ id: id },
        { $set: { titulo: req.body.titulo, descripcion: req.body.descripcion, fecha: req.body.fecha, enlace: req.body.enlace, tags: req.body.tag } }, { new: true }, function (err, doc) {
            if (err) console.log("Error ", err);
            console.log("Updated Doc -> ", doc);
            PostModel.find().sort({ id: -1 }).exec(function (err, post) {
                console.log(post);
                res.status(200).render("edicionPosteos", { data: post });
            });

        });
};

exports.visualizar = (req, res) => {
    let id = req.params.id;
    PostModel.find({ id: id }, (err, post) => {
        console.log(post);
        res.status(200).render("visualizarPost", { data: post });
    });
};

exports.eliminar = (req, res) => {
    // let titulo = document.getElementById("titulo");
    // console.log(titulo.innerHTML); 
    User.findOneAndDelete({ id: req.params['id'] }, function (err, docs) {
        if (err) {
            console.log(err)
        }
        else {
            console.log("Deleted User : ", docs);
        }
    });
};

exports.eliminarPost = (req, res) => {
    let id = req.params.id;
    PostModel.find({ id: id }).remove().exec();
    PostModel.find().sort({ id: -1 }).exec(function (err, post) {
        console.log(post);
        res.status(200).render("edicionPosteos", { data: post });
    });
    res.redirect("/seccionAdmin");
}

exports.verPostsUsuario = (req, res) => {
    PostModel.find(function (err, data) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(data);
            res.status(200).render("verPostsUsuario", {data:data});
        }
    });
};

exports.contactanos = (req, res) => {
    PostModel.find(function (err, data) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(data);
            res.status(200).render("vistaContacto", { data: data });
        }
    });
}