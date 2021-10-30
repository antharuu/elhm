import Settings from "./settings.js";
import * as fs from 'fs';

const {['log']: _cl} = console;

let showedFiles: string[] = [];
let page = "index";

let savedSettings: SettingsType = {};

const urlParams = new URLSearchParams(window.location.search);
const current_project = urlParams.get("project");

window.addEventListener("DOMContentLoaded", () => {
    page = document.querySelector("#page").textContent.trim() ?? "index";

    const projectsPath: Element = document.querySelector("#projects__path") ?? null;
    const projectsList: Element = document.querySelector("#projects__list") ?? null;
    const formCreateProject: HTMLFormElement = document.querySelector("#form-create-project") ?? null;
    const formRenameProject: HTMLFormElement = document.querySelector("#project__name") ?? null;
    const inputProjectName: HTMLInputElement = document.querySelector("#project__name__input") ?? null;

    Settings.get().then((settings: SettingsType) => {
        savedSettings = settings;

        _cl("CURRENT PAGE: " + page);
        // ------------------------------------------------------ Show projects & path
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

    // ------------------------------------------------------ Create project
    if (formCreateProject) {
        formCreateProject.addEventListener("submit", (e) => {
            e.preventDefault();
            const inputName: HTMLInputElement = document.querySelector("#project-name") ?? null;
            if (savedSettings !== {} && inputName) {
                const projectName: string = inputName.value ?? "";
                if (projectName !== "") {
                    const projectPath: string = savedSettings.base_dir + "/" + projectName;
                    fs.mkdir(projectPath, {recursive: true}, (err: NodeJS.ErrnoException) => {
                        if (err) {
                            _cl(err);
                        } else {
                            window.location.href = "index.html";
                        }
                    });
                }
            }
        });
    }

    // ------------------------------------------------------ Rename project
    if (formRenameProject) {
        inputProjectName.addEventListener("keyup", () => {
            if (inputProjectName.value !== current_project) {
                inputProjectName.classList.add("edited");
            } else {
                inputProjectName.classList.remove("edited");
            }
        });

        formRenameProject.addEventListener("submit", (e) => {
            e.preventDefault();

            if (current_project != inputProjectName.value) {
                const renameValue: string = inputProjectName.value;
                fs.rename(savedSettings.base_dir + current_project,
                    savedSettings.base_dir + renameValue,
                    () => {
                        window.location.href = "project.html?project=" + renameValue;
                    });
            }
        });
    }
});

// ------------------------- Check if files changed
function checkFiles(settings: SettingsType, projectsList: Element) {
    _cl("STATE: CHECK");
    fs.readdir(settings.base_dir, (_err: NodeJS.ErrnoException, files: string[]) => {
        if (checkChanges()) {
            _cl("STATE: UPDATE");
            projectsList.innerHTML = "";
            printFiles(files, projectsList);
            showedFiles = files;
        }

        // Check if files and showed files has changes
        function checkChanges(): boolean {
            let r = false;

            files.forEach((file: string) => {
                if (showedFiles.indexOf(file) === -1) {
                    r = true;
                }
            });

            return r;
        }
    });
}

// ------------------------- Print files
function printFiles(files: string[], projectsList: Element): void {
    files.forEach((file: string) => {
        if (file !== "Elhm") {
            const project: HTMLElement = document.createElement("a");
            const projectTitle: Text = document.createTextNode(file);

            project.classList.add("project_folder");
            project.setAttribute("href", "project.html?project=" + projectTitle.textContent.trim());

            project.appendChild(projectTitle);

            projectsList.appendChild(project);
        }
    });
}