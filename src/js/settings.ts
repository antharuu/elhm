type SettingsType = {
    base_dir: string
}

class Settings {
    constructor(file_path: string) {
        this.file_path = file_path
    }
    file_path: string
    async get(): Promise<SettingsType> {
        const response = await fetch(this.file_path);
        const json = await response.json();
        return await json;
    }
}

export default new Settings("src/settings.json")