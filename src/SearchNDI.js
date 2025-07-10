import React, { useState, useMemo } from "react";

export default function SearchNDI({ offers }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});
  
  console.log("SearchNDI offers:", offers);
  
  // Fonction améliorée pour extraire récursivement toutes les offres
  const extractOffers = (data) => {
    const results = [];
    
    const traverse = (obj, parentPath = [], parentInfo = {}) => {
      if (!obj || typeof obj !== 'object') return;
      
      // Si c'est un objet offre (contient idoffer)
      if (obj.idoffer) {
        results.push({
          ...obj,
          _path: parentPath.join(' > '),
          _parentNames: parentPath,
          _parentInfo: parentInfo
        });
        return;
      }
      
      // Traverser les propriétés
      Object.keys(obj).forEach(key => {
        const value = obj[key];
        
        if (key === 'list' && value && typeof value === 'object') {
          // Parcourir les éléments de la liste
          Object.keys(value).forEach(subKey => {
            const subValue = value[subKey];
            if (subValue && typeof subValue === 'object') {
              const newPath = obj.name ? [...parentPath, obj.name] : parentPath;
              const newParentInfo = {
                ...parentInfo,
                section: obj.section || parentInfo.section,
                section_parent: obj.section_parent || parentInfo.section_parent,
                name: obj.name || parentInfo.name
              };
              traverse(subValue, newPath, newParentInfo);
            }
          });
        } else if (Array.isArray(value)) {
          // Traiter les tableaux
          value.forEach((item, index) => {
            if (item && typeof item === 'object') {
              traverse(item, parentPath, parentInfo);
            }
          });
        } else if (value && typeof value === 'object' && key !== 'address' && key !== 'endpoint' && key !== 'info') {
          // Continuer la traversée pour les autres objets (éviter certains objets techniques)
          traverse(value, parentPath, parentInfo);
        }
      });
    };
    
    // Commencer la traversée
    if (Array.isArray(data)) {
      data.forEach(item => traverse(item, [], {}));
    } else {
      traverse(data, [], {});
    }
    
    return results;
  };
  
  // Traitement des données reçues
  const processedData = useMemo(() => {
    if (!offers) {
      return { ndi: "Aucune donnée", resultsList: [], sections: {}, metadata: {} };
    }
    
    let resultsList = [];
    let sections = {};
    let metadata = {};
    
    // Extraire les métadonnées si disponibles
    if (offers.address) {
      metadata.address = offers.address;
    }
    if (offers.info) {
      metadata.info = offers.info;
    }
    if (offers.endpoint) {
      metadata.endpoint = offers.endpoint;
    }
    
    // Si les données sont dans un tableau 'data'
    const dataToProcess = offers.data || offers;
    
    // Extraire les offres
    resultsList = extractOffers(dataToProcess);
    
    // Organiser par sections
    resultsList.forEach(offer => {
      const sectionName = offer.section || offer.section_parent || offer._parentInfo?.section || offer._parentNames[0] || 'Non classé';
      if (!sections[sectionName]) {
        sections[sectionName] = [];
      }
      sections[sectionName].push(offer);
    });
    
    return {
      ndi: offers.name || metadata.address?.cityName || "Résultats de recherche",
      ndi_status: "Active",
      date: new Date().toISOString(),
      resultsList,
      sections,
      metadata
    };
  }, [offers]);
  
  // Si aucune donnée valide n'est trouvée
  if (!offers) {
    return (
      <div className="w-full min-h-screen p-6 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto bg-gray-800 rounded-xl shadow-lg p-6 border border-red-500/30">
          <h1 className="text-2xl font-bold text-red-400 mb-4">
            Erreur
          </h1>
          <p className="text-gray-300">Aucune donnée disponible</p>
        </div>
      </div>
    );
  }

  const handleItemSelect = (item) => {
    setSelectedItem(item);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedItem(null);
  };

  const toggleSection = (sectionName) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionName]: !prev[sectionName]
    }));
  };

  // Fonction pour formater le prix
  const formatPrice = (price) => {
    if (!price || price === 0 || price === "0") return "Gratuit";
    return `${price}€`;
  };

  return (
    <div className="w-full min-h-screen p-6 bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* En-tête avec informations de localisation */}
        <div 
          className="bg-gray-800 rounded-xl shadow-lg p-6 border border-green-500/30"
        >
          <h1 className="text-2xl font-bold text-green-400 mb-4 flex items-center">
            🔍 Résultats de la recherche
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600/30">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Localisation
              </label>
              <div className="bg-gray-800/50 p-3 rounded-md border border-gray-600/50">
                <span className="text-green-400 font-mono">
                  {processedData.metadata.address ? 
                    `${processedData.metadata.address.cityName} (${processedData.metadata.address.cityZip})` : 
                    processedData.ndi}
                </span>
              </div>
            </div>
            
            <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600/30">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Type de site
              </label>
              <div className="bg-gray-800/50 p-3 rounded-md border border-gray-600/50">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  processedData.metadata.info?.fiber ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'
                }`}>
                  {processedData.metadata.info?.site || 'Non spécifié'}
                </span>
              </div>
            </div>
            
            <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600/30">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Date de recherche
              </label>
              <div className="bg-gray-800/50 p-3 rounded-md border border-gray-600/50">
                <span className="text-purple-400">
                  {new Date(processedData.date).toLocaleDateString('fr-FR')}
                </span>
              </div>
            </div>
            
            <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600/30">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Nombre d'offres
              </label>
              <div className="bg-gray-800/50 p-3 rounded-md border border-gray-600/50">
                <span className="text-orange-400 font-bold text-lg">{processedData.resultsList.length}</span>
              </div>
            </div>
          </div>
          
          {/* Informations techniques */}
          {processedData.metadata.info && (
            <div className="mt-4 p-4 bg-gray-700/30 rounded-lg border border-gray-600/30">
              <h3 className="text-sm font-semibold text-gray-300 mb-2">Informations techniques</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                {processedData.metadata.info.nra && (
                  <div>
                    <span className="text-gray-400">NRA:</span>
                    <span className="ml-2 text-white font-mono">{processedData.metadata.info.nra}</span>
                  </div>
                )}
                {processedData.metadata.info.nb_copper_pairs_available !== undefined && (
                  <div>
                    <span className="text-gray-400">Paires cuivre disponibles:</span>
                    <span className="ml-2 text-white">{processedData.metadata.info.nb_copper_pairs_available}</span>
                  </div>
                )}
                {processedData.metadata.info.wires && processedData.metadata.info.wires.length > 0 && (
                  <div>
                    <span className="text-gray-400">Ligne:</span>
                    <span className="ml-2 text-white">
                      {processedData.metadata.info.wires[0].caliber}mm - {processedData.metadata.info.wires[0].length}m
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Affichage des offres par section */}
        {Object.keys(processedData.sections).length > 0 ? (
          <div className="space-y-4">
            {Object.entries(processedData.sections).map(([sectionName, offers]) => (
              <div 
                key={sectionName}
                className="bg-gray-800 rounded-xl shadow-lg border border-blue-500/30"
              >
                <div 
                  className="p-6 cursor-pointer hover:bg-gray-700/30 transition-colors"
                  onClick={() => toggleSection(sectionName)}
                >
                  <h2 className="text-xl font-bold text-blue-400 mb-2 flex items-center justify-between">
                    📦 {sectionName} ({offers.length} offre{offers.length > 1 ? 's' : ''})
                    <span className="text-sm">
                      {expandedSections[sectionName] ? '▼' : '▶'}
                    </span>
                  </h2>
                </div>
                
                {(expandedSections[sectionName] || Object.keys(processedData.sections).length === 1) && (
                  <div className="px-6 pb-6 space-y-4">
                    {offers.map((item, index) => (
                      <div
                        key={item.idoffer || index}
                        className="bg-gray-700/50 p-4 rounded-lg border border-gray-600/30 hover:border-green-400/30 transition-all duration-300 cursor-pointer transform hover:scale-[1.01]"
                        onClick={() => handleItemSelect(item)}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className="lg:col-span-2">
                            <label className="block text-sm font-medium text-gray-400 mb-1">
                              Nom de l'offre
                            </label>
                            <div className="bg-gray-800/50 p-2 rounded border border-gray-600/50">
                              <span className="text-white font-medium">
                                {item.offer || item.retailer_repackaging || item.name || "N/A"}
                              </span>
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">
                              Débit
                            </label>
                            <div className="bg-gray-800/50 p-2 rounded border border-gray-600/50">
                              <span className="text-green-400 font-bold">
                                {item.debit || "N/A"}
                              </span>
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">
                              Prix mensuel
                            </label>
                            <div className="bg-gray-800/50 p-2 rounded border border-gray-600/50">
                              <span className="text-yellow-400 font-bold">
                                {formatPrice(item.amt_recur)}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">
                              Frais d'activation
                            </label>
                            <div className="bg-gray-800/50 p-2 rounded border border-gray-600/50">
                              <span className="text-orange-400">
                                {formatPrice(item.amt_fee)}
                              </span>
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">
                              Engagement
                            </label>
                            <div className="bg-gray-800/50 p-2 rounded border border-gray-600/50">
                              <span className="text-purple-400">
                                {item.engagement || "N/A"}
                              </span>
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">
                              Fournisseur
                            </label>
                            <div className="bg-gray-800/50 p-2 rounded border border-gray-600/50">
                              <span className="text-blue-400">
                                {item.provider || "N/A"}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="text-xs text-gray-400">
                              <span className="font-medium">Référence:</span> {item.reference || item.retailer_reference || "N/A"}
                            </div>
                            {item.customer && (
                              <div className="text-xs text-gray-400">
                                <span className="font-medium">Client:</span> {item.customer}
                              </div>
                            )}
                          </div>
                          <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                            Voir détails →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div 
            className="bg-gray-800 rounded-xl shadow-lg p-12 border border-yellow-500/30 text-center"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-xl text-gray-400 mb-2">Aucune offre trouvée</h2>
            <p className="text-sm text-gray-500">
              Aucune offre n'a été trouvée dans les données fournies
            </p>
          </div>
        )}

        {/* Modal de détails */}
        {showDetails && selectedItem && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleCloseDetails}
          >
            <div 
              className="bg-gray-800 rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-green-400/30"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-green-400">
                  📋 Détails de l'offre
                </h3>
                <button 
                  onClick={handleCloseDetails}
                  className="text-gray-400 hover:text-white text-xl font-bold"
                >
                  ✕
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Nom de l'offre
                    </label>
                    <div className="bg-gray-700/50 p-3 rounded-lg border border-gray-600/50">
                      <span className="text-white font-medium">
                        {selectedItem.offer || selectedItem.retailer_repackaging || "N/A"}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Référence
                    </label>
                    <div className="bg-gray-700/50 p-3 rounded-lg border border-gray-600/50">
                      <span className="text-gray-300 font-mono">
                        {selectedItem.reference || selectedItem.retailer_reference || "N/A"}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Débit
                    </label>
                    <div className="bg-gray-700/50 p-3 rounded-lg border border-gray-600/50">
                      <span className="text-green-400 font-bold">
                        {selectedItem.debit || "N/A"}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Fournisseur
                    </label>
                    <div className="bg-gray-700/50 p-3 rounded-lg border border-gray-600/50">
                      <span className="text-blue-400">
                        {selectedItem.provider || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Prix mensuel
                    </label>
                    <div className="bg-gray-700/50 p-3 rounded-lg border border-gray-600/50">
                      <span className="text-yellow-400 font-bold text-lg">
                        {formatPrice(selectedItem.amt_recur)}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Frais d'activation
                    </label>
                    <div className="bg-gray-700/50 p-3 rounded-lg border border-gray-600/50">
                      <span className="text-orange-400 font-bold">
                        {formatPrice(selectedItem.amt_fee)}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Frais de résiliation
                    </label>
                    <div className="bg-gray-700/50 p-3 rounded-lg border border-gray-600/50">
                      <span className="text-red-400">
                        {formatPrice(selectedItem.amt_resil)}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Engagement
                    </label>
                    <div className="bg-gray-700/50 p-3 rounded-lg border border-gray-600/50">
                      <span className="text-purple-400">
                        {selectedItem.engagement || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Informations supplémentaires */}
              <div className="mt-6 p-4 bg-gray-700/30 rounded-lg border border-gray-600/30">
                <h4 className="text-lg font-semibold text-purple-400 mb-3">
                  Informations complémentaires
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  {selectedItem.section && (
                    <div>
                      <span className="text-gray-400">Section:</span> 
                      <span className="ml-2 text-white">{selectedItem.section}</span>
                    </div>
                  )}
                  {selectedItem.customer && (
                    <div>
                      <span className="text-gray-400">Client:</span> 
                      <span className="ml-2 text-white">{selectedItem.customer}</span>
                    </div>
                  )}
                  {selectedItem.date_begin && (
                    <div>
                      <span className="text-gray-400">Date de début:</span> 
                      <span className="ml-2 text-white">{selectedItem.date_begin}</span>
                    </div>
                  )}
                  {selectedItem.periodicity && (
                    <div>
                      <span className="text-gray-400">Périodicité:</span> 
                      <span className="ml-2 text-white">{selectedItem.periodicity}</span>
                    </div>
                  )}
                  {selectedItem.eligibility_reference && (
                    <div>
                      <span className="text-gray-400">Référence éligibilité:</span> 
                      <span className="ml-2 text-white font-mono text-xs">{selectedItem.eligibility_reference}</span>
                    </div>
                  )}
                  {selectedItem.availability_begin && (
                    <div>
                      <span className="text-gray-400">Disponible depuis:</span> 
                      <span className="ml-2 text-white">{selectedItem.availability_begin}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}