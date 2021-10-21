"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const settings_js_1 = require("./settings.js");
const fs = require("fs");
const { ['log']: _cl } = console;
let showedFiles = [];
let savedSettings = {};
window.addEventListener("DOMContentLoaded", () => {
    var _a, _b, _c;
    const projectsPath = (_a = document.querySelector("#projects__path")) !== null && _a !== void 0 ? _a : null;
    const projectsList = (_b = document.querySelector("#projects__list")) !== null && _b !== void 0 ? _b : null;
    const form = (_c = document.querySelector("#form-create-project")) !== null && _c !== void 0 ? _c : null;
    settings_js_1.default.get().then((settings) => {
        savedSettings = settings;
        if (projectsPath && projectsList) {
            projectsPath.textContent = settings.base_dir;
            checkFiles(settings, projectsList);
            if (settings.check_interval !== false) {
                setInterval(() => checkFiles(settings, projectsList), settings.check_interval * 1000);
            }
        }
    });
    if (form) {
        form.addEventListener("submit", (e) => {
            var _a, _b;
            e.preventDefault();
            const inputName = (_a = document.querySelector("#project-name")) !== null && _a !== void 0 ? _a : null;
            if (savedSettings !== {} && inputName) {
                const projectName = (_b = inputName.value) !== null && _b !== void 0 ? _b : "";
                if (projectName !== "") {
                    const projectPath = savedSettings.base_dir + "/" + projectName;
                    fs.mkdir(projectPath, { recursive: true }, (err) => {
                        if (err) {
                            _cl(err);
                        }
                        else {
                            window.location.href = "index.html";
                        }
                    });
                }
            }
        });
    }
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
        const project = document.createElement("a");
        const projectTitle = document.createTextNode(file);
        project.classList.add("project_folder");
        project.setAttribute("href", "#");
        project.appendChild(projectTitle);
        projectsList.appendChild(project);
    });
}
