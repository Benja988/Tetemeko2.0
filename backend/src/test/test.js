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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
function checkNews() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Replace with your actual database name
            const dbUri = "mongodb://localhost:27017/tetemeko";
            yield mongoose_1.default.connect(dbUri);
            console.log("✅ Connected to MongoDB");
            const news = yield mongoose_1.default.connection.db.collection("news").findOne({
                _id: new mongoose_1.default.Types.ObjectId("685ace818fd71d5e057b5719"),
            });
            console.log("📰 Found News:", news !== null && news !== void 0 ? news : "No news found");
            yield mongoose_1.default.disconnect();
            console.log("🔌 Disconnected from MongoDB");
        }
        catch (error) {
            console.error("❌ Error:", error);
        }
    });
}
checkNews();
