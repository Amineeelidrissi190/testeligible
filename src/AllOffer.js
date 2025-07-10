import { useState, useEffect } from "react"
import axios from "axios"

export default function AllOffer(props) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6
  props.filters ? console.log(props.filters.list):console.log(false)
  const totalItems = data.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentData = data.slice(startIndex, endIndex)

  // Fonctions de navigation
  const goToPage = (page) => {
    setCurrentPage(page)
  }

  const goToPreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1))
  }

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages))
  }

  useEffect(() => {
    handlegetOffersEligible()
  }, [])

  const handlegetOffersEligible = async () => {
    try {
      setLoading(true)
      
      // Récupération du token depuis localStorage
      const token = localStorage.getItem('token')
      
      // Configuration de l'en-tête d'autorisation
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      // Appel API avec axios
      const res = await axios.get("/ema/api/v1/retailer_repackaging/", {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      })
      
      // Mise à jour des données (res.data.data si la réponse a une structure imbriquée)
      setData(res.data.data || res.data)
      props.lengthOffers(res.data.data.length)
      console.log(res.data)
      setLoading(false)
      
    } catch (error) {
      console.log(error)
      setError("Erreur lors du chargement des données")
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center min-h-screen">
        <div className="bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl border border-green-400/20 shadow-lg shadow-green-400/10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400 mx-auto"></div>
          <p className="text-green-400 mt-2 text-center">Chargement...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full flex items-center justify-center min-h-screen">
        <div className="bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl border border-red-400/20 shadow-lg shadow-red-400/10">
          <p className="text-red-400 text-center">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl border border-green-400/20 shadow-lg shadow-green-400/10 overflow-hidden">
          {/* En-tête avec pagination info */}
          <div className="bg-gradient-to-r from-green-400/10 to-blue-400/10 p-6 border-b border-green-400/20">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-green-400 mb-2">Toutes les Offres</h1>
                <p className="text-gray-300">
                  {totalItems} offre(s) au total | Page {currentPage} sur {totalPages}
                </p>
              </div>
              <div className="text-sm text-gray-400">
                Affichage {startIndex + 1}-{Math.min(endIndex, totalItems)} sur {totalItems}
              </div>
            </div>
          </div>

          {/* Tableau */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-700/50">
                <tr className="border-b border-green-400/20">
                  <th className="text-left p-4 text-green-400 font-semibold">ID</th>
                  <th className="text-left p-4 text-green-400 font-semibold">Repackaging</th>
                  <th className="text-left p-4 text-green-400 font-semibold">Offre</th>
                  <th className="text-left p-4 text-green-400 font-semibold">Référence</th>
                  <th className="text-left p-4 text-green-400 font-semibold">Client</th>
                  <th className="text-left p-4 text-green-400 font-semibold">Engagement</th>
                  <th className="text-left p-4 text-green-400 font-semibold">Périodicité</th>
                  <th className="text-left p-4 text-green-400 font-semibold">Date début</th>
                  <th className="text-left p-4 text-green-400 font-semibold">Montants</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((item, index) => (
                  <tr 
                    key={item.idretailer_repackaging || index}
                    className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors duration-200"
                  >
                    <td className="p-4 text-gray-300 font-mono text-xs">
                      {item.idretailer_repackaging}
                    </td>
                    <td className="p-4 text-gray-300 font-mono text-xs">
                      {item.retailer_repackaging}
                    </td>
                    <td className="p-4 text-gray-200 max-w-xs">
                      <div className="truncate" title={item.offer}>
                        {item.offer}
                      </div>
                    </td>
                    <td className="p-4 text-gray-300 font-mono text-xs">
                      {item.reference}
                    </td>
                    <td className="p-4 text-gray-200">
                      {item.customer}
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-400/20 text-green-400">
                        {item.engagement}
                      </span>
                    </td>
                    <td className="p-4 text-gray-300">
                      {item.periodicity}
                    </td>
                    <td className="p-4 text-gray-300 font-mono text-xs">
                      {item.date_begin}
                    </td>
                    <td className="p-4">
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-400">OTC:</span>
                          <span className="text-green-400">{item.amt_otc}€</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Fee:</span>
                          <span className="text-green-400">{item.amt_fee}€</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Recur:</span>
                          <span className="text-green-400">{item.amt_recur}€</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Résil:</span>
                          <span className="text-green-400">{item.amt_resil}€</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pied de page avec pagination */}
          <div className="bg-gray-800/50 p-4 border-t border-green-400/20">
            {totalItems === 0 ? (
              <div className="text-center py-4">
                <p className="text-gray-400">Aucune offre disponible</p>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-400">
                  Affichage de {startIndex + 1} à {Math.min(endIndex, totalItems)} sur {totalItems} offres
                </div>
                
                {/* Contrôles de pagination */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded-md text-sm font-medium bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Précédent
                  </button>
                  
                  {/* Numéros de page */}
                  <div className="flex space-x-1">
                    {[...Array(totalPages)].map((_, i) => {
                      const page = i + 1
                      const isActive = page === currentPage
                      const showPage = page === 1 || page === totalPages || Math.abs(page - currentPage) <= 2
                      
                      if (!showPage && page !== 2 && page !== totalPages - 1) {
                        if (page === 2 && currentPage > 4) {
                          return <span key={page} className="px-2 text-gray-500">...</span>
                        }
                        if (page === totalPages - 1 && currentPage < totalPages - 3) {
                          return <span key={page} className="px-2 text-gray-500">...</span>
                        }
                        return null
                      }
                      
                      return (
                        <button
                          key={page}
                          onClick={() => goToPage(page)}
                          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                            isActive
                              ? 'bg-green-400 text-gray-900'
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                        >
                          {page}
                        </button>
                      )
                    })}
                  </div>
                  
                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded-md text-sm font-medium bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Suivant
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}