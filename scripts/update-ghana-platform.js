const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'index.html');
let content = fs.readFileSync(indexPath, 'utf8');

console.log('Original content size:', content.length);

// 1. Title and Meta description
content = content.replace(
  /<title>.*?<\/title>/,
  "<title>AETHER | Ghana's Premier Luxury Stays, Executive Fleet & Gastronomy</title>"
);
content = content.replace(
  /<meta name="description" content=".*?">/,
  '<meta name="description" content="Aether Ghana - Reserve verified 5-star hotel suites in Accra & Kumasi, ride BMW xDrive, Mercedes GLE & Toyota Land Cruiser V8, and discover authentic Ghanaian fine dining.">'
);

// 2. Hero Background in CSS
content = content.replace(
  /background: radial-gradient\(circle at 50% 20%, rgba\(30, 27, 75, 0\.6\) 0%, rgba\(7, 7, 11, 0\.95\) 75%\), url\('https:\/\/images\.unsplash\.com\/photo-1542314831-068cd1dbfeeb\?q=80&w=2000'\);/,
  "background: radial-gradient(circle at 50% 25%, rgba(10, 10, 18, 0.45) 0%, rgba(7, 7, 11, 0.94) 82%), url('https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=2000');"
);

// 3. Navbar Desktop - Remove Yachts & Jets
content = content.replace(
  /\s*<a class="nav-link" id="nav-yachts" onclick="quickFilterService\('YACHT'\)"><i data-lucide="anchor" style="width:15px;height:15px;"><\/i> Yachts & Jets<\/a>/,
  ""
);

// 4. Navbar Mobile - Remove Yachts & Jets
content = content.replace(
  /\s*<a class="mobile-nav-link" id="mobile-nav-yachts" onclick="quickFilterService\('YACHT'\); closeMobileNav\(\);"><i data-lucide="anchor"><\/i> Yachts & Jets<\/a>/,
  ""
);

// 5. Currency Selectors (Desktop & Mobile) - Add GHS as default
const desktopCurrOld = `<select id="currency-select" class="input-field" style="padding: 0.4rem 0.8rem; font-size: 0.8rem; width: auto; background: rgba(255,255,255,0.05); border-radius: var(--radius-sm);" onchange="updateCurrency(this.value)">
        <option value="USD">USD ($)</option>
        <option value="EUR">EUR (€)</option>
        <option value="GBP">GBP (£)</option>
        <option value="AED">AED (د.إ)</option>
        <option value="JPY">JPY (¥)</option>
      </select>`;

const desktopCurrNew = `<select id="currency-select" class="input-field" style="padding: 0.4rem 0.8rem; font-size: 0.8rem; width: auto; background: rgba(255,255,255,0.05); border-radius: var(--radius-sm);" onchange="updateCurrency(this.value)">
        <option value="GHS" selected>GHS (GH₵)</option>
        <option value="USD">USD ($)</option>
        <option value="EUR">EUR (€)</option>
        <option value="GBP">GBP (£)</option>
      </select>`;

content = content.replace(desktopCurrOld, desktopCurrNew);

const mobileCurrOld = `<select id="mobile-currency-select" class="input-field" style="padding: 0.4rem 0.8rem; font-size: 0.82rem; width: auto; background: rgba(255,255,255,0.06); border-radius: var(--radius-sm);" onchange="updateCurrency(this.value)">
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="AED">AED (د.إ)</option>
            <option value="JPY">JPY (¥)</option>
          </select>`;

const mobileCurrNew = `<select id="mobile-currency-select" class="input-field" style="padding: 0.4rem 0.8rem; font-size: 0.82rem; width: auto; background: rgba(255,255,255,0.06); border-radius: var(--radius-sm);" onchange="updateCurrency(this.value)">
            <option value="GHS" selected>GHS (GH₵)</option>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
          </select>`;

content = content.replace(mobileCurrOld, mobileCurrNew);

// 6. Hero text and search widget in page-home
const heroOldText = `<div style="max-width: 900px; margin-bottom: 2.5rem; z-index: 10;">
        <div style="display: inline-flex; align-items: center; gap: 0.6rem; background: rgba(255,255,255,0.06); border: 1px solid var(--border-gold); padding: 0.55rem 1.4rem; border-radius: 40px; margin-bottom: 2rem; box-shadow: var(--shadow-gold);">
          <span style="color: var(--accent-gold); font-size: 1.1rem;">✦</span>
          <span style="font-size: 0.82rem; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #fde047;">The Pinnacle of Curated Luxury Escapes</span>
        </div>
        
        <h1 class="font-serif" style="font-size: 3.8rem; font-weight: 900; line-height: 1.08; margin-bottom: 1.5rem;">
          Bespoke Stays, <span class="gradient-gold-text">Chauffeurs</span> & <span class="gradient-cyan-text">Gastronomy</span>
        </h1>
        
        <p style="font-size: 1.2rem; color: var(--text-gray); line-height: 1.6; max-width: 720px; margin: 0 auto;">
          An exclusive ecosystem for discerning global travelers. Reserve verified presidential suites, private chauffeur limousines, track supercars, and Michelin-starred tasting tables.
        </p>
      </div>`;

const heroNewText = `<div style="max-width: 920px; margin-bottom: 2.5rem; z-index: 10;">
        <div style="display: inline-flex; align-items: center; gap: 0.6rem; background: rgba(255,255,255,0.06); border: 1px solid var(--border-gold); padding: 0.55rem 1.4rem; border-radius: 40px; margin-bottom: 2rem; box-shadow: var(--shadow-gold);">
          <span style="color: var(--accent-gold); font-size: 1.1rem;">✦</span>
          <span style="font-size: 0.82rem; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #fde047;">Ghana's Premier Luxury Platform</span>
        </div>
        
        <h1 class="font-serif" style="font-size: 3.6rem; font-weight: 900; line-height: 1.08; margin-bottom: 1.5rem;">
          Experience Ghana in <span class="gradient-gold-text">Absolute Luxury</span>
        </h1>
        
        <p style="font-size: 1.15rem; color: var(--text-gray); line-height: 1.6; max-width: 780px; margin: 0 auto;">
          Ghana's #1 luxury booking platform. Reserve 5-star hotels in Accra & Kumasi, cruise in a BMW xDrive, Mercedes GLE, or Toyota Land Cruiser V8, and discover authentic Ghanaian fine dining.
        </p>
      </div>`;

content = content.replace(heroOldText, heroNewText);

// 7. Hero Search Category Tabs - remove Yachts and update labels
const searchTabsOld = `<div class="service-tabs-nav">
          <button class="tab-search-btn active" onclick="setSearchCategory('ALL', this)"><i data-lucide="globe" style="width:15px;height:15px;"></i> All Services</button>
          <button class="tab-search-btn" onclick="setSearchCategory('HOTEL', this)"><i data-lucide="building-2" style="width:15px;height:15px;"></i> Hotels & Villas</button>
          <button class="tab-search-btn" onclick="setSearchCategory('CAR_RENTAL', this)"><i data-lucide="car" style="width:15px;height:15px;"></i> Exotic Car Rentals</button>
          <button class="tab-search-btn" onclick="setSearchCategory('PRIVATE_DRIVER', this)"><i data-lucide="award" style="width:15px;height:15px;"></i> Chauffeur Services</button>
          <button class="tab-search-btn" onclick="setSearchCategory('RESTAURANT', this)"><i data-lucide="utensils-crossed" style="width:15px;height:15px;"></i> Michelin Dining</button>
          <button class="tab-search-btn" onclick="setSearchCategory('YACHT', this)"><i data-lucide="anchor" style="width:15px;height:15px;"></i> Yachts & Jets</button>
        </div>`;

