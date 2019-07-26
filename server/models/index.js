
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

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

db.college_courses.belongsTo(db.colleges);
db.college_courses.belongsTo(db.courses);

db.feedbacks.belongsTo(db.candidates);
db.candidates.belongsTo(db.colleges);

db.candidates.hasMany(db.feedbacks);
db.colleges.hasMany(db.candidates);

db.mcq_set_mcqs.belongsTo(db.mcqs);
db.mcq_set_mcqs.belongsTo(db.mcq_sets);

db.mcq_sets.belongsToMany(db.mcqs, {
  through  : db.mcq_set_mcqs,
    foreignKey: 'mcqSetId',
    otherKey: 'mcqId',
    as: 'questions'
})

db.mcqs.belongsToMany(db.mcq_set_mcqs, {
  through  : db.mcq_set_mcqs,
  foreignKey: 'mcqId',
    otherKey: 'mcqSetId',
    as: 'sets'
})

db.problem_set_problem_definitions.belongsTo(db.problem_definitions);
db.mcq_answers.belongsTo(db.mcqs);
db.candidate_assigned_sets.belongsTo(db.mcq_sets);
db.candidate_assigned_sets.belongsTo(db.problem_sets);
db.candidate_assigned_sets.belongsTo(db.candidates);

db.problem_solutions.belongsTo(db.problem_definitions ,{as: 'ProblemDef', foreignKey: 'problemId'});

module.exports = db;
