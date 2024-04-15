const jwt = require("jsonwebtoken");

async function sign(userData) {
  const secretKey = process.env.JWT_SECRET_KEY;
  const expiresIn = process.env.JWT_SECRET_KEY_EXPIRE_IN;
  const token = jwt.sign(
    { user: userData.name, role: userData.role },
    secretKey,
    { expiresIn: expiresIn }
  );
  return token;
}

async function verify(token) {
  const secretKey = process.env.JWT_SECRET_KEY;
  const decodedToken = jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      throw new Error("Debe proveer un token valido");
    }
    return decoded;
  });
  return decodedToken;
}

module.exports = { sign, verify };