const searchTabsNew = `<div class="service-tabs-nav">
          <button class="tab-search-btn active" onclick="setSearchCategory('ALL', this)"><i data-lucide="globe" style="width:15px;height:15px;"></i> All Services</button>
          <button class="tab-search-btn" onclick="setSearchCategory('HOTEL', this)"><i data-lucide="building-2" style="width:15px;height:15px;"></i> Hotels & Resorts</button>
          <button class="tab-search-btn" onclick="setSearchCategory('CAR_RENTAL', this)"><i data-lucide="car" style="width:15px;height:15px;"></i> Executive Car Fleet</button>
          <button class="tab-search-btn" onclick="setSearchCategory('PRIVATE_DRIVER', this)"><i data-lucide="award" style="width:15px;height:15px;"></i> Chauffeur & VIP Escorts</button>
          <button class="tab-search-btn" onclick="setSearchCategory('RESTAURANT', this)"><i data-lucide="utensils-crossed" style="width:15px;height:15px;"></i> Ghanaian Fine Dining</button>
        </div>`;

content = content.replace(searchTabsOld, searchTabsNew);

// Search destination placeholder
content = content.replace(
  'id="search-destination" placeholder="e.g. Paris, Dubai, Monaco"',
  'id="search-destination" placeholder="e.g. Accra, Kumasi, Takoradi"'
);

// Quick destination pills
const trendingOld = `<div style="display: flex; gap: 0.6rem; align-items: center; margin-top: 1.2rem; flex-wrap: wrap; font-size: 0.82rem; color: var(--text-gray);">
          <span style="font-weight: 600; color: var(--accent-gold);">Trending Destinations:</span>
          <span class="persona-btn" onclick="quickSearchCity('Paris')">🇫🇷 Paris</span>
          <span class="persona-btn" onclick="quickSearchCity('Monaco')">🇲🇨 Monaco</span>
          <span class="persona-btn" onclick="quickSearchCity('Dubai')">🇦🇪 Dubai</span>
          <span class="persona-btn" onclick="quickSearchCity('Tokyo')">🇯🇵 Tokyo</span>
          <span class="persona-btn" onclick="quickSearchCity('Amalfi Coast')">🇮🇹 Amalfi</span>
          <span class="persona-btn" onclick="quickSearchCity('Los Angeles')">🇺🇸 Los Angeles</span>
          <span class="persona-btn" onclick="quickSearchCity('Geneva')">🇨🇭 Geneva</span>
        </div>`;

const trendingNew = `<div style="display: flex; gap: 0.6rem; align-items: center; margin-top: 1.2rem; flex-wrap: wrap; font-size: 0.82rem; color: var(--text-gray);">
          <span style="font-weight: 600; color: var(--accent-gold);">Popular in Ghana:</span>
          <span class="persona-btn" onclick="quickSearchCity('Accra')">🇬🇭 Accra</span>
          <span class="persona-btn" onclick="quickSearchCity('Kumasi')">🇬🇭 Kumasi</span>
          <span class="persona-btn" onclick="quickSearchCity('Takoradi')">🇬🇭 Takoradi</span>
          <span class="persona-btn" onclick="quickSearchCity('Cape Coast')">🇬🇭 Cape Coast</span>
          <span class="persona-btn" onclick="quickSearchCity('Aburi')">🇬🇭 Aburi Hills</span>
          <span class="persona-btn" onclick="quickSearchCity('Akosombo')">🇬🇭 Akosombo</span>
          <span class="persona-btn" onclick="quickSearchCity('Ada Foah')">🇬🇭 Ada Foah</span>
        </div>`;

content = content.replace(trendingOld, trendingNew);

// KPI Stats banner text
content = content.replace('14,500+', '150+');
content = content.replace('Verified Luxury Accommodations', 'Luxury Ghanaian Hotels & Suites');
content = content.replace('1,200+', '95+');
content = content.replace('Chauffeurs & Exotic Supercars', 'BMW, GLE & V8 Fleet Vehicles');
content = content.replace('680+', '60+');
content = content.replace('Michelin & Sommelier Tables', 'Fine Dining & Gastronomy Venues');

