var Sequelize = require('sequelize');
var sequelize = new Sequelize('basetest', 'root', '', {
host: 'localhost',
dialect: 'mysql',
logging: false,
});

var exports = module.exports = {};
exports.sequelize = sequelize;

/**
 * company
 */
const Company = sequelize.define('company', {
    id: {type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true},
    name: {type: Sequelize.STRING(255), allowNull: false},
    address: {type: Sequelize.STRING(255), allowNull: false},
    number: {type: Sequelize.STRING(255), allowNull: false},
    webSite: {type: Sequelize.STRING(255), allowNull: false},
    id_user: {type: Sequelize.STRING(255), allowNull: false},

},
        {tableName: 'company', timestamps: false, underscored: true}
);
exports.Company = Company;

/*
 * USER
 */
const User = sequelize.define('user', {
    id: {type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true},
    name: {type: Sequelize.STRING(255), allowNull: false, },
     firstname: {type: Sequelize.STRING(255), allowNull: false, },
      address: {type: Sequelize.STRING(255), allowNull: false, },
       number: {type: Sequelize.STRING(255), allowNull: false, },
    email: {type: Sequelize.STRING(255), allowNull: false, unique: true},
     id_company: {type: Sequelize.STRING(255), allowNull: false, unique: true},
},
        {tableName: 'user', timestamps: false, underscored: true}
);
exports.User = User;


sequelize.sync({logging: console.log});
