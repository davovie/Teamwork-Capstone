const jwt = require("jsonwebtoken");

//Check to make sure header is not undefined, if so, return Forbidden (403)
const checkToken = (req, res, next) => {
  const header = req.headers["authorization"];

  if (typeof header !== "undefined") {
    const bearer = header.split(" ");
    const token = bearer[1];

    req.token = token;
    next();
  } else {
    //If header is undefined return Forbidden (403)
    res.sendStatus(403);
  }
};

const auth = (req, res, next) => {
  try {
    const stringArray = req.headers.authorization.split(' ');
    const token = stringArray[1] ? stringArray[1] : stringArray[0];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userid = decodedToken.employeeId;
    if (req.body.employeeid && req.body.employeeid !== userid) {
      throw 'Invalid user ID';
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};

module.exports = { auth };