// 8. Insert Ghana Fleet Showcase section right after KPI stats banner
const kpiEndTarget = `</section>\n\n    <!-- Featured Elite Experiences Grid -->`;
const ghanaFleetSection = `</section>

    <!-- ─── GHANA'S MOST WANTED FLEET SHOWCASE ─── -->
    <section style="background: linear-gradient(180deg, rgba(7,7,12,1) 0%, rgba(14,14,24,0.92) 100%); padding: 5rem 4rem 3rem 4rem; border-bottom: 1px solid var(--border-glass);">
      <div style="max-width: 1350px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 3rem;">
          <div style="display: inline-flex; align-items: center; gap: 0.5rem; color: var(--accent-cyan); font-size: 0.85rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1.2px; margin-bottom: 0.6rem;">
            <i data-lucide="car" style="width: 16px; height: 16px;"></i> Ghana's Most Wanted Fleet
          </div>
          <h2 class="font-serif" style="font-size: 2.5rem; font-weight: 800;">Drive Ghana's Finest Wheels</h2>
          <p style="color: var(--text-gray); font-size: 1.05rem; margin-top: 0.5rem; max-width: 680px; margin-left: auto; margin-right: auto;">
            From the bustling business avenues of Airport City to the scenic highlands of Kumasi & Aburi — drive or be chauffeured in iconic prestige.
          </p>
        </div>

        <div class="grid-4" style="gap: 1.5rem;">
          <!-- BMW X5 xDrive -->
          <div class="glass glass-interactive" onclick="quickFilterService('CAR_RENTAL')" style="border-radius: var(--radius-lg); overflow: hidden; cursor: pointer;">
            <div style="height: 180px; overflow: hidden; position: relative;">
              <img src="https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=800" alt="BMW xDrive" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease;" onmouseenter="this.style.transform='scale(1.08)'" onmouseleave="this.style.transform='scale(1)'">
              <div style="position: absolute; top: 0.8rem; left: 0.8rem; background: rgba(0,0,0,0.75); backdrop-filter: blur(8px); border: 1px solid var(--accent-gold); border-radius: 20px; padding: 0.3rem 0.75rem; font-size: 0.7rem; font-weight: 800; color: var(--accent-gold); text-transform: uppercase;">
                Most Popular
              </div>
            </div>
            <div style="padding: 1.3rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
                <h3 style="font-size: 1.15rem; font-weight: 800; color: #fff;">BMW X5 xDrive</h3>
                <span style="color: var(--accent-gold); font-weight: 800; font-size: 0.95rem;">GH₵ 1,850/d</span>
              </div>
              <p style="font-size: 0.82rem; color: var(--text-gray); line-height: 1.4; margin-bottom: 0.8rem;">
                Intelligent all-wheel drive, M-Sport styling & Harman Kardon sound. Ultimate Accra road performance.
              </p>
              <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; font-size: 0.72rem; color: var(--accent-cyan);">
                <span>• xDrive AWD</span>
                <span>• TwinPower Turbo</span>
                <span>• Airport Residential</span>
              </div>
            </div>
          </div>

          <!-- Mercedes-Benz GLE 450 -->
          <div class="glass glass-interactive" onclick="quickFilterService('CAR_RENTAL')" style="border-radius: var(--radius-lg); overflow: hidden; cursor: pointer;">
            <div style="height: 180px; overflow: hidden; position: relative;">
              <img src="https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=800" alt="Mercedes GLE" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease;" onmouseenter="this.style.transform='scale(1.08)'" onmouseleave="this.style.transform='scale(1)'">
              <div style="position: absolute; top: 0.8rem; left: 0.8rem; background: rgba(0,0,0,0.75); backdrop-filter: blur(8px); border: 1px solid var(--accent-cyan); border-radius: 20px; padding: 0.3rem 0.75rem; font-size: 0.7rem; font-weight: 800; color: var(--accent-cyan); text-transform: uppercase;">
                Executive Pick
              </div>
            </div>
            <div style="padding: 1.3rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
                <h3 style="font-size: 1.15rem; font-weight: 800; color: #fff;">Mercedes GLE 450</h3>
                <span style="color: var(--accent-gold); font-weight: 800; font-size: 0.95rem;">GH₵ 2,600/d</span>
              </div>
              <p style="font-size: 0.82rem; color: var(--text-gray); line-height: 1.4; margin-bottom: 0.8rem;">
                AMG 4MATIC luxury, airmatic suspension & Burmester audio. Preferred corporate status symbol.
              </p>
              <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; font-size: 0.72rem; color: var(--accent-cyan);">
                <span>• 4MATIC AWD</span>
                <span>• Burmester Sound</span>
                <span>• Airport City</span>
              </div>
            </div>
          </div>

          <!-- Toyota Land Cruiser V8 -->
          <div class="glass glass-interactive" onclick="quickFilterService('PRIVATE_DRIVER')" style="border-radius: var(--radius-lg); overflow: hidden; cursor: pointer;">
            <div style="height: 180px; overflow: hidden; position: relative;">
              <img src="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=800" alt="Land Cruiser V8" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease;" onmouseenter="this.style.transform='scale(1.08)'" onmouseleave="this.style.transform='scale(1)'">
              <div style="position: absolute; top: 0.8rem; left: 0.8rem; background: rgba(0,0,0,0.75); backdrop-filter: blur(8px); border: 1px solid #34d399; border-radius: 20px; padding: 0.3rem 0.75rem; font-size: 0.7rem; font-weight: 800; color: #34d399; text-transform: uppercase;">
                Icon of Ghana
              </div>
            </div>
            <div style="padding: 1.3rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
                <h3 style="font-size: 1.15rem; font-weight: 800; color: #fff;">Toyota Land Cruiser V8</h3>
                <span style="color: var(--accent-gold); font-weight: 800; font-size: 0.95rem;">GH₵ 2,800/d</span>
              </div>
              <p style="font-size: 0.82rem; color: var(--text-gray); line-height: 1.4; margin-bottom: 0.8rem;">
                Unrivaled road presence. Bulletproof 4x4 capability for VIP convoys and cross-country expeditions.
              </p>
              <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; font-size: 0.72rem; color: #34d399;">
                <span>• Full 4WD</span>
                <span>• Vetted Chauffeur</span>
                <span>• Kumasi & Accra</span>
              </div>
            </div>
          </div>

          <!-- Toyota Vitz / Yaris -->
          <div class="glass glass-interactive" onclick="quickFilterService('CAR_RENTAL')" style="border-radius: var(--radius-lg); overflow: hidden; cursor: pointer;">
            <div style="height: 180px; overflow: hidden; position: relative;">
              <img src="https://images.unsplash.com/photo-1609521263047-f8f205293f24?q=80&w=800" alt="Toyota Vitz Yaris" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease;" onmouseenter="this.style.transform='scale(1.08)'" onmouseleave="this.style.transform='scale(1)'">
              <div style="position: absolute; top: 0.8rem; left: 0.8rem; background: rgba(0,0,0,0.75); backdrop-filter: blur(8px); border: 1px solid var(--accent-violet); border-radius: 20px; padding: 0.3rem 0.75rem; font-size: 0.7rem; font-weight: 800; color: var(--accent-violet); text-transform: uppercase;">
                City Cruiser
              </div>
            </div>
            <div style="padding: 1.3rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
                <h3 style="font-size: 1.15rem; font-weight: 800; color: #fff;">Toyota Vitz / Yaris</h3>
                <span style="color: var(--accent-gold); font-weight: 800; font-size: 0.95rem;">GH₵ 650/d</span>
              </div>
              <p style="font-size: 0.82rem; color: var(--text-gray); line-height: 1.4; margin-bottom: 0.8rem;">
                Agile, reliable, ice-cold air conditioning, and fuel-efficient. The smart urban choice for Accra commuting.
              </p>
              <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; font-size: 0.72rem; color: var(--accent-violet);">
                <span>• Fuel Efficient</span>
                <span>• Cool A/C</span>
                <span>• East Legon & Osu</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>\n\n    <!-- Featured Elite Experiences Grid -->`;

if (content.includes(kpiEndTarget)) {
  content = content.replace(kpiEndTarget, ghanaFleetSection);
}

// 9. Listings Filter Bar - remove Yacht & update pills
const filterPillsOld = `<div style="display: flex; gap: 0.5rem; flex-wrap: wrap;" id="listing-filter-pills">
        <button class="btn btn-primary btn-sm btn-filter-pill" onclick="filterByServiceType('ALL', this)">All (16)</button>
        <button class="btn btn-secondary btn-sm btn-filter-pill" onclick="filterByServiceType('HOTEL', this)"><i data-lucide="building" style="width:14px;height:14px;"></i> Stays & Villas</button>
        <button class="btn btn-secondary btn-sm btn-filter-pill" onclick="filterByServiceType('CAR_RENTAL', this)"><i data-lucide="car" style="width:14px;height:14px;"></i> Exotic Rentals</button>
        <button class="btn btn-secondary btn-sm btn-filter-pill" onclick="filterByServiceType('PRIVATE_DRIVER', this)"><i data-lucide="award" style="width:14px;height:14px;"></i> Chauffeurs</button>
        <button class="btn btn-secondary btn-sm btn-filter-pill" onclick="filterByServiceType('RESTAURANT', this)"><i data-lucide="utensils" style="width:14px;height:14px;"></i> Gastronomy</button>
        <button class="btn btn-secondary btn-sm btn-filter-pill" onclick="filterByServiceType('YACHT', this)"><i data-lucide="anchor" style="width:14px;height:14px;"></i> Yachts & Jets</button>
      </div>`;

const filterPillsNew = `<div style="display: flex; gap: 0.5rem; flex-wrap: wrap;" id="listing-filter-pills">
        <button class="btn btn-primary btn-sm btn-filter-pill" onclick="filterByServiceType('ALL', this)">All Collections</button>
        <button class="btn btn-secondary btn-sm btn-filter-pill" onclick="filterByServiceType('HOTEL', this)"><i data-lucide="building" style="width:14px;height:14px;"></i> Stays & Resorts</button>
        <button class="btn btn-secondary btn-sm btn-filter-pill" onclick="filterByServiceType('CAR_RENTAL', this)"><i data-lucide="car" style="width:14px;height:14px;"></i> Car Rentals (BMW, GLE, V8, Vitz)</button>
        <button class="btn btn-secondary btn-sm btn-filter-pill" onclick="filterByServiceType('PRIVATE_DRIVER', this)"><i data-lucide="award" style="width:14px;height:14px;"></i> Executive Chauffeurs</button>
        <button class="btn btn-secondary btn-sm btn-filter-pill" onclick="filterByServiceType('RESTAURANT', this)"><i data-lucide="utensils" style="width:14px;height:14px;"></i> Ghanaian Gastronomy</button>
      </div>`;

