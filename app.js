const path = require('path');
const express = require('express');
const session = require('express-session');
//const helpers = require('./utils/helpers');
//test
const sequelize = require('./config/connection');
const exphbs = require('express-handlebars');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const routes = require("./controllers")


const app = express();
const PORT = process.env.PORT || 3000;
// const PORT = 3001;

// Set up Handlebars.js engine with custom helpers
//const hbs = exphbs.create({ helpers });
const hbs = exphbs.create();

const sess = {
    secret: 'Super secret secret',
    cookie: {
      maxAge: 300000,
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
    },
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
      db: sequelize,
    }),
};
  
  app.use(session(sess));
  

  // Inform Express.js on which template engine to use
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
//possible way to fix the header type
app.use((req, res, next) =>{
  if(req.url.endsWith('.js')){
    res.setHeader('Content-Type', 'text/javascript');
  }
  next();
});

app.use(routes);

sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log(`Now listening on ${PORT}`));
  });