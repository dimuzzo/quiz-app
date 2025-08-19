# SAS Quiz App 🎓

![GitHub last commit](https://img.shields.io/github/last-commit/dimuzzo/quiz-app?style=flat-square&logo=github&label=Last%20Commit)
![GitHub repo size](https://img.shields.io/github/repo-size/dimuzzo/quiz-app?style=flat-square&logo=github&label=Repo%20Size)
![GitHub stars](https://img.shields.io/github/stars/dimuzzo/quiz-app?style=flat-square&logo=github&label=Stars)

Welcome to the SAS Quiz application! 

This is a web app designed to test your knowledge of **Software Application Development (Sviluppo Applicazioni Software)**.

The entire application is now available in both **Italian** and **English**, with a convenient switcher to change languages at any time without losing any progress!

---

## 🌟 Overview

This application offers two main quiz modes:

1.  **Theory Quiz:** True/false questions to verify understanding of fundamental software application development concepts and the Unified Process.
2.  **Design Patterns Quiz:** Multiple-choice questions focused on GRASP and GoF design patterns (creational, structural, behavioral), with problem-solution scenarios and UML diagram interpretation.

Both quizzes provide immediate feedback with detailed explanations for each answer and a final screen summarizing the session's statistics.

---

## ✨ Key Features

* **Two Quiz Modes:**
    * Theory, where you can select the number of questions.
    * Design Patterns, with multiple-choice and UML-based questions.
* **Bilingual Support:** Easily switch between Italian and English at any point. The quiz state is preserved, allowing you to change languages mid-quiz without losing progress.
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
    * A detailed breakdown of correct and incorrect answers.
* **Modern and Responsive Design:** A clean, pleasant user interface that adapts to different devices.
* **PWA (Progressive Web App) Ready:** Includes a `manifest.json` for an experience similar to a native app.

---

## 🛠️ Technologies Used

* HTML5
* CSS3 (with Flexbox, Grid and animations)
* JavaScript (Vanilla JS) for the quiz logic and internationalization.

---

## 🚀 How to Run the Application

### Online (Recommended)

The easiest way to use the app is through the GitHub Pages link:

**[https://dimuzzo.github.io/quiz-app/](https://dimuzzo.github.io/quiz-app/)**

### Locally

The application is entirely client-side, but due to modern browser security restrictions (CORS policy), it cannot be run by simply opening the `index.html` file (with a `file:///...` address). To work correctly, the files must be served by a local web server (`http://localhost/...`).

Here are two simple ways to do this:

**1. With Visual Studio Code + Live Server extension (Easiest):**
* Install the **Live Server** extension by Ritwick Dey.
* Right-click on the `index.html` file.
* Select **"Open with Live Server"**.

**2. With Python:**
* Open a terminal in the project's root folder.
* Run the command:
    ```bash
    python -m http.server
    ```
* Open your browser and navigate to `http://localhost:8000`.

---

## 📁 File Structure

The project is organized to separate content, styling, and logic for better maintainability.

* `index.html`: The main page where the user chooses the quiz type.
* `theory.html`: The HTML structure for the theory quiz.
* `pattern.html`: The HTML structure for the design patterns quiz.
* `style.css`: Contains the common CSS styles shared across all pages.
* `quiz-style.css`: Contains specific styles for the quiz interface.
* `quiz-logic.js`: The main JavaScript engine for the quizzes (rendering, scoring, navigation).
* `i18n.js`: The internationalization (i18n) module that manages language loading and switching.
* `locales/`: Folder containing the language files.
    * `en.json`: Contains all English text strings for the UI and questions.
    * `it.json`: Contains all Italian text strings for the UI and questions.
* `manifest.json`: Configuration file for the Progressive Web App.
* `app-icon.png`: Icon for the PWA.

---

## 🙏 Contributions

If you want to contribute to the project, feel free to fork the repository and submit a pull request!

---

> Created with passion by [dimuzzo](https://github.com/dimuzzo)
