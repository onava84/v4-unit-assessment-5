const bcryptjs = require("bcryptjs");

module.exports = {
  register: (req, res) => {
    const { username, password } = req.body;
    const db = req.app.get("db");
    if (username && password) {
      db.user.check_username({ username }).then((count) => {
        const newCount = +count[0].count;
        if (newCount > 0) {
          res.status(500).then("The user is already taken");
        } else {
          const hash = bcryptjs.hashSync(password);
          db.user
            .create_user({
              username,
              password: hash,
              profile_pic: `https://robohash.org/${username}.png`,
            })
            .then(() => {
              req.session.loggedIn = true;
              res.sendStatus(200);
            })
            .catch((error) => {
              console.log(error);
            });
        }
      });
    } else {
      res.status(400).send("Please provide username and password");
    }
  },
  login: (req, res) => {
    const { username, password } = req.body;
    const db = req.app.get("db");
    db.user.find_user_by_username({ username }).then((user) => {
      if (user[0]) {
        const { password: hash } = user[0];
        const areEqual = bcryptjs.compareSync(password, hash);
        if (areEqual) {
          req.session.loggedIn = true;
          req.session.user = user[0];
          res.status(200).send(user[0]);
        } else {
          res.status(404).send("Username or password is incorrect");
        }
      } else {
        res.status(401).send("Username not found");
      }
    });
  },
  logout: (req, res) => {
    req.session.destroy();
    res.sendStatus(200);
  },
  getUser: (req, res) => {
    if (req.session.user) {
      res.status(200).send(req.session.user);
    } else {
      res.status(404).send("There is no user");
    }
  },
};
