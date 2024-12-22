const jwt = require("jsonwebtoken");
const secret = process.env.SECRET_CODE;
function setUser(data) {
  return jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 60,
      data: data,
      role: data.role,
    },
    secret
  );
}

function getUser(token) {
  if (!token) return null;
  try {
    return jwt.verify(token, secret, (err, res) => {
      return {
        err,
        res,
      };
    });
  } catch (error) {
    console.log("enter valid jwt");
    return null;
  }
}
module.exports = { setUser, getUser };
