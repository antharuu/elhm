import Settings from "./settings.js"
import * as fs from 'fs';

const { ['log']: _cl } = console

window.addEventListener("DOMContentLoaded", () => {
    Settings.get().then((settings) => {
        const projectsPath = document.querySelector("#projects__path");
        const projectsList = document.querySelector("#projects__list");

        projectsPath.textContent = settings.base_dir

        fs.readdir(settings.base_dir, (_err: NodeJS.ErrnoException, files: string[]) => {
            files.forEach((file: string) => {
                let project: HTMLElement = document.createElement("div")
                let projectTitle: Text = document.createTextNode(file)

                project.classList.add("project_folder")

                project.appendChild(projectTitle)

                projectsList.appendChild(project);
            })
        });
    })
});