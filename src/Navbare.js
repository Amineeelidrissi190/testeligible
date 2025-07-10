import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion'
import './i18n';
export default function Navbare(){
        const { t, i18n } = useTranslation();
        const changeLanguage = (lng) => i18n.changeLanguage(lng);
        return <div className='z-50 fixed w-full flex items-center justify-between px-4 py-3 bg-gray-800/80 backdrop-blur-sm border-b border-green-400/20 shadow-lg shadow-green-400/10'>
            <p className='text-white'>Amine El Idrissi</p>
            <div className='flex items-center space-x-4'>
                <button onClick={() => changeLanguage('en')} className="text-sm text-gray-300 hover:text-white">English</button>
                <button onClick={() => changeLanguage('fr')} className="text-sm text-gray-300 hover:text-white">Français</button>
            </div>
        </div>
}