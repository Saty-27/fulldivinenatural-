import { db } from "../db";
import { bills, users } from "@shared/schema";
import { eq } from "drizzle-orm";

interface InvoiceData {
  billId: number;
  customerName: string;
  address: string;
  month: string;
  year: number;
  items: any[];
  subscriptionTotal: number;
  ordersTotal: number;
  previousPending: number;
  penalty: number;
  discount: number;
  finalAmount: number;
  dueDate: string;
  status: string;
  generatedDate: string;
}

export function createInvoiceHTML(data: InvoiceData): string {
  const createdDate = new Date().toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const monthYear = `${data.month} ${data.year}`;

  const itemsHTML = data.items
    .map(
      (item) => `
    <tr style="border-bottom: 1px solid #e5e7eb;">
      <td style="padding: 0.75rem; font-size: 0.875rem; text-align: left;">${item.date}</td>
      <td style="padding: 0.75rem; font-size: 0.875rem; text-align: left;">${item.description}</td>
      <td style="padding: 0.75rem; font-size: 0.875rem; text-align: center;">${item.quantity}</td>
      <td style="padding: 0.75rem; font-size: 0.875rem; text-align: right;">₹${item.price.toLocaleString()}</td>
      <td style="padding: 0.75rem; font-size: 0.875rem; text-align: right; font-weight: 600;">₹${item.total.toLocaleString()}</td>
    </tr>
  `
    )
    .join("");

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Divine Naturals Invoice</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #f9fafb;
            padding: 2rem;
        }
        .invoice-container {
            background: white;
            max-width: 900px;
            margin: 0 auto;
            padding: 2rem;
            border-radius: 0.5rem;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 2rem;
            border-bottom: 3px solid #10b981;
            padding-bottom: 1.5rem;
        }
        .company-name {
            font-size: 1.75rem;
            font-weight: 700;
            color: #10b981;
            margin-bottom: 0.25rem;
        }
        .company-tagline {
            font-size: 0.875rem;
            color: #6b7280;
            font-style: italic;
        }
        .invoice-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
            margin-bottom: 2rem;
        }
        .info-section h3 {
            font-size: 0.875rem;
            font-weight: 600;
            color: #374151;
            margin-bottom: 0.5rem;
            text-transform: uppercase;
        }
        .info-section p {
            font-size: 0.875rem;
            color: #6b7280;
            line-height: 1.6;
        }
        .summary-cards {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1rem;
            margin-bottom: 2rem;
        }
        .summary-card {
            background: #f3f4f6;
            padding: 1rem;
            border-radius: 0.5rem;
            border-left: 4px solid #3b82f6;
        }
        .summary-card.success {
            border-left-color: #10b981;
        }
        .summary-card.warning {
            border-left-color: #f59e0b;
        }
        .summary-card label {
            display: block;
            font-size: 0.75rem;
            color: #6b7280;
            font-weight: 600;
            margin-bottom: 0.25rem;
            text-transform: uppercase;
        }
        .summary-card .value {
            font-size: 1.5rem;
            font-weight: 700;
            color: #111827;
        }
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 2rem;
            margin-top: 2rem;
        }
        .items-table thead {
            background: #f3f4f6;
            border-bottom: 2px solid #e5e7eb;
        }
        .items-table th {
            padding: 0.75rem;
            text-align: left;
            font-size: 0.875rem;
            font-weight: 600;
            color: #374151;
        }
        .items-table td {
            padding: 0.75rem;
            font-size: 0.875rem;
            color: #6b7280;
        }
        .totals-section {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 2rem;
        }
        .totals-box {
            width: 300px;
            border: 2px solid #e5e7eb;
            border-radius: 0.5rem;
            padding: 1rem;
        }
        .total-row {
            display: flex;
            justify-content: space-between;
            padding: 0.5rem 0;
            font-size: 0.875rem;
            color: #6b7280;
            border-bottom: 1px solid #e5e7eb;
        }
        .total-row.grand {
            border: none;
            padding: 1rem 0;
            font-size: 1.25rem;
            font-weight: 700;
            color: #111827;
            margin-top: 0.5rem;
        }
        .status-badge {
            display: inline-block;
            padding: 0.5rem 1rem;
            border-radius: 0.5rem;
            font-size: 0.875rem;
            font-weight: 600;
            margin-top: 1rem;
        }
        .status-badge.paid {
            background: #d1fae5;
            color: #065f46;
        }
        .status-badge.unpaid {
            background: #fef3c7;
            color: #92400e;
        }
        .status-badge.overdue {
            background: #fee2e2;
            color: #991b1b;
        }
        .footer {
            text-align: center;
            margin-top: 2rem;
            padding-top: 1rem;
            border-top: 1px solid #e5e7eb;
            font-size: 0.75rem;
            color: #9ca3af;
        }
        @media print {
            body {
                padding: 0;
                background: white;
            }
            .invoice-container {
                box-shadow: none;
                max-width: 100%;
            }
        }
    </style>
