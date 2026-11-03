import express from "express";

const app = express();
const PORT = 4000;

app.use(express.json({ limit: "1mb" }));

let books = [
  { id: 1, title: "The Alchemist", author: "Paulo Coelho", price: 350, category: "Fiction" },
  { id: 2, title: "Wings of Fire", author: "A. P. J. Abdul Kalam", price: 250, category: "Biography" },
  { id: 3, title: "Atomic Habits", author: "James Clear", price: 450, category: "Self-help" }
];

function validateBook(body) {
  return body &&
    Number.isInteger(Number(body.id)) &&
    typeof body.title === "string" && body.title.trim().length > 0 &&
    typeof body.author === "string" && body.author.trim().length > 0 &&
    Number.isFinite(Number(body.price)) && Number(body.price) >= 0 &&
    (body.category === undefined || typeof body.category === "string");
}

function normalizeBook(body) {
  return {
    id: Number(body.id),
    title: body.title.trim(),
    author: body.author.trim(),
    price: Number(body.price),
    category: typeof body.category === "string" ? body.category : "Uncategorized"
  };
}

function getBookById(id) {
  return books.find(book => book.id === Number(id));
}

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the Library Book Management REST API",
    endpoints: ["GET /books", "GET /books/:id", "POST /books", "PUT /books/:id", "DELETE /books/:id"]
  });
});

app.get("/books", (req, res) => {
  res.status(200).json(books);
});

app.get("/books/:id", (req, res) => {
  const book = getBookById(req.params.id);
  if (!book) return res.status(404).json({ error: "Book not found." });
  res.status(200).json(book);
});

app.post("/books", (req, res) => {
  if (!validateBook(req.body)) {
    return res.status(400).json({ error: "Invalid book. Required: integer id, title, author and non-negative price." });
  }
  const book = normalizeBook(req.body);
  if (books.some(item => item.id === book.id)) {
    return res.status(409).json({ error: "A book with this ID already exists." });
  }
  books.push(book);
  res.status(201).json({ message: "Book added successfully", book });
});

app.put("/books/:id", (req, res) => {
  const book = getBookById(req.params.id);
  if (!book) return res.status(404).json({ error: "Book not found." });

  const body = req.body;
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return res.status(400).json({ error: "Request body must be a JSON object." });
  }
  if (body.title !== undefined && (typeof body.title !== "string" || !body.title.trim())) {
    return res.status(400).json({ error: "title must be a non-empty string." });
  }
  if (body.author !== undefined && (typeof body.author !== "string" || !body.author.trim())) {
    return res.status(400).json({ error: "author must be a non-empty string." });
  }
  if (body.price !== undefined && (!Number.isFinite(Number(body.price)) || Number(body.price) < 0)) {
    return res.status(400).json({ error: "price must be a non-negative number." });
  }
  if (body.category !== undefined && typeof body.category !== "string") {
    return res.status(400).json({ error: "category must be a string." });
  }

  if (body.title !== undefined) book.title = body.title.trim();
  if (body.author !== undefined) book.author = body.author.trim();
  if (body.price !== undefined) book.price = Number(body.price);
  if (body.category !== undefined) book.category = body.category;

  res.status(200).json({ message: "Book updated successfully", book });
});

app.delete("/books/:id", (req, res) => {
  const index = books.findIndex(book => book.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ error: "Book not found." });
  const [deletedBook] = books.splice(index, 1);
  res.status(200).json({ message: "Book deleted successfully", book: deletedBook });
});

app.use((req, res) => {
  res.status(404).json({ error: "Route not found." });
});

app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && "body" in error) {
    return res.status(400).json({ error: "Invalid JSON body." });
  }
  console.error(error);
  res.status(500).json({ error: "Internal server error." });
});

app.listen(PORT, () => {
  console.log(`Express Server running at http://localhost:${PORT}`);
});
