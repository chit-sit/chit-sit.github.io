/**
 * JSON Database Utility for Client-Side Applications
 * 
 * This utility provides methods to read/write JSON data.
 * Note: On GitHub Pages, actual file writes are not possible due to static hosting limitations.
 * This code is designed to work in environments where file writing is possible,
 * or can serve as a template for API integration in dynamic environments.
 */

class JSONDatabase {
  constructor(filePath) {
    this.filePath = filePath;
    this.data = {};
  }

  /**
   * Load data from JSON file
   */
  async load() {
    try {
      // For GitHub Pages, we'll use localStorage as fallback
      if (typeof window !== 'undefined' && window.localStorage) {
        const storedData = localStorage.getItem(this.filePath);
        if (storedData) {
          this.data = JSON.parse(storedData);
          return this.data;
        }
      }
      
      // In Node.js environment or with proper server support:
      // const fs = require('fs').promises;
      // const fileContent = await fs.readFile(this.filePath, 'utf8');
      // this.data = JSON.parse(fileContent);
      // return this.data;
      
      console.warn('File system access not available. Using empty default data.');
      this.data = this.getDefaultData();
      return this.data;
    } catch (error) {
      console.error('Error loading JSON database:', error);
      this.data = this.getDefaultData();
      return this.data;
    }
  }

  /**
   * Save data to JSON file
   */
  async save() {
    try {
      // For GitHub Pages, we'll use localStorage as fallback
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(this.filePath, JSON.stringify(this.data, null, 2));
        return true;
      }
      
      // In Node.js environment or with proper server support:
      // const fs = require('fs').promises;
      // await fs.writeFile(this.filePath, JSON.stringify(this.data, null, 2));
      // return true;
      
      console.warn('Cannot save to file system on this environment.');
      return false;
    } catch (error) {
      console.error('Error saving JSON database:', error);
      return false;
    }
  }

  /**
   * Get default data structure
   */
  getDefaultData() {
    return {
      questions: [],
      settings: {
        siteName: "Cheatsheet Hub Questions",
        lastUpdated: new Date().toISOString(),
        version: "1.0.0"
      }
    };
  }

  /**
   * Add a new record
   */
  async addRecord(collection, record) {
    await this.load();
    
    if (!this.data[collection]) {
      this.data[collection] = [];
    }
    
    // Generate ID if not provided
    if (!record.id) {
      const ids = this.data[collection].map(item => item.id || 0);
      record.id = ids.length > 0 ? Math.max(...ids) + 1 : 1;
    }
    
    // Add timestamp if not provided
    if (!record.timestamp) {
      record.timestamp = new Date().toISOString();
    }
    
    this.data[collection].push(record);
    await this.save();
    return record;
  }

  /**
   * Update a record
   */
  async updateRecord(collection, id, updates) {
    await this.load();
    
    const index = this.data[collection]?.findIndex(item => item.id == id);
    if (index !== -1) {
      this.data[collection][index] = { ...this.data[collection][index], ...updates };
      await this.save();
      return this.data[collection][index];
    }
    return null;
  }

  /**
   * Delete a record
   */
  async deleteRecord(collection, id) {
    await this.load();
    
    if (this.data[collection]) {
      this.data[collection] = this.data[collection].filter(item => item.id != id);
      await this.save();
      return true;
    }
    return false;
  }

  /**
   * Find records by criteria
   */
  async find(collection, criteria = {}) {
    await this.load();
    
    if (!this.data[collection]) {
      return [];
    }
    
    if (Object.keys(criteria).length === 0) {
      return this.data[collection];
    }
    
    return this.data[collection].filter(item => {
      return Object.keys(criteria).every(key => {
        if (typeof criteria[key] === 'string') {
          return String(item[key]).toLowerCase().includes(criteria[key].toLowerCase());
        }
        return item[key] === criteria[key];
      });
    });
  }

  /**
   * Get all records from a collection
   */
  async getAll(collection) {
    await this.load();
    return this.data[collection] || [];
  }
}

// Export for use in modules (Node.js) or assign to global object (browser)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = JSONDatabase;
} else if (typeof window !== 'undefined') {
  window.JSONDatabase = JSONDatabase;
}