const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'index.html');
let content = fs.readFileSync(indexPath, 'utf8');

// Normalize CRLF to LF for reliable string replacement
content = content.replace(/\r\n/g, '\n');

// 1. Badge CSS
content = content.replace(
  /\.badge-yacht\s*\{[^}]*\}/,
  ".badge-fleet { background: rgba(245, 158, 11, 0.15); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.35); }"
);

// 2. Tab search buttons
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

// 3. Listings filter pills
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

// 4. Concierge description & select options
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

// 5. Partner category options
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

// 6. Footer link
content = content.replace(
  /\s*<a onclick="quickFilterService\('YACHT'\)"[^>]*>Superyachts & Jets<\/a>/,
  ""
);

// 7. Add asset modal
content = content.replace(
  /\s*<option value="YACHT">Superyacht \/ Private Jet<\/option>/,
  ""
);

// Re-convert to CRLF for Windows consistency
content = content.replace(/\n/g, '\r\n');

fs.writeFileSync(indexPath, content, 'utf8');
console.log('Saved index.html cleanly.');

// Sync demo.html
const demoPath = path.join(__dirname, '..', 'demo.html');
fs.writeFileSync(demoPath, content, 'utf8');
console.log('Synced demo.html cleanly.');
