const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};


let sequelize;
if (config.use_env_variable) {
  console.log('ifff');
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  console.log('else');
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.documents.belongsTo(db.status);
db.status.hasMany(db.documents);

db.doc_signs.belongsTo(db.documents);
db.documents.hasMany(db.doc_signs);
db.doc_signs.belongsTo(db.organizations);
db.organizations.hasMany(db.doc_signs);
db.doc_signs.belongsTo(db.creators);
db.creators.hasMany(db.doc_signs);
db.doc_signs.belongsTo(db.recipients);
db.recipients.hasMany(db.doc_signs);
db.doc_signs.belongsTo(db.status);
db.status.hasMany(db.doc_signs);

db.sign_logs.belongsTo(db.doc_signs)
db.doc_signs.hasMany(db.sign_logs);
db.sign_logs.belongsTo(db.signs)
db.signs.hasMany(db.sign_logs);
db.sign_logs.belongsTo(db.status);
db.status.hasMany(db.sign_logs);

// db.feedbacks.belongsTo(db.candidates);
// db.candidates.belongsTo(db.colleges);

// db.candidates.hasMany(db.feedbacks);
// db.colleges.hasMany(db.candidates);

// db.mcq_set_mcqs.belongsTo(db.mcqs);
// db.mcq_set_mcqs.belongsTo(db.mcq_sets);

// db.mcq_sets.belongsToMany(db.mcqs, {
//   through  : db.mcq_set_mcqs,
//     foreignKey: 'mcqSetId',
//     otherKey: 'mcqId',
//     as: 'questions'
// })

// db.mcqs.belongsToMany(db.mcq_set_mcqs, {
//   through  : db.mcq_set_mcqs,
//   foreignKey: 'mcqId',
//     otherKey: 'mcqSetId',
//     as: 'sets'
// })

// db.problem_set_problem_definitions.belongsTo(db.problem_definitions);
// db.mcq_answers.belongsTo(db.mcqs);
// db.candidate_assigned_sets.belongsTo(db.mcq_sets);
// db.candidate_assigned_sets.belongsTo(db.problem_sets);
// db.candidate_assigned_sets.belongsTo(db.candidates);

// db.problem_solutions.belongsTo(db.problem_definitions ,{as: 'ProblemDef', foreignKey: 'problemId'});

module.exports = db;
