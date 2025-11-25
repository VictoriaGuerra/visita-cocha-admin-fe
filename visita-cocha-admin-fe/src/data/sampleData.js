// Script para inicializar datos de ejemplo en localStorage

export const initializeSampleData = () => {
  const sampleAttractions = [
    {
      id: "coliseo-jose-casto-mendez",
      name: "Coliseo José Casto Méndez",
      description: "El Coliseo José Casto Méndez, es una de las principales instalaciones deportivas de la ciudad. Este coliseo cubierto se destaca por ser sede de una variedad de eventos, tanto deportivos como culturales, incluyendo competencias de baloncesto, voleibol y eventos de lucha, así como conciertos y actividades de entretenimiento.",
      coverUrl: "https://firebasestorage.googleapis.com/v0/b/cocha-turismo.appspot.com/o/images%2Fjose%20casto%20mendez.jpg?alt=media&token=bc247473-1f67-47bb-b82a-3e3764f19be3",
      available: true,
      isFeatured: true,
      categories: ["popular", "entretenimiento"],
      mainCategories: ["populares", "entretenimiento"],
      location: {
        address: "Avenida Manuela Gandarillas, Colina de San Sebastián",
        coords: {
          lat: "-17.401160047869425",
          lng: "-66.16145219131906"
        }
      },
      contact: {
        phone: "",
        mail: "",
        link: ""
      },
      accessibility: "",
      rating: 4,
      order: 75,
      faq: [],
      foods: []
    },
    {
      id: "cristo-de-la-concordia",
      name: "Cristo de la Concordia",
      description: "El Cristo de la Concordia es uno de los monumentos más emblemáticos de Cochabamba. Con 34.20 metros de altura, es considerado el Cristo más alto del mundo. Ubicado en la cima del Cerro San Pedro, ofrece una vista panorámica espectacular de toda la ciudad.",
      coverUrl: "https://example.com/cristo-concordia.jpg",
      available: true,
      isFeatured: true,
      categories: ["popular", "cultura", "naturaleza"],
      mainCategories: ["populares", "cultura"],
      location: {
        address: "Cerro San Pedro, Cochabamba",
        coords: {
          lat: "-17.394546",
          lng: "-66.138952"
        }
      },
      contact: {
        phone: "+591 4 4258585",
        mail: "",
        link: ""
      },
      accessibility: "Teleférico disponible para personas con movilidad reducida",
      rating: 5,
      order: 1,
      faq: [],
      foods: []
    },
    {
      id: "plaza-14-septiembre",
      name: "Plaza 14 de Septiembre",
      description: "La Plaza 14 de Septiembre es el corazón histórico y social de Cochabamba. Es un espacio público amplio rodeado de importantes edificios coloniales y republicanos, ideal para pasear y disfrutar del ambiente citadino.",
      coverUrl: "https://example.com/plaza-14.jpg",
      available: true,
      isFeatured: true,
      categories: ["popular", "cultura"],
      mainCategories: ["populares", "cultura"],
      location: {
        address: "Centro de Cochabamba",
        coords: {
          lat: "-17.393621",
          lng: "-66.157112"
        }
      },
      contact: {
        phone: "",
        mail: "",
        link: ""
      },
      accessibility: "Totalmente accesible",
      rating: 4.5,
      order: 2,
      faq: [],
      foods: []
    }
  ];

  // Guardar en localStorage
  localStorage.setItem('vc_data_attractions_v1', JSON.stringify(sampleAttractions));
  
  console.log('Datos de ejemplo inicializados correctamente');
  return sampleAttractions;
};

// Función para limpiar datos
export const clearSampleData = () => {
  localStorage.removeItem('vc_data_attractions_v1');
  console.log('Datos de ejemplo eliminados');
};

// Inicializa datos de ejemplo para Restaurantes si no existen
export const initializeSampleRestaurants = () => {
  const key = 'vc_data_restaurants_v1';
  const existing = localStorage.getItem(key);
  if (existing) {
    try { const arr = JSON.parse(existing); if (Array.isArray(arr) && arr.length) return arr; } catch {}
  }

  const sampleRestaurants = [
    {
      id: 'casa-de-campo',
      name: 'Casa de Campo',
      description: 'Restaurante de comida típica con ambiente familiar.',
      coverUrl: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=1200&auto=format&fit=crop',
      available: true,
      accessibility: 'Rampas de acceso y baños adaptados',
      categories: ['gastronomia', 'popular'],
      mainCategories: ['gastronomia'],
      contact: { phone: '+591 4 4440000', mail: 'contacto@casadecampo.bo', link: 'https://casadecampo.bo' },
      customDeliveryUrl: '',
      deliveryUrls: ['https://yaigo.com/casadecampo', 'https://patio.com/casadecampo'],
      faq: ['¿Atienden con reserva?', '¿Tienen menú vegetariano?'],
      foods: ['Pique Macho', 'Silpancho'],
      isFeatured: true,
      location: { address: 'Av. Libertador 123', coords: { lat: '-17.39', lng: '-66.15' } },
      order: 1,
      rating: 4.6
    },
    {
      id: 'cafe-andino',
      name: 'Café Andino',
      description: 'Cafetería artesanal con postres y café de altura.',
      coverUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop',
      available: true,
      accessibility: '',
      categories: ['café'],
      mainCategories: ['gastronomia'],
      contact: { phone: '+591 4 4455555', mail: '', link: '' },
      customDeliveryUrl: '',
      deliveryUrls: [],
      faq: [],
      foods: ['Café', 'Tiramisú'],
      isFeatured: false,
      location: { address: 'Calle Aroma 456', coords: { lat: '-17.40', lng: '-66.17' } },
      order: 2,
      rating: 4.2
    }
  ];

  localStorage.setItem(key, JSON.stringify(sampleRestaurants));
  console.log('Datos de ejemplo de restaurantes inicializados');
  return sampleRestaurants;
};

