import React, { createContext, useContext, useState, useCallback } from 'react';

const CompanyContext = createContext();

export const CompanyProvider = ({ children }) => {
  const [companyUpdateTrigger, setCompanyUpdateTrigger] = useState(0);
  const [updatedCompanies, setUpdatedCompanies] = useState(new Map());

  const notifyCompanyUpdate = useCallback((companyId, updatedCompanyData) => {
    setUpdatedCompanies(prev => {
      const newMap = new Map(prev);
      newMap.set(companyId, {
        ...updatedCompanyData,
        lastUpdated: Date.now()
      });
      return newMap;
    });
    
    setCompanyUpdateTrigger(prev => prev + 1);
  }, []);

  const getUpdatedCompanyData = useCallback((companyId) => {
    return updatedCompanies.get(companyId);
  }, [updatedCompanies]);

  const clearCompanyUpdate = useCallback((companyId) => {
    setUpdatedCompanies(prev => {
      const newMap = new Map(prev);
      newMap.delete(companyId);
      return newMap;
    });
  }, []);

  const value = {
    companyUpdateTrigger,
    notifyCompanyUpdate,
    getUpdatedCompanyData,
    clearCompanyUpdate,
    updatedCompanies
  };

  return (
    <CompanyContext.Provider value={value}>
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompanyContext = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useCompanyContext must be used within a CompanyProvider');
  }
  return context;
};

export default CompanyContext;
