class Settings {
    constructor(file_path: string) {
        this.file_path = file_path
    }
    file_path: string
    async get(): Promise<SettingsType> {
        const response = await fetch(this.file_path);
        const file_settings: SettingsType = await response.json();

        let current_settings: SettingsType = {
            // Default settings
            base_dir: "/",
            check_interval: 5

            // User settings
            , ...file_settings
        };

        // Validate settings
        if (current_settings.base_dir.substr(-1) !== "/") current_settings.base_dir += "/";
        if (current_settings.check_interval < 1) current_settings.check_interval = false;

        return current_settings;
    }
}

export default new Settings("src/settings.json")