export interface Product {
  id: number;
  name: string;
  description: string;
  ingredients: string[];
  price: number;
  oldPrice?: number;
  image: string;
  category: string;
  isPopular?: boolean;
  isNew?: boolean;
  weight: string;
  spicyLevel?: number; // 0-3
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export const categories: Category[] = [
  { id: 'popular', name: 'Популярное', icon: '🔥' },
  { id: 'classic', name: 'Классика', icon: '🌯' },
  { id: 'premium', name: 'Премиум', icon: '👑' },
  { id: 'spicy', name: 'Острое', icon: '🌶️' },
  { id: 'combo', name: 'Комбо', icon: '🎁' },
  { id: 'drinks', name: 'Напитки', icon: '🥤' },
];

export const products: Product[] = [
  // Популярное
  {
    id: 1,
    name: 'Шаурма Классик',
    description: 'Легендарная классическая шаурма с нежной курицей, свежими овощами и фирменным соусом',
    ingredients: ['Куриное филе', 'Лаваш', 'Томаты', 'Огурцы', 'Капуста', 'Чесночный соус', 'Кетчуп'],
    price: 299,
    image: 'https://images.unsplash.com/photo-1561651823-34feb02250e4?w=600&h=400&fit=crop',
    category: 'popular',
    isPopular: true,
    weight: '350г',
  },
  {
    id: 2,
    name: 'Шаурма Роял',
    description: 'Премиальная шаурма с двойной порцией мяса и сыром',
    ingredients: ['Двойное куриное филе', 'Сыр чеддер', 'Лаваш', 'Томаты', 'Огурцы', 'Фирменный соус'],
    price: 449,
    oldPrice: 499,
    image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=600&h=400&fit=crop',
    category: 'popular',
    isPopular: true,
    weight: '450г',
  },
  {
    id: 3,
    name: 'Шаурма Острая',
    description: 'Для любителей острых ощущений с перцем халапеньо',
    ingredients: ['Куриное филе', 'Халапеньо', 'Острый соус', 'Лаваш', 'Томаты', 'Лук'],
    price: 329,
    image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600&h=400&fit=crop',
    category: 'spicy',
    spicyLevel: 2,
    weight: '350г',
  },
  
  // Классика
  {
    id: 4,
    name: 'Шаурма с говядиной',
    description: 'Сочная говядина с овощами и пикантным соусом',
    ingredients: ['Говядина', 'Лаваш', 'Томаты', 'Огурцы маринованные', 'Лук', 'Соус барбекю'],
    price: 399,
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&h=400&fit=crop',
    category: 'classic',
    weight: '400г',
  },
  {
    id: 5,
    name: 'Шаурма Вегетарианская',
    description: 'Свежие овощи и фалафель в хрустящем лаваше',
    ingredients: ['Фалафель', 'Хумус', 'Лаваш', 'Томаты', 'Огурцы', 'Салат', 'Тахини'],
    price: 279,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&h=400&fit=crop',
    category: 'classic',
    weight: '320г',
  },
  {
    id: 6,
    name: 'Шаурма XL',
    description: 'Увеличенная порция для настоящих гурманов',
    ingredients: ['Куриное филе', 'Говядина', 'Лаваш большой', 'Все овощи', 'Три соуса'],
    price: 549,
    image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=600&h=400&fit=crop',
    category: 'classic',
    weight: '550г',
  },

  // Премиум
  {
    id: 7,
    name: 'Шаурма Gold',
    description: 'Эксклюзивная шаурма с мраморной говядиной и трюфельным маслом',
    ingredients: ['Мраморная говядина', 'Трюфельное масло', 'Рукола', 'Пармезан', 'Авторский соус'],
    price: 799,
    oldPrice: 899,
    image: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=600&h=400&fit=crop',
    category: 'premium',
    isNew: true,
    weight: '420г',
  },
  {
    id: 8,
    name: 'Шаурма Black Angus',
    description: 'Премиальная говядина Black Angus с карамелизированным луком',
    ingredients: ['Black Angus', 'Карамелизированный лук', 'Сыр бри', 'Руккола', 'Соус демиглас'],
    price: 899,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=400&fit=crop',
    category: 'premium',
    weight: '450г',
  },
  {
    id: 9,
    name: 'Шаурма Султан',
    description: 'Королевская шаурма с бараниной и восточными специями',
    ingredients: ['Баранина', 'Восточные специи', 'Мята', 'Йогуртовый соус', 'Гранат'],
    price: 749,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&h=400&fit=crop',
    category: 'premium',
    weight: '400г',
  },

  // Острое
  {
    id: 10,
    name: 'Шаурма Inferno',
    description: 'Экстремально острая шаурма с перцем каролина рипер',
    ingredients: ['Курица', 'Каролина рипер', 'Хабанеро', 'Острый соус', 'Перец чили'],
    price: 379,
    image: 'https://images.unsplash.com/photo-1604467715878-83e57e8bc129?w=600&h=400&fit=crop',
    category: 'spicy',
    spicyLevel: 3,
    weight: '350г',
  },
  {
    id: 11,
    name: 'Шаурма Мексиканская',
    description: 'Шаурма в мексиканском стиле с гуакамоле',
    ingredients: ['Курица', 'Гуакамоле', 'Сальса', 'Халапеньо', 'Сметана', 'Начос'],
    price: 399,
    image: 'https://images.unsplash.com/photo-1624300629298-e9de39c13be5?w=600&h=400&fit=crop',
    category: 'spicy',
    spicyLevel: 2,
    weight: '380г',
  },

  // Комбо
  {
    id: 12,
    name: 'Комбо Дуэт',
    description: '2 классические шаурмы + 2 напитка',
    ingredients: ['2x Шаурма Классик', '2x Напиток на выбор'],
    price: 699,
    oldPrice: 798,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop',
    category: 'combo',
    weight: '700г + напитки',
  },
  {
    id: 13,
    name: 'Комбо Семейный',
    description: '4 шаурмы разных видов + картофель фри + напитки',
    ingredients: ['4x Шаурма на выбор', 'Картофель фри', '4x Напиток'],
    price: 1499,
    oldPrice: 1796,
    image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=600&h=400&fit=crop',
    category: 'combo',
    weight: '1.4кг + напитки',
  },

  // Напитки
  {
    id: 14,
    name: 'Айран',
    description: 'Освежающий кисломолочный напиток',
    ingredients: ['Кисломолочный продукт', 'Соль', 'Укроп'],
    price: 99,
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600&h=400&fit=crop',
    category: 'drinks',
    weight: '300мл',
  },
  {
    id: 15,
    name: 'Лимонад Домашний',
    description: 'Лимонад по фирменному рецепту',
    ingredients: ['Лимон', 'Мята', 'Сахар', 'Газированная вода'],
    price: 149,
    image: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=600&h=400&fit=crop',
    category: 'drinks',
    weight: '400мл',
  },
  {
    id: 16,
    name: 'Чай Турецкий',
    description: 'Традиционный крепкий чай',
    ingredients: ['Черный чай', 'Сахар'],
    price: 79,
    image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=600&h=400&fit=crop',
    category: 'drinks',
    weight: '250мл',
  },
];

export const slides = [
  {
    id: 1,
    title: 'Премиальная Шаурма',
    subtitle: 'Вкус, который покоряет с первого укуса',
    description: 'Откройте для себя мир изысканных вкусов восточной кухни',
    image: 'https://images.unsplash.com/photo-1561651823-34feb02250e4?w=1920&h=1080&fit=crop',
    cta: 'Заказать сейчас',
  },
  {
    id: 2,
    title: 'Новинка: Gold Collection',
    subtitle: 'Эксклюзивные рецепты от шеф-повара',
    description: 'Мраморная говядина, трюфельное масло и авторские соусы',
    image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=1920&h=1080&fit=crop',
    cta: 'Попробовать',
  },
  {
    id: 3,
    title: 'Семейные Комбо',
    subtitle: 'Выгода до 20%',
    description: 'Большие порции для большой компании',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1920&h=1080&fit=crop',
    cta: 'Выбрать комбо',
  },
];
