# 🚌 Fleet & Tire Lifecycle Management Backend

This project is a Node.js + Express backend API for managing buses, tires, trips, and tire lifecycle history.  
It follows a clean controller–service–model architecture for scalability and maintainability.

---

## 📁 Project Structure

src/
│
├── app.js
├── server.js
│
├── config/
│   ├── constants.js
│   └── db.js
│
├── controllers/
│   ├── busController.js
│   ├── tireController.js
│   ├── tripController.js
│   └── historyController.js
│
├── services/
│   ├── busService.js
│   ├── tireService.js
│   ├── tripService.js
│   └── historyService.js
│
├── models/
│   ├── busModel.js
│   ├── tireModel.js
│   ├── tripModel.js
│   ├── tireHistoryModel.js
│   └── busTireSlotModel.js
│
├── routes/
│   ├── busRoute.js
│   ├── tireRoute.js
│   ├── tripRoute.js
│   └── historyRoute.js
│
└── utils/
    └── lifecycleCalculator.js

---

## 🧠 Architecture Overview

- Routes handle API endpoints
- Controllers handle HTTP requests and responses
- Services contain business logic
- Models define database schemas
- Utils contain reusable helper logic

This separation ensures clean, maintainable, and testable code.

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- MongoDB (local or cloud)

---

### Installation

```bash
npm install

## 📌 Modules Overview

## 🚌 Bus Module
- Create and manage buses
- Configure tire slots for each bus

### 🛞 Tire Module
- Register and manage tires
- Track tire status and usage

### 🧾 Trip Module
- Create trips
- Assign buses to trips
- Track distance and usage

### 📊 Tire History Module
- Maintain tire lifecycle history
- Track wear and usage across trips

---

## 🧮 Tire Lifecycle Utility

The `lifecycleCalculator` utility centralizes logic for:
- Tire usage calculation
- Lifecycle estimation
- Consistent business rules

---

## 🛠 Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JavaScript (ES6+)

---

## ✅ Key Features

- Modular and scalable architecture
- Clear separation of concerns
- Easy to extend for analytics and reporting
- Production-ready backend structure
