/* eslint-disable no-useless-catch */


//const bcrypt = require('bcryptjs');
const LocalStrategy = require('passport-local').Strategy;
const { User } = require('./db/models'); // Assuming you have a User model defined with Sequelize

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await User.findOne({ where: { username } });
        if (user === null) {
          return done(null, false);
        }

        if(password === user.password){

          return done(null, user);
        }

        return done(null, false);
      } catch (error) {
        throw error;
      }
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findByPk(id);

      if (user) {
        const userInfo = {
          id: user.id,
          username: user.username
        };
        done(null, userInfo);
      } else {
        done(null, false);
      }
    } catch (error) {
      throw error;
    }
  });
};
