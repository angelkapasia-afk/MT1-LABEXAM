import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const htmlPath = path.join(__dirname, "public", "index.html");
const PORT = 3000;

let books = [
  { id: 1, title: "The Alchemist", author: "Paulo Coelho", price: 350 },
  { id: 2, title: "Wings of Fire", author: "A. P. J. Abdul Kalam", price: 250 },
  { id: 3, title: "Atomic Habits", author: "James Clear", price: 450 }
];

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(data, null, 2));
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", chunk => {
      body += chunk;
      if (body.length > 1_000_000) {
        reject(new Error("Request body too large"));
        req.destroy();
      }
    });
    req.on("end", () => {
      if (!body.trim()) return reject(new Error("Request body is required"));
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error("Invalid JSON body"));
      }
    });
    req.on("error", reject);
  });
}

function validBook(book) {
  return book &&
    Number.isInteger(Number(book.id)) &&
    typeof book.title === "string" && book.title.trim().length > 0 &&
    typeof book.author === "string" && book.author.trim().length > 0 &&
    Number.isFinite(Number(book.price)) && Number(book.price) >= 0;
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const pathname = url.pathname;

  if (req.method === "GET" && pathname === "/") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end("<!doctype html><html><head><title>Library Management</title></head><body><h1>Welcome to Library Book Management</h1><p>Node.js HTTP module demonstration.</p><p>Try <a href='/books'>/books</a>, <a href='/about'>/about</a>, and <a href='/home'>/home</a>.</p></body></html>");
    return;
  }

  if (req.method === "GET" && pathname === "/books") {
    sendJson(res, 200, books);
    return;
  }

  if (req.method === "GET" && pathname === "/about") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end("<!doctype html><html><head><title>About</title></head><body><h1>About this application</h1><p>A sample library book management application built with Node.js HTTP and FS modules. Book data is stored in memory.</p></body></html>");
    return;
  }

  if (req.method === "GET" && pathname === "/home") {
    fs.readFile(htmlPath, "utf8", (error, html) => {
      if (error) {
        sendJson(res, 500, { error: "Unable to read the home page file." });
        return;
      }
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(html);
    });
    return;
  }

  if (req.method === "POST" && pathname === "/add-book") {
    try {
      const book = await readJsonBody(req);
      if (!validBook(book)) {
        sendJson(res, 400, { error: "Invalid book. Required: integer id, title, author and non-negative price." });
        return;
      }
      const id = Number(book.id);
      if (books.some(item => item.id === id)) {
        sendJson(res, 409, { error: "A book with this ID already exists." });
        return;
      }
      const newBook = {
        id,
        title: book.title.trim(),
        author: book.author.trim(),
        price: Number(book.price)
      };
      books.push(newBook);
      sendJson(res, 201, { message: "Book added successfully", book: newBook });
    } catch (error) {
      if (!res.headersSent && !res.destroyed) {
        sendJson(res, 400, { error: error.message || "Invalid request." });
      }
    }
    return;
  }

  sendJson(res, 404, { error: "Route not found." });
});

server.listen(PORT, () => {
  console.log(`HTTP Server running at http://localhost:${PORT}`);
});