content = content.replace(filterPillsOld, filterPillsNew);

// Search input keyword placeholder in listings
content = content.replace(
  'id="list-keyword-input" placeholder="Search keywords, penthouse, Ferrari..."',
  'id="list-keyword-input" placeholder="Search BMW xDrive, Land Cruiser V8, Kempinski, Buka..."'
);

// 10. VIP Concierge Form - remove yacht & jet options
const conciergeDescOld = `<p style="color: var(--text-gray); font-size: 1.1rem; max-width: 650px; margin: 0 auto;">
          Require a private jet charter, superyacht Mediterranean buyout, red carpet security entourage, or Michelin chef residency at your private villa?
        </p>`;

const conciergeDescNew = `<p style="color: var(--text-gray); font-size: 1.1rem; max-width: 680px; margin: 0 auto;">
          Require police escort motorcades, Toyota Land Cruiser V8 cross-country convoys, VIP Kotoka International Airport reception, or private chef residency?
        </p>`;

content = content.replace(conciergeDescOld, conciergeDescNew);

const conciergeSelectOld = `<select id="concierge-type" class="input-field">
                <option value="Private Jet & Aviation">Private Jet & Helicopter Aviation</option>
                <option value="Superyacht Buyout">Superyacht Mediterranean Buyout</option>
                <option value="VIP Security & Armored Transport">VIP Close Protection & Armored Escort</option>
                <option value="Private Island Estate">Private Island Estate Acquisition</option>
                <option value="Michelin Private Chef">Private Michelin Chef in Residence</option>
              </select>`;

const conciergeSelectNew = `<select id="concierge-type" class="input-field">
                <option value="VIP Police Escort & Diplomatic Motorcade">VIP Police Escort & Diplomatic Motorcade</option>
                <option value="Toyota Land Cruiser V8 Cross-Country Convoy">Toyota Land Cruiser V8 Cross-Country Convoy</option>
                <option value="Kotoka International Airport (KIA) VIP Meet & Greet">Kotoka International Airport (KIA) VIP Meet & Greet</option>
                <option value="Private Chef for Contemporary Ghanaian Gastronomy">Private Chef for Contemporary Ghanaian Gastronomy</option>
                <option value="Presidential Lake & Oceanfront Villa Buyout">Presidential Lake & Oceanfront Villa Buyout (Akosombo / Ada Foah)</option>
              </select>`;

content = content.replace(conciergeSelectOld, conciergeSelectNew);

content = content.replace(
  'placeholder="e.g. Nice Airport to Monaco Heliport + Port Hercule"',
  'placeholder="e.g. Kotoka Airport KIA VIP Lounge to Kempinski Hotel & Kumasi Convoy"'
);

// 11. Partner Registration Form Options
const partnerCatOld = `<select id="auth-partner-category" class="input-field" style="font-size: 0.82rem;">
                  <option value="Supercars, Yachts & Private Drivers">Supercars, Yachts & Private Drivers</option>
                  <option value="Private Aviation & Helicopter Transfers">Private Aviation & Helicopter Transfers</option>
                  <option value="Luxury Stays & Heritage Châteaux">Luxury Stays & Heritage Châteaux</option>
                  <option value="Michelin Gastronomy & Estate Chefs">Michelin Gastronomy & Estate Chefs</option>
                </select>`;

const partnerCatNew = `<select id="auth-partner-category" class="input-field" style="font-size: 0.82rem;">
                  <option value="Executive Cars & Chauffeur Services">Executive Cars & Chauffeur Services (BMW xDrive, GLE, V8, Vitz/Yaris)</option>
                  <option value="5-Star Hotels, Stays & Luxury Villas">5-Star Hotels, Stays & Luxury Villas</option>
                  <option value="Authentic & Contemporary Gastronomy">Authentic & Contemporary Gastronomy</option>
                  <option value="VIP Diplomatic & Corporate Security Escorts">VIP Diplomatic & Corporate Security Escorts</option>
                </select>`;

content = content.replace(partnerCatOld, partnerCatNew);

content = content.replace('placeholder="Monaco, Cannes, Nice, Paris"', 'placeholder="Accra, Kumasi, Takoradi, Tema, Cape Coast"');
content = content.replace('placeholder="E.g. 14 Supercars & 4 Yachts"', 'placeholder="E.g. 12 Executive SUVs (BMW, GLE, V8) & 8 City Cars (Vitz/Yaris)"');
content = content.replace('placeholder="+377 98 98 22 00"', 'placeholder="+233 24 456 7890"');
content = content.replace('placeholder="MON-LUX-2024-8874"', 'placeholder="DVLA-GH-FLEET-8874"');
content = content.replace('placeholder="Lloyd\'s of London ($50M Liability)"', 'placeholder="Enterprise Insurance Ghana Ltd. (GH₵25M Liability)"');

// 12. Add-asset modal options - remove YACHT
const newAssetTypeOld = `<select id="new-asset-type" class="input-field">
                    <option value="HOTEL">Hotel Suite / Luxury Villa</option>
                    <option value="CAR_RENTAL">Exotic Car (Self-Drive)</option>
                    <option value="PRIVATE_DRIVER">Chauffeur / Limousine Service</option>
                    <option value="RESTAURANT">Michelin Gastronomy Table</option>
                    <option value="YACHT">Superyacht / Private Jet</option>
                  </select>`;

const newAssetTypeNew = `<select id="new-asset-type" class="input-field">
                    <option value="HOTEL">Hotel Suite / Luxury Villa</option>
                    <option value="CAR_RENTAL">Executive Car Rental (BMW, GLE, V8, Vitz/Yaris)</option>
                    <option value="PRIVATE_DRIVER">Chauffeur / VIP Driver Service</option>
                    <option value="RESTAURANT">Ghanaian Fine Dining & Lounge</option>
                  </select>`;

content = content.replace(newAssetTypeOld, newAssetTypeNew);

// 13. Testimonials & Footer text update
content = content.replace('Gianluca Rossi', 'Kwame Asante');
content = content.replace('Villa & Yacht Operator, Italy', 'Luxury Fleet & Residence Host, Accra & Kumasi');
content = content.replace(
  '"The partner host portal is the best in the industry. As a luxury villa owner in Amalfi, getting approved guests and direct payouts has never been smoother."',
  '"Aether has transformed our executive fleet operations in Accra. From BMW xDrives to Land Cruiser V8 convoys, corporate clients and tourists book effortlessly with guaranteed escrow settlements."'
);

content = content.replace(
  'Subscribe for confidential private jet empty-leg alerts, private island invitations, and $250 credit toward your first booking.',
  'Subscribe for confidential luxury suite upgrades, VIP Land Cruiser convoy discounts, and GH₵500 welcome credit toward your first booking.'
);