// Inicializa datos de ejemplo para Eventos si no existen
export const initializeSampleEvents = () => {
  const key = 'vc_data_events_v1';
  const existing = localStorage.getItem(key);
  if (existing) {
    try { const arr = JSON.parse(existing); if (Array.isArray(arr) && arr.length) return arr; } catch {}
  }

  const sampleEvents = [
    {
      id: 'festival-musica-cocha-2026',
      name: 'Festival de Música Cocha 2026',
      description: 'Festival al aire libre con bandas locales e internacionales.',
      coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop',
      available: true,
      active: true,
      isFeatured: true,
      categories: ['música', 'festival'],
      mainCategories: ['eventos'],
      tags: ['rock', 'pop'],
      startDate: '2026-02-12',
      endDate: '2026-02-14',
      startTime: '16:00',
      endTime: '23:59',
      venueName: 'Parque de la Familia',
      location: { address: 'Av. Circunvalación', coords: { lat: '-17.39', lng: '-66.15' } },
      organizer: 'Cultura Cocha',
      contact: { phone: '+591 4 4400000', mail: 'info@culturacocha.bo', link: 'https://culturacocha.bo' },
      ticketUrl: 'https://tickets.cocha.bo/festival2026',
      isFree: false,
      price: 80,
      currency: 'BOB',
      capacity: 5000,
      galleryUrls: [],
      faq: ['¿Se permite ingreso con mascotas?'],
      order: 1
    },
    {
      id: 'feria-gastronomica-abril',
      name: 'Feria Gastronómica de Abril',
      description: 'Muestras culinarias y concursos de chefs locales.',
      coverUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=1200&auto=format&fit=crop',
      available: true,
      active: true,
      isFeatured: false,
      categories: ['gastronomia', 'familia'],
      mainCategories: ['eventos'],
      tags: ['comida', 'feria'],
      startDate: '2026-04-20',
      endDate: '2026-04-21',
      startTime: '10:00',
      endTime: '20:00',
      venueName: 'Recinto Ferial Alalay',
      location: { address: 'Lago Alalay', coords: { lat: '-17.40', lng: '-66.16' } },
      organizer: 'Turismo Cocha',
      contact: { phone: '', mail: '', link: '' },
      ticketUrl: '',
      isFree: true,
      price: 0,
      currency: 'BOB',
      capacity: 2000,
      galleryUrls: [],
      faq: [],
      order: 2
    }
  ];

  localStorage.setItem(key, JSON.stringify(sampleEvents));
  console.log('Datos de ejemplo de eventos inicializados');
  return sampleEvents;
};

// Inicializa datos de ejemplo para Hoteles si no existen
export const initializeSampleHotels = () => {
  const key = 'vc_data_hotels_v1';
  const existing = localStorage.getItem(key);
  if (existing) {
    try { const arr = JSON.parse(existing); if (Array.isArray(arr) && arr.length) return arr; } catch {}
  }

  const sampleHotels = [
    {
      id: 'hotel-llajta',
      name: 'Hotel Llajta',
      description: 'Hotel céntrico con desayuno incluido y WiFi.',
      coverUrl: 'https://images.unsplash.com/photo-1551776235-dde6d4829808?q=80&w=1200&auto=format&fit=crop',
      available: true,
      isFeatured: true,
      stars: 4,
      rating: 4.3,
      categories: ['hotel', 'familiar'],
      mainCategories: ['alojamiento'],
      amenities: ['WiFi', 'Desayuno', 'Piscina'],
      roomTypes: ['Single', 'Doble', 'Suite'],
      priceRangeMin: 180,
      priceRangeMax: 450,
      currency: 'BOB',
      checkInTime: '14:00',
      checkOutTime: '12:00',
      location: { address: 'Av. Principal 123', coords: { lat: '-17.39', lng: '-66.16' } },
      contact: { phone: '+591 4 4411111', mail: 'reservas@llajta.bo', link: 'https://llajta.bo' },
      galleryUrls: [],
      faq: [],
      order: 1
    },
    {
      id: 'hostal-andes',
      name: 'Hostal Andes',
      description: 'Opción económica cerca del mercado.',
      coverUrl: 'https://images.unsplash.com/photo-1505692794403-34d4982b1e48?q=80&w=1200&auto=format&fit=crop',
      available: true,
      isFeatured: false,
      stars: 2,
      rating: 3.8,
      categories: ['hostal', 'económico'],
      mainCategories: ['alojamiento'],
      amenities: ['WiFi'],
      roomTypes: ['Doble'],
      priceRangeMin: 80,
      priceRangeMax: 150,
      currency: 'BOB',
      checkInTime: '13:00',
      checkOutTime: '11:00',
      location: { address: 'Calle Secundaria 45', coords: { lat: '-17.40', lng: '-66.18' } },
      contact: { phone: '', mail: '', link: '' },
      galleryUrls: [],
      faq: [],
      order: 2
    }
  ];

  localStorage.setItem(key, JSON.stringify(sampleHotels));
  console.log('Datos de ejemplo de hoteles inicializados');
  return sampleHotels;
};

