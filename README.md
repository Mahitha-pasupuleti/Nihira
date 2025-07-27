# Nihira – Real-Time Chat Application

**Nihira** is a scalable, modular, and real-time chat application built using a microservices architecture. Designed for performance, security, and extensibility, Nihira mimics production-grade chat systems like WhatsApp, Slack, and Discord—while offering transparency in design and educational value.

---

## 🚀 Features

* ⚡ **Real-time Messaging** using `Socket.IO`
* 📦 **Microservices Architecture** (Modular & Scalable)
* 📨 **Event-Driven Communication** using `Kafka`
* 🔀 **Efficient Pub/Sub** with `Redis`
* 🔐 **Secure Authentication** with `JWT`
* ☁️ **Cloud Deployment Ready** (AWS)
* 🛠️ **Modern Tech Stack** with best practices in scalability, fault-tolerance, and maintainability

---

## 🧱 Architecture Overview

```
Client (React) <---> Gateway Service (Express + JWT Auth)
                             |
                             V
                +-------------------------+
                |                         |
      Message Service <--> Kafka <--> Notification Service
                |
             MongoDB
                |
             Redis Pub/Sub
```

* **Gateway Service**: Handles authentication, token verification, and API routing.
* **Message Service**: Stores and routes messages, interacts with MongoDB, Kafka, and Redis.
* **Notification Service**: Consumes Kafka topics and handles notifications.
* **Kafka**: Acts as the backbone for scalable event communication.
* **Redis**: Used for pub/sub and temporary session/state management.

---

## 🧰 Tech Stack

| Layer              | Technology                  |
| ------------------ | --------------------------- |
| **Frontend**       | React                       |
| **Backend**        | Node.js + Express           |
| **Real-time Comm** | Socket.IO                   |
| **Message Broker** | Apache Kafka                |
| **Database**       | MongoDB                     |
| **Cache/Queue**    | Redis                       |
| **Authentication** | JWT                         |
| **Deployment**     | AWS EC2, Docker             |
| **AI Layer**       | Python + Transformers (NLP) |

---

## 📁 Folder Structure

```
nihira/
├── frontend/                      # React UI
│   └── src/, components/, pages/
│
├── backend/                       # Node.js Microservices
│   ├── gateway-service/
│   │   └── routes/, controllers/, auth/
│   ├── message-service/
│   │   └── socket/, kafka/, redis/, models/
│   └── notification-service/
│       └── consumers/, utils/
│
├── ai-layer/                      # Chat summarizer, NLP tools
│   └── summarizer/, detectors/, models/
│
├── shared/                        # Shared utilities/constants
│   └── utils/, constants/
│
├── docker-compose.yml
└── README.md
```

---

## 🔒 Security Highlights

* **JWT-based Authentication** to secure endpoints and Socket.IO connections.
* **Rate Limiting & Input Sanitization** (planned).
* **Service-to-Service Communication** via secure Kafka channels.

---

## 📈 Scalability & Reliability

* **Kafka** allows decoupling of services for independent scaling.
* **Redis Pub/Sub** ensures lightweight, real-time state sync.
* Services are **containerized** and can be deployed across nodes using Docker & AWS.

---

## 🧪 Testing

* ✅ Unit and integration tests (Jest + Supertest)
* ✅ Kafka topic simulation for event reliability
* ✅ Manual tests for real-time socket events

---

## 🧠 Learning Goals

This project was built as part of the **CPSC 598 Seminar** to demonstrate:

* Real-time backend system design
* Microservices communication patterns
* Kafka-based event streaming
* Production-grade software modularity

---

## 📦 Future Improvements

* User presence/status tracking
* File sharing in chat
* Group messaging and threads
* Admin dashboard for analytics
* Kafka dead-letter queue handling

---

## 🧑‍💻 Author

**Mahitha Pasupuleti**
🌐 [Portfolio](#) | 💼 [LinkedIn](#) | 📧 [Email](#)
Open to internships and full-time roles in **Backend Engineering**, **Distributed Systems**, and **Real-Time Applications**

---

## 📄 License

This project is for educational and portfolio use. Feel free to fork and customize!
