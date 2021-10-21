"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const settings_js_1 = require("./settings.js");
const fs = require("fs");
const { ['log']: _cl } = console;
window.addEventListener("DOMContentLoaded", () => {
    settings_js_1.default.get().then((settings) => {
        const projectsPath = document.querySelector("#projects__path");
        const projectsList = document.querySelector("#projects__list");
        projectsPath.textContent = settings.base_dir;
        fs.readdir(settings.base_dir, (_err, files) => {
            files.forEach((file) => {
                let project = document.createElement("div");
                let projectTitle = document.createTextNode(file);
                project.classList.add("project_folder");
                project.appendChild(projectTitle);
                projectsList.appendChild(project);
            });
        });
    });
});