// Categorías de ejemplo basadas en adjuntos
export const initializeAttractionCategories = () => {
  const key = 'vc_cats_attractions_v1';
  const existing = localStorage.getItem(key);
  if (existing) {
    try { const arr = JSON.parse(existing); if (Array.isArray(arr) && arr.length) return arr; } catch {}
  }
  const seed = [
    { id: 'historico', name: 'Histórico', order: 40, available: true },
    { id: 'iglesias', name: 'Iglesias', order: 70, available: true },
    { id: 'museos', name: 'Museos', order: 60, available: true },
    { id: 'parques', name: 'Parques', order: 30, available: true },
    { id: 'plazas', name: 'Plazas', order: 70, available: true },
    { id: 'popular', name: 'Popular', order: 20, available: true },
    { id: 'tiendas', name: 'Tiendas', order: 60, available: false }
  ];
  localStorage.setItem(key, JSON.stringify(seed));
  return seed;
};

// Inicializa datos de ejemplo para Puntos de Interés
export const initializeSamplePoints = () => {
  const key = 'vc_data_points_v1';
  const existing = localStorage.getItem(key);
  if (existing) {
    try { const arr = JSON.parse(existing); if (Array.isArray(arr) && arr.length) return arr; } catch {}
  }
  const samplePoints = [
    {
      id: 'plaza-colon',
      name: 'Plaza Colón',
      description: 'Punto de encuentro céntrico con áreas verdes y fuente.',
      coverUrl: 'https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?q=80&w=1200&auto=format&fit=crop',
      available: true,
      isFeatured: true,
      categories: ['plazas', 'popular'],
      mainCategories: ['populares'],
      location: { address: 'Av. Ballivián', coords: { lat: '-17.38', lng: '-66.16' } },
      contact: { phone: '', mail: '', link: '' },
      order: 1
    },
    {
      id: 'mirador-san-pedro',
      name: 'Mirador San Pedro',
      description: 'Mirador con vista panorámica de la ciudad.',
      coverUrl: 'https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?q=80&w=1200&auto=format&fit=crop',
      available: true,
      isFeatured: false,
      categories: ['naturaleza'],
      mainCategories: ['naturaleza'],
      location: { address: 'Cerro San Pedro', coords: { lat: '-17.39', lng: '-66.14' } },
      contact: { phone: '', mail: '', link: '' },
      order: 2
    }
  ];
  localStorage.setItem(key, JSON.stringify(samplePoints));
  console.log('Datos de ejemplo de puntos de interés inicializados');
  return samplePoints;
};

export const initializeRestaurantCategories = () => {
  const key = 'vc_cats_restaurants_v1';
  const existing = localStorage.getItem(key);
  if (existing) {
    try { const arr = JSON.parse(existing); if (Array.isArray(arr) && arr.length) return arr; } catch {}
  }
  const toBool = (v) => v === true || v === 'true' || v === 1;
  const seed = [
    { id: 'cafeterias', name: 'Cafés', order: 30, available: true },
    { id: 'parrilla', name: 'Parrilla', order: 40, available: true },
    { id: 'pasta', name: 'Pastas', order: 40, available: true },
    { id: 'popular', name: 'Popular', order: 30, available: toBool('') ? true : true },
    { id: 'postres', name: 'Postres', order: 50, available: false },
    { id: 'rapida', name: 'Comida rápida', order: 50, available: false },
    { id: 'tradicional', name: 'Tradicional', order: 20, available: true },
    { id: 'vegetariano', name: 'Vegetariana', order: 50, available: true }
  ];
  localStorage.setItem(key, JSON.stringify(seed));
  return seed;
};

export const initializeMainCategoriesSeed = () => {
  const key = 'vc_cats_main_v1';
  const existing = localStorage.getItem(key);
  if (existing) {
    try { const arr = JSON.parse(existing); if (Array.isArray(arr) && arr.length) return arr; } catch {}
  }
  const seed = [
    { id: 'cultura', name: 'Cultura', isFeatured: true, photoUrl: 'https://firebasestorage.googleapis.com/v0/b/cocha-turismo.appspot.com/o/main-categories%2FCocha-FotosLite1083_4_11zon.webp?alt=media&token=70db28b2-79f9-4339-b9e5-286c1b952bd8', icon: 'color-palette-outline', available: false, order: 10 },
    { id: 'entretenimiento', name: 'Entretenimiento', isFeatured: true, photoUrl: 'https://firebasestorage.googleapis.com/v0/b/cocha-turismo.appspot.com/o/main-categories%2FCocha-FotosLite1456_11zon.webp?alt=media&token=f2d101e2-ea13-42ff-bfa7-0a70f0052318', icon: 'golf-outline', available: true, order: 30 },
    { id: 'festividades', name: 'Festividades', isFeatured: true, photoUrl: 'https://firebasestorage.googleapis.com/v0/b/cocha-turismo.appspot.com/o/main-categories%2FCocha-FotosLite1842.webp?alt=media&token=49346ecb-8c0c-4e58-8d6d-b2640c9f478a', icon: 'flash-outline', available: false, order: 30 },
    { id: 'historia', name: 'Historia', isFeatured: true, photoUrl: 'https://firebasestorage.googleapis.com/v0/b/cocha-turismo.appspot.com/o/main-categories%2FCocha-FotosLite597_5_11zon.webp?alt=media&token=570779d3-cbf0-471c-9799-9a5df81e6648', icon: 'footsteps-outline', available: true, order: 50 },
    { id: 'naturaleza', name: 'Naturaleza', isFeatured: true, photoUrl: 'https://firebasestorage.googleapis.com/v0/b/cocha-turismo.appspot.com/o/main-categories%2FCocha-FotosLite856_11zon.webp?alt=media&token=c05fdd97-9689-4e46-88a9-e10e77ceda78', icon: 'leaf-outline', available: true, order: 50 },
    { id: 'patrimonio', name: 'Patrimonio', isFeatured: true, photoUrl: 'https://firebasestorage.googleapis.com/v0/b/cocha-turismo.appspot.com/o/main-categories%2FCocha-FotosLite50_11zon.webp?alt=media&token=5024a4d8-b843-471a-9099-11065c707fe0', icon: 'business-outline', available: true, order: 30 },
    { id: 'populares', name: 'Populares', isFeatured: true, photoUrl: 'https://firebasestorage.googleapis.com/v0/b/cocha-turismo.appspot.com/o/main-categories%2FCocha-FotosLite2056_11zon.webp?alt=media&token=ecc57f96-1523-41a3-83ff-65c13a10d787', icon: 'flame-outline', available: true, order: 10 },
    { id: 'religioso', name: 'Religioso', isFeatured: true, photoUrl: 'https://firebasestorage.googleapis.com/v0/b/cocha-turismo.appspot.com/o/main-categories%2FCocha-FotosLite898_11zon.webp?alt=media&token=801a86ca-bfdc-43cb-ae49-218c780fe1ef', icon: 'megaphone-outline', available: true, order: 60 },
    { id: 'restaurante', name: 'Donde comer', isFeatured: true, photoUrl: 'https://firebasestorage.googleapis.com/v0/b/cocha-turismo.appspot.com/o/main-categories%2Frestaurant.webp?alt=media&token=f515cb69-8b2a-4e52-bd41-63124b82103e', icon: 'restaurant-outline', available: false, order: 40 }
  ];
  localStorage.setItem(key, JSON.stringify(seed));
  return seed;
};

