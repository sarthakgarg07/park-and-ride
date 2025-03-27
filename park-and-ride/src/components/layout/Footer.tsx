import Link from 'next/link';
import { 
  FiMapPin, 
  FiMail, 
  FiPhone, 
  FiFacebook, 
  FiTwitter, 
  FiInstagram, 
  FiLinkedin 
} from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="col-span-1">
            <Link href="/" className="flex items-center mb-4">
              <div className="relative h-8 w-8 mr-2">
                <div className="absolute inset-0 bg-primary-500 rounded-full flex items-center justify-center">
                  <FiMapPin className="h-5 w-5 text-white" />
                </div>
              </div>
              <span className="text-xl font-bold">Park&Ride</span>
            </Link>
            <p className="text-gray-400 mb-4">
              Making commuting easier with modern park and ride solutions. Seamlessly book parking and rides in one place.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors duration-200">
                <FiFacebook />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors duration-200">
                <FiTwitter />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors duration-200">
                <FiInstagram />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors duration-200">
                <FiLinkedin />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-primary-500 transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/book-parking" className="text-gray-400 hover:text-primary-500 transition-colors duration-200">
                  Book Parking
                </Link>
              </li>
              <li>
                <Link href="/book-ride" className="text-gray-400 hover:text-primary-500 transition-colors duration-200">
                  Book Ride
                </Link>
              </li>
              <li>
                <Link href="/tracking" className="text-gray-400 hover:text-primary-500 transition-colors duration-200">
                  Live Tracking
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-400 hover:text-primary-500 transition-colors duration-200">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="text-gray-400 hover:text-primary-500 transition-colors duration-200">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-primary-500 transition-colors duration-200">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-primary-500 transition-colors duration-200">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-primary-500 transition-colors duration-200">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-primary-500 transition-colors duration-200">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <FiMapPin className="mt-1 mr-2 text-primary-500" />
                <span className="text-gray-400">123 Park Street, City, Country</span>
              </li>
              <li className="flex items-center">
                <FiMail className="mr-2 text-primary-500" />
                <a href="mailto:info@parkandride.com" className="text-gray-400 hover:text-primary-500 transition-colors duration-200">
                  info@parkandride.com
                </a>
              </li>
              <li className="flex items-center">
                <FiPhone className="mr-2 text-primary-500" />
                <a href="tel:+1234567890" className="text-gray-400 hover:text-primary-500 transition-colors duration-200">
                  +1 (234) 567-890
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-400">
            &copy; {currentYear} Park&Ride. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 