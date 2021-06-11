
let express = require('express')
let app = express()

let bodyParser = require('body-parser')
app.set('view engine', 'ejs')
app.use('/css',express.static('css'))

app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())

app.get('/', async (req, res, next) => {

    //on importe le modèle
    var Model = require('./Model');

    //recherche de tous les utilisateurs
    var users = await Model.User.findAll({
            order: [['name', 'ASC']]
    });

    for(var i = 0; i < users.length; i++) {
         var id_company = users[i].id_company.split(';');
         var companiesName = '';
         for(var j = 0; j < id_company.length; j++){
         var companiesUsers = await Model.Company.findAll({
                 where: {id: id_company[j]},
                 order: [['name', 'ASC']]
             });
              if(typeof companiesUsers[0] !== 'undefined')
                companiesName = companiesName  + companiesUsers[0].name + ', '
            }
            companiesName = companiesName.slice(0, -2);
            users[i].id_company = companiesName
    }

    //recherche de toutes les entreprises
    var companies = await Model.Company.findAll({
            order: [['name', 'ASC']]
    });
    for(var i = 0; i < companies.length; i++) {
         var id_user = companies[i].id_user.split(';');
         var usersName = '';
         for(var j = 0; j < id_user.length; j++){
         var usersComp = await Model.User.findAll({
                 where: {id: id_user[j]},
                 order: [['name', 'ASC']]
             });
             if(typeof usersComp[0] !== 'undefined')
                usersName = usersName  + usersComp[0].name + ', '
            }
            usersName = usersName.slice(0, -2);
            companies[i].id_user = usersName
    }



    res.render('pages/index', {users, companies})

})

app.post('/', (request, response) => {



    if(request.body.firstName !== undefined && request.body.idUser === undefined){// s'il s'agit d'un utilisateur
        crudUsers(request.body, 'add')

        response.redirect('/')
    }
    else if(request.body.siteWeb !== undefined && request.body.idEntreprise === undefined){// s'il s'agit d'une entreprise

        crudCompanies(request.body, 'add')
        response.redirect('/')
    }
        else if(request.body.idEntreprise !== undefined && request.body.siteWeb !== undefined){// s'il s'agit d'une modif entreprise
            crudCompanies(request.body, 'update')
            response.redirect('/')
        }
        else if(request.body.idUser !== undefined && request.body.firstName !== undefined){// s'il s'agit d'une modif utilisateurs

            crudUsers(request.body, 'update')
            response.redirect('/')
        }
        else if(request.body.idUser !== undefined && request.body.firstName === undefined ){// s'il s'agit d'une suppression utilisateurs
            crudUsers(request.body, 'delete')
            response.redirect('/')
        }
        else if(request.body.idEntreprise !== undefined && request.body.siteWeb === undefined){// s'il s'agit d'une suppression entreprise
            crudCompanies(request.body, 'delete')
            response.redirect('/')
        }

    else {
        console.log("erreur")
        response.redirect('/')
        }
    })


function crudUsers(body, action )
{
    var Model = require('./Model');
    if(action == 'add')
    {
         Model.User.create({
             name: body.nameUser,
             firstname : body.firstName,
             address : body.adresse,
             number : body.tel,
             email : body.email,
             id_company : body.idcompany
         }
         ).then(user => {
             console.log("ajout user ok")
             })
    }
    if(action == 'update')
    {
         Model.User.update(
                 {name: body.nameUser,
                 firstname: body.firstName,
                 address: body.adresse,
                 number: body.tel,
                 email: body.email,
                 id_company: body.idcompany},
                 {where: {id: body.idUser}}
         ).then(user => {
             console.log("update user ok")
         });

    }
        if(action == 'delete')
        {
             Model.User.destroy(
                     {where: {id: body.idUser}}
             ).then(user => {
                 console.log("delete user ok")
             });

        }


}
function crudCompanies(body, action){
    var Model = require('./Model');
    if(action == 'add')
    {

             Model.Company.create({
                 name: body.nameCompany,
                 address : body.adresse,
                 number : body.tel,
                 webSite : body.siteWeb,
                 id_user : body.iduser
             }).then(user => {
                 console.log("ajout company ok")
                 })
    }
        if(action == 'update')
        {
        console.log(body.idEntreprise)
             Model.Company.update(
                     {name: body.nameCompany,
                     address: body.adresse,
                     number: body.tel,
                     webSite: body.siteWeb,
                     id_user: body.iduser},
                     {where: {id: body.idEntreprise}}
             ).then(user => {
                  console.log("update user ok")
             });
        }
        if(action == 'delete')
        {
             Model.Company.destroy(
                     {where: {id: body.idEntreprise}}
             ).then(company => {
                 console.log("delete company ok")
             });

        }
}

app.listen(8080)