// Inicializa datos de ejemplo para Anuncios si no existen
export const initializeSampleAnnouncements = () => {
  const key = 'vc_data_announcements_v1';
  const existing = localStorage.getItem(key);
  if (existing) {
    try { const arr = JSON.parse(existing); if (Array.isArray(arr) && arr.length) return arr; } catch {}
  }

  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const todayStr = `${yyyy}-${mm}-${dd}`;

  const sampleAnnouncements = [
    {
      id: 'bienvenida-temporada',
      title: '¡Bienvenidos a la temporada!',
      description: 'Promos y actividades destacadas para esta temporada en Cochabamba.',
      coverUrl: 'https://images.unsplash.com/photo-1506784881475-29c2e86d80f2?q=80&w=1200&auto=format&fit=crop',
      startDate: todayStr,
      endDate: '',
      active: true,
      isFeatured: true,
      order: 1
    },
    {
      id: 'mantenimiento-app',
      title: 'Mantenimiento programado',
      description: 'La plataforma estará en mantenimiento el próximo domingo de 02:00 a 04:00.',
      coverUrl: '',
      startDate: todayStr,
      endDate: '',
      active: true,
      isFeatured: false,
      order: 2
    }
  ];

  localStorage.setItem(key, JSON.stringify(sampleAnnouncements));
  console.log('Datos de ejemplo de anuncios inicializados');
  return sampleAnnouncements;
};

