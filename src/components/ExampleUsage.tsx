'use client';

import { useI18n } from '@/hooks/useI18n';

export const ExampleUsage = () => {
  const { t } = useI18n();

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">{t('home.hero.title')}</h2>
      <p className="text-gray-600 mb-4">{t('home.hero.description')}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 border rounded">
          <h3 className="font-semibold">{t('home.features.analysis.title')}</h3>
          <p className="text-sm text-gray-600">{t('home.features.analysis.description')}</p>
        </div>
        
        <div className="p-4 border rounded">
          <h3 className="font-semibold">{t('home.features.risk.title')}</h3>
          <p className="text-sm text-gray-600">{t('home.features.risk.description')}</p>
        </div>
      </div>
    </div>
  );
};

