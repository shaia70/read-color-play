
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageDirectionWrapper from "@/components/layout/LanguageDirectionWrapper";

const PrivacyPolicy = () => {
  const { t, language } = useLanguage();
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Header />
      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <LanguageDirectionWrapper>
            <div className="bg-white shadow-md rounded-lg p-6 md:p-8">
              <h1 className="text-2xl font-bold mb-3">{t('privacy.title')}</h1>
              <p className="mb-4">{t('privacy.lastUpdated')}</p>
              <p className="mb-4">{t('privacy.intro1')}</p>
              <p className="mb-6">{t('privacy.intro2')}</p>
              
              <h2 className="text-xl font-bold mt-6 mb-3">{t('privacy.interpretationTitle')}</h2>
              <h3 className="text-lg font-bold mt-4 mb-2">{t('privacy.interpretationSubtitle')}</h3>
              <p className="mb-4">{t('privacy.interpretationText')}</p>
              <h3 className="text-lg font-bold mt-4 mb-2">{t('privacy.definitionsTitle')}</h3>
              <p className="mb-3">{t('privacy.definitionsText')}</p>
              <ul className="list-disc ml-6 my-3">
                <li className="mb-2">
                  <p><strong>{t('privacy.account')}</strong> {t('privacy.accountText')}</p>
                </li>
                <li className="mb-2">
                  <p><strong>{t('privacy.affiliate')}</strong> {t('privacy.affiliateText')}</p>
                </li>
                <li className="mb-2">
                  <p><strong>{t('privacy.application')}</strong> {t('privacy.applicationText')}</p>
                </li>
                <li className="mb-2">
                  <p><strong>{t('privacy.company')}</strong> {t('privacy.companyText')}</p>
                </li>
                <li className="mb-2">
                  <p><strong>{t('privacy.cookies')}</strong> {t('privacy.cookiesText')}</p>
                </li>
                <li className="mb-2">
                  <p><strong>{t('privacy.country')}</strong> {t('privacy.countryText')}</p>
                </li>
                <li className="mb-2">
                  <p><strong>{t('privacy.device')}</strong> {t('privacy.deviceText')}</p>
                </li>
                <li className="mb-2">
                  <p><strong>{t('privacy.personalData')}</strong> {t('privacy.personalDataText')}</p>
                </li>
                <li className="mb-2">
                  <p><strong>{t('privacy.service')}</strong> {t('privacy.serviceText')}</p>
                </li>
                <li className="mb-2">
                  <p><strong>{t('privacy.serviceProvider')}</strong> {t('privacy.serviceProviderText')}</p>
                </li>
                <li className="mb-2">
                  <p><strong>{t('privacy.usageData')}</strong> {t('privacy.usageDataText')}</p>
                </li>
                <li className="mb-2">
                  <p><strong>{t('privacy.website')}</strong> {t('privacy.websiteText')} <a href="https://www.shelley.co.il" rel="external nofollow noopener" target="_blank" className="text-blue-600 hover:underline">https://www.shelley.co.il</a></p>
                </li>
                <li className="mb-2">
                  <p><strong>{t('privacy.you')}</strong> {t('privacy.youText')}</p>
                </li>
              </ul>
              
              <h2 className="text-xl font-bold mt-6 mb-3">{t('privacy.collectingDataTitle')}</h2>
              <h3 className="text-lg font-bold mt-4 mb-2">{t('privacy.typesDataTitle')}</h3>
              <h4 className="text-base font-bold mt-3 mb-2">{t('privacy.personalDataTitle')}</h4>
              <p className="mb-3">{t('privacy.personalDataDescription')}</p>
              <ul className="list-disc ml-6 my-3">
                <li className="mb-2">
                  <p>{t('privacy.email')}</p>
                </li>
                <li className="mb-2">
                  <p>{t('privacy.name')}</p>
                </li>
                <li className="mb-2">
                  <p>{t('privacy.usageDataTitle')}</p>
                </li>
              </ul>
              <h4 className="text-base font-bold mt-3 mb-2">{t('privacy.usageDataTitle')}</h4>
              <p className="mb-3">{t('privacy.usageDataDescription1')}</p>
              <p className="mb-3">{t('privacy.usageDataDescription2')}</p>
              <p className="mb-3">{t('privacy.usageDataDescription3')}</p>
              <p className="mb-3">{t('privacy.usageDataDescription4')}</p>
              
              <h4 className="text-base font-bold mt-3 mb-2">{t('privacy.infoCollectedTitle')}</h4>
              <p className="mb-3">{t('privacy.infoCollectedDescription')}</p>
              <ul className="list-disc ml-6 my-3">
                <li className="mb-2">{t('privacy.infoCollectedItem')}</li>
              </ul>
              <p className="mb-3">{t('privacy.infoCollectedUsage')}</p>
              <p className="mb-3">{t('privacy.infoCollectedAccess')}</p>
              
              <h4 className="text-base font-bold mt-3 mb-2">{t('privacy.trackingTitle')}</h4>
              <p className="mb-3">{t('privacy.trackingDescription')}</p>
              <ul className="list-disc ml-6 my-3">
                <li className="mb-2"><strong>{t('privacy.cookiesItem')}</strong> {t('privacy.cookiesItemDescription')}</li>
                <li className="mb-2"><strong>{t('privacy.webBeaconsItem')}</strong> {t('privacy.webBeaconsItemDescription')}</li>
              </ul>
              <p className="mb-3">{t('privacy.cookiesTypes')} {t('privacy.cookiesLearnMore')} <a href="https://www.termsfeed.com/blog/cookies/#What_Are_Cookies" target="_blank" className="text-blue-600 hover:underline">TermsFeed website</a></p>
              
              <p className="mb-3">{t('privacy.cookiesUsage')}</p>
              <ul className="list-disc ml-6 my-3">
                <li className="mb-3">
                  <p><strong>{t('privacy.essentialCookies')}</strong></p>
                  <p>{t('privacy.essentialCookiesType')}</p>
                  <p>{t('privacy.essentialCookiesAdmin')}</p>
                  <p>{t('privacy.essentialCookiesPurpose')}</p>
                </li>
                <li className="mb-3">
                  <p><strong>{t('privacy.acceptanceCookies')}</strong></p>
                  <p>{t('privacy.acceptanceCookiesType')}</p>
                  <p>{t('privacy.acceptanceCookiesAdmin')}</p>
                  <p>{t('privacy.acceptanceCookiesPurpose')}</p>
                </li>
                <li className="mb-3">
                  <p><strong>{t('privacy.functionalityCookies')}</strong></p>
                  <p>{t('privacy.functionalityCookiesType')}</p>
                  <p>{t('privacy.functionalityCookiesAdmin')}</p>
                  <p>{t('privacy.functionalityCookiesPurpose')}</p>
                </li>
              </ul>
              <p className="mb-4">{t('privacy.cookiesMoreInfo')}</p>
              
              <h3 className="text-lg font-bold mt-4 mb-2">{t('privacy.usePersonalDataTitle')}</h3>
              <p className="mb-3">{t('privacy.usePersonalDataDescription')}</p>
              <ul className="list-disc ml-6 my-3">
                <li className="mb-2">
                  <p><strong>{t('privacy.provideService')}</strong>, {t('privacy.provideServiceDescription')}</p>
                </li>
                <li className="mb-2">
                  <p><strong>{t('privacy.manageAccount')}</strong> {t('privacy.manageAccountDescription')}</p>
                </li>
                <li className="mb-2">
                  <p><strong>{t('privacy.contractPerformance')}</strong> {t('privacy.contractPerformanceDescription')}</p>
                </li>
                <li className="mb-2">
                  <p><strong>{t('privacy.contactYou')}</strong> {t('privacy.contactYouDescription')}</p>
                </li>
                <li className="mb-2">
                  <p><strong>{t('privacy.provideOffers')}</strong> {t('privacy.provideOffersDescription')}</p>
                </li>
                <li className="mb-2">
                  <p><strong>{t('privacy.manageRequests')}</strong> {t('privacy.manageRequestsDescription')}</p>
                </li>
                <li className="mb-2">
                  <p><strong>{t('privacy.businessTransfers')}</strong> {t('privacy.businessTransfersDescription')}</p>
                </li>
                <li className="mb-2">
                  <p><strong>{t('privacy.otherPurposes')}</strong> {t('privacy.otherPurposesDescription')}</p>
                </li>
              </ul>
              
              <p className="mb-3">{t('privacy.sharePersonalInfo')}</p>
              <ul className="list-disc ml-6 my-3">
                <li className="mb-2"><strong>{t('privacy.withServiceProviders')}</strong> {t('privacy.withServiceProvidersDescription')}</li>
                <li className="mb-2"><strong>{t('privacy.forBusinessTransfers')}</strong> {t('privacy.forBusinessTransfersDescription')}</li>
                <li className="mb-2"><strong>{t('privacy.withAffiliates')}</strong> {t('privacy.withAffiliatesDescription')}</li>
                <li className="mb-2"><strong>{t('privacy.withBusinessPartners')}</strong> {t('privacy.withBusinessPartnersDescription')}</li>
                <li className="mb-2"><strong>{t('privacy.withOtherUsers')}</strong> {t('privacy.withOtherUsersDescription')}</li>
                <li className="mb-2"><strong>{t('privacy.withConsent')}</strong> {t('privacy.withConsentDescription')}</li>
              </ul>
              
              <h3 className="text-lg font-bold mt-4 mb-2">{t('privacy.retentionTitle')}</h3>
              <p className="mb-3">{t('privacy.retentionDescription1')}</p>
              <p className="mb-3">{t('privacy.retentionDescription2')}</p>
              
              <h3 className="text-lg font-bold mt-4 mb-2">{t('privacy.transferTitle')}</h3>
              <p className="mb-3">{t('privacy.transferDescription1')}</p>
              <p className="mb-3">{t('privacy.transferDescription2')}</p>
              <p className="mb-3">{t('privacy.transferDescription3')}</p>
              
              <h3 className="text-lg font-bold mt-4 mb-2">{t('privacy.deleteTitle')}</h3>
              <p className="mb-3">{t('privacy.deleteDescription1')}</p>
              <p className="mb-3">{t('privacy.deleteDescription2')}</p>
              <p className="mb-3">{t('privacy.deleteDescription3')}</p>
              <p className="mb-3">{t('privacy.deleteDescription4')}</p>
              
              <h3 className="text-lg font-bold mt-4 mb-2">{t('privacy.disclosureTitle')}</h3>
              <h4 className="text-base font-bold mt-3 mb-2">{t('privacy.businessTransactionsTitle')}</h4>
              <p className="mb-3">{t('privacy.businessTransactionsDescription')}</p>
              <h4 className="text-base font-bold mt-3 mb-2">{t('privacy.lawEnforcementTitle')}</h4>
              <p className="mb-3">{t('privacy.lawEnforcementDescription')}</p>
              <h4 className="text-base font-bold mt-3 mb-2">{t('privacy.otherLegalTitle')}</h4>
              <p className="mb-3">{t('privacy.otherLegalDescription')}</p>
              <ul className="list-disc ml-6 my-3">
                <li className="mb-2">{t('privacy.legalItems1')}</li>
                <li className="mb-2">{t('privacy.legalItems2')}</li>
                <li className="mb-2">{t('privacy.legalItems3')}</li>
                <li className="mb-2">{t('privacy.legalItems4')}</li>
                <li className="mb-2">{t('privacy.legalItems5')}</li>
              </ul>
              
              <h3 className="text-lg font-bold mt-4 mb-2">{t('privacy.securityTitle')}</h3>
              <p className="mb-3">{t('privacy.securityDescription')}</p>
              
              <h2 className="text-xl font-bold mt-6 mb-3">{t('privacy.childrenTitle')}</h2>
              <p className="mb-3">{t('privacy.childrenDescription1')}</p>
              <p className="mb-3">{t('privacy.childrenDescription2')}</p>
              
              <h2 className="text-xl font-bold mt-6 mb-3">{t('privacy.linksTitle')}</h2>
              <p className="mb-3">{t('privacy.linksDescription1')}</p>
              <p className="mb-3">{t('privacy.linksDescription2')}</p>
              
              <h2 className="text-xl font-bold mt-6 mb-3">{t('privacy.changesTitle')}</h2>
              <p className="mb-3">{t('privacy.changesDescription1')}</p>
              <p className="mb-3">{t('privacy.changesDescription2')}</p>
              <p className="mb-3">{t('privacy.changesDescription3')}</p>
              
              <h2 className="text-xl font-bold mt-6 mb-3">{t('privacy.contactTitle')}</h2>
              <p className="mb-3">{t('privacy.contactDescription')}</p>
              <ul className="list-disc ml-6 my-3">
                <li className="mb-2">
                  <p>{t('privacy.contactEmail')} contact@shelley.co.il</p>
                </li>
                <li className="mb-2">
                  <p>{t('privacy.contactWebsite')} <a href="https://www.shelley.co.il/contact" rel="external nofollow noopener" target="_blank" className="text-blue-600 hover:underline">https://www.shelley.co.il/contact</a></p>
                </li>
              </ul>
            </div>
          </LanguageDirectionWrapper>
        </div>
      </main>
      <Footer />
    </motion.div>
  );
};

export default PrivacyPolicy;
