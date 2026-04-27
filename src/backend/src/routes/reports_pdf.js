const express = require('express');
const PDFDocument = require('pdfkit');
const { getDb } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Generate PDF report
router.get('/:id/pdf', authenticateToken, (req, res, next) => {
  try {
    const db = getDb();
    db.get(
      'SELECT * FROM reports WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.userId],
      (err, report) => {
        if (err) return next(err);
        
        if (!report) {
          return res.status(404).json({ message: 'Report not found' });
        }
        
        const reportData = JSON.parse(report.data || '{}');
        
        // Create PDF
        const doc = new PDFDocument();
        const filename = `impact-report-${report.id}-${Date.now()}.pdf`;
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        
        doc.pipe(res);
        
        // Header
        doc.fontSize(24).text('IMPACT MATCH', 50, 50);
        doc.fontSize(16).text('影響力報告', 50, 80);
        doc.moveDown();
        
        // Report info
        doc.fontSize(12);
        doc.text(`報告標題: ${report.title}`, 50, 120);
        doc.text(`報告期間: ${report.period_start} 至 ${report.period_end}`, 50, 140);
        doc.text(`生成日期: ${new Date().toLocaleDateString('zh-HK')}`, 50, 160);
        doc.moveDown(2);
        
        // Summary stats
        doc.fontSize(14).text('影響力摘要', 50, 200);
        doc.fontSize(12);
        doc.text(`總受益人數: ${report.total_beneficiaries || 0}`, 50, 220);
        doc.text(`總支出: HK$ ${(report.total_spending || 0).toLocaleString()}`, 50, 240);
        doc.moveDown(2);
        
        // Details
        if (reportData.matches && reportData.matches.length > 0) {
          doc.fontSize(14).text('配對詳情', 50, 280);
          doc.fontSize(12);
          
          let y = 300;
          reportData.matches.forEach((match, index) => {
            if (y > 700) {
              doc.addPage();
              y = 50;
            }
            doc.text(`${index + 1}. ${match.product_name || '未命名項目'}`, 50, y);
            doc.text(`   社企: ${match.se_name || '-'}`, 70, y + 15);
            doc.text(`   類型: ${match.type || '-'}`, 70, y + 30);
            doc.text(`   配對分數: ${match.match_score || 0}%`, 70, y + 45);
            y += 70;
          });
        }
        
        // Impact metrics
        if (reportData.impact_metrics) {
          doc.addPage();
          doc.fontSize(14).text('影響力指標', 50, 50);
          doc.fontSize(12);
          
          const metrics = reportData.impact_metrics;
          let y = 80;
          Object.entries(metrics).forEach(([key, value]) => {
            const label = {
              beneficiaries: '受益人數',
              jobs_created: '創造就業',
              waste_reduced_kg: '減少廢物 (kg)',
              workshops_held: '工作坊數量',
              skills_trained: '培訓人數',
              seniors_served: '服務長者',
              meals_provided: '提供餐食',
              volunteer_hours: '義工時數',
              youth_trained: '培訓青年',
              youth_employed: '青年就業',
              events_served: '活動場數',
              cultural_exchanges: '文化交流',
              women_empowered: '婦女賦能',
              meals_served: '提供餐食',
              women_employed: '婦女就業',
              items_made: '製作物品',
              income_generated: '產生收入'
            }[key] || key;
            doc.text(`${label}: ${value}`, 50, y);
            y += 20;
          });
        }
        
        // Footer
        doc.fontSize(10).text(
          '本報告由 IMPACT MATCH 平台生成 | impactmatch.hk',
          50,
          doc.page.height - 50,
          { align: 'center' }
        );
        
        doc.end();
      }
    );
  } catch (err) {
    next(err);
  }
});

module.exports = router;
