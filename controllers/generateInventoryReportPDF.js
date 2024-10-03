import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { sendMail } from '../services/common.js';
import InventoryItem from '../models/inventoryItem.Model.js';
import { StockMovement } from '../models/stockMovement.Model.js';
import Order from '../models/order.Model.js';

export const generateInventoryReportPDF = async (req, res) => {
  const filePath = path.resolve('./inventory_report.pdf');
  const logoPath = path.resolve('./ELST.png');

  try {
    const items = await InventoryItem.find();
    const stocks = await StockMovement.find().populate('user').populate('item');
    const orders = await Order.find().populate('customer').populate('items.product');

    const doc = new PDFDocument({
      size: 'A4',
      margin: 50,
    });
    const writeStream = fs.createWriteStream(filePath);

    doc.pipe(writeStream);

    // Add the company logo
    doc.image(logoPath, {
      fit: [100, 100],
      align: 'left',
    });

    // Add report title with a larger font and center alignment
    doc.fontSize(20).text('Inventory Report', { align: 'center' }).moveDown(2);

    // Add date of the report generation
    doc.fontSize(12).text(`Report Date: ${new Date().toLocaleDateString()}`, { align: 'right' }).moveDown(2)

    if (items.length === 0) {
      doc.fontSize(14).fillColor('red').text('No inventory items available.', { align: 'center' });
    }

    // Iterate through inventory items and stock movements
    items.forEach(item => {
      doc.fontSize(16).fillColor('green').text(`Item: ${item.name}`).moveDown(0.5);

      doc.fontSize(12)
        .fillColor('black')
        .text(`Category: ${item.category}`)
        .text(`Price: ${item.price}`)
        .text(`Current inventory levels: ${item.quantity}`)
        .moveDown(0.5)
        .fontSize(12).text('Stock Movements:', { underline: true }).moveDown(0.5);

      const itemStockMovements = stocks.filter(stock => stock.item.equals(item._id));

      if (itemStockMovements.length === 0) {
        doc.fillColor('red').text('  No stock movements for this item.');
      } else {
        itemStockMovements.forEach(movement => {
          doc.text(`   Transaction type: ${movement.type}`)
            .text(`   Quantity Change: ${movement.quantityChange}`)
            .text(`   Handled By: ${movement.user ? movement.user.name : 'Unknown Customer'}`)
            .text(`   Notes: ${movement.notes}`)
            .text(`   Created At: ${movement.timestamp.toLocaleDateString()}`)
            .moveDown(0.5);
        });
      }

      // Sales transactions
      const itemOrders = orders.filter(order =>
        order.items.some(orderItem => orderItem.product && orderItem.product.equals(item._id))
      );

      if (itemOrders.length > 0) {
        doc.fontSize(12).fillColor('black').text('Sales transactions:', { underline: true });
        itemOrders.forEach(order => {
          doc.text(`   Customer: ${order.customer ? order.customer.name : 'Unknown Customer'}`)
            .text(`   Order Status: ${order.status}`)
            .text(`   Quantities: ${order.items.map(item => `${item.quantity}`).join(', ')}`)
            .text(`   Total Amount: ${order.totalAmount}`)
            .text(`   Created At: ${order.createdAt.toLocaleDateString()} ${order.createdAt.getHours()}:${order.createdAt.getMinutes()}`)
            .moveDown(0.5);
        });
      }

      doc.text('----------', { align: 'center' }).moveDown(2);
    });

    // Add the company logo
    doc.image(logoPath, {
      fit: [100, 100],
      align: 'right',
    });
    // Finalize the PDF
    doc.end();

    writeStream.on('finish', async () => {
      try {
        const adminEmails = stocks
          .filter(stock => stock.user && stock.user.role === 'Admin')
          .map(stock => stock.user.email);

        if (adminEmails.length > 0) {
          await sendMail({
            to: adminEmails.join(', '),
            subject: 'Inventory Report',
            text: 'Please find the attached inventory report.',
            attachments: [
              {
                filename: 'inventory_report.pdf',
                path: filePath,
                contentType: 'application/pdf',
              },
            ],
          });
          res.status(200).send('Inventory PDF Report generated and emailed successfully.');
        } else {
          res.status(200).send('PDF Report generated but no Admin email to send.');
        }
      } catch (mailError) {
        console.error('Error sending email:', mailError);
        res.status(500).json({ error: 'Error sending email with PDF report' });
      }
    });

    writeStream.on('error', (error) => {
      console.error('Error writing PDF file:', error);
      res.status(500).json({ error: 'Error generating PDF report' });
    });

  } catch (error) {
    console.error('Error generating PDF report:', error);
    res.status(500).json({ error: 'Error generating PDF report' });
  }
};
