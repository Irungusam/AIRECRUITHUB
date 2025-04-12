import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white pt-12 pb-6">
      <div className="container mx-auto px-6">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-8">
          {/* Company Info */}
          <div>
            <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              AI RECRUIT HUB
            </h2>
            <p className="mt-4 text-gray-300 text-sm">
              Connecting top talent with innovative companies through AI-powered
              recruitment solutions.
            </p>
            <div className="flex space-x-4 mt-6">
              <a
                href="https://facebook.com"
                className="text-gray-400 hover:text-blue-500 transition-colors"
                aria-label="Facebook"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22.676 0H1.324C.593 0 0 .592 0 1.324v21.352C0 23.408.593 24 1.324 24H12.82V14.706H9.692v-3.578h3.128V8.408c0-3.1 1.893-4.787 4.657-4.787 1.325 0 2.463.1 2.794.144v3.238l-1.918.001c-1.503 0-1.794.715-1.794 1.762v2.31h3.587l-.468 3.578h-3.119V24h6.116C23.407 24 24 23.408 24 22.676V1.324C24 .592 23.407 0 22.676 0z" />
                </svg>
              </a>
              <a
                href="https://twitter.com"
                className="text-gray-400 hover:text-blue-400 transition-colors"
                aria-label="Twitter"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 4.557a9.835 9.835 0 01-2.828.775 4.934 4.934 0 002.165-2.724 9.867 9.867 0 01-3.127 1.195 4.924 4.924 0 00-8.38 4.49A13.978 13.978 0 011.67 3.149 4.93 4.93 0 003.16 9.724a4.903 4.903 0 01-2.229-.616v.062a4.93 4.93 0 003.946 4.827 4.902 4.902 0 01-2.224.084 4.93 4.93 0 004.6 3.417A9.869 9.869 0 010 21.543a13.978 13.978 0 007.548 2.212c9.057 0 14.01-7.507 14.01-14.01 0-.213-.004-.425-.015-.636A10.012 10.012 0 0024 4.557z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                className="text-gray-400 hover:text-blue-600 transition-colors"
                aria-label="LinkedIn"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452H16.85v-5.569c0-1.327-.027-3.037-1.852-3.037-1.854 0-2.137 1.446-2.137 2.94v5.666H9.147V9.756h3.448v1.464h.05c.48-.91 1.653-1.871 3.401-1.871 3.634 0 4.307 2.39 4.307 5.498v5.605zM5.337 8.29c-1.105 0-2-.896-2-2 0-1.106.895-2 2-2 1.104 0 2 .895 2 2 0 1.104-.896 2-2 2zM7.119 20.452H3.553V9.756h3.566v10.696zM22.225 0H1.771C.791 0 0 .774 0 1.729v20.542C0 23.226.792 24 1.771 24h20.451c.979 0 1.771-.774 1.771-1.729V1.729C24 .774 23.205 0 22.225 0z" />
                </svg>
              </a>
              <a
                href="https://instagram.com"
                className="text-gray-400 hover:text-pink-500 transition-colors"
                aria-label="Instagram"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-100">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/jobs"
                  className="text-gray-300 hover:text-blue-400 transition-colors"
                >
                  Browse Jobs
                </a>
              </li>
              <li>
                <a
                  href="/companies"
                  className="text-gray-300 hover:text-blue-400 transition-colors"
                >
                  Companies
                </a>
              </li>
              <li>
                <a
                  href="/candidates"
                  className="text-gray-300 hover:text-blue-400 transition-colors"
                >
                  For Candidates
                </a>
              </li>
              <li>
                <a
                  href="/employers"
                  className="text-gray-300 hover:text-blue-400 transition-colors"
                >
                  For Employers
                </a>
              </li>
              <li>
                <a
                  href="/pricing"
                  className="text-gray-300 hover:text-blue-400 transition-colors"
                >
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-100">
              Resources
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/blog"
                  className="text-gray-300 hover:text-blue-400 transition-colors"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="/career-advice"
                  className="text-gray-300 hover:text-blue-400 transition-colors"
                >
                  Career Advice
                </a>
              </li>
              <li>
                <a
                  href="/help-center"
                  className="text-gray-300 hover:text-blue-400 transition-colors"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="/ai-tools"
                  className="text-gray-300 hover:text-blue-400 transition-colors"
                >
                  AI Resume Tools
                </a>
              </li>
              <li>
                <a
                  href="/webinars"
                  className="text-gray-300 hover:text-blue-400 transition-colors"
                >
                  Webinars
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-100">
              Stay Updated
            </h3>
            <p className="text-gray-300 text-sm mb-4">
              Subscribe to receive job alerts and career tips.
            </p>
            <form className="space-y-2">
              <div className="flex flex-col space-y-2">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="bg-gray-700 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 transition-colors text-white py-2 px-4 rounded-md font-medium"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-6"></div>

        {/* Bottom footer */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>© 2025 AIRecruitHub. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a
              href="/privacy"
              className="hover:text-blue-400 transition-colors"
            >
              Privacy Policy
            </a>
            <a href="/terms" className="hover:text-blue-400 transition-colors">
              Terms of Service
            </a>
            <a
              href="/contact"
              className="hover:text-blue-400 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
