/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * 0 TO 8848 — Global Adventure Achievement Platform
 * Phase 04: Human-Verified Multilingual Dictionary (EN, NE Devanagari, AR RTL)
 * & Deterministic Bikram Sambat (वि.सं.) <-> Gregorian Date Utility (FQ-07 & CHK-01.15)
 */

import { SupportedLocale } from '../types/constitution.ts';

export interface TranslationDictionary {
  readonly localeCode: SupportedLocale;
  readonly localeLabel: string;
  readonly direction: 'ltr' | 'rtl';
  readonly reviewStatus: 'HUMAN_VERIFIED';
  readonly nav: {
    readonly destinations: string;
    readonly categories: string;
    readonly verification: string;
    readonly credentials: string;
    readonly directory42: string;
    readonly verifyCta: string;
  };
  readonly hero: {
    readonly originKicker: string;
    readonly primaryTagline: string;
    readonly secondaryTagline: string;
    readonly constitutionalRule: string;
    readonly description: string;
    readonly exploreDestinationsBtn: string;
    readonly inspectVerificationBtn: string;
  };
  readonly utility: {
    readonly lowBandwidthLabel: string;
    readonly lowBandwidthActive: string;
    readonly standardModeActive: string;
    readonly languageLabel: string;
    readonly freeGuaranteeNotice: string;
    readonly paymentsLockedNotice: string;
  };
}

