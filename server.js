
let express = require('express')
let app = express()

let bodyParser = require('body-parser')
app.set('view engine', 'ejs')
app.use('/css',express.static('css'))

app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())

app.get('/', (request, response) => {

    //on importe le modèle
    var Model = require('./Model');
    //recherche de tous les utilisateurs
    Model.User.findAll().then(users => {
        //on récupère ici un tableau "users" contenant une liste d'utilisateurs
       // console.log(users);
    }).catch(function (e) {
        //gestion erreur
       // console.log(e);
    });

    response.render('pages/index')
})

app.post('/', (request, response) => {
    var Model = require('./Model');
    console.log(request.body.nameCompany);
    if(request.body.nameCompany !== undefined || request.body.nameCompany !== ''){// s'il s'agit d'une entreprise
             Model.User.create({
                 name: 'Test',
                 email : 'test@testmail.com'
             }).then(user => {
                 return user.destroy();
                 })
        response.redirect('/')
    }

    else {

        response.redirect('/')
        }
    })





app.listen(8080)