// Footer links
const footerColOld = `<div style="display: flex; flex-direction: column; gap: 0.7rem; font-size: 0.88rem; color: var(--text-gray);">
          <a onclick="quickFilterService('HOTEL')" style="cursor: pointer; transition: 0.2s;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='var(--text-gray)'">Presidential Penthouses</a>
          <a onclick="quickFilterService('CAR_RENTAL')" style="cursor: pointer; transition: 0.2s;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='var(--text-gray)'">Ferrari & Rolls-Royce Fleet</a>
          <a onclick="quickFilterService('PRIVATE_DRIVER')" style="cursor: pointer; transition: 0.2s;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='var(--text-gray)'">Executive Chauffeurs</a>
          <a onclick="quickFilterService('RESTAURANT')" style="cursor: pointer; transition: 0.2s;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='var(--text-gray)'">Michelin Star Tables</a>
          <a onclick="quickFilterService('YACHT')" style="cursor: pointer; transition: 0.2s;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='var(--text-gray)'">Superyachts & Jets</a>
        </div>`;

const footerColNew = `<div style="display: flex; flex-direction: column; gap: 0.7rem; font-size: 0.88rem; color: var(--text-gray);">
          <a onclick="quickFilterService('HOTEL')" style="cursor: pointer; transition: 0.2s;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='var(--text-gray)'">5-Star Stays & Suites</a>
          <a onclick="quickFilterService('CAR_RENTAL')" style="cursor: pointer; transition: 0.2s;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='var(--text-gray)'">BMW xDrive & GLE Fleet</a>
          <a onclick="quickFilterService('PRIVATE_DRIVER')" style="cursor: pointer; transition: 0.2s;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='var(--text-gray)'">Land Cruiser V8 Chauffeurs</a>
          <a onclick="quickFilterService('CAR_RENTAL')" style="cursor: pointer; transition: 0.2s;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='var(--text-gray)'">Toyota Vitz & Yaris Cruisers</a>
          <a onclick="quickFilterService('RESTAURANT')" style="cursor: pointer; transition: 0.2s;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='var(--text-gray)'">Ghanaian Fine Dining</a>
        </div>`;

content = content.replace(footerColOld, footerColNew);

const footerDestOld = `<div style="display: flex; flex-direction: column; gap: 0.7rem; font-size: 0.88rem; color: var(--text-gray);">
          <a onclick="quickSearchCity('Paris')" style="cursor: pointer;">Paris, France</a>
          <a onclick="quickSearchCity('Monaco')" style="cursor: pointer;">Monaco & French Riviera</a>
          <a onclick="quickSearchCity('Dubai')" style="cursor: pointer;">Dubai, UAE</a>
          <a onclick="quickSearchCity('Tokyo')" style="cursor: pointer;">Tokyo, Japan</a>
          <a onclick="quickSearchCity('Amalfi Coast')" style="cursor: pointer;">Amalfi Coast, Italy</a>
        </div>`;

const footerDestNew = `<div style="display: flex; flex-direction: column; gap: 0.7rem; font-size: 0.88rem; color: var(--text-gray);">
          <a onclick="quickSearchCity('Accra')" style="cursor: pointer;">Accra (Capital & Coast)</a>
          <a onclick="quickSearchCity('Kumasi')" style="cursor: pointer;">Kumasi (Garden City)</a>
          <a onclick="quickSearchCity('Takoradi')" style="cursor: pointer;">Takoradi (Western Region)</a>
          <a onclick="quickSearchCity('Aburi')" style="cursor: pointer;">Aburi Hills (Highlands)</a>
          <a onclick="quickSearchCity('Akosombo')" style="cursor: pointer;">Akosombo & Lake Volta</a>
        </div>`;

content = content.replace(footerDestOld, footerDestNew);

// 14. JavaScript DEFAULT_SEED_DATA & helper logic
// Replace DEFAULT_SEED_DATA with complete Ghana luxury dataset
const seedDataRegex = /const DEFAULT_SEED_DATA = \{[\s\S]*?\n    \};\n\n    \/\/ Load from localStorage/;

