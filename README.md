# 🧠 MindRush

MindRush is a modern multiplayer quiz platform built with Java and Spring Boot. It allows users to create and play custom quiz packs through a responsive web interface.

## ✨ Current Features

* 🔐 User registration and login
* 👤 JWT-based authentication and authorization
* 🎮 Create and play quiz games
* 📝 Built-in quiz pack editor
* 📚 Create and manage custom question packs
* 🖼️ User avatar support
* 🗄️ PostgreSQL database
* 🐳 Docker support (`docker compose up --build -d`)
* 🌐 REST API backend

## 🛠️ Technology Stack

### Backend

* Java
* Spring Boot
* Spring Security
* Spring Data JPA
* PostgreSQL
* Maven

### Frontend

* HTML
* CSS
* JavaScript

### Infrastructure

* Docker
* Docker Compose

## 🚀 Quick Start

### Requirements

* Docker Desktop

### Run the application
1. Clone the repository and navigate to the project root:
```bash
   git clone [https://github.com/yasnO-Oleh/MindRush.git](https://github.com/yasnO-Oleh/MindRush.git)
   cd MindRush
```
2. Spin up the containers:

```bash
docker compose up --build -d
```
The application and its required services will start automatically.

3. Open your browser and go to: http://localhost:8080

4. To stop the application, simply run:

```bash
docker compose down
```

## 📌 Project Status

Implemented:

* ✅ Authentication
* ✅ Quiz gameplay
* ✅ Quiz pack creation
* ✅ User avatars
* ✅ Dockerized deployment

## 📷 Screenshots

<img width="2544" height="1300" alt="image" src="https://github.com/user-attachments/assets/24f73fbe-38bf-4ff0-8f41-2c83a983c759" />
<img width="2544" height="1304" alt="image" src="https://github.com/user-attachments/assets/656487ab-c64b-4677-a8da-308e0fc633ff" />
<img width="2531" height="1293" alt="image" src="https://github.com/user-attachments/assets/5cdc7d78-542f-47f4-8134-c0693e12510c" />

Planned for the future:

* 🔄 Community-created quiz packs
* 🔄 Improved media support for questions
* 🔄 Additional UI improvements

## 📄 Purpose

MindRush is a personal portfolio and learning project focused on backend development, REST APIs, authentication, databases, and containerized deployment using Docker.
