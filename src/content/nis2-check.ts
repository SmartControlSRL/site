import type { ActivityRule } from '../components/nis2/classify';
import type { Lang } from '../i18n/ui';

// Copy for the orientative NIS 2 self-check on the Networking & Cybersecurity
// page (RESOLUTIONS §36). Sector groups mirror annexes 1 and 2 of OUG 155/2024
// as amended by Legea 124/2025; every option maps to one classification rule.

export interface Nis2Option {
  rule: ActivityRule;
  label: string;
}

export interface Nis2Copy {
  eyebrow: string;
  heading: string;
  intro: string;
  activity: { label: string; placeholder: string; groups: Array<{ label: string; options: Nis2Option[] }>; error: string };
  size: { legend: string; help: string; employees: string; turnover: string; assets: string; error: string };
  designated: { label: string; help: string };
  submit: string;
  sizes: Record<'large' | 'medium' | 'small', string>;
  sizeLine: string;
  borderline: string;
  outcomes: Record<'essential' | 'important' | 'designated' | 'out', { tag: string; body: string }>;
  dora: string;
  basis: string;
  next: string;
  notice: string;
  disclaimer: string;
}

export const nis2Copy: Record<Lang, Nis2Copy> = {
  ro: {
    eyebrow: 'Verificare rapidă',
    heading: 'Intră firma ta sub NIS 2?',
    intro: 'Trei întrebări, un rezultat orientativ pe baza OUG 155/2024, în forma consolidată după Legea 124/2025.',
    activity: {
      label: 'Care este activitatea principală a firmei?',
      placeholder: 'Alege activitatea',
      error: 'Alege activitatea mai întâi.',
      groups: [
        {
          label: 'Anexa 1 — sectoare cu importanță critică ridicată',
          options: [
            { rule: 'annex1', label: 'Energie: electricitate, gaze, petrol, hidrogen, termoficare' },
            { rule: 'annex1', label: 'Transport: aerian, feroviar, naval, rutier' },
            { rule: 'dora', label: 'Sector bancar: instituții de credit' },
            { rule: 'dora', label: 'Infrastructuri ale pieței financiare' },
            { rule: 'annex1', label: 'Sănătate: servicii medicale, laboratoare, medicamente, distribuție și farmacii' },
            { rule: 'annex1', label: 'Apă potabilă sau ape uzate' },
            { rule: 'annex1', label: 'Infrastructură digitală: cloud, centre de date, CDN, IXP' },
            { rule: 'always-essential', label: 'Furnizor de servicii DNS sau registru de nume TLD' },
            { rule: 'always-essential', label: 'Prestator calificat de servicii de încredere' },
            { rule: 'trust', label: 'Prestator necalificat de servicii de încredere' },
            { rule: 'ecomm', label: 'Rețele sau servicii publice de comunicații electronice' },
            { rule: 'annex1', label: 'Servicii TIC gestionate (MSP), business-to-business' },
            { rule: 'mssp', label: 'Servicii de securitate gestionate (MSSP)' },
            { rule: 'public-admin', label: 'Administrație publică centrală' },
            { rule: 'annex1', label: 'Spațiu: infrastructură terestră pentru servicii spațiale' },
          ],
        },
        {
          label: 'Anexa 2 — alte sectoare critice',
          options: [
            { rule: 'annex2', label: 'Servicii poștale și de curierat' },
            { rule: 'annex2', label: 'Gestionarea deșeurilor, ca activitate principală' },
            { rule: 'annex2', label: 'Fabricarea și distribuția de substanțe chimice' },
            { rule: 'annex2', label: 'Alimente: producție industrială, procesare, distribuție en-gros' },
            { rule: 'annex2', label: 'Fabricare: dispozitive medicale, electronice, echipamente electrice, mașini, autovehicule' },
            { rule: 'annex2', label: 'Furnizori digitali: marketplace, motoare de căutare, rețele sociale' },
            { rule: 'annex2', label: 'Organizații de cercetare' },
          ],
        },
        { label: 'Altele', options: [{ rule: 'none', label: 'Altă activitate' }] },
      ],
    },
    size: {
      legend: 'Cât de mare este firma?',
      help: 'Datele din ultimul exercițiu financiar aprobat. Pentru grupuri, adunați întreprinderile partenere și legate (Legea 346/2004). Participația statului nu schimbă încadrarea.',
      employees: 'Număr mediu de salariați',
      turnover: 'Cifră de afaceri netă (mil. EUR)',
      assets: 'Active totale (mil. EUR)',
      error: 'Completează numărul de salariați.',
    },
    designated: {
      label: 'Am fost identificați de DNSC sau de autoritatea sectorială (art. 9) ori desemnați entitate critică',
      help: 'Bifați doar dacă ați primit o decizie în acest sens.',
    },
    submit: 'Vezi rezultatul',
    sizes: { large: 'întreprindere mare', medium: 'întreprindere mijlocie', small: 'întreprindere mică sau microîntreprindere' },
    sizeLine: 'Mărime estimată: {size}.',
    borderline: 'Încadrarea ca întreprindere mijlocie vine doar din cifra de afaceri și active, cu sub 50 de salariați. Merită confirmată cu un consultant.',
    outcomes: {
      essential: { tag: 'Entitate esențială', body: 'Activitatea și mărimea indică o entitate esențială: notificare către DNSC, măsuri de gestionare a riscurilor și raportarea incidentelor, cu cerințele cele mai stricte.' },
      important: { tag: 'Entitate importantă', body: 'Activitatea și mărimea indică o entitate importantă: notificare către DNSC, măsuri de gestionare a riscurilor și raportarea incidentelor.' },
      designated: { tag: 'Sub incidență prin decizie', body: 'Identificarea sau desemnarea vă aduce sub OUG 155/2024. Categoria, esențială sau importantă, rezultă din decizia autorității.' },
      out: { tag: 'Probabil în afara NIS 2', body: 'Pe baza răspunsurilor, firma nu pare să intre sub incidență. Pot exista totuși cerințe contractuale de la clienți care sunt entități esențiale sau importante.' },
    },
    dora: 'Pentru entitățile supuse DORA, din OUG 155/2024 se aplică doar art. 5–10 și art. 18; cerințele de securitate și raportare vin din DORA.',
    basis: 'Temei: {basis} din OUG 155/2024.',
    next: 'Notificarea se face prin Instrumentul NIS de pe dnsc.ro.',
    notice: 'Rezultatul este doar orientativ. Nu reprezintă o încadrare oficială și nu înlocuiește analiza juridică a situației firmei.',
    disclaimer: 'Calculul se face în browser. Răspunsurile nu sunt trimise și nu sunt salvate.',
  },
  en: {
    eyebrow: 'Quick check',
    heading: 'Is your company in scope of NIS 2?',
    intro: 'Three questions and an indicative result based on Emergency Ordinance 155/2024, as consolidated after Law 124/2025.',
    activity: {
      label: 'What is the company’s main activity?',
      placeholder: 'Choose an activity',
      error: 'Choose an activity first.',
      groups: [
        {
          label: 'Annex 1 — sectors of high criticality',
          options: [
            { rule: 'annex1', label: 'Energy: electricity, gas, oil, hydrogen, district heating' },
            { rule: 'annex1', label: 'Transport: air, rail, water, road' },
            { rule: 'dora', label: 'Banking: credit institutions' },
            { rule: 'dora', label: 'Financial market infrastructure' },
            { rule: 'annex1', label: 'Health: healthcare, laboratories, medicines, distribution and pharmacies' },
            { rule: 'annex1', label: 'Drinking water or waste water' },
            { rule: 'annex1', label: 'Digital infrastructure: cloud, data centres, CDN, IXP' },
            { rule: 'always-essential', label: 'DNS service provider or TLD name registry' },
            { rule: 'always-essential', label: 'Qualified trust service provider' },
            { rule: 'trust', label: 'Non-qualified trust service provider' },
            { rule: 'ecomm', label: 'Public electronic communications networks or services' },
            { rule: 'annex1', label: 'Managed ICT services (MSP), business-to-business' },
            { rule: 'mssp', label: 'Managed security services (MSSP)' },
            { rule: 'public-admin', label: 'Central public administration' },
            { rule: 'annex1', label: 'Space: ground-based infrastructure for space services' },
          ],
        },
        {
          label: 'Annex 2 — other critical sectors',
          options: [
            { rule: 'annex2', label: 'Postal and courier services' },
            { rule: 'annex2', label: 'Waste management, as the main activity' },
            { rule: 'annex2', label: 'Manufacture and distribution of chemicals' },
            { rule: 'annex2', label: 'Food: industrial production, processing, wholesale distribution' },
            { rule: 'annex2', label: 'Manufacturing: medical devices, electronics, electrical equipment, machinery, vehicles' },
            { rule: 'annex2', label: 'Digital providers: marketplaces, search engines, social networks' },
            { rule: 'annex2', label: 'Research organisations' },
          ],
        },
        { label: 'Other', options: [{ rule: 'none', label: 'Another activity' }] },
      ],
    },
    size: {
      legend: 'How large is the company?',
      help: 'Use figures from the last approved financial year. For groups, add up partner and linked enterprises (Law 346/2004). State ownership does not change the classification.',
      employees: 'Average number of employees',
      turnover: 'Net turnover (EUR million)',
      assets: 'Total assets (EUR million)',
      error: 'Enter the number of employees.',
    },
    designated: {
      label: 'We have been identified by DNSC or the sector authority (art. 9) or designated a critical entity',
      help: 'Tick this only if you have received a decision to that effect.',
    },
    submit: 'See the result',
    sizes: { large: 'large enterprise', medium: 'medium-sized enterprise', small: 'small or micro enterprise' },
    sizeLine: 'Estimated size: {size}.',
    borderline: 'The medium-sized classification rests on turnover and assets alone, with fewer than 50 employees. Confirm it with an adviser.',
    outcomes: {
      essential: { tag: 'Essential entity', body: 'The activity and size point to an essential entity: notification to DNSC, risk-management measures and incident reporting, under the strictest requirements.' },
      important: { tag: 'Important entity', body: 'The activity and size point to an important entity: notification to DNSC, risk-management measures and incident reporting.' },
      designated: { tag: 'In scope by decision', body: 'The identification or designation brings you within Emergency Ordinance 155/2024. The authority’s decision sets whether you are essential or important.' },
      out: { tag: 'Probably out of scope', body: 'Based on your answers, the company does not appear to be in scope. Customers that are essential or important entities may still pass requirements on to you by contract.' },
    },
    dora: 'For entities subject to DORA, only arts. 5–10 and 18 of Emergency Ordinance 155/2024 apply; security and reporting requirements come from DORA.',
    basis: 'Legal basis: {basis} of Emergency Ordinance 155/2024.',
    next: 'Notification is made through the NIS Instrument on dnsc.ro.',
    notice: 'This result is indicative only. It is not an official classification and does not replace a legal review of your company’s situation.',
    disclaimer: 'Calculated in your browser. Your answers are not sent or stored.',
  },
};