const newSeedDataCode = `const DEFAULT_SEED_DATA = {
      currentPage: 'home',
      activeSearchType: 'ALL',
      activeFilterType: 'ALL',
      selectedCurrency: 'GHS',
      currencyRates: { GHS: 1, USD: 0.065, EUR: 0.059, GBP: 0.051 },
      currencySymbols: { GHS: 'GH₵', USD: '$', EUR: '€', GBP: '£' },
      currentUser: null,
      selectedListingId: null,
      currentStripeBooking: null,

      users: [
        {
          id: 'usr-1',
          email: 'admin@booking.com.gh',
          password: 'adminpassword',
          firstName: 'Alex',
          lastName: 'Admin',
          role: 'ADMIN',
          status: 'APPROVED',
          avatar: 'AA',
          phoneNumber: '+233 24 000 0001'
        },
        {
          id: 'usr-2',
          email: 'kwame.asante@asantefleets.com.gh',
          password: 'partnerpassword',
          firstName: 'Kwame',
          lastName: 'Asante',
          role: 'PARTNER',
          status: 'APPROVED',
          avatar: 'KA',
          phoneNumber: '+233 24 456 7890',
          application: {
            companyName: 'Asante Executive Fleets & Suites Ghana Ltd.',
            registrationNumber: 'GH-CS-7849102',
            taxId: 'GH-TIN-P0084912',
            incorporationCountry: 'Ghana',
            city: 'Accra & Kumasi',
            address: 'Airport Residential Area, Accra',
            phone: '+233 24 456 7890',
            website: 'https://asante-fleets.com.gh',
            category: 'Executive Cars & 5-Star Suites',
            portfolioScale: '24 Executive Vehicles (BMW xDrive, GLE, Land Cruiser V8, Vitz/Yaris) & 10 Presidential Suites',
            assetValuation: 45000000,
            coverageZones: ['Accra', 'Kumasi', 'Takoradi', 'Aburi Hills'],
            proposalPitch: 'Providing diplomats, multinational corporate executives, and high-net-worth visitors with luxury BMW xDrive SUVs, Mercedes-Benz GLEs, and rugged Toyota Land Cruiser V8s across Ghana.',
            commercialLicense: {
              number: 'DVLA-GH-FLEET-9921',
              status: 'VERIFIED_ACTIVE',
              authority: 'Driver & Vehicle Licensing Authority (DVLA) Ghana',
              expiry: '2029-06-30'
            },
            insurance: {
              carrier: 'Enterprise Insurance Ghana Ltd.',
              policyNumber: 'EIG-FLEET-882194-GH',
              coverageAmount: 25000000,
              expiry: '2028-12-31',
              status: 'VALID_ACTIVE'
            },
            safetyAuditScore: 99,
            riskAssessment: 'LOW RISK (TIER-1 LUXURY ACCREDITED)',
            tierGranted: 'Tier-1 Certified Luxury Partner',
            adminNotes: 'Fully vetted executive fleet operator. DVLA roadworthiness and comprehensive passenger liability verified.',
            documents: [
              { id: 'doc-gh-reg', title: 'Ghana Registrar General Certificate of Incorporation', type: 'PDF', size: '2.1 MB', date: '2026-08-15', verified: true },
              { id: 'doc-gh-ins', title: 'Enterprise Insurance GH₵25M Comprehensive Fleet Binder', type: 'PDF', size: '3.4 MB', date: '2026-08-16', verified: true }
            ],
            appliedAt: '2026-08-14'
          }
        },
        {
          id: 'usr-3',
          email: 'akosua.mensah@goldcoastmotors.com.gh',
          password: 'partnerpassword',
          firstName: 'Akosua',
          lastName: 'Mensah',
          role: 'PARTNER',
          status: 'PENDING',
          avatar: 'AM',
          phoneNumber: '+233 20 890 1234',
          application: {
            companyName: 'Gold Coast Prestige Motors & Chauffeur Services',
            registrationNumber: 'GH-CS-892401',
            taxId: 'GH-TIN-P0029104',
            incorporationCountry: 'Ghana',
            city: 'Accra',
            address: 'Liberation Road, Airport City, Accra',
            phone: '+233 20 890 1234',
            website: 'https://goldcoast-motors.com.gh',
            category: 'Executive Car Rentals & Chauffeur Fleet',
            portfolioScale: '18 Luxury SUVs (BMW xDrive, Mercedes GLE, Toyota Land Cruiser V8) & 12 City Cruisers (Toyota Yaris & Vitz)',
            assetValuation: 32000000,
            coverageZones: ['Greater Accra', 'Ashanti Region', 'Western Region'],
            proposalPitch: 'We provide VIP executive transport and self-drive rentals with top-maintained BMW xDrive SUVs, Mercedes-Benz GLEs, and bulletproof Toyota Land Cruiser V8s for corporate and leisure clients across Ghana.',
            commercialLicense: {
              number: 'DVLA-GH-FLEET-8874',
              status: 'VERIFIED_ACTIVE',
              authority: 'Driver & Vehicle Licensing Authority (DVLA) Ghana',
              expiry: '2028-12-31'
            },
            insurance: {
              carrier: 'SIC Insurance Ghana PLC',
              policyNumber: 'SIC-GH-882194-AUTO',
              coverageAmount: 20000000,
              expiry: '2027-06-30',
              status: 'VALID_ACTIVE'
            },
            safetyAuditScore: 97,
            riskAssessment: 'LOW RISK (TIER-1 LUXURY ACCREDITED)',
            tierGranted: 'Tier-1 Certified Luxury Partner',
            adminNotes: 'Vetted with DVLA licensing registry. All vehicles 2023-2025 models with full maintenance records. Direct airport pickup permits active.',
            documents: [
              { id: 'doc-gh-corp', title: 'Ghana Corporate Registration & Tax Clearance', type: 'PDF', size: '2.4 MB', date: '2026-09-20', verified: true },
              { id: 'doc-gh-fleet-ins', title: 'SIC Insurance GH₵20M Fleet Liability Binder', type: 'PDF', size: '4.1 MB', date: '2026-09-21', verified: true },
              { id: 'doc-gh-id', title: 'Managing Director Passport & National ID KYC', type: 'DOC', size: '1.8 MB', date: '2026-09-20', verified: true }
            ],
            appliedAt: '2026-09-21'
          }
        },
        {
          id: 'usr-4',
          email: 'kofi.boateng@traveler.com.gh',
          password: 'customerpassword',
          firstName: 'Kofi',
          lastName: 'Boateng',
          role: 'CUSTOMER',
          status: 'APPROVED',
          avatar: 'KB',
          phoneNumber: '+233 55 123 4567'
        }
      ],

      destinations: [
        { name: 'Accra', country: 'Ghana', image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=800', badge: '5-Star Hotels & Executive Fleets', count: 6 },
        { name: 'Kumasi', country: 'Ghana', image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=800', badge: 'Garden City Royalty & Land Cruiser V8s', count: 4 },
        { name: 'Takoradi', country: 'Ghana', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800', badge: 'Western Coastline & Oil City Stays', count: 3 },
        { name: 'Aburi Hills', country: 'Ghana', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800', badge: 'Lush Mountain Resorts & Vistas', count: 3 },
        { name: 'Akosombo & Volta', country: 'Ghana', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800', badge: 'Riverfront Luxury & Lake Escapes', count: 2 },
        { name: 'Cape Coast', country: 'Ghana', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800', badge: 'Heritage Coastline & Palm Beaches', count: 2 }
      ],

      listings: [
        {
          id: 'lst-1',
          title: 'Kempinski Hotel Gold Coast City Accra',
          description: "Accra's crowning 5-star hotel in the downtown diplomatic enclave. Unparalleled luxury suites, 25-meter infinity pool, Resense Spa, and VIP executive lounge access.",
          serviceType: 'HOTEL',
          status: 'APPROVED',
          address: 'Gammal Abdul Nasser Ave, Ministries',
          city: 'Accra',
          country: 'Ghana',
          latitude: 5.5502,
          longitude: -0.1985,
          mapTop: 45,
          mapLeft: 42,
          coverImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800',
          images: [
            'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800',
            'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=800',
            'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=800'
          ],
          rating: 4.98,
          reviewCount: 42,
          ownerId: 'usr-2',
          hotelDetails: {
            roomType: 'Diplomatic Presidential Suite',
            amenities: ['Resort Infinity Pool', 'Resense Spa Access', '24/7 Butler Service', 'Airport Chauffeur Included', 'Executive Lounge Bar'],
            pricePerNight: 3500.0,
            capacity: 4,
            bedrooms: 2
          },
          reviews: [
            { reviewer: 'Dr. Kwame Osei', rating: 5, comment: 'Exceptional hospitality. The presidential suite at Kempinski with views over Accra is unmatched.' },
            { reviewer: 'Sarah Jenkins', rating: 5, comment: 'Impeccable service, delicious Ghanaian jollof and wonderful spa treatments.' }
          ]
        },
        {
          id: 'lst-2',
          title: 'BMW X5 xDrive40i (Executive Luxury SUV)',
          description: 'German engineering at its finest with intelligent xDrive all-wheel drive, panoramic sky lounge roof, and Harman Kardon sound. The preferred ride for executive business in Cantonments and Airport Residential.',
          serviceType: 'CAR_RENTAL',
          status: 'APPROVED',
          address: 'Airport Residential Area',
          city: 'Accra',
          country: 'Ghana',
          latitude: 5.6037,
          longitude: -0.1768,
          mapTop: 32,
          mapLeft: 55,
          coverImage: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=800',
          images: [
            'https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=800',
            'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=800'
          ],
          rating: 4.95,
          reviewCount: 38,
          ownerId: 'usr-2',
          carDetails: {
            carType: 'BMW X5 xDrive40i M-Sport',
            isRental: true,
            pricePerDay: 1850.0,
            capacity: 5,
            transmission: 'Steptronic 8-Speed xDrive',
            fuelType: 'TwinPower Turbo Petrol'
          },
          reviews: [
            { reviewer: 'Nana Yaw Ampofo', rating: 5, comment: 'Superb xDrive handling on Accra roads. Delivered with full tank and immaculately clean.' }
          ]
        },
        {
          id: 'lst-3',
          title: 'Mercedes-Benz GLE 450 AMG Line (4MATIC)',
          description: 'Commanding road presence with AMG body styling, 4MATIC all-wheel drive, airmatic suspension, and Burmester surround audio. Immaculate condition for high-profile arrivals across Accra and Kumasi.',
          serviceType: 'CAR_RENTAL',
          status: 'APPROVED',
          address: 'Airport City High Street',
          city: 'Accra',
          country: 'Ghana',
          latitude: 5.6022,
          longitude: -0.1714,
          mapTop: 48,
          mapLeft: 48,
          coverImage: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=800',
          images: [
            'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=800',
            'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?q=80&w=800'
          ],
          rating: 4.96,
          reviewCount: 32,
          ownerId: 'usr-2',
          carDetails: {
            carType: 'Mercedes-Benz GLE 450 4MATIC',
            isRental: true,
            pricePerDay: 2600.0,
            capacity: 5,
            transmission: '9G-TRONIC 4MATIC',
            fuelType: 'Mild Hybrid EQ Boost'
          },
          reviews: [
            { reviewer: 'Chief David Lawson', rating: 5, comment: 'The GLE is the benchmark for corporate dignity in Accra. Smooth ride and pristine interior.' }
          ]
        },
        {
          id: 'lst-4',
          title: 'Toyota Land Cruiser V8 (King of Ghana Roads)',
          description: "Ghana's undisputed heavyweight icon. Unmatched power, bulletproof 4x4 ruggedness, tinted privacy glass, and plush leather interior. Driven by security-vetted professional chauffeur for cross-country trips and convoys.",
          serviceType: 'PRIVATE_DRIVER',
          status: 'APPROVED',
          address: 'Harper Road, Nhyiaeso',
          city: 'Kumasi',
          country: 'Ghana',
          latitude: 6.6885,
          longitude: -1.6244,
          mapTop: 28,
          mapLeft: 35,
          coverImage: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=800',
          images: [
            'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=800',
            'https://images.unsplash.com/photo-1594976912810-8800cbe6085a?q=80&w=800'
          ],
          rating: 4.99,
          reviewCount: 56,
          ownerId: 'usr-2',
          carDetails: {
            carType: 'Toyota Land Cruiser V8 LC200',
            isRental: false,
            driverName: 'Kofi Mensah (VIP & Security Certified)',
            pricePerHour: 280.0,
            capacity: 6
          },
          reviews: [
            { reviewer: 'Ambassador Emmanuel Darko', rating: 5, comment: 'Kofi navigated the Accra-Kumasi corridor with supreme poise. The V8 road presence is unrivaled.' }
          ]
        },
        {
          id: 'lst-5',
          title: 'Toyota Vitz / Yaris (Urban City Executive)',
          description: "Ghana's favorite smart city cruiser. Ultra fuel-efficient, ice-cold air conditioning, pristine interior, and effortless handling. Perfect for agile commuting and meetings across Osu, East Legon, and Accra Central.",
          serviceType: 'CAR_RENTAL',
          status: 'APPROVED',
          address: 'Lagos Avenue, East Legon',
          city: 'Accra',
          country: 'Ghana',
          latitude: 5.6375,
          longitude: -0.1601,
          mapTop: 36,
          mapLeft: 62,
          coverImage: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?q=80&w=800',
          images: [
            'https://images.unsplash.com/photo-1609521263047-f8f205293f24?q=80&w=800',
            'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=800'
          ],
          rating: 4.88,
          reviewCount: 44,
          ownerId: 'usr-2',
          carDetails: {
            carType: 'Toyota Vitz / Yaris Hatchback',
            isRental: true,
            pricePerDay: 650.0,
            capacity: 5,
            transmission: 'Automatic CVT',
            fuelType: 'Petrol (Ultra Efficient)'
          },
          reviews: [
            { reviewer: 'Abena Frimpong', rating: 5, comment: 'Super convenient for meetings in East Legon and Osu. AC was freezing cold and petrol lasted all week!' }
          ]
        },
        {
          id: 'lst-6',
          title: 'The Buka Restaurant & Lounge',
          description: "Accra's premier upscale destination for authentic Ghanaian gastronomy and West African delicacies. Fresh charcoal-grilled tilapia, seasoned party jollof, spicy kelewele, and signature palm wine cocktails in an open-air terrace.",
          serviceType: 'RESTAURANT',
          status: 'APPROVED',
          address: '10th Street, Osu',
          city: 'Accra',
          country: 'Ghana',
          latitude: 5.5562,
          longitude: -0.1832,
          mapTop: 52,
          mapLeft: 46,
          coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800',
          images: [
            'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800',
            'https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=800'
          ],
          rating: 4.95,
          reviewCount: 68,
          ownerId: 'usr-2',
          diningDetails: {
            cuisineType: 'Authentic Ghanaian & West African Gastronomy',
            averageCost: 550.0,
            availableSlots: ['12:30 PM', '02:00 PM', '06:30 PM', '08:00 PM', '09:30 PM'],
            seatingCapacity: 60
          },
          reviews: [
            { reviewer: 'Ekow Mensah', rating: 5, comment: 'The grilled tilapia with banku and hot pepper sauce is pure gold. Outstanding atmosphere.' }
          ]
        },
        {
          id: 'lst-7',
          title: 'The Royal Senchi Resort & Hotel',
          description: "Ghana's premier luxury river resort along the historic Volta River in Akosombo. Traditional royal architecture, riverfront infinity pool, nature park excursions, and tranquil sunsets.",
          serviceType: 'HOTEL',
          status: 'APPROVED',
          address: 'Senchi Ferry Road',
          city: 'Akosombo',
          country: 'Ghana',
          latitude: 6.2235,
          longitude: 0.0894,
          mapTop: 22,
          mapLeft: 70,
          coverImage: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=800',
          images: ['https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=800'],
          rating: 4.97,
          reviewCount: 29,
          ownerId: 'usr-2',
          hotelDetails: {
            roomType: 'Volta River Presidential Villa',
            amenities: ['Riverfront Balcony', 'Infinity Pool', 'Boat Cruise Included', 'Spa & Wellness Sanctuary', 'Tennis Court'],
            pricePerNight: 2800.0,
            capacity: 4,
            bedrooms: 2
          },
          reviews: []
        },
        {
          id: 'lst-8',
          title: 'Skybar 25 Rooftop Lounge',
          description: "Perched atop the iconic Alto Tower at Villaggio Vista, Skybar 25 offers 360-degree panoramic views of Accra's glowing skyline with craft cocktails, gourmet tasting small plates, and international DJ sets.",
          serviceType: 'RESTAURANT',
          status: 'APPROVED',
          address: 'Villaggio Vista, Airport Residential',
          city: 'Accra',
          country: 'Ghana',
          latitude: 5.6081,
          longitude: -0.1788,
          mapTop: 42,
          mapLeft: 58,
          coverImage: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=800',
          images: ['https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=800'],
          rating: 4.92,
          reviewCount: 51,
          ownerId: 'usr-2',
          diningDetails: {
            cuisineType: 'Rooftop Pan-Asian & Contemporary Fusion',
            averageCost: 750.0,
            availableSlots: ['06:00 PM', '08:00 PM', '10:00 PM'],
            seatingCapacity: 45
          },
          reviews: []
        },
        {
          id: 'lst-9',
          title: 'Peduase Valley Resort (Aburi Hills)',
          description: 'Nestled in the lush, cool green ridges of Aburi overlooking Greater Accra. Elegant chalets, horse stables, heated pool, and pure mountain air just 30 minutes from the capital.',
          serviceType: 'HOTEL',
          status: 'APPROVED',
          address: 'Peduase Valley, Aburi Hills',
          city: 'Aburi',
          country: 'Ghana',
          latitude: 5.8485,
          longitude: -0.1764,
          mapTop: 18,
          mapLeft: 50,
          coverImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800',
          images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800'],
          rating: 4.94,
          reviewCount: 25,
          ownerId: 'usr-2',
          hotelDetails: {
            roomType: 'Mountain View Executive Chalet',
            amenities: ['Mountain View Balcony', 'Horse Riding', 'Heated Pool', 'Spa Treatments', 'High-Speed WiFi'],
            pricePerNight: 2200.0,
            capacity: 3,
            bedrooms: 1
          },
          reviews: []
        }
      ],

      bookings: [
        {
          id: 'bk-94812',
          customerId: 'usr-4',
          listingId: 'lst-1',
          listingTitle: 'Kempinski Hotel Gold Coast City Accra',
          listingImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800',
          serviceType: 'HOTEL',
          startDate: '2026-10-12',
          endDate: '2026-10-15',
          timeSlot: null,
          guestCount: 2,
          totalPrice: 10500.0,
          status: 'CONFIRMED',
          paymentStatus: 'PAID',
          vipPerks: ['VIP Airport Chauffeur (BMW xDrive)', 'Complimentary Resense Spa Treatment'],
          referenceCode: 'AETH-ACC-94812'
        },
        {
          id: 'bk-94813',
          customerId: 'usr-4',
          listingId: 'lst-4',
          listingTitle: 'Toyota Land Cruiser V8 (King of Ghana Roads)',
          listingImage: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=800',
          serviceType: 'PRIVATE_DRIVER',
          startDate: '2026-10-12',
          endDate: null,
          timeSlot: '09:00 AM',
          guestCount: 4,
          totalPrice: 1680.0,
          status: 'CONFIRMED',
          paymentStatus: 'PAID',
          vipPerks: ['VIP Police Escort Protocol Available', 'Bottled Mineral Refreshments'],
          referenceCode: 'AETH-KMS-94813'
        }
      ]
    };

    // Load from localStorage`;

