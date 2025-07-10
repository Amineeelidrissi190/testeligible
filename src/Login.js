import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Typewriter } from 'react-simple-typewriter';
import { useTranslation } from 'react-i18next';
import axios from "axios";
import './i18n';
import Navbare from "./Navbare";
import { useNavigate } from "react-router-dom";

function Login({ loginRef }) {
  const [randomTags, setRandomTags] = useState([]);
  const [formData, setFormData] = useState({
    login: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate()

  // Liste des tags à animer
  const codeTags = [
    { text: "<login />", color: "text-pink-400" },
    { text: t('auth.secure'), color: "text-purple-400" },
    { text: t('auth.connect'), color: "text-red-400" },
    { text: "<access />", color: "text-cyan-300" },
    { text: t('auth.word1'), color: "text-yellow-300" },
    { text: t('auth.word2'), color: "text-green-400" }
  ];

  
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

      const duration = 10 + Math.random() * 10;

      return {
        ...tag,
        initialX: randomX,
        initialY: randomY,
        animX,
        animY,
        duration,
        delay: Math.random() * 2,
      };
    });
  };

  useEffect(() => {
    setRandomTags(generateRandomTags());
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axios.post("/ema/api/v1/account/login/", formData, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });

      setIsLoading(false);
      const token = res.data?.data?.token;
      const user = res.data?.data?.user;

      if (token) {
        console.log(token);
        localStorage.setItem('token', token); 
        localStorage.setItem('user', JSON.stringify(user)); 
        navigate("/dashboard");
      } 

    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div ref={loginRef} id="login" className="">
       <Navbare />
       <div className="flex items-center justify-center min-h-screen relative overflow-hidden bg-gray-900">
              {randomTags.map((tag, index) => (
        <motion.div
          key={index}
          className={`${tag.color} font-mono text-sm md:text-sm absolute z-0 opacity-50 select-none`}
          style={{
            left: '50%',
            top: '50%'
          }}
          initial={{
            x: tag.initialX + 'vw',
            y: tag.initialY + 'vh',
            opacity: 0.4
          }}
          animate={{
            x: tag.animX.map(x => x + 'vw'),
            y: tag.animY.map(y => y + 'vh'),
            opacity: [0.3, 0.5, 0.3]
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

      <motion.div
        className="z-10 w-11/12 md:w-2/5 p-4 rounded-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="bg-gray-800/80 backdrop-blur-sm p-8 rounded-xl border border-green-400/20 shadow-lg shadow-green-400/10">
          <div className="mb-6 text-center">
            <p className="text-xs text-green-400 font-mono mb-4">
              <Typewriter
                words={[t('auth.word1'), t('auth.word2'), t('auth.word3')]}
                loop={true}
                cursor
                cursorStyle="_"
                typeSpeed={70}
                deleteSpeed={50}
                delaySpeed={1000}
              />
            </p>
          </div>

          {/* Login Form */}
          <motion.div
            className="text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <h2 className="text-2xl font-bold text-green-400 mb-6 text-center">
              {t('auth.login')}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="login" className="block text-sm font-medium text-gray-300 mb-2">
                  {t('auth.username')}
                </label>
                <motion.input
                  type="text"
                  id="login"
                  name="login"
                  value={formData.login}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-900/50 border border-green-400/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-green-400/50 transition-all duration-300"
                  placeholder={t('auth.placeholderUserName')}
                  whileFocus={{ scale: 1.02 }}
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  {t('auth.password')}
                </label>
                <div className="relative">
                  <motion.input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gray-900/50 border border-green-400/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-green-400/50 transition-all duration-300 pr-12"
                    placeholder={t('auth.placeholderpassword')}
                    whileFocus={{ scale: 1.02 }}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-green-400 transition-colors"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember"
                    name="remember"
                    type="checkbox"
                    className="h-4 w-4 text-green-400 bg-gray-900/50 border-green-400/20 rounded focus:ring-green-400/50"
                  />
                  <label htmlFor="remember" className="ml-2 block text-sm text-gray-300">
                    {t('auth.Souvenirmoi')}
                  </label>
                </div>
                <div className="text-sm">
                  <a href="#" className="text-green-400 hover:text-green-300 transition-colors">
                    {t('auth.motdepassoublier')}
                  </a>
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-gradient-to-r from-green-400 to-blue-500 text-white font-medium rounded-lg hover:from-green-500 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-green-400/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Connexion en cours...
                  </div>
                ) : (
                  t('auth.se connecter')
                )}
              </motion.button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">
                {t('auth.lparagraph')}{' '}
                <a href="#" className="text-green-400 hover:text-green-300 transition-colors font-medium">
                  {t('auth.register')}
                </a>
              </p>
            </div>
          </motion.div>
        </div>

        {/* Effet de lueur */}
        <motion.div
          className="absolute -inset-4 bg-gradient-to-r from-green-400 to-blue-500 opacity-20 rounded-xl blur-xl -z-10"
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
      </motion.div>

       </div>

    </div>
  );
}

export default Login;