"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const settings_js_1 = require("./settings.js");
const fs = require("fs");
const { ['log']: _cl } = console;
let showedFiles = [];
let page = "index";
let savedSettings = {};
const urlParams = new URLSearchParams(window.location.search);
const current_project = urlParams.get("project");
window.addEventListener("DOMContentLoaded", () => {
    var _a, _b, _c, _d, _e, _f;
    page = (_a = document.querySelector("#page").textContent.trim()) !== null && _a !== void 0 ? _a : "index";
    const projectsPath = (_b = document.querySelector("#projects__path")) !== null && _b !== void 0 ? _b : null;
    const projectsList = (_c = document.querySelector("#projects__list")) !== null && _c !== void 0 ? _c : null;
    const formCreateProject = (_d = document.querySelector("#form-create-project")) !== null && _d !== void 0 ? _d : null;
    const formRenameProject = (_e = document.querySelector("#project__name")) !== null && _e !== void 0 ? _e : null;
    const inputProjectName = (_f = document.querySelector("#project__name__input")) !== null && _f !== void 0 ? _f : null;
    settings_js_1.default.get().then((settings) => {
        savedSettings = settings;
        _cl("CURRENT PAGE: " + page);
        if (projectsPath && projectsList && page === "index") {
            projectsPath.textContent = settings.base_dir;
            checkFiles(settings, projectsList);
            if (settings.check_interval !== false) {
                setInterval(() => checkFiles(settings, projectsList), settings.check_interval * 1000);
            }
        }
        if (page === "project") {
            inputProjectName.value = current_project;
        }
    });
    if (formCreateProject) {
        formCreateProject.addEventListener("submit", (e) => {
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
    if (formRenameProject) {
        inputProjectName.addEventListener("keyup", () => {
            if (inputProjectName.value !== current_project) {
                inputProjectName.classList.add("edited");
            }
            else {
                inputProjectName.classList.remove("edited");
            }
        });
        formRenameProject.addEventListener("submit", (e) => {
            e.preventDefault();
            if (current_project != inputProjectName.value) {
                const renameValue = inputProjectName.value;
                fs.rename(savedSettings.base_dir + current_project, savedSettings.base_dir + renameValue, () => {
                    window.location.href = "project.html?project=" + renameValue;
                });
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
        if (file !== "Elhm") {
            const project = document.createElement("a");
            const projectTitle = document.createTextNode(file);
            project.classList.add("project_folder");
            project.setAttribute("href", "project.html?project=" + projectTitle.textContent.trim());
            project.appendChild(projectTitle);
            projectsList.appendChild(project);
        }
    });
}
