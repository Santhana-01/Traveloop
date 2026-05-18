import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from '../Header';
import { motion, AnimatePresence } from 'framer-motion';

const MainLayout = ({ children, title }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="app-root">
      <div className="wave-bg"></div>
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`app-main ${!sidebarOpen ? 'full-width' : ''}`}>
        <Header 
          title={title} 
          toggleSidebar={toggleSidebar} 
          sidebarOpen={sidebarOpen}
        />
        <motion.main 
          className="app-content"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="content-container">
            {children}
          </div>
        </motion.main>
      </div>

      <style jsx>{`
        .app-root {
          display: flex;
          min-height: 100vh;
          background-color: #030D13;
          position: relative;
          overflow-x: hidden;
          background-image: 
            radial-gradient(at 0% 0%, rgba(19, 99, 223, 0.05) 0px, transparent 50%),
            radial-gradient(at 100% 100%, rgba(255, 142, 114, 0.02) 0px, transparent 50%);
        }
        .wave-bg {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(180deg, rgba(3, 13, 19, 0) 0%, rgba(19, 99, 223, 0.02) 100%);
          pointer-events: none;
          z-index: 0;
        }
        .app-main {
          flex: 1;
          margin-left: 280px;
          display: flex;
          flex-direction: column;
          min-width: 0;
          position: relative;
          z-index: 1;
          transition: margin-left 0.5s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .app-main.full-width {
          margin-left: 0;
        }
        .app-content {
          flex: 1;
          padding: 24px;
          margin-top: 80px;
        }
        .content-container {
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }
        @media (max-width: 1024px) {
          .app-main {
            margin-left: 0;
          }
          .app-main.full-width {
            margin-left: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default MainLayout;