// Inicializa datos de ejemplo para Comidas usando adjunto
export const initializeSampleFoods = () => {
  const key = 'vc_data_foods_v1';
  const existing = localStorage.getItem(key);
  if (existing) {
    try { const arr = JSON.parse(existing); if (Array.isArray(arr) && arr.length) return arr; } catch {}
  }

  // Datos crudos desde foods.json (adjunto)
  const RAW = [
    {"_id":"Chajchu","coverUrl":"https://firebasestorage.googleapis.com/v0/b/cocha-turismo.appspot.com/o/foods%2FChajchu%20cocha.jpg?alt=media&token=02108378-961f-42f9-97bf-7e45fe0977fe","name":"Chajchu","available":true,"rating":5,"ingredients":["Carne de res desebrada","papa ","huevo","sarza de tomate y cebolla"],"description":"El anticucho es parte crucial de la comida cochabambina. No se tiene un origen preciso, sin embargo le da sabor al valle.","order":40},
    {"_id":"anticucho","name":"Anticucho","available":true,"rating":5,"order":40,"description":"El anticucho es parte crucial de la comida cochabambina. No se tiene un origen preciso, sin embargo le da sabor al valle.","coverUrl":"https://firebasestorage.googleapis.com/v0/b/cocha-turismo.appspot.com/o/foods%2FANTICUCHOS-2.jpg?alt=media&token=84ccd9cd-a4d0-43ba-a89e-750f2888e2dc","ingredients":["Corazón de res","papa ","yuca","ají de maní"]},
    {"_id":"api","coverUrl":"https://firebasestorage.googleapis.com/v0/b/cocha-turismo.appspot.com/o/foods%2Fapi%20con%20pastel.jfif?alt=media&token=ede54f71-4aa8-4ac6-87e2-9538153ea3d5","name":"Api","rating":5,"description":"El api es una tradición nacional, una bebida milenaria acompañada de un \"pastel\" repleto de queso en su interior,","ingredients":["Maiz Morado molido","Azucar","Agua","Canela","Clavo de olor","Cascara de naranja"],"order":40,"available":true},
    {"_id":"cafe","name":"Café","order":50,"rating":5,"description":"El café es una bebida popular y estimulante que se obtiene de las semillas tostadas y molidas de la planta de café, conocida como Coffea. Es una de las bebidas más consumidas en todo el mundo y tiene una larga historia que se remonta a siglos atrás.","coverUrl":"https://firebasestorage.googleapis.com/v0/b/cocha-turismo.appspot.com/o/foods%2Fcafe.webp?alt=media&token=31236814-9a91-4439-aab3-838a34f88d66","available":true},
    {"_id":"ceviche","rating":5,"name":"Ceviche","ingredients":["pescado","limon","aji en vaina","camote"],"description":"El ceviche es una comida de mar, elaborada con pescado fresco y cocinado en limón y sal.","order":30,"coverUrl":"https://firebasestorage.googleapis.com/v0/b/cocha-turismo.appspot.com/o/foods%2Fceviche-peruano-de-pescado.jpg?alt=media&token=f17f1b4c-43e8-4b5f-a0c6-4ba1e954ecee","available":false},
    {"_id":"chankapollo","coverUrl":"https://firebasestorage.googleapis.com/v0/b/cocha-turismo.appspot.com/o/foods%2Fchaka.webp?alt=media&token=b54649f5-22c4-4827-a029-58c74f92d27f","name":"Chank’a de Pollo","rating":5,"description":"La Chanka de pollo, es un plato típico cochabambino que además de su exquisito sabor, puede ayudar a combatir el resfriado común o malestar estomacal.","ingredients":["Pollo","Papa","habas","cebolla","laurel","zanahoria","arvejas","condimentos"],"order":50,"available":true},
    {"_id":"charque","ingredientes":["charque de res","huevo duro","mote","quesillo","papa"],"available":true,"rating":5,"order":35,"description":"El charque tiene su origen en la cultura precolombina, a medida que los siglos han ido transcurriendo, la carne se ha ido afinando y se ha convertido en un plato estrella del valle cochabambino.","coverUrl":"https://firebasestorage.googleapis.com/v0/b/cocha-turismo.appspot.com/o/foods%2Fcharque-boliviano.jpg?alt=media&token=784b7829-788d-48b9-9474-4c20e95a0d54","name":"Charque"},
    {"_id":"chicharron","coverUrl":"https://firebasestorage.googleapis.com/v0/b/cocha-turismo.appspot.com/o/foods%2FChicharron.JPG?alt=media&token=18cc21c5-16e6-475e-acb5-8187db436a5f","name":"Chicharron","rating":5,"description":"El chicharrón es uno de los platos típicos de Cochabamba que se prepara en grandes peroles acompañado de mote, chuño, y una rica y pincante llajwa.","ingredients":["Carne de cerdo","Condimentos","Papa","mote","llajua (opcional)"],"order":20,"available":true},
    {"_id":"cinternacional","rating":5,"available":true,"order":40,"description":"La comida internacional que se provee en Patrimonio, es de nivel gourmet.","name":"Comida Internacional","ingredients":["Internacional"],"coverUrl":"https://firebasestorage.googleapis.com/v0/b/cocha-turismo.appspot.com/o/foods%2Fcomidas-combo-kCVC-U11010842306536oD-1248x770%40Diario%20Sur.jpg?alt=media&token=bad2c957-c6bf-4998-9984-b677a309d27f"},
    {"_id":"empanada","ingredientes":["queso","charque","picante","pollo"],"available":true,"rating":5,"order":35,"description":"Las empanadas, a diferencia de los pasteles, tienen una masa más gruesa y su interior puede estar acompañado de diferentes ingredientes, como el pollo, res, charque o queso. ","coverUrl":"https://firebasestorage.googleapis.com/v0/b/cocha-turismo.appspot.com/o/foods%2FEMPANADAS.JPG?alt=media&token=1d1e9c8a-db3c-4cde-b35a-a4f5e66b71b1","name":"Empanada"},
    {"_id":"ensaladas","coverUrl":"https://firebasestorage.googleapis.com/v0/b/cocha-turismo.appspot.com/o/foods%2Fensaladas%202.jfif?alt=media&token=78474f9d-df39-4f98-8fc5-b99dfdf52c0a","name":"Ensaladas","rating":5,"description":"La ensalada consiste en una combinación de ingredientes frescos y crujientes, generalmente vegetales, que se aliñan con aderezos y se sirven fríos. Las ensaladas son conocidas por su variedad de sabores, colores y texturas, y son una opción popular tanto como plato principal como acompañamiento","ingredients":["Lechuga u otros tipos de hojas verdes","Vegetales frescos","Ingredientes adicionales","Aderezo"],"order":38,"available":true},
    {"_id":"guarniciones","name":"Guarniciones","available":true,"rating":5,"ingredients":["yuca","papa","arroz con queso","ensalada"],"description":"Las guarniciones acompañan al plato principal. ","order":40,"coverUrl":"https://firebasestorage.googleapis.com/v0/b/cocha-turismo.appspot.com/o/foods%2Fguarniciones.webp?alt=media&token=f8223623-1eea-470f-ad69-c04675b03f9e"},
    {"_id":"hamburguesa","coverUrl":"https://firebasestorage.googleapis.com/v0/b/cocha-turismo.appspot.com/o/foods%2Fhamburguesa.jfif?alt=media&token=84d1d4b9-c2a4-4288-a958-19ed6987eee9","name":"Hamburguesa","rating":5,"description":"Las hamburguesa son un emblema en todo el mundo, es un sándwich hecho a base de carne molida o de origen vegetal, aglutinada en forma de filete cocinado a la parrilla o a la plancha, aunque también puede freírse u hornearse, Se sirve en pan, se añade queso y se acompaña con papas fritas.","ingredients":["Pan de hamburguesa","Carne picada","Condimentos","Ingredientes para el relleno"],"order":35,"available":true},
    {"_id":"helado","coverUrl":"https://firebasestorage.googleapis.com/v0/b/cocha-turismo.appspot.com/o/foods%2Fhelados%202.jfif?alt=media&token=43c0fdb6-6d24-4473-a0e7-12b543e98f29","name":"Helado","rating":5,"description":"Este postre congelado y cremoso es ampliamente disfrutado en todo el mundo. Su textura suave y refrescante, combinada con una variedad de sabores y coberturas, lo convierten en un dulce irresistible.","ingredients":["Leche","Azúcar","Crema de leche","Yemas de huevo","Vainilla","Ingredientes adicionales según el sabor deseado"],"order":399,"available":true},
    {"_id":"heladocanela","coverUrl":"https://firebasestorage.googleapis.com/v0/b/cocha-turismo.appspot.com/o/foods%2Fhelado%20de%20canela.jfif?alt=media&token=6c9d5c49-37c2-4eba-9267-4655c5460a60","name":"Helado de Canela","rating":5,"description":"Son muy representativos de la gastronomía cochabambina, ya que son acompañantes ideales de las empanadas. Además, se las pueden encontrar en cualquier esquina los días de mucho calor y sobre todo los fines de semana, donde muchas tiendas o proveedoras instalan sus máquinas artesanales.","ingredients":["Agua","Azucar","Canela en rama y molida","Limon","Airampo(colorante)"],"order":80,"available":true},
    {"_id":"lapping","coverUrl":"https://firebasestorage.googleapis.com/v0/b/cocha-turismo.appspot.com/o/foods%2FLAPIING.JPG?alt=media&token=a8350378-55c0-4c31-a397-df9fffa57f33","name":"Lapping","rating":5,"description":"Lapping cochabambino acompañado de un refresco de mocochinchi es lo máximo,este plato consiste en carne de pecho de vaca, acompañado con mote de habas, choclo, papa cocida con cáscara , y mucha ensalada de tomate con cebolla y mucha kirkiña","ingredients":["Carne de vaca","papa con cascara","Choclo","Haba","Ensalada(Lechuga,tomate,cebolla","Kirkiña"],"order":40,"available":true},
    {"_id":"menudito","ingredientes":["mote blanco","carne res/pollo/cerdo","locoto","cebolla verde"],"available":true,"rating":5,"order":35,"description":"El menudito es una sopa exquisita que tiene carne de res, pollo y cerdo, acompañado de mote blanco. Se creía que tenía su origen en Sucre, sin embargo, es un invento de Sucremante, de ahí la confusión.","coverUrl":"https://firebasestorage.googleapis.com/v0/b/cocha-turismo.appspot.com/o/foods%2Fmenudito.jpg?alt=media&token=455ea981-2a5e-4928-bfaf-752d57073bf3","name":"Menudito"},
    {"_id":"mexicana","name":"Comida Mexicana","rating":5,"ingredients":["Tortilla de maíz/trigo","carne variada","pico de gallo","chile picante"],"order":35,"description":"La comida mexicana tiene sabores fuertes, la tortilla de maíz y el mole verde, son parte fundamental de su cocina.","coverUrl":"https://firebasestorage.googleapis.com/v0/b/cocha-turismo.appspot.com/o/foods%2Fcomida%20mexicana%202.jfif?alt=media&token=86c15618-26dd-4806-97bf-3298b0454679","available":false},
    {"_id":"nacional","name":"Comida Nacional","available":true,"rating":5,"ingredients":["Comida Nacional Gourmet"],"order":40,"description":"Variada comida nacional gourmet","coverUrl":"https://firebasestorage.googleapis.com/v0/b/cocha-turismo.appspot.com/o/foods%2Fbolivia%20nacional%20gourmet.jpg?alt=media&token=b2718133-08f6-4149-94a2-a1a51ff81901"},
    {"_id":"parrilla","coverUrl":"https://firebasestorage.googleapis.com/v0/b/cocha-turismo.appspot.com/o/foods%2Fparrillada.jfif?alt=media&token=da81e32b-dcb5-4b1b-b9c4-1df420aacc57","name":"Parrillada","rating":5,"description":"La parrillada también llamada asado, churrasco, barbacoa o torrada​ es un método para cocinar carnes de diferentes animales, principalmente de bovino, pollo o cerdo, mediante el calor del fuego de la parrilla.","ingredients":["Carne (Bistec, pollo, cerdo, cordero, salchichas, chorizos)","papa","arroz con queso","ensalada","pan"],"order":35,"available":true},
    {"_id":"pastas","coverUrl":"https://firebasestorage.googleapis.com/v0/b/cocha-turismo.appspot.com/o/foods%2Fpastas%202.jfif?alt=media&token=c940b08a-5685-4fc0-9c17-0985910680c2","name":"Pastas","rating":5,"description":"Las pastas están disponibles en una amplia variedad de formas y tamaños. Algunas de las más conocidas incluyen spaghetti (hebras largas y delgadas), penne (tubos cortos con extremos biselados), farfalle (moñitos o corbatas), fusilli (espirales), lasaña (láminas planas) y ravioli (pastas rellenas).","ingredients":["Pasta de tu elección","Salsa de tomate o salsa"],"order":30,"available":true},
    {"_id":"pastelqueso","coverUrl":"https://firebasestorage.googleapis.com/v0/b/cocha-turismo.appspot.com/o/foods%2Fpastel%20de%20queso.jfif?alt=media&token=3ad999de-ee5d-43af-861e-6d5153311b6e","name":"Pastel de Queso ","rating":5,"description":"El pastel de api mas conocido internacional mente como empanada frita de queso, este majestuoso desayuno es muy original en Bolivia","ingredients":["Masa (Harina, manteca, agua, sal)","Queso Criollo","Aceite para freir"],"order":30,"available":true},
    {"_id":"picantepollo","coverUrl":"https://firebasestorage.googleapis.com/v0/b/cocha-turismo.appspot.com/o/foods%2Fpicante%20de%20pollo.jfif?alt=media&token=a6fa92b9-46de-441f-aabe-192d1299666a","name":"Picante de Pollo","rating":5,"description":"El picante de pollo es una de las muchas recetas criollas originarias de Cochabamba que se carac-teriza por su aroma y sabor picante.  Su elabora-ción consiste en cocinar y hacer hervir el pollo en agua con las cebollas, para luego despréselo y añadir ají colorado molido. ","ingredients":["Pollo","aji molido","papa","arroz","chuño","ensalda (tomate y cebolla)"],"order":50,"available":true},
    {"_id":"piquemacho","coverUrl":"https://firebasestorage.googleapis.com/v0/b/cocha-turismo.appspot.com/o/foods%2FPIQUE%20ESPECIAL.jpg?alt=media&token=327e2e23-6eb7-494b-ba90-af818e009cff","name":"Pique Macho","rating":5,"description":"El pique macho es un plato típico de la gastronomía de Cochabamba, Bolivia, que consiste en una porción generosa de carne de res cortada en tiras, papas fritas, huevo duro, cebolla, tomate y locoto (un tipo de ají picante)","ingredients":["Carne de res cortada en tiras","Papas fritas","Huevo duro","Ensalada (tomate, cebolla y locoto)","Chorizo"],"order":20,"available":true},
    {"_id":"pizza","coverUrl":"https://firebasestorage.googleapis.com/v0/b/cocha-turismo.appspot.com/o/foods%2Fpizzas.jfif?alt=media&token=82a880c8-f99f-4026-ba6a-192cdaf2a9b8","name":"Pizza","rating":5,"description":"La pizza es una preparación culinaria que consiste en un pan plano, habitualmente de forma circular, elaborado con harina de trigo, levadura, agua y sal que tradicionalmente se cubre con salsa de tomate y mozzarella y se hornea a alta temperatura en un horno de leña.​​​","ingredients":["Masa para pizza","Salsa de tomate","Queso mozzarella","Ingredientes para cubrir la pizza"],"order":35,"available":true},
    {"_id":"pollo","coverUrl":"https://firebasestorage.googleapis.com/v0/b/cocha-turismo.appspot.com/o/foods%2Fpollo%20spiedo.jfif?alt=media&token=35f0525a-9d7a-4fc9-a14d-925ebf45fe97","name":"Pollo","rating":5,"description":"El pollo es un plato popular en muchas culturas alrededor del mundo, y cada región tiene su propia variante. se puede disfrutar de muchas maneras: frito, al spiedo, a la leña, a la parrilla, etc.","ingredients":["Piezas de pollo","Aceite o mantequilla para cocinar","Condimentos","Hierbas y especias adicionales"],"order":30,"available":true},
    {"_id":"rellenopapa","coverUrl":"https://firebasestorage.googleapis.com/v0/b/cocha-turismo.appspot.com/o/foods%2Frellenoapap.webp?alt=media&token=027f8e17-5b26-47c6-bdc6-82fde48a6882","name":"Relleno de Papa","rating":5,"description":"El Relleno de Papa es uno de los bocados tradicionales cochabambinos más deliciosos  de media mañana que se puede encontrar en diferentes lugares de la ciudad y alrededores. Esta particular merienda consiste en una bolita amasada de papa que contiene un delicioso gigote de carne de pollo o res, acompañado de una porción de ensalada.","order":80,"available":true,"ingredients":["Papa","Ensalada (Lechuga, tomate, cebolla y locoto)","Jigote (Pollo o res)"]},
    {"_id":"saltena","coverUrl":"https://firebasestorage.googleapis.com/v0/b/cocha-turismo.appspot.com/o/foods%2Fsaltena.webp?alt=media&token=d6a0fe11-8b94-4a0a-b91b-6b53216fa1a8","name":"Salteña","rating":5,"description":"La salteña es una empanada jugosa que contiene un gigote de carne de res o pollo, que puede ser dulce, picante o normal. El lugar que ocupa la salteña en la gastronomía boliviana es único e inigualable, por  la combinación de sabores que deleita los paladares de propios y extraños. Esta emblemática empanada se la consume a media mañana y se encuentra en cualquiera de los 4 puntos cardinales de nuestra ciudad.","ingredients":["Masa (Harina, manteca, achiote, huevo, sal,azucar)","Jigote o Relleno (Pollo, carne, especias, huevo duro, gelatina sin sabor, papa)"],"order":20,"available":true},
    {"_id":"sandwiches","coverUrl":"https://firebasestorage.googleapis.com/v0/b/cocha-turismo.appspot.com/o/foods%2Fsandwiches.jfif?alt=media&token=eb800c50-6f30-4585-98cd-700e3be0c11e","name":"Sandwiches","rating":5,"description":"El sandwich es un plato versátil y popular que consiste en la combinación de ingredientes entre dos rebanadas de pan. Su versatilidad permite una amplia variedad de sabores y opciones, adaptándose a los gustos y preferencias de cada persona.","ingredients":["Pan","Carnes segun elección","Queso","Vegetales","Condimentos"],"order":30,"available":true},
    {"_id":"schorizo","coverUrl":"https://firebasestorage.googleapis.com/v0/b/cocha-turismo.appspot.com/o/foods%2Fsandwich%20chorizo.jfif?alt=media&token=25bb33c4-83bb-4d0e-9cee-f9c35f7f21cb","name":"Sándwich de chorizo","rating":5,"description":"El sándwich de chorizo es uno de las merien-das más saboreadas en nuestra ciudad a me-dia mañana.  Este delicioso bocadillo se lo puede encontrar tanto en restaurantes, sand-wicherías, así como en como en los comedores populares y ferias zonales de nuestro munici-pio.","ingredients":["Pan Frances","Chorizo","Ensalada (Lechuga, tomate, cebolla)","Llajua"],"order":30,"available":true},
    {"_id":"silpancho","coverUrl":"https://firebasestorage.googleapis.com/v0/b/cocha-turismo.appspot.com/o/foods%2Fsilpancho.webp?alt=media&token=b42d2c61-36e9-4d89-bbf5-eb5ff705b056","name":"Silpancho","rating":5,"description":"El Silpancho es un plato típico de la gastronomía boliviana compuesto por una base de arroz, carne de res empanizada, papas, ensalada y huevo frito. Esta deliciosa y abundante combinación de sabores y texturas es un plato muy popular en la región de Cochabamba y se considera una de las comidas más representativas de Bolivia.","ingredients":["Carne de res empanizada","Arroz","Papas","Ensalada (tomate, cebolla y lechuga)","Huevo frito"],"order":28,"available":true},
    {"_id":"sopamani","coverUrl":"https://firebasestorage.googleapis.com/v0/b/cocha-turismo.appspot.com/o/foods%2Fsopa%20de%20mani.jfif?alt=media&token=60c27c42-66ba-408f-a35e-228df0d81af7","name":"Sopa de maní","rating":5,"description":"De acuerdo  a varios historiadores, la cuna de origen de la sopa de maní es el Departamento de Cochabamba y se remonta al siglo XIX. La sopa de maní se ha convertido en el plato bandera de nuestro país porque es un plato que se prepara y cocina en las diferentes re-giones de nuestro país y ha trascendido fron-teras. ","ingredients":["Mani molido crudo","Caldo de res o vegetales","Carne","Zanahoria","Arvejas","Papa","Fideo","Especias"],"order":30,"available":true},
    {"_id":"sopas","coverUrl":"https://firebasestorage.googleapis.com/v0/b/cocha-turismo.appspot.com/o/foods%2Fsopas.jfif?alt=media&token=c40347d9-da4b-4983-a71f-e772b9922968","name":"Sopas","rating":5,"description":"Las sopas se han consumido durante siglos en diferentes culturas y son apreciadas por su capacidad de brindar nutrición, saciedad y sabor. Son platos versátiles que pueden adaptarse a diferentes gustos y preferencias culinarias.","ingredients":["Caldo de pollo o vegetales","Carne (opcional)","Pescado (opcional)","Verduras (zanahorias, cebolla, apio, etc.)","Ajo","Hierbas y especias (perejil, tomillo, laurel, etc.)","Sal y pimienta","Fideos o arroz (opcional)"],"order":50,"available":true},
    {"_id":"trancapecho","coverUrl":"https://firebasestorage.googleapis.com/v0/b/cocha-turismo.appspot.com/o/foods%2Ftrancapecho.webp?alt=media&token=c1d8b8ce-2688-4105-9e7b-7dcecf28177d","name":"Trancapecho","rating":5,"description":"El tranca pecho es la versión de un sandwich de silpancho, porque contiene arroz, papa, huevo, ensalada de zanahoria cocida, salsa de cebolla y tomate y locoto picado.","ingredients":["Pan","Carne de res empanizada","Arroz","Ensalada (Tomate, lechuga, cebolla)","Papas","Locoto"],"order":29,"available":true},
    {"_id":"vegetariana","coverUrl":"https://firebasestorage.googleapis.com/v0/b/cocha-turismo.appspot.com/o/foods%2Fcomida%20vegetariana%202.jfif?alt=media&token=1b1fe436-2638-42d2-bd61-15c76d55216d","rating":5,"description":"Son muy representativos de la gastronomía cochabambina, ya que son acompañantes ideales de las empanadas. Además, se las pueden encontrar en cualquier esquina los días de mucho calor y sobre todo los fines de semana, donde muchas tiendas o proveedoras instalan sus máquinas artesanales.","ingredients":["Vegetales variados","Legumbres","Tofu o tempeh","Cereales","Aceite de oliva","Hierbas y especias para sazonar"],"order":35,"available":true,"name":"Comida Vegana"}
  ];

  const slugify = (s) => String(s || '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const foods = RAW.map(item => ({
    id: item._id || slugify(item.name),
    name: item.name || item._id || 'Sin nombre',
    description: item.description || '',
    coverUrl: item.coverUrl || '',
    available: item.available !== false,
    rating: typeof item.rating === 'number' ? item.rating : 0,
    ingredients: Array.isArray(item.ingredients) ? item.ingredients : (Array.isArray(item.ingredientes) ? item.ingredientes : []),
    order: typeof item.order === 'number' ? item.order : 0
  }));

  localStorage.setItem(key, JSON.stringify(foods));
  console.log('Datos de ejemplo de comidas inicializados');
  return foods;
};

// Inicializa datos de ejemplo para Itinerarios
export const initializeSampleItineraries = () => {
  const key = 'vc_data_itineraries_v1';
  const existing = localStorage.getItem(key);
  if (existing) {
    try { const arr = JSON.parse(existing); if (Array.isArray(arr) && arr.length) return arr; } catch {}
  }
  const sample = [
    {
      id: 'carnaval-2024',
      title: 'Carnaval',
      cssClass: { mainColor: '', animation: 'confetti' },
      active: true,
      description: 'Sumérgete en el Carnaval de Cochabamba 2024, donde la cultura, la tradición y la diversión se fusionan en una celebración inolvidable. ¡Únete a nosotros en esta fiesta vibrante!',
      coverUrl: 'https://img.freepik.com/vector-gratis/fondo-carnaval-brasileno-degradado-carnaval_23-2150020891.jpg',
      order: 1,
      available: true,
      link: 'https://www.facebook.com/gamcochabamba',
      slug: '',
      eventList: [],
      duration: 'Del 18 Ene - 17 Feb'
    }
  ];
  localStorage.setItem(key, JSON.stringify(sample));
  console.log('Datos de ejemplo de itinerarios inicializados');
  return sample;
};