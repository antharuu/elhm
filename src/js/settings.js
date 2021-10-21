"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class Settings {
    constructor(file_path) {
        this.file_path = file_path;
    }
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(this.file_path);
            const file_settings = yield response.json();
            const current_settings = Object.assign({ base_dir: "/", check_interval: 5 }, file_settings);
            if (current_settings.base_dir.substr(-1) !== "/")
                current_settings.base_dir += "/";
            if (current_settings.check_interval < 1)
                current_settings.check_interval = false;
            return current_settings;
        });
    }
}
exports.default = new Settings("src/settings.json");
