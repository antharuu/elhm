"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const settings_js_1 = require("./settings.js");
const fs = require("fs");
const { ['log']: _cl } = console;
let showedFiles = [];
window.addEventListener("DOMContentLoaded", () => {
    settings_js_1.default.get().then((settings) => {
        const projectsPath = document.querySelector("#projects__path");
        const projectsList = document.querySelector("#projects__list");
        projectsPath.textContent = settings.base_dir;
        checkFiles(settings, projectsList);
        _cl(settings);
        if (settings.check_interval !== false) {
            setInterval(() => checkFiles(settings, projectsList), settings.check_interval * 1000);
        }
    });
});
function checkFiles(settings, projectsList) {
    _cl("STATE: CHECK");
    fs.readdir(settings.base_dir, (_err, files) => {
        if (checkChanges()) {
            _cl("STATE: UPDATE");
            projectsList.innerHTML = "";
            printFiles(files, projectsList);
            showedFiles = files;
        }
        function checkChanges() {
            let r = false;
            files.forEach((file) => {
                if (showedFiles.indexOf(file) === -1) {
                    r = true;
                }
            });
            return r;
        }
    });
}
function printFiles(files, projectsList) {
    files.forEach((file) => {
        let project = document.createElement("div");
        let projectTitle = document.createTextNode(file);
        project.classList.add("project_folder");
        project.appendChild(projectTitle);
        projectsList.appendChild(project);
    });
}
