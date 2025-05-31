# LifeLinkr Employee Management Portal

This project is a full-stack Employee Management Portal (HRM) built with the MERN stack (MongoDB, Express, React, Node.js) and deployed using Vercel (frontend) and Render (backend).

## Project Overview
- **Frontend:** React (Vite)
- **Backend:** Node.js + Express
- **Database:** MongoDB (Atlas)
- **Image Storage:** Cloudinary (stores image URLs in MongoDB)
- **Deployment:**
  - Frontend: Vercel
  - Backend: Render

## How This Was Built
- The code was written with the assistance of GitHub Copilot (GPT).
- MongoDB was chosen as the database for its flexibility and ease of use with Node.js. If you want to build a more traditional HRM portal, you can use a SQL-based database (like MySQL or PostgreSQL) instead.
- For image uploads, we used Cloudinary to store images online. Only the image URL is saved in MongoDB, making it compatible with a text-based database.
- The frontend and backend are fully integrated and deployed to cloud platforms for public access.

## Features
- Admin authentication (login required)
- Employee CRUD (Create, Read, Update, Delete)
- Image upload (Cloudinary)
- Robust validation (required fields, email/mobile format, duplicate checks, file type)
- Responsive UI with sorting and search

## Demo Credentials
- **Username:** `hukum123`
- **Password:** `Hello01.!`

## Deployment Links
- **Frontend (Vercel):** [https://life-linkr-brown.vercel.app](https://life-linkr-brown.vercel.app)
- **Backend (Render):** [https://lifelinkr-z1vr.onrender.com](https://lifelinkr-z1vr.onrender.com)

## Video Demonstration
- [Watch the demo video](https://drive.google.com/file/d/1wT0AZPpCXbYYGDqUxVjW1aqNFwwdJpk0/view?usp=sharing)

## Notes
- All API endpoints are protected and validated.
- Images are not stored in the database, only their URLs.
- You can extend this project to use SQL databases or add more HRM features as needed.

---

Built with ❤️ and AI assistance.