content = content.replace(seedDataRegex, newSeedDataCode);

// 15. Update loadInitialState to use Ghana luxury key and wipe stale French cache
const loadInitialOld = `function loadInitialState() {
      const saved = localStorage.getItem('aether_booking_state_v3');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.users && parsed.users.some(u => u.application)) {
            return parsed;
          }
        } catch (e) {
          console.error('Failed to parse saved state, reverting to seed', e);
        }
      }
      const initial = JSON.parse(JSON.stringify(DEFAULT_SEED_DATA));
      localStorage.setItem('aether_booking_state_v3', JSON.stringify(initial));
      return initial;
    }

    function saveState() {
      localStorage.setItem('aether_booking_state_v3', JSON.stringify(state));
    }

    function resetDemoData() {
      if (confirm('Reset all demo listings, applications, and bookings to initial luxury seeds?')) {
        localStorage.removeItem('aether_booking_state_v3');
        state = JSON.parse(JSON.stringify(DEFAULT_SEED_DATA));
        saveState();
        showToast('Demo data successfully reset to initial pristine state.', 'info');
        initApp();
        if (state.currentUser && state.currentUser.role === 'ADMIN') {
          navigateTo('dashboard');
        }
      }
    }`;

const loadInitialNew = `function loadInitialState() {
      const storageKey = 'aether_ghana_luxury_v5';
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.listings && parsed.listings.some(l => l.country === 'Ghana')) {
            return parsed;
          }
        } catch (e) {
          console.error('Failed to parse saved state, reverting to Ghana seed', e);
        }
      }
      // Clear legacy non-Ghana state keys
      localStorage.removeItem('aether_booking_state_v3');
      localStorage.removeItem('aether_booking_state_v4');
      const initial = JSON.parse(JSON.stringify(DEFAULT_SEED_DATA));
      localStorage.setItem(storageKey, JSON.stringify(initial));
      return initial;
    }

    function saveState() {
      localStorage.setItem('aether_ghana_luxury_v5', JSON.stringify(state));
    }

    function resetDemoData() {
      if (confirm('Reset all demo listings, applications, and bookings to pristine Ghana luxury seeds?')) {
        localStorage.removeItem('aether_ghana_luxury_v5');
        state = JSON.parse(JSON.stringify(DEFAULT_SEED_DATA));
        saveState();
        showToast('Demo data successfully reset to Ghana luxury seed state.', 'info');
        initApp();
        if (state.currentUser && state.currentUser.role === 'ADMIN') {
          navigateTo('dashboard');
        }
      }
    }`;

