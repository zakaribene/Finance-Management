import xlsx from 'xlsx';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ok } from '../../utils/response.js';
import { logActivity } from '../activity-logs/activityLog.service.js';
import * as service from './report.service.js';

export const income = asyncHandler(async (req, res) => ok(res, '', await service.incomeReport(req)));
export const overview = asyncHandler(async (req, res) => ok(res, '', await service.overviewReport(req)));
export const expenses = asyncHandler(async (req, res) => ok(res, '', await service.expenseReport(req)));
export const transfers = asyncHandler(async (req, res) => ok(res, '', await service.transferReport(req)));
export const paymentMethods = asyncHandler(async (req, res) => ok(res, '', await service.paymentMethodReport(req)));
export const activity = asyncHandler(async (req, res) => ok(res, '', await service.activityReport(req)));
export const exportExcel = asyncHandler(async (req, res) => {
  const report = await service.incomeReport(req);
  const sheet = xlsx.utils.json_to_sheet(report.rows.map((row) => ({
    Date: row.date,
    PaymentMethod: row.paymentMethod?.name,
    Category: row.category || 'Uncategorized',
    Amount: row.amount,
    Description: row.description
  })));
  const book = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(book, sheet, 'Report');
  await logActivity(req, 'reports', 'Report Export (Excel)', 'Report exported as Excel');
  res.setHeader('Content-Disposition', 'attachment; filename="report.xlsx"');
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.end(xlsx.write(book, { type: 'buffer', bookType: 'xlsx' }));
});
export const exportPdf = asyncHandler(async (req, res) => {
  await logActivity(req, 'reports', 'Report Export (PDF)', 'Report exported as PDF');
  res.setHeader('Content-Type', 'application/pdf');
  res.send(Buffer.from('%PDF-1.4\n% Finance Management SaaS report export\n'));
});
