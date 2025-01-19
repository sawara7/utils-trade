"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultBotStatus = void 0;
const getDefaultBotStatus = () => {
    return {
        name: '',
        cpl: 0,
        upl: 0,
        since: '',
        latest: '',
        running: false
    };
};
exports.getDefaultBotStatus = getDefaultBotStatus;