content = content.replace(loadInitialOld, loadInitialNew);

// 16. Clean up JS functions that reference YACHT
content = content.replace("else if (state.activeFilterType === 'YACHT') activeId = 'nav-yachts';", "");
content = content.replace("if (serviceCategory === 'YACHT' && txt.includes('yacht')) b.className = 'btn btn-primary btn-sm btn-filter-pill';", "");
content = content.replace("if (item.serviceType === 'HOTEL' || item.serviceType === 'YACHT') return item.hotelDetails?.pricePerNight || 0;", "if (item.serviceType === 'HOTEL') return item.hotelDetails?.pricePerNight || 0;");
content = content.replace("if (item.serviceType === 'HOTEL' || item.serviceType === 'YACHT') {", "if (item.serviceType === 'HOTEL') {");
content = content.replace("if (listing.serviceType === 'HOTEL' || listing.serviceType === 'YACHT') {", "if (listing.serviceType === 'HOTEL') {");
content = content.replace("if (listing.serviceType === 'HOTEL' || listing.serviceType === 'YACHT' || listing.serviceType === 'CAR_RENTAL') {", "if (listing.serviceType === 'HOTEL' || listing.serviceType === 'CAR_RENTAL') {");
content = content.replace("if (listing.serviceType === 'HOTEL' || listing.serviceType === 'YACHT' || listing.serviceType === 'CAR_RENTAL') {", "if (listing.serviceType === 'HOTEL' || listing.serviceType === 'CAR_RENTAL') {");
content = content.replace("if (type === 'HOTEL' || type === 'YACHT') {", "if (type === 'HOTEL') {");
content = content.replace("return { class: 'badge badge-yacht', label: 'Superyacht / Jet', icon: 'anchor' };", "return { class: 'badge badge-car', label: 'Executive Fleet', icon: 'car' };");

// Update review modal default fields to Ghana
content = content.replace(
  "category: 'Supercars, Yachts & Private Drivers',",
  "category: 'Executive Car Rentals & Chauffeur Fleet',"
);
content = content.replace(
  "portfolioScale: '14 Supercars & 4 Yachts',",
  "portfolioScale: '18 Luxury SUVs (BMW xDrive, Mercedes GLE, Toyota Land Cruiser V8) & 12 City Cruisers (Toyota Yaris & Vitz)',"
);
content = content.replace(
  "proposalPitch: 'Providing ultra-high-net-worth VIP clients with bespoke yacht charters and chauffeured exotic supercars.',",
  "proposalPitch: 'Providing VIP executive transport and self-drive rentals with top-maintained BMW xDrive SUVs, Mercedes-Benz GLEs, and bulletproof Toyota Land Cruiser V8s for corporate and leisure clients across Ghana.',"
);

// Save updated index.html
fs.writeFileSync(indexPath, content, 'utf8');
console.log('Successfully updated index.html! New size:', content.length);

// Also copy index.html to demo.html so both files remain 100% in sync
const demoPath = path.join(__dirname, '..', 'demo.html');
fs.writeFileSync(demoPath, content, 'utf8');
console.log('Successfully synced demo.html with index.html!');
