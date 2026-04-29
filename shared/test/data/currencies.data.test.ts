import { currenciesData, Currency } from '../../src';

describe('currenciesData', () => {
  test('should expose the main supported currencies', () => {
    expect(currenciesData).toEqual([
      { code: 'BRL', symbol: 'R$', countryCode: 'BR', name: 'Real Brasileiro' },
      { code: 'USD', symbol: '$', countryCode: 'US', name: 'Dólar Americano' },
      { code: 'EUR', symbol: '€', countryCode: 'EU', name: 'Euro' },
      { code: 'JPY', symbol: '¥', countryCode: 'JP', name: 'Iene Japonês' },
      { code: 'GBP', symbol: '£', countryCode: 'GB', name: 'Libra Esterlina' },
      { code: 'CNY', symbol: '¥', countryCode: 'CN', name: 'Yuan Chinês' },
      { code: 'CHF', symbol: 'CHF', countryCode: 'CH', name: 'Franco Suíço' },
      { code: 'CAD', symbol: '$', countryCode: 'CA', name: 'Dólar Canadense' },
      { code: 'AUD', symbol: '$', countryCode: 'AU', name: 'Dólar Australiano' },
      { code: 'HKD', symbol: 'HK$', countryCode: 'HK', name: 'Dólar de Hong Kong' },
      { code: 'SGD', symbol: 'S$', countryCode: 'SG', name: 'Dólar de Singapura' },
    ]);
  });

  test('should keep all currencies valid according to the Currency VO', () => {
    for (const currency of currenciesData) {
      const result = Currency.tryCreate(currency);

      expect(result.isOk).toBe(true);
    }
  });
});
