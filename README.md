# SAS Quiz App 🎓

![GitHub last commit](https://img.shields.io/github/last-commit/dimuzzo/quiz-app?style=flat-square&logo=github&label=Last%20Commit)
![GitHub repo size](https://img.shields.io/github/repo-size/dimuzzo/quiz-app?style=flat-square&logo=github&label=Repo%20Size)
![GitHub stars](https://img.shields.io/github/stars/dimuzzo/quiz-app?style=flat-square&logo=github&label=Stars)

Welcome to the SAS Quiz application! This is a web app designed to test your knowledge of Sviluppo Applicazioni Software.

The app is in Italian, but the English version is now live!

You can choose to switch up between the two languages whenever you want!

---

## 🌟 Overview

This application offers two main quiz modes:

1.  **Theory Quiz:** True/false questions to verify understanding of fundamental software application development concepts and the Unified Process.
2.  **Design Patterns Quiz:** Multiple-choice questions focused on GRASP and GoF design patterns (creational, structural, behavioral), with problem-solution scenarios and UML diagram interpretation.

Both quizzes provide immediate feedback with detailed explanations for each answer and a final screen summarizing the statistics.

---

## ✨ Key Features

* **Two Quiz Modes:**
    * Theory, where you can select the number of questions.
    * Design Patterns, with multiple-choice and UML-based questions.
* **Random Questions:** Questions and options are shuffled each session for a new experience every time.
* **Immediate Feedback:** Instantly see if your answer is correct or incorrect.
* **Detailed Explanations:** Understand the reasoning behind each answer.
* **Flexible Navigation:**
    * Jump directly to any question using a convenient dropdown menu and a visual question map.
    * Move step-by-step with "Previous" and "Next" buttons.
    * Use "Show Answer" to reveal the correct choice or "Stop Quiz" to end the session early.
* **Progress Tracking:**
    * A visual progress bar.
    * A real-time count of correct and incorrect answers during the quiz.
* **Results Summary:**
    * A final percentage score.
    * A detailed breakdown of correct/incorrect answers.
* **Modern and Responsive Design:** A clean, pleasant user interface that adapts to different devices.
* **PWA (Progressive Web App) Ready:** Includes a `manifest.json` for an experience similar to a native app.

---

## 🛠️ Technologies Used

* HTML5
* CSS3 (with Flexbox, Grid, and animations)
* JavaScript (Vanilla JS)

---

## 🚀 How to Run the Application

The application is entirely client-side and does not require a backend or complex build steps.

1.  **Clone the repository (or download the files):**
    ```bash
    git clone https://github.com/dimuzzo/quiz-app.git
    ```
    Alternatively, download the ZIP and unzip it.

2.  **Open the files in your browser:**
    https://dimuzzo.github.io/quiz-app/

---

## 📁 File Structure

The project is organized to separate content, styling, and logic for better maintainability.

* `index.html`: The main page where the user chooses the quiz type.
* `theory.html`: The HTML structure for the theory quiz. It loads the specific questions and initializes the quiz.
* `pattern.html`: The HTML structure for the design patterns quiz. It loads its specific questions and initializes the quiz.
* `style.css`: Contains the common CSS styles shared across all pages (layout, header, footer, etc.).
* `quiz-style.css`: Contains specific styles for the quiz interface (progress bar, question cards, options, etc.).
* `quiz-logic.js`: The core JavaScript engine for the quizzes. It handles question rendering, navigation, scoring, and results.
* `manifest.json`: Configuration file for the Progressive Web App.
* `icon-192.png` & `icon-512.png`: Icons for the PWA.

---

## 🙏 Contributions

If you want to contribute to the project, feel free to fork the repository and submit a pull request!

---

> Created with passion by [dimuzzo](https://github.com/dimuzzo)
