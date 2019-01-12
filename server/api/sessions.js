const jwt = require("jsonwebtoken");
const { User } = require("../models");
const secret = process.env.JWT_SECRET;

const withAuthorization = (handler) => (req, res) => {
  let token = req.headers["authorization"];
  let user;

  if (token && token.startsWith("Bearer ")) {
    // Remove Bearer from string
    token = token.slice(7, token.length);
  }

  if (token) {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return;
      }

      user = User.findById(decoded.uid);
    });
  }

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  req.user = user;

  return handler(req, res);
}

function signInHandler(req, res) {
  const username = req.body.username;
  const user = User.create({ username });

  const token = jwt.sign({ username: user.username, uid: user.id }, secret, {
    expiresIn: "7d"
  });

  return res.json({ token, uid: user.id, username: user.username });
}

const verifyHandler = withAuthorization((req, res) => {
  return res.status(200).json({ verify: 'ok' });  
}); 


module.exports = {
  signInHandler,
  verifyHandler,
  withAuthorization
};
