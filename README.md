# Todo-Website-using-Firebase
This is a simple website to keep track of your tasks date-wise.

# About
- This is a simple website that helps keep a TODO list.
- You can create tasks (by clicking the add task button), delete them(by clicking on the delete button on the task) and check them (if done by clicking on the task).
- You can also go back to a certain date in the past or the future to check the completion of tasks or adding new tasks for that particular day( by clicking on the calendar button ). 
- This website uses Google Firebase for the back-end and HTML, CSS and JS for front-end. (https://firebase.google.com/)
- This website uses ParticleJS for the background. (https://vincentgarreau.com/particles.js/)
- See steps to configure to modify the website or you can see the final website here(https://todo-8ce2c.web.app/)

# Content of files:
- The public folder contains all the HTML, JS and CSS files.
- app.js contains the code to connect to firestore and data management.
- index.html is the main html file.
- styles.css contains the styles for index.html.

# Steps to configure:
(You should have npm and firebase installed in your system.)
1. Create a project in firebase with any name.
2. Copy the unique ID number for the project and paste it replacing "todo-8ce2c" in .firebaserc file
3. Create a web app from the firebase console, register with any name.
4. Replace the firebase config script tag (commented as   <!-- FIREBASE CONFIGURATION -->) in index.html with the one given in your app (only the script tag that says //Your web app's Firebase configuration).
5. Configuration is done. Now you can edit serve it locally or host it after editing the functionality or the look of the webapp.

