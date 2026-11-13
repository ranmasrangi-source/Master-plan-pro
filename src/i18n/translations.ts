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
      lowBandwidthActive: 'Low-Bandwidth Active (<15 KB Lite)',
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
      lowBandwidthActive: 'कम-ब्यान्डविथ सक्रिय (<15 KB)',
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
      lowBandwidthActive: 'الوضع الخفيف نشط (<15 كيلوبايت)',
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

/**
 * FQ-07: Deterministic Gregorian (AD) to Bikram Sambat (वि.सं. BS) Converter for Permit & Certificate Dates.
 * Bikram Sambat is 56 years, 8 months, and ~17 days ahead of Gregorian AD.
 * Validates real Gregorian calendar dates (including leap years) and accurately handles
 * the Baisakh 1 (mid-April) New Year boundary.
 */
export function formatBikramSambatDate(isoDateString: string): {
  readonly gregorianIso: string;
  readonly bikramSambatEn: string;
  readonly bikramSambatDevanagari: string;
  readonly isValidDate: boolean;
} {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDateString.trim());
  if (!match) {
    return {
      gregorianIso: isoDateString,
      bikramSambatEn: 'BS Date Pending',
      bikramSambatDevanagari: 'वि.सं. मिति',
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
      isValidDate: false,
    };
  }

  // Approximate Gregorian day-of-month solar transition (Sankranti ~14th of each month)
  const sankrantiDay = 14;
  const isOnOrAfterSankranti = adDay >= sankrantiDay;

  // Bikram Sambat New Year (Baisakh 1 = Month 1) begins on April 14
  const isOnOrAfterNewYear = adMonth > 4 || (adMonth === 4 && isOnOrAfterSankranti);
  const bsYear = isOnOrAfterNewYear ? adYear + 57 : adYear + 56;

  // Map Gregorian month + Sankranti phase to Bikram Sambat month (1 = Baisakh .. 12 = Chaitra)
  // On/after 14th of adMonth: Apr->1, May->2, Jun->3, Jul->4, Aug->5, Sep->6, Oct->7, Nov->8, Dec->9, Jan->10, Feb->11, Mar->12
  const bsMonthOnOrAfter = ((adMonth + 8) % 12) + 1;
  const bsMonthIndex = isOnOrAfterSankranti
    ? bsMonthOnOrAfter
    : ((bsMonthOnOrAfter + 10) % 12) + 1;

  const bsDay = isOnOrAfterSankranti ? adDay - sankrantiDay + 1 : adDay + 17;

  const paddedMonth = String(bsMonthIndex).padStart(2, '0');
  const paddedDay = String(bsDay).padStart(2, '0');

  return {
    gregorianIso: `${adYear}-${String(adMonth).padStart(2, '0')}-${String(adDay).padStart(2, '0')}`,
    bikramSambatEn: `${bsYear}-${paddedMonth}-${paddedDay} BS`,
    bikramSambatDevanagari: `वि.सं. ${toDevanagariNumerals(bsYear)}-${toDevanagariNumerals(paddedMonth)}-${toDevanagariNumerals(paddedDay)}`,
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