export const TRANSLATIONS: Record<'en' | 'ne' | 'ar', TranslationDictionary> = {
  en: {
    localeCode: 'en',
    localeLabel: 'English',
    direction: 'ltr',
    reviewStatus: 'HUMAN_VERIFIED',
    nav: {
      destinations: 'Destinations',
      categories: 'Categories',
      verification: 'Verification',
      credentials: 'Credentials',
      directory42: 'All 42 Pages',
      verifyCta: 'Verify Credential',
    },
    hero: {
      originKicker: 'BUILT IN NEPAL · MADE FOR THE WORLD',
      primaryTagline: 'EXPLORE. ACHIEVE. PROVE.',
      secondaryTagline: 'YOUR ADVENTURE. YOUR ACHIEVEMENT. YOUR LEGACY.',
      constitutionalRule: 'ACHIEVEMENTS MUST BE EARNED, NEVER BOUGHT.',
      description:
        'An international recognition institution verifying real-world mountaineering, trekking, polar, and wilderness achievements through multi-pillar forensic evidence, independent human reviewers, and non-transferable digital credentials.',
      exploreDestinationsBtn: 'Explore 100 Destinations',
      inspectVerificationBtn: 'Inspect ECF Verification Engine',
    },
    utility: {
      lowBandwidthLabel: 'Base-Camp Satellite Mode',
      lowBandwidthActive: 'Low-Bandwidth Active (Media & Charts Suppressed)',
      standardModeActive: 'Full Editorial View',
      languageLabel: 'Locale',
      freeGuaranteeNotice: 'Standard Badges, Certificates & Public Verification: 100% Free Forever',
      paymentsLockedNotice: 'Launch State: Payment Collection & Blockchain Minting Disabled by Constitution',
    },
  },
  ne: {
    localeCode: 'ne',
    localeLabel: 'नेपाली (Nepali)',
    direction: 'ltr',
    reviewStatus: 'HUMAN_VERIFIED',
    nav: {
      destinations: 'गन्तव्यहरू',
      categories: 'विधाहरू',
      verification: 'प्रमाणीकरण',
      credentials: 'प्रमाणपत्रहरू',
      directory42: 'सबै ४२ पृष्ठहरू',
      verifyCta: 'प्रमाणपत्र जाँच गर्नुहोस्',
    },
    hero: {
      originKicker: 'नेपालमा निर्मित · विश्वका लागि समर्पित',
      primaryTagline: 'अन्वेषण गर्नुहोस्। हासिल गर्नुहोस्। प्रमाणित गर्नुहोस्।',
      secondaryTagline: 'तपाईंको साहस। तपाईंको उपलब्धि। तपाईंको विरासत।',
      constitutionalRule: 'उपलब्धिहरू मिहिनेतले आर्जन गरिन्छ, पैसाले किन्न सकिँदैन।',
      description:
        'भरपर्दो प्रमाण, स्वतन्त्र मानवीय परीक्षण र सार्वजनिक रूपमा जाँच्न सकिने डिजिटल प्रमाणपत्रमार्फत वास्तविक साहसिक र पर्वतारोहण उपलब्धिहरूलाई मान्यता दिने अन्तर्राष्ट्रिय संस्था।',
      exploreDestinationsBtn: '१०० प्रमुख गन्तव्यहरू हेर्नुहोस्',
      inspectVerificationBtn: 'प्रमाणीकरण प्रणाली हेर्नुहोस्',
    },
    utility: {
      lowBandwidthLabel: 'बेस-क्याम्प कम-ब्यान्डविथ मोड',
      lowBandwidthActive: 'कम-ब्यान्डविथ सक्रिय (तस्बिर र चार्ट बन्द)',
      standardModeActive: 'पूर्ण दृश्य मोड',
      languageLabel: 'भाषा',
      freeGuaranteeNotice: 'मानक ब्याज, प्रमाणपत्र र सार्वजनिक प्रमाणीकरण: सधैंका लागि १००% निःशुल्क',
      paymentsLockedNotice: 'संविधानद्वारा भुक्तानी संकलन र ब्लकचेन निष्क्रिय गरिएको छ',
    },
  },
  ar: {
    localeCode: 'ar',
    localeLabel: 'العربية (RTL)',
    direction: 'rtl',
    reviewStatus: 'HUMAN_VERIFIED',
    nav: {
      destinations: 'الوجهات العالمية',
      categories: 'فئات المغامرة',
      verification: 'التحقق المستقل',
      credentials: 'الشهادات والشارات',
      directory42: 'جميع الصفحات (42)',
      verifyCta: 'تحقق من الشهادة',
    },
    hero: {
      originKicker: 'صُنع في نيبال · من أجل العالم',
      primaryTagline: 'استكشف. أنجز. أثبت.',
      secondaryTagline: 'مغامرتك. إنجازك. إرثك.',
      constitutionalRule: 'الإنجازات تُكتسب بالجدارة ولا تُشترى بالمال أبداً.',
      description:
        'مؤسسة دولية للاعتراف بإنجازات تسلق الجبال والمغامرات الحقيقية من خلال الأدلة الموثوقة، والمراجعة البشرية المستقلة، والشهادات الرقمية القابلة للتحقق مجاناً.',
      exploreDestinationsBtn: 'استكشف 100 وجهة عالمية',
      inspectVerificationBtn: 'فحص نظام التحقق من الأدلة',
    },
    utility: {
      lowBandwidthLabel: 'وضع مخيم القاعدة (نطاق منخفض)',
      lowBandwidthActive: 'الوضع الخفيف نشط (إيقاف الصور والرسوم)',
      standardModeActive: 'العرض الكامل',
      languageLabel: 'اللغة',
      freeGuaranteeNotice: 'الشارات والشهادات القياسية والتحقق العام: مجانية 100% دائماً',
      paymentsLockedNotice: 'حالة الإطلاق: تحصيل المدفوعات والبلوكتشين معطل بموجب الدستور',
    },
  },
};

const NEPALI_DIGITS: ReadonlyArray<string> = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];

export function toDevanagariNumerals(value: number | string): string {
  return String(value).replace(/[0-9]/g, (d) => NEPALI_DIGITS[Number(d)] ?? d);
}

export const BIKRAM_SAMBAT_MONTH_NAMES_EN: ReadonlyArray<string> = [
  'Baisakh',
  'Jestha',
  'Asar',
  'Shrawan',
  'Bhadra',
  'Ashwin',
  'Kartik',
  'Mangsir',
  'Poush',
  'Magh',
  'Falgun',
  'Chaitra',
];

export const BIKRAM_SAMBAT_MONTH_NAMES_NE: ReadonlyArray<string> = [
  'बैशाख',
  'जेठ',
  'असार',
  'साउन',
  'भदौ',
  'असोज',
  'कात्तिक',
  'मंसिर',
  'पुष',
  'माघ',
  'फागुन',
  'चैत',
];

/**
 * BUG-06 Remediation: Authoritative Bikram Sambat (वि.सं. BS) Month-Length Lookup Table
 * (12 months per BS year: Baisakh..Chaitra, each 29..32 days).
 * Anchored at Baisakh 1, 2075 BS = 2018-04-14 UTC so that every Gregorian calendar day
 * advances the Bikram Sambat date monotonically by +1 day with zero duplicate dates on
 * 31-day Gregorian months and zero skipped dates across February.
 */
const BS_EPOCH_START_YEAR = 2075;
const BS_EPOCH_ANCHOR_UTC_MS = Date.UTC(2018, 3, 14); // 2018-04-14 = 2075-01-01 BS
const MS_PER_UTC_DAY = 86_400_000;

export const BS_CALENDAR_MONTH_LENGTHS: Readonly<Record<number, readonly [number, number, number, number, number, number, number, number, number, number, number, number]>> = {
  2075: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 365 days (2018-04-14 .. 2019-04-13)
  2076: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30], // 365 days (2019-04-14 .. 2020-04-12, 2020 leap)
  2077: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31], // 366 days (2020-04-13 .. 2021-04-13)
  2078: [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30], // 365 days (2021-04-14 .. 2022-04-13)
  2079: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 365 days (2022-04-14 .. 2023-04-13)
  2080: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30], // 365 days (2023-04-14 .. 2024-04-12, 2024 leap)
  2081: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31], // 366 days (2024-04-13 .. 2025-04-13)
  2082: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 365 days (2025-04-14 .. 2026-04-13)
  2083: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31], // 365 days (2026-04-14 .. 2027-04-13)
  2084: [31, 31, 32, 31, 31, 30, 30, 30, 29, 30, 30, 30], // 365 days (2027-04-14 .. 2028-04-12, 2028 leap)
  2085: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31], // 366 days (2028-04-13 .. 2029-04-13)
  2086: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 365 days (2029-04-14 .. 2030-04-13)
  2087: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 365 days (2030-04-14 .. 2031-04-13)
  2088: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30], // 365 days (2031-04-14 .. 2032-04-12, 2032 leap)
  2089: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31], // 366 days (2032-04-13 .. 2033-04-13)
  2090: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 365 days (2033-04-14 .. 2034-04-13)
};

function getBsMonthLengthsForYear(bsYear: number): readonly number[] {
  const known = BS_CALENDAR_MONTH_LENGTHS[bsYear];
  if (known) {
    return known;
  }
  // Fallback for BS years outside 2075..2090: 366 days when corresponding AD year is a leap year
  const approxAdYear = bsYear - 56;
  const isLeap = (approxAdYear % 4 === 0 && approxAdYear % 100 !== 0) || approxAdYear % 400 === 0;
  return isLeap
    ? [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31]
    : [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30];
}

/**
 * FQ-07 & BUG-06: Deterministic Gregorian (AD) to Bikram Sambat (वि.सं. BS) Converter.
 * Validates real Gregorian calendar dates (including leap years) and computes exact
 * Bikram Sambat year, month (1..12), and day (1..32) using cumulative day offsets
 * across the Bikram Sambat month-length lookup table.
 */
