import { delay } from '../index';
import { toast } from 'react-toastify';

class MovieService {
  constructor() {
    this.tableName = 'movie';
    this.watchlistTableName = 'watchlist';
    this.fields = [
      'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
      'title', 'year', 'poster', 'rating', 'runtime', 'synopsis', 'trailer_url', 'genres', 'moods'
    ];
    this.updateableFields = [
      'Name', 'Tags', 'Owner', 'title', 'year', 'poster', 'rating', 'runtime', 
      'synopsis', 'trailer_url', 'genres', 'moods'
    ];
  }

  getApperClient() {
    const { ApperClient } = window.ApperSDK;
    return new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }

  async getAll() {
    try {
      const apperClient = this.getApperClient();
      const params = {
        fields: this.fields,
        orderBy: [{
          fieldName: "CreatedOn",
          SortType: "DESC"
        }]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching movies:", error);
      toast.error("Failed to load movies");
      return [];
    }
  }

  async getById(id) {
    try {
      const apperClient = this.getApperClient();
      const params = {
        fields: this.fields
      };

      const response = await apperClient.getRecordById(this.tableName, id, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching movie with ID ${id}:`, error);
      toast.error("Failed to load movie");
      return null;
    }
  }

  async getByMood(mood) {
    try {
      const apperClient = this.getApperClient();
      const params = {
        fields: this.fields,
        where: [{
          fieldName: "moods",
          operator: "Contains",
          values: [mood]
        }]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching movies by mood:", error);
      toast.error("Failed to load movies");
      return [];
    }
  }

  async getByGenre(genre) {
    try {
      const apperClient = this.getApperClient();
      const params = {
        fields: this.fields,
        where: [{
          fieldName: "genres",
          operator: "Contains",
          values: [genre]
        }]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching movies by genre:", error);
      toast.error("Failed to load movies");
      return [];
    }
  }

  async search(query) {
    try {
      const apperClient = this.getApperClient();
      const params = {
        fields: this.fields,
        whereGroups: [{
          operator: "OR",
          subGroups: [{
            conditions: [
              {
                fieldName: "title",
                operator: "Contains",
                values: [query]
              },
              {
                fieldName: "synopsis",
                operator: "Contains",
                values: [query]
              },
              {
                fieldName: "genres",
                operator: "Contains",
                values: [query]
              }
            ],
            operator: "OR"
          }]
        }]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error searching movies:", error);
      toast.error("Failed to search movies");
      return [];
    }
  }

  async create(movieData) {
    try {
      const apperClient = this.getApperClient();
      
      // Filter to only include updateable fields and format data
      const filteredData = {};
      this.updateableFields.forEach(field => {
        if (movieData.hasOwnProperty(field)) {
          if (field === 'genres' || field === 'moods') {
            // Convert arrays to comma-separated strings for MultiPicklist
            filteredData[field] = Array.isArray(movieData[field]) 
              ? movieData[field].join(',') 
              : movieData[field];
          } else if (field === 'year' || field === 'runtime') {
            // Ensure numeric fields are numbers
            filteredData[field] = parseInt(movieData[field]);
          } else if (field === 'rating') {
            // Ensure rating is a decimal
            filteredData[field] = parseFloat(movieData[field]);
          } else {
            filteredData[field] = movieData[field];
          }
        }
      });

      const params = {
        records: [filteredData]
      };

      const response = await apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} movies:${failedRecords}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          toast.success("Movie created successfully");
          return successfulRecords[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating movie:", error);
      toast.error("Failed to create movie");
      return null;
    }
  }

  async update(id, updateData) {
    try {
      const apperClient = this.getApperClient();
      
      // Filter to only include updateable fields and format data
      const filteredData = { Id: parseInt(id) };
      this.updateableFields.forEach(field => {
        if (updateData.hasOwnProperty(field)) {
          if (field === 'genres' || field === 'moods') {
            // Convert arrays to comma-separated strings for MultiPicklist
            filteredData[field] = Array.isArray(updateData[field]) 
              ? updateData[field].join(',') 
              : updateData[field];
          } else if (field === 'year' || field === 'runtime') {
            // Ensure numeric fields are numbers
            filteredData[field] = parseInt(updateData[field]);
          } else if (field === 'rating') {
            // Ensure rating is a decimal
            filteredData[field] = parseFloat(updateData[field]);
          } else {
            filteredData[field] = updateData[field];
          }
        }
      });

      const params = {
        records: [filteredData]
      };

      const response = await apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} movies:${failedUpdates}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          toast.success("Movie updated successfully");
          return successfulUpdates[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error updating movie:", error);
      toast.error("Failed to update movie");
      return null;
    }
  }

  async delete(id) {
    try {
      const apperClient = this.getApperClient();
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} movies:${failedDeletions}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulDeletions.length > 0) {
          toast.success("Movie deleted successfully");
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error("Error deleting movie:", error);
      toast.error("Failed to delete movie");
      return false;
    }
  }

  // Legacy watchlist methods for compatibility
  async addToWatchlist(movieId) {
    await delay(200);
    toast.success("Movie added to watchlist!");
    return true;
  }

  async removeFromWatchlist(movieId) {
    await delay(200);
    toast.success("Movie removed from watchlist!");
    return true;
  }

  async getWatchlistMovies() {
    // This would need to be implemented with watchlist service integration
    await delay(300);
    return [];
  }
}

export default new MovieService();