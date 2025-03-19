import React from "react";

const Footer = () => {
  return (
    <footer>
      <div className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold">Financial Tracker</h2>
            <p className="text-sm">
              &copy; {new Date().getFullYear()} All rights reserved.
            </p>
          </div>
          <div className="flex gap-4">
            <a
              href="https://www.instagram.com/kenrafly/"
              target="_blank"
              className="text-sm hover:underline"
            >
              Owner's Instagram
            </a>
            <a href="#" className="text-sm hover:underline">
              Terms of Service
            </a>
            <a href="#" className="text-sm hover:underline">
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
