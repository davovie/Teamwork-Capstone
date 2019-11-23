const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    const stringArray = req.headers.authorization.split(' ');
    const token = stringArray[1] ? stringArray[1] : stringArray[0];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userid = decodedToken.userid;
    if (userid.NaN) {
      throw 'Could not gain access!!';
    } else {
      req.auth = userid;
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};

module.exports = { auth };
