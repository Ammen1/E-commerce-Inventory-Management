import PDFDocument from 'pdfkit';
import fs from 'fs';
import { sendMail } from '../services/common.js';
import InventoryItem from '../models/inventoryItem.Model.js';
import { StockMovement } from '../models/stockMovement.Model.js';
import Order from '../models/order.Model.js';

export const generateInventoryReportPDF = async (req, res) => {
    const filePath = 'E-commerce-Inventory-Management-Report-pdf/inventory_report.pdf';
  
    try {
      const items = await InventoryItem.find();
      const stocks = await StockMovement.find().populate('user').populate('item');
      const orders = await Order.find().populate('customer').populate('items.product');
  
      const emails = stocks.map(stock => (stock.user ? stock.user.email : 'Unknown Customer'));
  
      const doc = new PDFDocument();
      const writeStream = fs.createWriteStream(filePath);
  
      doc.pipe(writeStream);
  
      doc.fontSize(18).text('Inventory Report', { align: 'center' });
      doc.moveDown();
  
      items.forEach(item => {
        doc.fontSize(12)
          .text(`Item: ${item.name}`)
          .text(`Category: ${item.category}`)
          .text(`Price: ${item.price}`)
          .text(`Current inventory levels: ${item.quantity}`)
          .text('Stock Movements:');
  
        const itemStockMovements = stocks.filter(stock => stock.item.equals(item._id));
        itemStockMovements.forEach(movement => {
          doc.text(`   Transaction type: ${movement.type}`)
            .text(`    Quantity Change: ${movement.quantityChange}`);
          const customerName = movement.user ? movement.user.name : 'Unknown Customer';
          doc.text(` - Handled By: ${customerName}`)
            .text(`    Notes: ${movement.notes}`)
            .text(`    Created At: ${movement.timestamp.toLocaleDateString()}`)
            .moveDown(0.5);
        });
  
        const itemOrders = orders.filter(order => 
          order.items.some(orderItem => orderItem.product && orderItem.product.equals(item._id))
        );
  
        if (itemOrders.length > 0) {
          doc.text('Sales transactions:');
          itemOrders.forEach(order => {
            const customerName = order.customer ? order.customer.name : 'Unknown Customer';
            doc.text(`  Customer: ${customerName}`)
              .text(`    Order Status: ${order.status}`);
            const quantities = order.items.map(item => `${item.quantity}`).join(', ');
            doc.text(`  Quantities: ${quantities}`)
              .text(`    Total Amount: ${order.totalAmount}`)
              .text(`    Created At: ${order.createdAt.toLocaleDateString()} ${order.createdAt.getHours()}:${order.createdAt.getMinutes()}`)
              .moveDown(0.5);
          });
        }
  
        doc.text('----------').moveDown();
      });
  
      doc.end(); // Finalize the PDF document
  
      writeStream.on('finish', async () => {
        try {
          // Filter out only Admin emails
          const adminEmails = stocks
            .filter(stock => stock.user && stock.user.role === 'Admin')
            .map(stock => stock.user.email);
      
          if (adminEmails.length > 0) {
            await sendMail({
              to: adminEmails.join(', '),
              subject: 'Inventory Report',
              text: 'Please find the attached inventory report.',
              attachments: [{ path: filePath }]
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
  