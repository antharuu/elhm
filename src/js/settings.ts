const default_settings: SettingsType = {
    base_dir: "/",
    check_interval: 5
}

class Settings {
    constructor(file_path: string) {
        this.file_path = file_path
    }
    file_path: string
    async get(): Promise<SettingsType> {
        return fetch(this.file_path).then((response) => {
            return response.json().then((file_settings: SettingsType) => {
                return { default_settings, ...file_settings }
            });
        })
    }
}

export default new Settings("src/settings.json")