</head>
<body>
    <div class="invoice-container">
        <!-- Header -->
        <div class="header">
            <div class="company-name">🥛 DIVINE NATURALS</div>
            <div class="company-tagline">Pure. Fresh. Daily.</div>
        </div>

        <!-- Invoice Info -->
        <div class="invoice-info">
            <div class="info-section">
                <h3>📋 Bill Details</h3>
                <p><strong>Bill ID:</strong> #${data.billId}</p>
                <p><strong>Month:</strong> ${monthYear}</p>
                <p><strong>Generated:</strong> ${createdDate}</p>
                <p><strong>Due Date:</strong> ${new Date(data.dueDate).toLocaleDateString("en-IN")}</p>
            </div>
            <div class="info-section">
                <h3>👤 Customer Details</h3>
                <p><strong>${data.customerName}</strong></p>
                <p>${data.address}</p>
            </div>
        </div>

        <!-- Summary Cards -->
        <div class="summary-cards">
            <div class="summary-card">
                <label>Subscriptions</label>
                <div class="value">₹${data.subscriptionTotal.toLocaleString()}</div>
            </div>
            <div class="summary-card">
                <label>Orders</label>
                <div class="value">₹${data.ordersTotal.toLocaleString()}</div>
            </div>
            <div class="summary-card success">
                <label>Total Amount</label>
                <div class="value">₹${data.finalAmount.toLocaleString()}</div>
            </div>
        </div>

        <!-- Items Table -->
        <table class="items-table">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th style="text-align: center;">Qty</th>
                    <th style="text-align: right;">Rate</th>
                    <th style="text-align: right;">Total</th>
                </tr>
            </thead>
            <tbody>
                ${itemsHTML}
            </tbody>
        </table>

        <!-- Totals -->
        <div class="totals-section">
            <div class="totals-box">
                <div class="total-row">
                    <span>Subscriptions:</span>
                    <span>₹${data.subscriptionTotal.toLocaleString()}</span>
                </div>
                <div class="total-row">
                    <span>Orders:</span>
                    <span>₹${data.ordersTotal.toLocaleString()}</span>
                </div>
                ${data.previousPending > 0 ? `
                <div class="total-row">
                    <span>Previous Due:</span>
                    <span>₹${data.previousPending.toLocaleString()}</span>
                </div>
                ` : ""}
                ${data.penalty > 0 ? `
                <div class="total-row warning">
                    <span>⚠️ Penalty:</span>
                    <span>₹${data.penalty.toLocaleString()}</span>
                </div>
                ` : ""}
                ${data.discount > 0 ? `
                <div class="total-row success">
                    <span>✅ Discount:</span>
                    <span>-₹${data.discount.toLocaleString()}</span>
                </div>
                ` : ""}
                <div class="total-row grand">
                    <span>Grand Total:</span>
                    <span>₹${data.finalAmount.toLocaleString()}</span>
                </div>
            </div>
        </div>

        <!-- Status Badge -->
        <div>
            <span class="status-badge ${data.status === "paid" ? "paid" : data.status === "overdue" ? "overdue" : "unpaid"}">
                ${data.status === "paid" ? "✅ PAID" : data.status === "overdue" ? "⚠️ OVERDUE" : "🟧 UNPAID"}
            </span>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>This is an automatically generated invoice. Please retain for your records.</p>
            <p>For queries, contact Divine Naturals customer support.</p>
        </div>
    </div>
</body>
</html>
  `;

  return html;
}

export async function getBillInvoiceData(billId: number): Promise<InvoiceData | null> {
  const bill = await db.select().from(bills).where(eq(bills.id, billId));

  if (!bill.length) return null;

  const billRecord = bill[0];
  const user = await db.select().from(users).where(eq(users.id, billRecord.userId));

  if (!user.length) return null;

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const items = typeof billRecord.items === "string" 
    ? JSON.parse(billRecord.items) 
    : billRecord.items;

  const dueDateStr = typeof billRecord.dueDate === "string"
    ? billRecord.dueDate
    : billRecord.dueDate instanceof Date
    ? billRecord.dueDate.toISOString()
    : new Date(billRecord.dueDate).toISOString();

  const createdAtStr = billRecord.createdAt instanceof Date
    ? billRecord.createdAt.toISOString()
    : new Date(billRecord.createdAt).toISOString();

  return {
    billId: billRecord.id,
    customerName: `${user[0].firstName || ""} ${user[0].lastName || ""}`.trim() || "N/A",
    address: user[0].address || "N/A",
    month: monthNames[billRecord.month - 1],
    year: billRecord.year,
    items: items || [],
    subscriptionTotal: Number(billRecord.subscriptionTotal || 0),
    ordersTotal: Number(billRecord.ordersTotal || 0),
    previousPending: Number(billRecord.previousPending || 0),
    penalty: Number(billRecord.penalty || 0),
    discount: Number(billRecord.discount || 0),
    finalAmount: Number(billRecord.finalAmount || 0),
    dueDate: dueDateStr,
    status: billRecord.status,
    generatedDate: createdAtStr,
  };
}
