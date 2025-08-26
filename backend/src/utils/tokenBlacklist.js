"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTokenRevoked = exports.revokeToken = void 0;
const tokenBlacklist = new Set();
const revokeToken = (token) => {
    tokenBlacklist.add(token);
    setTimeout(() => tokenBlacklist.delete(token), 15 * 60 * 1000); // 15 min expiry
};
exports.revokeToken = revokeToken;
const isTokenRevoked = (token) => {
    return tokenBlacklist.has(token);
};
exports.isTokenRevoked = isTokenRevoked;
