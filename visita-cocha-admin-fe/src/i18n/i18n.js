import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Importamos los recursos de idiomas
const resources = {
  es: {
    translation: {
      // Menú y navegación
      menu: {
        dashboard: 'Panel Principal',
        users: 'Usuarios',
        attractions: 'Atractivos Turísticos',
        restaurants: 'Restaurantes',
        events: 'Eventos',
        hotels: 'Hoteles',
        routes: 'Rutas Turísticas',
        points: 'Puntos de Interés',
        categories: 'Categorías',
        announcements: 'Anuncios',
        settings: 'Configuración'
      },

      // Acciones comunes
      actions: {
        create: 'Crear',
        edit: 'Editar',
        delete: 'Eliminar',
        save: 'Guardar',
        cancel: 'Cancelar',
        confirm: 'Confirmar',
        search: 'Buscar',
        filter: 'Filtrar',
        view: 'Ver',
        upload: 'Subir',
        download: 'Descargar',
        close: 'Cerrar',
        back: 'Volver'
      },

      // Mensajes de estado
      status: {
        loading: 'Cargando...',
        saving: 'Guardando...',
        success: 'Operación exitosa',
        error: 'Ha ocurrido un error',
        notFound: 'No encontrado',
        unauthorized: 'No autorizado',
        forbidden: 'Acceso denegado'
      },

      // Formularios
      forms: {
        required: 'Campo requerido',
        invalid: 'Campo inválido',
        min: 'Mínimo {{min}} caracteres',
        max: 'Máximo {{max}} caracteres',
        email: 'Email inválido',
        password: 'Contraseña inválida',
        passwordMatch: 'Las contraseñas no coinciden',
        selectOption: 'Seleccione una opción'
      },

      // Roles
      roles: {
        superadmin: 'Super Administrador',
        admin: 'Administrador',
        mantenedor: 'Mantenedor'
      },

      // Módulos específicos
      modules: {
        attractions: {
          title: 'Atractivos Turísticos',
          name: 'Nombre',
          description: 'Descripción',
          location: 'Ubicación',
          category: 'Categoría',
          schedule: 'Horario',
          contact: 'Contacto'
        },
        restaurants: {
          title: 'Restaurantes',
          name: 'Nombre',
          cuisine: 'Tipo de Cocina',
          priceRange: 'Rango de Precios',
          schedule: 'Horario',
          menu: 'Menú'
        },
        events: {
          title: 'Eventos',
          name: 'Nombre',
          date: 'Fecha',
          location: 'Ubicación',
          price: 'Precio',
          capacity: 'Capacidad'
        }
      },

      // Validaciones
      validation: {
        required: 'Este campo es requerido',
        email: 'Ingrese un email válido',
        minLength: 'Debe tener al menos {{min}} caracteres',
        maxLength: 'Debe tener máximo {{max}} caracteres',
        passwordMatch: 'Las contraseñas deben coincidir',
        integer: 'Debe ser un número entero',
        positive: 'Debe ser un número positivo'
      }
    }
  },
  en: {
    translation: {
      // English translations (similar structure)
    }
  },
  qu: {
    translation: {
      // Quechua translations (similar structure)
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'es', // idioma por defecto
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;