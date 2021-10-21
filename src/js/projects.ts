import Settings from "./settings.js";
import * as fs from 'fs';

const { ['log']: _cl } = console;

let showedFiles: string[] = [];

let savedSettings: SettingsType = {};

window.addEventListener("DOMContentLoaded", () => {
    const projectsPath: Element = document.querySelector("#projects__path") ?? null;
    const projectsList: Element = document.querySelector("#projects__list") ?? null;
    const form: HTMLFormElement = document.querySelector("#form-create-project") ?? null;

    Settings.get().then((settings) => {
        savedSettings = settings;

        // ------------------------------------------------------ Show projects & path
        if (projectsPath && projectsList) {
            projectsPath.textContent = settings.base_dir;

            checkFiles(settings, projectsList);

            if (settings.check_interval !== false) {
                setInterval(() => checkFiles(settings, projectsList), settings.check_interval * 1000);
            }

        }
    });

    // ------------------------------------------------------ Create project
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const inputName: HTMLInputElement = document.querySelector("#project-name") ?? null;
            if (savedSettings !== {} && inputName) {
                const projectName: string = inputName.value ?? "";
                if (projectName !== "") {
                    const projectPath: string = savedSettings.base_dir + "/" + projectName;
                    fs.mkdir(projectPath, { recursive: true }, (err: NodeJS.ErrnoException) => {
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
        const project: HTMLElement = document.createElement("a");
        const projectTitle: Text = document.createTextNode(file);

        project.classList.add("project_folder");
        project.setAttribute("href", "#");

        project.appendChild(projectTitle);

        projectsList.appendChild(project);
    });
}