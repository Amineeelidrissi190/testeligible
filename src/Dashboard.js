import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Typewriter } from 'react-simple-typewriter';
import AllOffer from "./AllOffer";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import SearchNDI from "./SearchNDI";


export default function Dashboard() {
  const [randomTags, setRandomTags] = useState([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [lenoffer, setlenoffer] = useState(0);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // États pour les étapes de l'API
  const [iso_alpha2, setiso_alpha2] = useState('');
  const [countryData, setCountryData] = useState(null);
  const [zip, setzip] = useState('');
  const [townData, setTownData] = useState(null);
  const [selectedTown, setSelectedTown] = useState(null);
  const [street, setstreet] = useState('');
  const [streetData, setStreetData] = useState(null);
  const [selectedStreet, setSelectedStreet] = useState(null);
  const [number, setnumber] = useState(null);
  const [houseNumberData, setHouseNumberData] = useState(null);
  const [selectedHouseNumber, setSelectedHouseNumber] = useState(null);
  const [ndiData, setNdiData] = useState(null);
  const [eligibilityData, setEligibilityData] = useState(null);

  // États pour la recherche NDI
  const [ndiSearch, setNdiSearch] = useState('');
  const [ndiStatus, setNdiStatus] = useState('active');

  const navigate = useNavigate();

  // Étape 1 : Récupération des informations d'un pays
  const handleGetCountry = async (isoCode) => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      const response = await axios.get(
        `ema/api/v1/endpoint/country/?iso_alpha2=${isoCode.toLowerCase()}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setCountryData(response.data);
      console.log('Étape 1 - Pays:', response.data);
      return response.data;
    } catch (err) {
      setError("Code ISO invalide ou erreur serveur.");
      console.error('Erreur étape 1:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Étape 2 : Récupération des informations d'une ville
  const handleGetTown = async (isoCode, zipCode) => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      const response = await axios.get(
        `ema/api/v1/endpoint/town/?iso_alpha2=${isoCode.toLowerCase()}&zip=${zipCode}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setTownData(response.data);
      console.log('Étape 2 - Ville:', response.data);
      return response.data;
    } catch (err) {
      setError("Code ZIP invalide ou erreur serveur.");
      console.error('Erreur étape 2:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Étape 3 : Récupération des informations d'une voie
  const handleGetStreet = async (idtown, streetName) => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      const response = await axios.get(
        `ema/api/v1/endpoint/street/?idtown=${idtown}&street=${streetName}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setStreetData(response.data);
      console.log('Étape 3 - Rue:', response.data);
      return response.data;
    } catch (err) {
      setError("Nom de rue invalide ou erreur serveur.");
      console.error('Erreur étape 3:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Étape 4 : Récupération des informations d'un numéro dans une voie
const handleGetHouseNumber = async (isoCode, idtown, idstreet, houseNumber = null) => {
  try {
    //
    if (!isoCode || !idtown || !idstreet) {
      console.error("Paramètres manquants pour l'étape houseNumber.");
      setError("Veuillez d'abord sélectionner le pays, la ville et la rue.");
      return null;
    }

    setLoading(true);
    setError(null);

    // Construction dynamique de l'URL
    let url = `ema/api/v1/endpoint/housenumber/?iso_alpha2=${isoCode.toLowerCase()}&idtown=${idtown}&idstreet=${idstreet}&number=${number}`;
    
    const token = localStorage.getItem('token');

    console.log("🔍 Requête GET vers :", url);

    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    if (Array.isArray(response.data) && response.data.length > 0) {
      setHouseNumberData(response.data);
      console.log("Résultat étape 4 - Numéros trouvés :", response.data);
      return response.data;
    } else {
      setError("Aucun numéro trouvé pour cette voie.");
      console.warn(" Aucune donnée retournée.");
      return [];
    }

  } catch (err) {
    console.error(" Erreur lors de l'appel à /housenumber :", err);
    setError("Erreur lors de la récupération des numéros.");
    return null;
  } finally {
    setLoading(false);
  }
};


  // Étape 5 : Récupération des informations d'un NDI
  const handleGetNDI = async (ndi, ndiStatus) => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      const response = await axios.get(
        `ema/api/v1/endpoint/ndi/?ndi=${ndi}&ndi_status=${ndiStatus}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setNdiData(response.data);
      console.log('Étape 5 - NDI:', response.data);
      return response.data;
    } catch (err) {
      setError("NDI invalide ou erreur serveur.");
      console.error('Erreur étape 5:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Étape 6 : Vérification de l'éligibilité
  const handleGetEligibility = async (params) => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');

      // Méthode GET pour éligibilité standard
      if (params.method === 'GET') {
        const queryParams = new URLSearchParams();
        Object.keys(params).forEach(key => {
          if (params[key] && key !== 'method') {
            queryParams.append(key, params[key]);
          }
        });

        const response = await axios.get(
          `ema/api/v1/retailer_eligibility/?${queryParams.toString()}`,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          }
        );

        setEligibilityData(response.data);
        console.log('Étape 6 - Éligibilité:', response.data);
        return response.data;
      }

      // Méthode POST pour éligibilité par opérateurs et catégories
      if (params.method === 'POST') {
        const response = await axios.post(
          'ema/api/v1/retailer_eligibility/',
          params,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          }
        );

        setEligibilityData(response.data);
        console.log('Étape 6 - Éligibilité POST:', response.data);
        return response.data;
      }

    } catch (err) {
      setError("Erreur lors de la vérification d'éligibilité.");
      console.error('Erreur étape 6:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour rechercher par NDI directement
  const handleNDISearch = async () => {
    if (!ndiSearch.trim()) {
      setError("Veuillez entrer un NDI.");
      return;
    }

    const result = await handleGetNDI(ndiSearch, ndiStatus);
    if (result && result.response) {
      setOffers(result.data.list || []);
      setlenoffer(result.data.list ? result.data.list.length : 0);
      setShowSearchResults(true);
    }
  };

  // Fonction pour le processus complet étape par étape
  const handleFullProcess = async () => {
    if (!iso_alpha2 || !zip || !street || !number) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    try {
      // Étape 1 : Récupérer les infos du pays
      const countryResult = await handleGetCountry(iso_alpha2);
      if (!countryResult) return;

      // Étape 2 : Récupérer les infos de la ville
      const townResult = await handleGetTown(countryResult.iso_alpha2, zip);
      if (!townResult || !townResult.length) return;

      const firstTown = townResult[0];
      setSelectedTown(firstTown);

      // Étape 3 : Récupérer les infos de la rue
      const streetResult = await handleGetStreet(firstTown.idtown, street);
      if (!streetResult || !streetResult.length) return;

      const firstStreet = streetResult[0];
      setSelectedStreet(firstStreet);

      // Étape 4 : Récupérer les infos du numéro
      const houseNumberResult = await handleGetHouseNumber(
        countryResult.iso_alpha2,
        firstTown.idtown,
        firstStreet.idstreet,
        parseInt(number)
      );
      if (!houseNumberResult || !houseNumberResult.length) return;

      const firstHouseNumber = houseNumberResult[0];
      setSelectedHouseNumber(firstHouseNumber);

      // Étape 6 : Vérifier l'éligibilité
      const eligibilityParams = {
        method: 'GET',
        ndi: ndiSearch || undefined,
        ndi_status: ndiStatus,
        idtown: firstTown.idtown,
        street: firstStreet.street,
        number: number,
        latitude: firstHouseNumber.lat,
        longitude: firstHouseNumber.lon,
        hexacle: firstHouseNumber.hexacle
      };

      const eligibilityResult = await handleGetEligibility(eligibilityParams);
      if (eligibilityResult && eligibilityResult.response) {
        setOffers(eligibilityResult.data || []);
        setlenoffer(eligibilityResult.data ? eligibilityResult.data.length : 0);
        setShowSearchResults(true);
      }

    } catch (err) {
      console.error('Erreur processus complet:', err);
      setError("Erreur lors du processus complet.");
    }
  };

  // Handlers pour les champs
  const handleCountryBlur = async () => {
    if (iso_alpha2.trim()) {
      await handleGetCountry(iso_alpha2);
    }
  };

  const handleZipBlur = async () => {
    if (zip.trim() && countryData) {
      await handleGetTown(countryData.iso_alpha2, zip);
    }
  };

  const handleStreetBlur = async () => {
    if (street.trim() && selectedTown) {
      await handleGetStreet(selectedTown.idtown, street);
    }
  };

  const handleNumberBlur = async () => {
    
 
      await handleGetHouseNumber(
        countryData.iso_alpha2,
        selectedTown.idtown,
        selectedStreet.idstreet,
        number
      );
    
  };

  const lengthOffers = (e) => {
    setlenoffer(e);
  };

  // Tags animés pour l'arrière-plan
  const codeTags = [
    { text: "<dashboard />", color: "text-pink-400" },
    { text: "<analytics />", color: "text-purple-400" },
    { text: "<monitoring />", color: "text-red-400" },
    { text: "<system />", color: "text-cyan-300" },
    { text: "<status />", color: "text-yellow-300" },
    { text: "<data />", color: "text-green-400" },
    { text: "<metrics />", color: "text-blue-400" },
    { text: "<alerts />", color: "text-orange-400" }
  ];

  // Générer des positions aléatoires pour les tags
  const generateRandomTags = () => {
    return codeTags.map((tag) => {
      const randomX = Math.floor(Math.random() * 80) - 40;
      const randomY = Math.floor(Math.random() * 80) - 40;

      const animX = [
        randomX,
        randomX + Math.random() * 60 - 30,
        randomX + Math.random() * 60 - 30,
        randomX
      ];

      const animY = [
        randomY,
        randomY + Math.random() * 60 - 30,
        randomY + Math.random() * 60 - 30,
        randomY
      ];

      const duration = 15 + Math.random() * 10;

      return {
        ...tag,
        initialX: randomX,
        initialY: randomY,
        animX,
        animY,
        duration,
        delay: Math.random() * 3,
      };
    });
  };

  useEffect(() => {
    setRandomTags(generateRandomTags());
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Fonction pour réinitialiser les filtres
  const resetFilters = () => {
    setiso_alpha2('');
    setzip('');
    setstreet('');
    setnumber('');
    setNdiSearch('');
    setNdiStatus('active');
    setCountryData(null);
    setTownData(null);
    setSelectedTown(null);
    setStreetData(null);
    setSelectedStreet(null);
    setHouseNumberData(null);
    setSelectedHouseNumber(null);
    setNdiData(null);
    setEligibilityData(null);
    setOffers([]);
    setShowSearchResults(false);
    setError(null);
  };

  // Fonction pour retourner à la vue AllOffer
  const backToAllOffers = () => {
    setShowSearchResults(false);
    setOffers([]);
    resetFilters();
  };

  return (
    <div className="min-h-screen w-full bg-gray-900 relative overflow-hidden">
  {/* Tags animés d'arrière-plan */}
  {randomTags.map((tag, index) => (
    <motion.div
      key={index}
      className={`${tag.color} font-mono text-xs md:text-sm absolute z-0 opacity-30 select-none`}
      style={{
        left: '50%',
        top: '50%'
      }}
      initial={{
        x: tag.initialX + 'vw',
        y: tag.initialY + 'vh',
        opacity: 0.2
      }}
      animate={{
        x: tag.animX.map(x => x + 'vw'),
        y: tag.animY.map(y => y + 'vh'),
        opacity: [0.2, 0.4, 0.2]
      }}
      transition={{
        duration: tag.duration,
        repeat: Infinity,
        repeatType: "reverse",
        delay: tag.delay,
        ease: "easeInOut"
      }}
    >
      {tag.text}
    </motion.div>
  ))}

  {/* Header */}
  <motion.header
    className="relative z-10 bg-gray-800/80 backdrop-blur-sm border-b border-green-400/20 shadow-lg shadow-green-400/10"
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
  >
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-green-400">
            <Typewriter
              words={['Dashboard', 'Control Panel', 'Command Center']}
              loop={true}
              cursor
              cursorStyle="_"
              typeSpeed={100}
              deleteSpeed={80}
              delaySpeed={2000}
            />
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* Bouton retour si on est dans la vue de recherche */}
          {showSearchResults && (
            <motion.button
              onClick={backToAllOffers}
              className="px-4 py-2 bg-gray-500/20 text-gray-400 border border-gray-400/20 rounded-lg hover:bg-gray-500/30 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ← Retour
            </motion.button>
          )}

          {/* Champ de recherche rapide pour NDI */}
          <div className="relative">
            <input
              type="text"
              placeholder="NDI..."
              value={ndiSearch}
              onChange={(e) => setNdiSearch(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleNDISearch()}
              className="bg-gray-700/50 text-white px-4 py-2 rounded-lg border border-gray-600/50 focus:border-green-400/50 focus:outline-none transition-all duration-300 text-sm"
            />
          </div>

          {/* Bouton de filtrage */}
          <motion.button
            onClick={() => setShowFilterModal(true)}
            className="px-4 py-2 bg-blue-500/20 text-blue-400 border border-blue-400/20 rounded-lg hover:bg-blue-500/30 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🔍 Filtres
          </motion.button>

          {/* Bouton de recherche NDI */}
          <motion.button
            onClick={handleNDISearch}
            disabled={loading}
            className="px-4 py-2 bg-green-500/20 text-green-400 border border-green-400/20 rounded-lg hover:bg-green-500/30 transition-all duration-300 disabled:opacity-50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {loading ? '🔄' : '🔍 NDI'}
          </motion.button>

          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-400/20 rounded-lg hover:bg-red-500/30 transition-all duration-300"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  </motion.header>

  {/* Indicateur de chargement */}
  {loading && (
    <div className="relative z-10 flex justify-center py-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
    </div>
  )}

  {/* Affichage des erreurs */}
  {error && (
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="bg-red-500/20 border border-red-400/20 rounded-lg p-4 text-red-400">
        ⚠️ {error}
      </div>
    </div>
  )}

  {/* Contenu principal */}
  <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      <motion.div
        className="bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl border border-green-400/20 shadow-lg shadow-green-400/10"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">
              {showSearchResults ? 'Résultats de recherche' : 'Offers lists'}
            </p>
            <p className="text-2xl font-bold text-green-400">{lenoffer}</p>
          </div>
          {loading && (
            <div className="animate-pulse">
              <div className="h-4 bg-green-400/20 rounded"></div>
            </div>
          )}
        </div>
      </motion.div>

      
    </motion.div>
  </div>

  {/* Modal de filtrage */}
  {showFilterModal && (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => setShowFilterModal(false)}
    >
      <motion.div
        className="bg-gray-800/95 backdrop-blur-sm p-8 rounded-xl border border-green-400/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-green-400">🔍 Recherche par adresse</h3>
          <button
            onClick={() => setShowFilterModal(false)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          {/* Recherche directe par NDI */}
          <div className="bg-gray-700/30 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-blue-400 mb-3">Recherche directe par NDI</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">NDI</label>
                <input
                  type="text"
                  placeholder="Entrez le NDI..."
                  value={ndiSearch}
                  onChange={(e) => setNdiSearch(e.target.value)}
                  className="w-full bg-gray-700/50 text-white px-4 py-3 rounded-lg border border-gray-600/50 focus:border-green-400/50 focus:outline-none transition-all duration-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Statut NDI</label>
                <select
                  value={ndiStatus}
                  onChange={(e) => setNdiStatus(e.target.value)}
                  className="w-full bg-gray-700/50 text-white px-4 py-3 rounded-lg border border-gray-600/50 focus:border-green-400/50 focus:outline-none transition-all duration-300"
                >
                  <option value="active">Actif</option>
                  <option value="inactive">Inactif</option>
                  <option value="pending">En attente</option>
                </select>
              </div>
            </div>
            <button
              onClick={handleNDISearch}
              disabled={loading}
              className="mt-4 w-full px-4 py-3 bg-blue-500/20 text-blue-400 border border-blue-400/20 rounded-lg hover:bg-blue-500/30 transition-all duration-300 disabled:opacity-50"
            >
              {loading ? '🔄 Recherche...' : '🔍 Rechercher par NDI'}
            </button>
          </div>

          <div className="border-t border-gray-600/50 pt-6">
            <h4 className="text-lg font-semibold text-green-400 mb-3">Recherche par adresse (Processus complet)</h4>

            {/* Pays */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Pays (Code ISO) {countryData && <span className="text-green-400">✓ {countryData.country}</span>}
              </label>
              <input
                type="text"
                placeholder="Ex: FR"
                value={iso_alpha2}
                onChange={(e) => setiso_alpha2(e.target.value)}
                onBlur={handleCountryBlur}
                className="w-full bg-gray-700/50 text-white px-4 py-3 rounded-lg border border-gray-600/50 focus:border-green-400/50 focus:outline-none transition-all duration-300"
              />
            </div>

            {/* ZIP */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Code Postal {townData && <span className="text-green-400">✓ {townData.length} ville(s) trouvée(s)</span>}
              </label>
              <input
                type="text"
                placeholder="Entrez le code postal..."
                value={zip}
                onChange={(e) => setzip(e.target.value)}
                onBlur={handleZipBlur}
                className="w-full bg-gray-700/50 text-white px-4 py-3 rounded-lg border border-gray-600/50 focus:border-green-400/50 focus:outline-none transition-all duration-300"
              />
              {/* Afficher les villes trouvées */}
              {townData && townData.length > 0 && (
                <div className="mt-2 p-2 bg-gray-600/30 rounded text-sm">
                  <p className="text-gray-300">Villes trouvées:</p>
                  {townData.map((town, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedTown(town)}
                      className={`block w-full text-left px-2 py-1 rounded mt-1 ${
                        selectedTown?.idtown === town.idtown
                          ? 'bg-green-500/20 text-green-400'
                          : 'hover:bg-gray-500/20 text-gray-300'
                      }`}
                    >
                      {town.town} (ID: {town.idtown})
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Rue */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nom de la rue {streetData && streetData.length > 0 && <span className="text-green-400">✓ {streetData.length} rue(s) trouvée(s)</span>}
              </label>
              <input
                type="text"
                placeholder="Entrez le nom de la rue..."
                value={street}
                onChange={(e) => setstreet(e.target.value)}
                onBlur={handleStreetBlur}
                // disabled={!selectedTown}
                className="w-full bg-gray-700/50 text-white px-4 py-3 rounded-lg border border-gray-600/50 focus:border-green-400/50 focus:outline-none transition-all duration-300 disabled:opacity-50"
              />
              {/* Afficher les rues trouvées */}
              {streetData && streetData.length > 0 && (
                <div className="mt-2 p-2 bg-gray-600/30 rounded text-sm">
                  <p className="text-gray-300">Rues trouvées:</p>
                  {streetData.map((street, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedStreet(street)}
                      className={`block w-full text-left px-2 py-1 rounded mt-1 ${
                        selectedStreet?.idstreet === street.idstreet
                          ? 'bg-green-500/20 text-green-400'
                          : 'hover:bg-gray-500/20 text-gray-300'
                      }`}
                    >
                      {street.street} (ID: {street.idstreet})
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Numéro */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Numéro {houseNumberData && <span className="text-green-400">✓ {houseNumberData.length} numéro(s) trouvé(s)</span>}
              </label>
              <input
                type="text"
                placeholder="Entrez le numéro..."
                value={number}
                onChange={(e) => setnumber(e.target.value)}
                onBlur={handleNumberBlur}
                // disabled={!selectedStreet}
                className="w-full bg-gray-700/50 text-white px-4 py-3 rounded-lg border border-gray-600/50 focus:border-green-400/50 focus:outline-none transition-all duration-300 disabled:opacity-50"
              />
              {/* Afficher les numéros trouvés */}
              {houseNumberData && houseNumberData.length > 0 && (
                <div className="mt-2 p-2 bg-gray-600/30 rounded text-sm">
                  <p className="text-gray-300">Numéros trouvés:</p>
                  {houseNumberData.map((house, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedHouseNumber(house)}
                      className={`block w-full text-left px-2 py-1 rounded mt-1 ${
                        selectedHouseNumber?.hexacle === house.hexacle
                          ? 'bg-green-500/20 text-green-400'
                          : 'hover:bg-gray-500/20 text-gray-300'
                      }`}
                    >
                      {house.number} - Lat: {house.lat}, Lon: {house.lon}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Bouton de recherche complète */}
            <div className="pt-4 border-t border-gray-600/50">
              <button
                onClick={handleFullProcess}
                disabled={loading}
                className="w-full px-4 py-3 bg-green-500/20 text-green-400 border border-green-400/20 rounded-lg hover:bg-green-500/30 transition-all duration-300 disabled:opacity-50"
              >
                {loading ? '🔄 Recherche...' : '🔍 Lancer la recherche complète'}
              </button>

              <button
                onClick={resetFilters}
                className="w-full mt-2 px-4 py-3 bg-gray-500/20 text-gray-400 border border-gray-400/20 rounded-lg hover:bg-gray-500/30 transition-all duration-300"
              >
                🔄 Réinitialiser les filtres
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )}

  {/* Contenu principal - Affichage des offres */}
  <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
    {showSearchResults && offers.length > 0 ? (
      <SearchNDI offers={offers} />
    ) : (
      <AllOffer lengthOffers={lengthOffers} />
      // <Profile/>
    )}
  </div>
</div>
  );
}