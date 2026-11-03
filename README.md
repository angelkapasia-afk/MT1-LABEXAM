# MT1-LABEXAM — Library Book Management

This project follows the supplied MT1 Lab Examination problem statement. It contains two independent applications:

- **Part A:** built-in Node.js `http` and `fs` modules on port `3000`
- **Part B:** Express.js CRUD REST API on port `4000`
- **Storage:** JavaScript arrays only; no database

## Setup

Install a current LTS version of Node.js and npm. Open a terminal in this project folder and run:

```bash
npm install
```

## Part A — HTTP and FS modules

```bash
npm run start:http
```

Open these URLs in a browser:

- http://localhost:3000/
- http://localhost:3000/books
- http://localhost:3000/about
- http://localhost:3000/home

Add a book using `POST http://localhost:3000/add-book` with Body → raw → JSON:

```json
{
  "id": 4,
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "price": 550
}
```

## Part B — Express REST API

Open a **second terminal** in the same folder and run:

```bash
npm run start:express
```

Base URL: `http://localhost:4000`

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/books` | Retrieve all books |
| GET | `/books/:id` | Retrieve one book by ID |
| POST | `/books` | Add a new book (HTTP 201) |
| PUT | `/books/:id` | Update book details |
| DELETE | `/books/:id` | Delete a book |

Sample POST body (Body → raw → JSON):

```json
{
  "id": 4,
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "price": 550,
  "category": "Programming"
}
```

Sample PUT body for `PUT http://localhost:4000/books/1`:

```json
{
  "title": "The Alchemist - Updated",
  "price": 400,
  "category": "Fiction"
}
```

Set `Content-Type: application/json` for JSON requests. The array is held in memory, so changes reset when the relevant server is restarted.

## Suggested testing order

1. Start Part A and visit `/`, `/books`, `/about` and `/home`.
2. Send POST `/add-book` with a new book object.
3. Start Part B in another terminal.
4. Test GET `/books` and GET `/books/1`.
5. Test POST `/books` with ID `4`.
6. Test PUT `/books/1` with updated fields.
7. Test DELETE `/books/1`.
8. Test a missing ID and an unknown route for 404 responses.
9. Capture your own screenshots in `screenshots/`.

## GitHub submission

Create a repository named `MT1-LABEXAM`. From this folder run:

```bash
git init
git add .
git commit -m "Initial project setup"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/MT1-LABEXAM.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your GitHub username. After completing each module, commit and push the changes using meaningful messages, for example:

```bash
git add .
git commit -m "Implement Node HTTP routes and FS page serving"
git add .
git commit -m "Add Express library book CRUD API"
git push
```

## Screenshot checklist

- [ ] HTTP server running in terminal
- [ ] `/home` page loaded in browser (FS module)
- [ ] Express server running in terminal
- [ ] EchoAPI GET, POST, PUT and DELETE responses
- [ ] GitHub repository and commit history

Screenshots must be captured from your own running application; they are not fabricated or included as evidence in this starter solution.