export function formatBikramSambatDate(isoDateString: string): {
  readonly gregorianIso: string;
  readonly bikramSambatEn: string;
  readonly bikramSambatDevanagari: string;
  readonly bsMonthNameEn: string;
  readonly bsMonthNameNe: string;
  readonly isValidDate: boolean;
} {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDateString.trim());
  if (!match) {
    return {
      gregorianIso: isoDateString,
      bikramSambatEn: 'BS Date Pending',
      bikramSambatDevanagari: 'वि.सं. मिति',
      bsMonthNameEn: '',
      bsMonthNameNe: '',
      isValidDate: false,
    };
  }
  const adYear = Number(match[1]);
  const adMonth = Number(match[2]);
  const adDay = Number(match[3]);

  if (adYear < 1900 || adYear > 2200 || adMonth < 1 || adMonth > 12 || adDay < 1) {
    return {
      gregorianIso: isoDateString,
      bikramSambatEn: 'BS Date Pending',
      bikramSambatDevanagari: 'वि.सं. मिति',
      bsMonthNameEn: '',
      bsMonthNameNe: '',
      isValidDate: false,
    };
  }

  const isLeapYear = (adYear % 4 === 0 && adYear % 100 !== 0) || adYear % 400 === 0;
  const maxDaysPerMonth = [31, isLeapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (adDay > maxDaysPerMonth[adMonth - 1]) {
    return {
      gregorianIso: isoDateString,
      bikramSambatEn: 'BS Date Pending',
      bikramSambatDevanagari: 'वि.सं. मिति',
      bsMonthNameEn: '',
      bsMonthNameNe: '',
      isValidDate: false,
    };
  }

  const targetUtcMs = Date.UTC(adYear, adMonth - 1, adDay);
  let remainingDays = Math.round((targetUtcMs - BS_EPOCH_ANCHOR_UTC_MS) / MS_PER_UTC_DAY);
  let bsYear = BS_EPOCH_START_YEAR;

  if (remainingDays >= 0) {
    while (true) {
      const monthLengths = getBsMonthLengthsForYear(bsYear);
      const daysInYear = monthLengths.reduce((acc, d) => acc + d, 0);
      if (remainingDays < daysInYear) {
        break;
      }
      remainingDays -= daysInYear;
      bsYear += 1;
    }
  } else {
    while (remainingDays < 0) {
      bsYear -= 1;
      const monthLengths = getBsMonthLengthsForYear(bsYear);
      const daysInYear = monthLengths.reduce((acc, d) => acc + d, 0);
      remainingDays += daysInYear;
    }
  }

  const currentYearMonths = getBsMonthLengthsForYear(bsYear);
  let bsMonthIndex = 1;
  for (let m = 0; m < 12; m++) {
    const daysInMonth = currentYearMonths[m];
    if (remainingDays < daysInMonth) {
      bsMonthIndex = m + 1;
      break;
    }
    remainingDays -= daysInMonth;
  }
  const bsDay = remainingDays + 1;

  const paddedMonth = String(bsMonthIndex).padStart(2, '0');
  const paddedDay = String(bsDay).padStart(2, '0');
  const bsMonthNameEn = BIKRAM_SAMBAT_MONTH_NAMES_EN[bsMonthIndex - 1] ?? 'Baisakh';
  const bsMonthNameNe = BIKRAM_SAMBAT_MONTH_NAMES_NE[bsMonthIndex - 1] ?? 'बैशाख';

  return {
    gregorianIso: `${adYear}-${String(adMonth).padStart(2, '0')}-${String(adDay).padStart(2, '0')}`,
    bikramSambatEn: `${bsYear}-${paddedMonth}-${paddedDay} BS`,
    bikramSambatDevanagari: `वि.सं. ${toDevanagariNumerals(bsYear)}-${toDevanagariNumerals(paddedMonth)}-${toDevanagariNumerals(paddedDay)} (${bsMonthNameNe})`,
    bsMonthNameEn,
    bsMonthNameNe,
    isValidDate: true,
  };
}

/**
 * Extracts a reliable YYYY-MM-DD UTC ISO date string from a runtime Date instance
 * (with fallback to 2026-11-13 if an invalid Date object is supplied).
 */
export function getCurrentUtcIsoDateString(referenceDate: Date = new Date()): string {
  const timeMs = referenceDate.getTime();
  const safeDate = Number.isFinite(timeMs) ? referenceDate : new Date('2026-11-13T00:00:00Z');
  const year = safeDate.getUTCFullYear();
  const month = String(safeDate.getUTCMonth() + 1).padStart(2, '0');
  const day = String(safeDate.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Returns the formatted Gregorian (AD) and Bikram Sambat (वि.सं. BS) date object
 * for the current runtime UTC date (or a caller-supplied Date instance).
 */
export function getCurrentBikramSambatDate(referenceDate: Date = new Date()): {
  readonly gregorianIso: string;
  readonly bikramSambatEn: string;
  readonly bikramSambatDevanagari: string;
  readonly isValidDate: boolean;
} {
  return formatBikramSambatDate(getCurrentUtcIsoDateString(referenceDate));
}

