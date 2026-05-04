const { initializeDatabase, getDb } = require('../config/database');

async function seed() {
  await initializeDatabase();
  const db = getDb();
  
  // Clear existing data (preserve admin user)
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
  
  // ============================================================
  // Seed social enterprises (20 total)
  // ============================================================
  const ses = [
    // 1. 綠點環保 (保留)
    { name: '綠點環保', description: '專注於環保產品和回收服務的社會企業，致力減少廢物並創造就業機會予弱勢社群。', website: 'https://greenpoint.hk', contact_email: 'info@greenpoint.hk', contact_phone: '2345-6789', address: '九龍灣宏開道15號' },
    // 2. 手作傳情 (保留)
    { name: '手作傳情', description: '培訓殘疾人士製作手工藝品，透過藝術表達促進社會共融。', website: 'https://handmade-care.hk', contact_email: 'hello@handmade-care.hk', contact_phone: '2893-4567', address: '灣仔軒尼詩道120號' },
    // 3. 銀齡樂活 (保留)
    { name: '銀齡樂活', description: '為長者提供健康食品和活動策劃服務，推動積極老齡化。', website: 'https://silverwell.hk', contact_email: 'contact@silverwell.hk', contact_phone: '3102-4567', address: '沙田石門安耀街3號' },
    // 4. 青年動力 (保留)
    { name: '青年動力', description: '為青少年提供職業培訓和就業機會，專注於餐飲和活動服務。', website: 'https://youthpower.hk', contact_email: 'info@youthpower.hk', contact_phone: '2712-3456', address: '觀塘鴻圖道52號' },
    // 5. 共融廚房 (保留)
    { name: '共融廚房', description: '少數族裔婦女經營的餐飲服務，提供多元文化美食體驗。', website: 'https://inclusive-kitchen.hk', contact_email: 'order@inclusive-kitchen.hk', contact_phone: '2887-1234', address: '油麻地上海街45號' },
    // 6. 升級再造坊
    { name: '升級再造坊', description: '將廢棄物料升級再造為時尚配飾和家居用品，由基層婦女手工製作，推動可持續消費。', website: 'https://upcycle-studio.hk', contact_email: 'hello@upcycle-studio.hk', contact_phone: '2987-1123', address: '深水埗大南街168號' },
    // 7. 有機農莊
    { name: '有機農莊', description: '本地有機農場，聘用康復者種植有機蔬果，供應企業健康食材和農耕體驗活動。', website: 'https://organic-farm.hk', contact_email: 'farm@organic-farm.hk', contact_phone: '2671-4456', address: '元朗錦田公路88號' },
    // 8. 心靈綠洲
    { name: '心靈綠洲', description: '提供精神健康推廣和靜觀減壓服務，由專業輔導員帶領，致力改善香港職場心理健康。', website: 'https://mind-oasis.hk', contact_email: 'care@mind-oasis.hk', contact_phone: '2525-9999', address: '中環德輔道中88號' },
    // 9. 無障礙科技
    { name: '無障礙科技', description: '由視障人士參與開發的無障礙科技方案，包括網頁無障礙測試和輔助科技培訓。', website: 'https://a11y-tech.hk', contact_email: 'info@a11y-tech.hk', contact_phone: '3107-8800', address: '香港仔數碼港道100號' },
    // 10. 街坊導賞團
    { name: '街坊導賞團', description: '由基層長者帶領的社區文化導賞，深度探索香港舊區故事，推動跨代共融和文化保育。', website: 'https://neighbourhood-tour.hk', contact_email: 'tour@neighbourhood-tour.hk', contact_phone: '2468-1357', address: '深水埗南昌街202號' },
    // 11. 清潔力量
    { name: '清潔力量', description: '生產天然環保清潔用品，聘用弱勢社群，提供企業綠色清潔方案，減少化學污染。', website: 'https://cleanpower.hk', contact_email: 'order@cleanpower.hk', contact_phone: '2622-3344', address: '葵涌大連排道58號' },
    // 12. 長者關懷
    { name: '長者關懷', description: '為居家長者提供陪診、家居清潔和日間護理服務，由受訓中年婦女擔任護理員。', website: 'https://eldercareplus.hk', contact_email: 'service@eldercareplus.hk', contact_phone: '2778-5678', address: '黃大仙龍翔道110號' },
    // 13. 體育共融
    { name: '體育共融', description: '為基層及特殊學習需要青少年提供運動培訓，透過體育建立自信和團隊精神。', website: 'https://sports-inclusive.hk', contact_email: 'play@sports-inclusive.hk', contact_phone: '2219-8765', address: '將軍澳寶康路105號' },
    // 14. 藝術療癒
    { name: '藝術療癒', description: '以表達藝術治療方式服務情緒困擾人士，提供企業減壓工作坊和社區藝術項目。', website: 'https://art-heal.hk', contact_email: 'create@art-heal.hk', contact_phone: '2541-3322', address: '上環荷李活道233號' },
    // 15. 公平貿易站
    { name: '公平貿易站', description: '推廣公平貿易產品，連接發展中國家小農與香港消費者，提供企業禮品和咖啡方案。', website: 'https://fairtrade-hub.hk', contact_email: 'trade@fairtrade-hub.hk', contact_phone: '2512-4444', address: '旺角彌敦道610號' },
    // 16. 社區農墟
    { name: '社區農墟', description: '連結都市人與本地農業，舉辦農墟市集和有機種植課程，推動社區支持農業模式。', website: 'https://community-farmers.hk', contact_email: 'market@community-farmers.hk', contact_phone: '2698-1122', address: '大埔林錦公路200號' },
    // 17. 聾人咖啡
    { name: '聾人咖啡', description: '由聾人咖啡師主理的精品咖啡店，提供手語餐飲體驗和企業咖啡到會服務。', website: 'https://deafcoffee.hk', contact_email: 'brew@deafcoffee.hk', contact_phone: '2366-7788', address: '荔枝角長沙灣道833號' },
    // 18. 輪椅遊蹤
    { name: '輪椅遊蹤', description: '設計無障礙旅遊路線，由輪椅使用者擔任導遊，推廣無障礙文化及共融旅遊體驗。', website: 'https://wheel-tour.hk', contact_email: 'explore@wheel-tour.hk', contact_phone: '2892-3456', address: '柴灣永泰道70號' },
    // 19. 少數族裔裁縫
    { name: '少數族裔裁縫', description: '由少數族裔婦女經營的裁縫工作室，製作傳統民族服飾和企業制服，推動多元文化。', website: 'https://ethnic-tailor.hk', contact_email: 'sew@ethnic-tailor.hk', contact_phone: '2399-1122', address: '佐敦寶靈街25號' },
    // 20. 回收單車
    { name: '回收單車', description: '回收廢棄單車翻新再售，為邊緣青年提供單車維修培訓，推廣綠色出行。', website: 'https://bike-reborn.hk', contact_email: 'ride@bike-reborn.hk', contact_phone: '2703-4455', address: '粉嶺安樂村工業街12號' }
  ];
  
  const seIds = [];
  for (const se of ses) {
    const result = await new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO social_enterprises (name, description, website, contact_email, contact_phone, address) VALUES (?, ?, ?, ?, ?, ?)',
        [se.name, se.description, se.website, se.contact_email, se.contact_phone, se.address],
        function(err) { if (err) return reject(err); resolve(this.lastID); }
      );
    });
    seIds.push(result);
  }
  
  // ============================================================
  // Seed products (40+ total, 2 per SE minimum)
  // ============================================================
  const products = [
    // --- 綠點環保 (seIds[0]) ---
    { se_id: seIds[0], name: '環保禮品套裝', type: 'product', description: '由回收材料製成的環保禮品，包括筆記本、環保袋和水杯，可按企業需求定制。', price_min: 150, price_max: 300, unit: '套', capacity_min: 50, capacity_max: 1000, tags: ['環保', '弱勢就業', '禮品', '定制'], impact_metrics: { beneficiaries: 15, waste_reduced_kg: 500, jobs_created: 5, data_confidence: 'self_reported' } },
    { se_id: seIds[0], name: '企業回收計劃', type: 'service', description: '為企業提供辦公室廢物回收和環保教育服務，每月回收報告和減廢建議。', price_min: 5000, price_max: 20000, unit: '月', capacity_min: 1, capacity_max: 10, duration: '長期', tags: ['環保', '企業服務', '教育', '回收'], impact_metrics: { beneficiaries: 200, waste_reduced_kg: 2000, training_hours: 48, data_confidence: 'verified' } },
    // --- 手作傳情 (seIds[1]) ---
    { se_id: seIds[1], name: '手工藝工作坊', type: 'workshop', description: '由殘疾人士教授的手工坊，製作獨一無二的手工藝品，體驗共融創作。', price_min: 200, price_max: 400, unit: '人', capacity_min: 10, capacity_max: 30, duration: '2小時', tags: ['殘疾人士', '工作坊', '藝術', '共融'], impact_metrics: { beneficiaries: 8, training_hours: 48, items_made: 300, data_confidence: 'self_reported' } },
    { se_id: seIds[1], name: '定制手工禮品', type: 'product', description: '根據企業需求定制的手工藝品禮品，每件均由殘疾人士親手製作。', price_min: 100, price_max: 500, unit: '件', capacity_min: 20, capacity_max: 200, tags: ['殘疾人士', '禮品', '定制', '手工'], impact_metrics: { beneficiaries: 12, items_made: 500, income_generated: 80000, data_confidence: 'verified' } },
    // --- 銀齡樂活 (seIds[2]) ---
    { se_id: seIds[2], name: '長者健康食品禮盒', type: 'product', description: '專為長者設計的低糖低鹽健康食品禮盒，選用本地優質食材。', price_min: 200, price_max: 500, unit: '盒', capacity_min: 30, capacity_max: 500, tags: ['長者', '健康', '禮品', '食品'], impact_metrics: { beneficiaries: 50, meals_provided: 1000, seniors_served: 200, data_confidence: 'verified' } },
    { se_id: seIds[2], name: '銀齡活動策劃', type: 'service', description: '為企業策劃長者探訪和互動活動，含活動設計、物資安排和現場協調。', price_min: 8000, price_max: 25000, unit: '場', capacity_min: 1, capacity_max: 5, duration: '半天至一天', tags: ['長者', '活動策劃', '企業服務', '義工'], impact_metrics: { beneficiaries: 100, seniors_engaged: 300, volunteer_hours: 500, data_confidence: 'self_reported' } },
    // --- 青年動力 (seIds[3]) ---
    { se_id: seIds[3], name: '青年餐飲培訓體驗', type: 'workshop', description: '由受訓青年帶領的餐飲製作工作坊，體驗咖啡拉花或烘焙的樂趣。', price_min: 250, price_max: 450, unit: '人', capacity_min: 8, capacity_max: 25, duration: '3小時', tags: ['青年', '工作坊', '餐飲', '培訓'], impact_metrics: { beneficiaries: 20, youth_trained: 15, workshops_held: 36, data_confidence: 'self_reported' } },
    { se_id: seIds[3], name: '企業下午茶服務', type: 'service', description: '由培訓青年製作的精緻下午茶點心服務，含多款甜鹹點心和飲品。', price_min: 80, price_max: 150, unit: '人', capacity_min: 20, capacity_max: 200, tags: ['青年', '餐飲', '企業服務', '食品'], impact_metrics: { beneficiaries: 25, youth_employed: 8, events_served: 50, data_confidence: 'verified' } },
    // --- 共融廚房 (seIds[4]) ---
    { se_id: seIds[4], name: '多元文化美食體驗', type: 'workshop', description: '學習製作少數族裔傳統美食，了解文化背景，促進跨文化理解和共融。', price_min: 300, price_max: 500, unit: '人', capacity_min: 10, capacity_max: 40, duration: '2.5小時', tags: ['少數族裔', '工作坊', '文化', '共融', '食品'], impact_metrics: { beneficiaries: 10, cultural_exchanges: 24, women_empowered: 6, data_confidence: 'self_reported' } },
    { se_id: seIds[4], name: '企業多元文化午餐', type: 'service', description: '為企業活動提供少數族裔特色午餐服務，多國菜式可選。', price_min: 100, price_max: 180, unit: '人', capacity_min: 30, capacity_max: 300, tags: ['少數族裔', '餐飲', '企業服務', '文化'], impact_metrics: { beneficiaries: 15, meals_served: 2000, women_employed: 8, data_confidence: 'verified' } },
    // --- 升級再造坊 (seIds[5]) ---
    { se_id: seIds[5], name: '升級再造皮革配飾工作坊', type: 'workshop', description: '利用廢棄皮革製作個性化配飾（鎖匙扣、卡片套），學習升級再造理念。', price_min: 280, price_max: 480, unit: '人', capacity_min: 8, capacity_max: 20, duration: '2小時', tags: ['升級再造', '工作坊', '婦女', '手工', '環保'], impact_metrics: { beneficiaries: 6, items_upcycled: 200, waste_diverted_kg: 150, data_confidence: 'self_reported' } },
    { se_id: seIds[5], name: '企業定制升級再造禮品', type: 'product', description: '利用企業廢棄物料（橫額、布料）改造為品牌紀念品，實現零廢目標。', price_min: 120, price_max: 350, unit: '件', capacity_min: 30, capacity_max: 500, tags: ['升級再造', '禮品', '定制', '環保', '婦女'], impact_metrics: { beneficiaries: 10, waste_diverted_kg: 300, women_employed: 4, data_confidence: 'verified' } },
    // --- 有機農莊 (seIds[6]) ---
    { se_id: seIds[6], name: '企業有機耕作體驗日', type: 'workshop', description: '團隊到農場體驗有機耕種，了解食物來源，享用田園午餐。適合團隊建設。', price_min: 350, price_max: 600, unit: '人', capacity_min: 10, capacity_max: 50, duration: '5小時', tags: ['有機', '工作坊', '健康', '團隊建設', '環保'], impact_metrics: { beneficiaries: 12, training_hours: 250, organic_produce_kg: 500, data_confidence: 'self_reported' } },
    { se_id: seIds[6], name: '有機蔬菜企業訂購', type: 'service', description: '每週新鮮有機蔬菜直送辦公室，由康復者種植和包裝，支持本地農業。', price_min: 2000, price_max: 8000, unit: '月', capacity_min: 5, capacity_max: 100, duration: '長期', tags: ['有機', '健康', '企業服務', '食品', '康復者'], impact_metrics: { beneficiaries: 8, organic_produce_kg: 1200, jobs_created: 3, data_confidence: 'verified' } },
    // --- 心靈綠洲 (seIds[7]) ---
    { se_id: seIds[7], name: '企業靜觀減壓工作坊', type: 'workshop', description: '由註冊輔導員帶領的靜觀體驗，學習壓力管理技巧，提升員工心理健康。', price_min: 400, price_max: 800, unit: '人', capacity_min: 8, capacity_max: 30, duration: '3小時', tags: ['精神健康', '工作坊', '靜觀', '員工關懷', '健康'], impact_metrics: { beneficiaries: 20, workshops_held: 48, satisfaction_rate: 92, data_confidence: 'verified' } },
    { se_id: seIds[7], name: '企業心理健康諮詢計劃', type: 'service', description: '為企業提供定期心理健康講座和員工輔導服務，建立正向工作文化。', price_min: 15000, price_max: 50000, unit: '季', capacity_min: 1, capacity_max: 5, duration: '長期', tags: ['精神健康', '企業服務', '輔導', '員工關懷'], impact_metrics: { beneficiaries: 100, counselling_hours: 200, absenteeism_reduced_pct: 15, data_confidence: 'estimated' } },
    // --- 無障礙科技 (seIds[8]) ---
    { se_id: seIds[8], name: '企業網站無障礙審計', type: 'service', description: '由視障測試員進行 WCAG 2.1 無障礙審計，提供詳細改善報告，助企業符合無障礙法規。', price_min: 10000, price_max: 40000, unit: '次', capacity_min: 1, capacity_max: 10, duration: '2-4週', tags: ['無障礙', '企業服務', '科技', '殘疾人士'], impact_metrics: { beneficiaries: 30, sites_audited: 50, digital_inclusion_score: 88, data_confidence: 'verified' } },
    { se_id: seIds[8], name: '輔助科技體驗工作坊', type: 'workshop', description: '體驗視障人士使用的輔助科技（屏幕閱讀器、點字顯示器），培養共融設計思維。', price_min: 250, price_max: 450, unit: '人', capacity_min: 6, capacity_max: 20, duration: '2小時', tags: ['無障礙', '工作坊', '科技', '共融', '殘疾人士'], impact_metrics: { beneficiaries: 15, participants_trained: 300, awareness_score: 85, data_confidence: 'self_reported' } },
    // --- 街坊導賞團 (seIds[9]) ---
    { se_id: seIds[9], name: '深水埗舊區文化導賞團', type: 'workshop', description: '由老街坊帶領探索深水埗布市場、排檔文化和歷史建築，聽在地人講在地故事。', price_min: 180, price_max: 300, unit: '人', capacity_min: 8, capacity_max: 25, duration: '3小時', tags: ['社區導賞', '工作坊', '長者', '文化', '共融'], impact_metrics: { beneficiaries: 5, tours_conducted: 120, seniors_engaged: 8, data_confidence: 'self_reported' } },
    { se_id: seIds[9], name: '企業文化團建導賞', type: 'service', description: '為企業定制主題導賞路線（美食、建築、歷史），結合團隊挑戰任務。', price_min: 3000, price_max: 8000, unit: '場', capacity_min: 10, capacity_max: 40, duration: '半天', tags: ['社區導賞', '企業服務', '團隊建設', '文化', '長者'], impact_metrics: { beneficiaries: 12, tours_conducted: 60, cross_generational_hours: 180, data_confidence: 'verified' } },
    // --- 清潔力量 (seIds[10]) ---
    { se_id: seIds[10], name: '天然環保清潔用品套裝', type: 'product', description: '天然植物配方清潔用品（洗潔精、萬用清潔劑、洗手液），無化學添加，弱勢社群生產。', price_min: 80, price_max: 250, unit: '套', capacity_min: 20, capacity_max: 500, tags: ['環保', '禮品', '弱勢就業', '健康'], impact_metrics: { beneficiaries: 10, chemicals_reduced_kg: 200, jobs_created: 4, data_confidence: 'self_reported' } },
    { se_id: seIds[10], name: '辦公室綠色清潔方案', type: 'service', description: '為企業提供天然清潔用品訂閱 + 定期補充服務，降低辦公室化學品使用。', price_min: 1500, price_max: 5000, unit: '月', capacity_min: 1, capacity_max: 20, tags: ['環保', '企業服務', '健康', '弱勢就業'], impact_metrics: { beneficiaries: 15, chemicals_reduced_kg: 500, offices_served: 30, data_confidence: 'verified' } },
    // --- 長者關懷 (seIds[11]) ---
    { se_id: seIds[11], name: '長者陪診及家居支援服務', type: 'service', description: '由受訓護理員提供長者陪診、家居清潔和簡單護理，減輕在職照顧者壓力。', price_min: 5000, price_max: 15000, unit: '月', capacity_min: 5, capacity_max: 30, duration: '長期', tags: ['長者', '護理', '企業服務', '婦女'], impact_metrics: { beneficiaries: 40, care_hours: 2400, caregivers_supported: 25, data_confidence: 'verified' } },
    { se_id: seIds[11], name: '認知障礙友善工作坊', type: 'workshop', description: '學習與認知障礙長者溝通技巧，體驗長者感官世界，培養同理心和照顧能力。', price_min: 280, price_max: 450, unit: '人', capacity_min: 10, capacity_max: 30, duration: '2.5小時', tags: ['長者', '工作坊', '護理', '健康', '教育'], impact_metrics: { beneficiaries: 25, participants_trained: 200, awareness_score: 90, data_confidence: 'self_reported' } },
    // --- 體育共融 (seIds[12]) ---
    { se_id: seIds[12], name: '共融運動體驗日', type: 'workshop', description: '體驗視障足球、輪椅籃球等共融運動，由特殊學習需要青年擔任教練。', price_min: 250, price_max: 400, unit: '人', capacity_min: 12, capacity_max: 40, duration: '3小時', tags: ['青年', '體育', '共融', '工作坊'], impact_metrics: { beneficiaries: 30, youth_coaches: 8, sessions_held: 72, data_confidence: 'self_reported' } },
    { se_id: seIds[12], name: '企業運動挑戰賽策劃', type: 'service', description: '為企業設計共融主題運動挑戰賽，結合團隊建設和社會共融理念。', price_min: 10000, price_max: 30000, unit: '場', capacity_min: 30, capacity_max: 200, duration: '半天', tags: ['青年', '體育', '企業服務', '共融', '團隊建設'], impact_metrics: { beneficiaries: 50, youth_employed: 12, events_held: 24, data_confidence: 'verified' } },
    // --- 藝術療癒 (seIds[13]) ---
    { se_id: seIds[13], name: '表達藝術減壓體驗', type: 'workshop', description: '運用繪畫、音樂和形體表達釋放壓力，無需藝術基礎，由註冊藝術治療師帶領。', price_min: 350, price_max: 550, unit: '人', capacity_min: 6, capacity_max: 20, duration: '3小時', tags: ['藝術', '工作坊', '精神健康', '員工關懷'], impact_metrics: { beneficiaries: 12, workshops_held: 36, wellbeing_score: 85, data_confidence: 'self_reported' } },
    { se_id: seIds[13], name: '社區壁畫共創項目', type: 'service', description: '企業義工與社區居民共同創作公共壁畫，美化社區同時建立團隊凝聚力。', price_min: 20000, price_max: 80000, unit: '項目', capacity_min: 1, capacity_max: 3, duration: '4-8週', tags: ['藝術', '企業服務', '社區', '共融', '義工'], impact_metrics: { beneficiaries: 200, murals_created: 8, volunteer_hours: 320, data_confidence: 'verified' } },
    // --- 公平貿易站 (seIds[14]) ---
    { se_id: seIds[14], name: '公平貿易企業禮品包', type: 'product', description: '精選公平貿易咖啡、茶葉和朱古力組合，附農民故事卡，送禮同時傳遞價值。', price_min: 150, price_max: 400, unit: '套', capacity_min: 20, capacity_max: 500, tags: ['公平貿易', '禮品', '國際發展', '食品'], impact_metrics: { beneficiaries: 50, farmers_supported: 120, fair_wage_premium_pct: 25, data_confidence: 'verified' } },
    { se_id: seIds[14], name: '公平貿易咖啡品味工作坊', type: 'workshop', description: '品嚐不同產地的公平貿易咖啡，了解咖啡從農田到杯中的旅程和公平貿易的意義。', price_min: 200, price_max: 350, unit: '人', capacity_min: 8, capacity_max: 24, duration: '2小時', tags: ['公平貿易', '工作坊', '咖啡', '國際發展', '教育'], impact_metrics: { beneficiaries: 20, workshops_held: 48, fair_trade_kg: 300, data_confidence: 'self_reported' } },
    // --- 社區農墟 (seIds[15]) ---
    { se_id: seIds[15], name: '社區農墟市集攤位', type: 'service', description: '在企業活動中設置小型農墟市集，提供新鮮本地農產品和手作食品，支持小農。', price_min: 5000, price_max: 15000, unit: '場', capacity_min: 50, capacity_max: 300, duration: '4小時', tags: ['有機', '企業服務', '社區', '食品', '市集'], impact_metrics: { beneficiaries: 30, farmers_participated: 15, local_sales_hkd: 50000, data_confidence: 'self_reported' } },
    { se_id: seIds[15], name: '城市農耕新手班', type: 'workshop', description: '在天台或露台學習種植香草和蔬菜，適合企業員工綠色生活培訓。', price_min: 200, price_max: 350, unit: '人', capacity_min: 10, capacity_max: 30, duration: '2.5小時', tags: ['工作坊', '有機', '教育', '環保', '健康'], impact_metrics: { beneficiaries: 18, participants_trained: 150, urban_farms_started: 25, data_confidence: 'self_reported' } },
    // --- 聾人咖啡 (seIds[16]) ---
    { se_id: seIds[16], name: '手語咖啡體驗工作坊', type: 'workshop', description: '在無聲環境中學習基本手語，體驗聾人咖啡師沖煮的精品咖啡，打破溝通障礙。', price_min: 180, price_max: 320, unit: '人', capacity_min: 6, capacity_max: 20, duration: '2小時', tags: ['殘疾人士', '工作坊', '咖啡', '共融', '手語'], impact_metrics: { beneficiaries: 5, deaf_baristas_employed: 4, workshops_held: 96, data_confidence: 'verified' } },
    { se_id: seIds[16], name: '企業無障礙咖啡到會', type: 'service', description: '由聾人咖啡師團隊提供企業活動咖啡到會，附手語教學小卡，推廣聾健共融。', price_min: 2500, price_max: 6000, unit: '場', capacity_min: 30, capacity_max: 200, tags: ['殘疾人士', '餐飲', '企業服務', '共融', '咖啡'], impact_metrics: { beneficiaries: 12, events_served: 80, deaf_employment_hours: 640, data_confidence: 'verified' } },
    // --- 輪椅遊蹤 (seIds[17]) ---
    { se_id: seIds[17], name: '無障礙城市探索團', type: 'workshop', description: '跟隨輪椅導遊探索城市，親身體驗無障礙設施的優劣，從用家角度理解城市設計。', price_min: 250, price_max: 400, unit: '人', capacity_min: 6, capacity_max: 15, duration: '3小時', tags: ['無障礙', '工作坊', '共融', '社區導賞'], impact_metrics: { beneficiaries: 8, tours_conducted: 48, accessibility_reports: 30, data_confidence: 'self_reported' } },
    { se_id: seIds[17], name: '企業無障礙顧問服務', type: 'service', description: '由輪椅使用者為企業進行無障礙評估，提供實體空間和服務流程改善建議。', price_min: 8000, price_max: 25000, unit: '次', capacity_min: 1, capacity_max: 5, duration: '2-3週', tags: ['無障礙', '企業服務', '顧問', '殘疾人士'], impact_metrics: { beneficiaries: 50, venues_assessed: 20, accessibility_improved: 85, data_confidence: 'verified' } },
    // --- 少數族裔裁縫 (seIds[18]) ---
    { se_id: seIds[18], name: '民族布藝手作工作坊', type: 'workshop', description: '學習少數族裔傳統布藝（紥染、刺繡），由婦女導師親授，體驗多元文化美學。', price_min: 220, price_max: 380, unit: '人', capacity_min: 8, capacity_max: 20, duration: '2.5小時', tags: ['少數族裔', '工作坊', '文化', '婦女', '手工'], impact_metrics: { beneficiaries: 6, women_empowered: 5, workshops_held: 36, data_confidence: 'self_reported' } },
    { se_id: seIds[18], name: '企業多元文化制服設計', type: 'service', description: '結合不同民族服飾元素為企業設計獨特制服，展示多元共融的企業文化。', price_min: 15000, price_max: 50000, unit: '項目', capacity_min: 1, capacity_max: 3, duration: '6-8週', tags: ['少數族裔', '企業服務', '定制', '文化'], impact_metrics: { beneficiaries: 8, women_employed: 6, projects_completed: 12, data_confidence: 'verified' } },
    // --- 回收單車 (seIds[19]) ---
    { se_id: seIds[19], name: '單車維修體驗工作坊', type: 'workshop', description: '學習基本單車維修技巧，由邊緣青年導師指導，了解循環經濟和社區活化。', price_min: 200, price_max: 350, unit: '人', capacity_min: 6, capacity_max: 15, duration: '3小時', tags: ['青年', '工作坊', '環保', '培訓', '回收'], impact_metrics: { beneficiaries: 10, youth_trained: 12, bikes_repaired: 200, data_confidence: 'self_reported' } },
    { se_id: seIds[19], name: '企業綠色出行方案', type: 'service', description: '為企業提供翻新單車租賃和維修服務，鼓勵員工綠色出行，減少碳足跡。', price_min: 3000, price_max: 10000, unit: '月', capacity_min: 5, capacity_max: 50, duration: '長期', tags: ['環保', '企業服務', '青年', '回收', '健康'], impact_metrics: { beneficiaries: 30, bikes_deployed: 100, carbon_reduced_kg: 1500, data_confidence: 'estimated' } }
  ];
  
  for (const product of products) {
    await new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO products (se_id, name, type, description, price_min, price_max, unit, capacity_min, capacity_max, duration, tags, impact_metrics) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          product.se_id, product.name, product.type, product.description,
          product.price_min, product.price_max, product.unit,
          product.capacity_min || null, product.capacity_max || null, product.duration || null,
          JSON.stringify(product.tags), JSON.stringify(product.impact_metrics)
        ],
        (err) => { if (err) return reject(err); resolve(); }
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
      (err) => { if (err) console.log('Admin user may already exist'); resolve(); }
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
