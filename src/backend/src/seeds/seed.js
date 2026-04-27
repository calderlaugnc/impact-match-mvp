const { initializeDatabase, getDb } = require('../config/database');

async function seed() {
  await initializeDatabase();
  const db = getDb();
  
  // Clear existing data
  await new Promise((resolve, reject) => {
    db.run('DELETE FROM products', (err) => {
      if (err) return reject(err);
      db.run('DELETE FROM social_enterprises', (err) => {
        if (err) return reject(err);
        db.run('DELETE FROM users WHERE email != "admin@impactmatch.hk"', (err) => {
          if (err) return reject(err);
          resolve();
        });
      });
    });
  });
  
  // Seed social enterprises
  const ses = [
    {
      name: '綠點環保',
      description: '專注於環保產品和回收服務的社會企業，致力減少廢物並創造就業機會予弱勢社群。',
      website: 'https://greenpoint.hk',
      contact_email: 'info@greenpoint.hk',
      contact_phone: '2345-6789',
      address: '九龍灣宏開道15號'
    },
    {
      name: '手作傳情',
      description: '培訓殘疾人士製作手工藝品，透過藝術表達促進社會共融。',
      website: 'https://handmade-care.hk',
      contact_email: 'hello@handmade-care.hk',
      contact_phone: '2893-4567',
      address: '灣仔軒尼詩道120號'
    },
    {
      name: '銀齡樂活',
      description: '為長者提供健康食品和活動策劃服務，推動積極老齡化。',
      website: 'https://silverwell.hk',
      contact_email: 'contact@silverwell.hk',
      contact_phone: '3102-4567',
      address: '沙田石門安耀街3號'
    },
    {
      name: '青年動力',
      description: '為青少年提供職業培訓和就業機會，專注於餐飲和活動服務。',
      website: 'https://youthpower.hk',
      contact_email: 'info@youthpower.hk',
      contact_phone: '2712-3456',
      address: '觀塘鴻圖道52號'
    },
    {
      name: '共融廚房',
      description: '少數族裔婦女經營的餐飲服務，提供多元文化美食體驗。',
      website: 'https://inclusive-kitchen.hk',
      contact_email: 'order@inclusive-kitchen.hk',
      contact_phone: '2887-1234',
      address: '油麻地上海街45號'
    }
  ];
  
  const seIds = [];
  for (const se of ses) {
    const result = await new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO social_enterprises (name, description, website, contact_email, contact_phone, address) VALUES (?, ?, ?, ?, ?, ?)',
        [se.name, se.description, se.website, se.contact_email, se.contact_phone, se.address],
        function(err) {
          if (err) return reject(err);
          resolve(this.lastID);
        }
      );
    });
    seIds.push(result);
  }
  
  // Seed products
  const products = [
    {
      se_id: seIds[0],
      name: '環保禮品套裝',
      type: 'product',
      description: '由回收材料製成的環保禮品，包括筆記本、環保袋和水杯。',
      price_min: 150,
      price_max: 300,
      unit: '套',
      capacity_min: 50,
      capacity_max: 1000,
      tags: ['環保', '弱勢就業', '禮品'],
      impact_metrics: { beneficiaries: 15, waste_reduced_kg: 500, jobs_created: 5 }
    },
    {
      se_id: seIds[0],
      name: '企業回收計劃',
      type: 'service',
      description: '為企業提供辦公室廢物回收和環保教育服務。',
      price_min: 5000,
      price_max: 20000,
      unit: '月',
      capacity_min: 1,
      capacity_max: 10,
      tags: ['環保', '企業服務', '教育'],
      impact_metrics: { beneficiaries: 200, waste_reduced_kg: 2000, workshops_held: 12 }
    },
    {
      se_id: seIds[1],
      name: '手工藝工作坊',
      type: 'workshop',
      description: '由殘疾人士教授的手工坊，製作獨一無二的手工藝品。',
      price_min: 200,
      price_max: 400,
      unit: '人',
      capacity_min: 10,
      capacity_max: 30,
      duration: '2小時',
      tags: ['殘疾人士', '工作坊', '藝術', '共融'],
      impact_metrics: { beneficiaries: 8, workshops_held: 24, skills_trained: 50 }
    },
    {
      se_id: seIds[1],
      name: '定制手工禮品',
      type: 'product',
      description: '根據企業需求定制的手工藝品禮品。',
      price_min: 100,
      price_max: 500,
      unit: '件',
      capacity_min: 20,
      capacity_max: 200,
      tags: ['殘疾人士', '禮品', '定制'],
      impact_metrics: { beneficiaries: 12, items_made: 500, income_generated: 80000 }
    },
    {
      se_id: seIds[2],
      name: '長者健康食品禮盒',
      type: 'product',
      description: '專為長者設計的低糖低鹽健康食品禮盒。',
      price_min: 200,
      price_max: 500,
      unit: '盒',
      capacity_min: 30,
      capacity_max: 500,
      tags: ['長者', '健康', '禮品', '食品'],
      impact_metrics: { beneficiaries: 50, seniors_served: 200, meals_provided: 1000 }
    },
    {
      se_id: seIds[2],
      name: '銀齡活動策劃',
      type: 'service',
      description: '為企業策劃長者探訪和互動活動。',
      price_min: 8000,
      price_max: 25000,
      unit: '場',
      capacity_min: 1,
      capacity_max: 5,
      duration: '半天至一天',
      tags: ['長者', '活動策劃', '企業服務', '義工'],
      impact_metrics: { beneficiaries: 100, seniors_engaged: 300, volunteer_hours: 500 }
    },
    {
      se_id: seIds[3],
      name: '青年餐飲培訓體驗',
      type: 'workshop',
      description: '由受訓青年帶領的餐飲製作工作坊，體驗咖啡拉花或烘焙。',
      price_min: 250,
      price_max: 450,
      unit: '人',
      capacity_min: 8,
      capacity_max: 25,
      duration: '3小時',
      tags: ['青年', '工作坊', '餐飲', '培訓'],
      impact_metrics: { beneficiaries: 20, youth_trained: 15, workshops_held: 36 }
    },
    {
      se_id: seIds[3],
      name: '企業下午茶服務',
      type: 'service',
      description: '由培訓青年製作的精緻下午茶點心服務。',
      price_min: 80,
      price_max: 150,
      unit: '人',
      capacity_min: 20,
      capacity_max: 200,
      tags: ['青年', '餐飲', '企業服務', '食品'],
      impact_metrics: { beneficiaries: 25, youth_employed: 8, events_served: 50 }
    },
    {
      se_id: seIds[4],
      name: '多元文化美食體驗',
      type: 'workshop',
      description: '學習製作少數族裔傳統美食，促進文化共融。',
      price_min: 300,
      price_max: 500,
      unit: '人',
      capacity_min: 10,
      capacity_max: 40,
      duration: '2.5小時',
      tags: ['少數族裔', '工作坊', '文化', '共融', '食品'],
      impact_metrics: { beneficiaries: 10, cultural_exchanges: 24, women_empowered: 6 }
    },
    {
      se_id: seIds[4],
      name: '企業多元文化午餐',
      type: 'service',
      description: '為企業活動提供少數族裔特色午餐服務。',
      price_min: 100,
      price_max: 180,
      unit: '人',
      capacity_min: 30,
      capacity_max: 300,
      tags: ['少數族裔', '餐飲', '企業服務', '文化'],
      impact_metrics: { beneficiaries: 15, meals_served: 2000, women_employed: 8 }
    }
  ];
  
  for (const product of products) {
    await new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO products (se_id, name, type, description, price_min, price_max, unit, capacity_min, capacity_max, duration, tags, impact_metrics) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          product.se_id, product.name, product.type, product.description,
          product.price_min, product.price_max, product.unit,
          product.capacity_min, product.capacity_max, product.duration || null,
          JSON.stringify(product.tags), JSON.stringify(product.impact_metrics)
        ],
        (err) => {
          if (err) return reject(err);
          resolve();
        }
      );
    });
  }
  
  // Seed admin user
  const bcrypt = require('bcryptjs');
  const adminHash = bcrypt.hashSync('admin123', 10);
  
  await new Promise((resolve) => {
    db.run(
      'INSERT INTO users (company_name, contact_name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)',
      ['IMPACT MATCH', 'Admin', 'admin@impactmatch.hk', adminHash, 'admin'],
      (err) => {
        if (err) console.log('Admin user may already exist');
        resolve();
      }
    );
  });
  
  console.log('Seed data inserted successfully');
  console.log(`- ${ses.length} social enterprises`);
  console.log(`- ${products.length} products/services/workshops`);
}

if (require.main === module) {
  seed().catch(console.error);
}

module.exports = { seed };
