export const CATEGORIES = {
    GAMES: 'ألعاب',
    SUBSCRIPTIONS: 'اشتراكات',
    SERVICES: 'خدمات',
  };
  
  export const PRODUCT_STATUS = {
    NEW: 'جديد',
    COMPLETED: 'مكتمل',
    CANCELLED: 'ملغي',
  };
  
  export const PRESET_PRODUCTS = [
    { 
      name: 'Fortnite Crew',
      category: CATEGORIES.GAMES,
      defaultCost: 35,
      defaultPrice: 45,
      description: 'اشتراك شهري في Fortnite Crew'
    },
    { 
      name: 'Discord Nitro',
      category: CATEGORIES.SUBSCRIPTIONS,
      defaultCost: 42,
      defaultPrice: 55,
      description: 'اشتراك Discord Nitro الشهري'
    },
    { 
      name: 'YouTube Premium',
      category: CATEGORIES.SUBSCRIPTIONS,
      defaultCost: 45,
      defaultPrice: 60,
      description: 'اشتراك YouTube Premium الشهري'
    },
    { 
      name: 'Netflix Premium',
      category: CATEGORIES.SUBSCRIPTIONS,
      defaultCost: 60,
      defaultPrice: 75,
      description: 'اشتراك Netflix Premium الشهري'
    },
    { 
      name: 'Spotify Premium',
      category: CATEGORIES.SUBSCRIPTIONS,
      defaultCost: 40,
      defaultPrice: 50,
      description: 'اشتراك Spotify Premium الشهري'
    },
    {
      name: 'PSN Gift Card',
      category: CATEGORIES.GAMES,
      defaultCost: 90,
      defaultPrice: 100,
      description: 'بطاقة PSN هدية'
    },
    {
      name: 'Steam Wallet',
      category: CATEGORIES.GAMES,
      defaultCost: 85,
      defaultPrice: 100,
      description: 'بطاقة Steam للمحفظة'
    },
  ];



export const PAYMENT_METHODS = {
    ASIA: 'آسيا',
    ZAIN_CASH: 'زين كاش',
    RAFIDAIN: 'الرافدين',
    CRYPTO: 'عملات رقمية'
  };
  
  export const CAPITAL_WARNING_THRESHOLD = 1000; // تنبيه عند انخفاض رأس المال عن 1000