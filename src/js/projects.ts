import Settings from "./settings.js"
import * as fs from 'fs';

const { ['log']: _cl } = console

let showedFiles: string[] = [];

window.addEventListener("DOMContentLoaded", () => {
    Settings.get().then((settings) => {
        

        const projectsPath: Element = document.querySelector("#projects__path");
        const projectsList: Element = document.querySelector("#projects__list");

        projectsPath.textContent = settings.base_dir

        checkFiles(settings, projectsList)
        if (settings.check_interval !== false) {
            setInterval(() => checkFiles(settings, projectsList), settings.check_interval * 1000)
        }

    })
});

function checkFiles(settings: SettingsType, projectsList: Element) {
    _cl("CHECK")
    projectsList.innerHTML = ""
    fs.readdir(settings.base_dir, (_err: NodeJS.ErrnoException, files: string[]) => {
        if (files !== showedFiles) {
            printFiles(files, projectsList);
            showedFiles = files
        }
    });
}

function printFiles(files: string[], projectsList: Element): void {
    files.forEach((file: string) => {
        let project: HTMLElement = document.createElement("div")
        let projectTitle: Text = document.createTextNode(file)

        project.classList.add("project_folder")

        project.appendChild(projectTitle)

        projectsList.appendChild(project);
    })
}