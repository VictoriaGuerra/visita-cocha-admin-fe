import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import BaseList from '../UI/BaseList';
import BaseForm from '../UI/BaseForm';
import { LANGUAGES } from '../../config/moduleTypes';

const LanguageManager = () => {
  const { t, i18n } = useTranslation();
  const [translations, setTranslations] = useState({});
  const [selectedLanguage, setSelectedLanguage] = useState('es');
  const [selectedModule, setSelectedModule] = useState('common');
  const [editingKey, setEditingKey] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTranslations();
  }, [selectedLanguage, selectedModule]);

  const loadTranslations = async () => {
    try {
      setLoading(true);
      // Aquí irá la llamada a tu API para cargar las traducciones
      const response = await fetch(`/api/translations/${selectedLanguage}/${selectedModule}`);
      const data = await response.json();
      setTranslations(data);
    } catch (err) {
      console.error('Error al cargar traducciones:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTranslation = async (key, value) => {
    try {
      // Aquí irá la llamada a tu API para guardar la traducción
      await fetch(`/api/translations/${selectedLanguage}/${selectedModule}/${key}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ value })
      });
      
      // Actualizar el estado local
      setTranslations(prev => ({
        ...prev,
        [key]: value
      }));
      setEditingKey(null);
    } catch (err) {
      console.error('Error al guardar traducción:', err);
    }
  };

  const modules = [
    { id: 'common', name: 'Común' },
    { id: 'auth', name: 'Autenticación' },
    { id: 'dashboard', name: 'Panel Principal' },
    { id: 'attractions', name: 'Atractivos Turísticos' },
    { id: 'restaurants', name: 'Restaurantes' },
    { id: 'events', name: 'Eventos' },
    { id: 'hotels', name: 'Hoteles' },
    { id: 'routes', name: 'Rutas' }
  ];

  return (
    <div className="language-manager">
      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-bold">Gestión de Idiomas</h2>
          
          <div className="flex gap-4">
            <select
              className="form-control"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
            >
              {LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>

            <select
              className="form-control"
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
            >
              {modules.map(module => (
                <option key={module.id} value={module.id}>
                  {module.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="card-body">
          {loading ? (
            <div className="loading">Cargando traducciones...</div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Clave</th>
                  <th>Traducción</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(translations).map(([key, value]) => (
                  <tr key={key}>
                    <td className="font-mono text-sm">{key}</td>
                    <td>
                      {editingKey === key ? (
                        <input
                          type="text"
                          className="form-control"
                          value={value}
                          onChange={(e) => setTranslations(prev => ({
                            ...prev,
                            [key]: e.target.value
                          }))}
                          onBlur={() => handleSaveTranslation(key, value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleSaveTranslation(key, value);
                            }
                          }}
                          autoFocus
                        />
                      ) : (
                        <span 
                          className="block p-2 hover:bg-gray-50 cursor-pointer"
                          onClick={() => setEditingKey(key)}
                        >
                          {value}
                        </span>
                      )}
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => setEditingKey(key)}
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Vista previa de traducciones */}
      <div className="card mt-6">
        <div className="card-header">
          <h3 className="text-lg font-semibold">Vista Previa</h3>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-2 gap-4">
            {modules.map(module => (
              <div key={module.id} className="preview-card">
                <h4 className="font-semibold mb-2">{module.name}</h4>
                <div className="p-4 bg-gray-50 rounded">
                  {/* Aquí irían ejemplos de uso de las traducciones */}
                  <p>{t(`${module.id}.title`)}</p>
                  <p>{t(`${module.id}.description`)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageManager;