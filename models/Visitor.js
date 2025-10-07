// models/Visitor.js
import mongoose from "mongoose";

const VisitorSchema = new mongoose.Schema({
    visitorId: {type: String, unique: true},
    ip: String,
    os: String,
    browser: String,
    device: String,
    userAgent: String,
    referrer: String,
    firstVisit: {type: Date, default: Date.now},
}, {versionKey: false});

export default mongoose.models.Visitor ||
mongoose.model("Visitor", VisitorSchema);
