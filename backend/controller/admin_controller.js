import { Report } from "../models/report_model.js";


export  const getReports = async (req, res) => {
    try {
        const reports = await Report.find();
        res.json(reports);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch reports' });
    }
};



export const resolveReport = async (req, res) => {
    try {
        await Report.findByIdAndUpdate(req.params.reportId, { status: 'resolved' });
        res.json({ message: 'Report resolved' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to resolve report' });
    }
};