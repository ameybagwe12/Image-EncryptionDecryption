const express = require("express");
const app = express();

const cors = require("cors");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const CryptoJS = require("crypto-js");
const fs = require("fs");

const key = "0123456789abcdef";
let plaintext = "";

plaintext = fs.readFileSync("chaava.jpeg", "hex").toString();

// Define DES class
class DES {
  constructor(key) {
    // Initialize DES with key
    this.key = CryptoJS.enc.Hex.parse(key);
  }

  encrypt(plaintext) {
    // Perform DES encryption on plaintext
    const encrypted = CryptoJS.DES.encrypt(plaintext, this.key, {
      mode: CryptoJS.mode.ECB,
    });

    // Return ciphertext as hex string
    return encrypted.ciphertext.toString();
  }

  decrypt(ciphertext) {
    // Parse ciphertext from hex string
    const ciphertextHex = CryptoJS.enc.Hex.parse(ciphertext);

    // Perform DES decryption on ciphertext
    const decrypted = CryptoJS.DES.decrypt(
      { ciphertext: ciphertextHex },
      this.key,
      { mode: CryptoJS.mode.ECB }
    );

    // Return decrypted plaintext as UTF-8 string
    return decrypted.toString(CryptoJS.enc.Utf8);
  }
}

// Perform DES encryption
const des = new DES(key);
const ciphertext = des.encrypt(plaintext);

// Perform DES decryption
const decrypted = des.decrypt(ciphertext);

// Print results
// console.log("Plaintext: ", plaintext);
// console.log("Ciphertext: ", ciphertext);
// console.log("Decrypted: ", decrypted);

console.log(decrypted);
// printPT(plaintext, "plaintext")
// printPT(decrypted, "decrypted")

let b = Buffer.from(decrypted);

const decryptedFile = b.toString("base64");

fs.writeFile("chaava420.jpeg", decryptedFile, function (err) {
  if (err) throw err;
  console.log("Saved!");
});

// Create a JWT
function createJwt(payload, secretKey) {
  const header = { alg: "HS256", typ: "JWT" };
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = btoa(`${encodedHeader}.${encodedPayload}.${secretKey}`);
  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

// Verify a JWT
function verifyJwt(token, secretKey) {
  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new Error("Invalid JWT format");
  }
  const encodedHeader = parts[0];
  const encodedPayload = parts[1];
  const signature = parts[2];
  const expectedSignature = btoa(
    `${encodedHeader}.${encodedPayload}.${secretKey}`
  );
  if (signature !== expectedSignature) {
    throw new Error("Invalid JWT signature");
  }
  const header = JSON.parse(atob(encodedHeader));
  const payload = JSON.parse(atob(encodedPayload));
  return { header, payload };
}

// Encode a base64 URL-safe string
function base64UrlEncode(str) {
  const base64 = Buffer.from(str, "utf8").toString("base64");

  //   base64 = base64.replace(/=/g, "");
  //   base64 = base64.replace(/\+/g, "-");
  //   base64 = base64.replace(/\//g, "_");
  return base64;
}

app.listen(5000, () => {
  console.log("Listening on port 5000");
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  console.log("====================================");
  console.log(email, password);
  console.log("====================================");
  const payload = { email: email, password: password };
  const secretKey = "my_secret_key";

  const token = createJwt(payload, secretKey);
  console.log(token);

  const decoded = verifyJwt(token, secretKey);
  console.log(decoded);
});
