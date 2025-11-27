/**
 * 🔥 LIMPIADOR DE DATOS MOCK
 * 
 * Ejecuta este script en la consola del navegador (F12) 
 * para eliminar TODOS los datos mock del localStorage
 */

console.log('🔥 Limpiando datos MOCK del localStorage...');

// Lista de todas las keys que usaban datos mock
const mockKeys = [
  'vc_data_attractions_v1',
  'vc_data_restaurants_v1',
  'vc_data_events_v1',
  'vc_data_hotels_v1',
  'vc_data_announcements_v1',
  'vc_data_points_v1',
  'vc_data_foods_v1',
  'vc_data_itineraries_v1',
  'vc_cats_attractions_v1',
  'vc_cats_restaurants_v1',
  'vc_cats_main_v1',
  'vc_users',
  'vc_modules',
  'vc_sent_emails'
];

let removed = 0;
mockKeys.forEach(key => {
  if (localStorage.getItem(key)) {
    localStorage.removeItem(key);
    console.log(`✅ Eliminado: ${key}`);
    removed++;
  }
});

if (removed > 0) {
  console.log(`\n🎉 ${removed} datos mock eliminados exitosamente`);
  console.log('🔄 Recarga la página (F5) para ver los datos reales del backend');
} else {
  console.log('✅ No hay datos mock que eliminar');
}

console.log('\n📊 Datos actuales en localStorage:');
console.log('Keys restantes:', Object.keys(localStorage).filter(k => k.startsWith('vc_')));

export default function cleanMockData() {
  mockKeys.forEach(key => localStorage.removeItem(key));
  console.log('🔥 Datos mock eliminados');
}
