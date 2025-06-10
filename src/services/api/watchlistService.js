import { delay } from '../index';
import { toast } from 'react-toastify';

class WatchlistService {
  constructor() {
    this.tableName = 'watchlist';
    this.fields = [
      'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
      'movie_ids', 'created_at', 'category'
    ];
    this.updateableFields = [
      'Name', 'Tags', 'Owner', 'movie_ids', 'created_at', 'category'
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
          fieldName: "created_at",
          SortType: "DESC"
        }]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      // Transform the data to match the expected format
      const transformedData = (response.data || []).map(item => ({
        ...item,
        movieIds: item.movie_ids ? item.movie_ids.split(',').filter(id => id.trim()) : [],
        createdAt: item.created_at
      }));

      return transformedData;
    } catch (error) {
      console.error("Error fetching watchlists:", error);
      toast.error("Failed to load watchlists");
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

      // Transform the data to match the expected format
      const item = response.data;
      return {
        ...item,
        movieIds: item.movie_ids ? item.movie_ids.split(',').filter(id => id.trim()) : [],
        createdAt: item.created_at
      };
    } catch (error) {
      console.error(`Error fetching watchlist with ID ${id}:`, error);
      toast.error("Failed to load watchlist");
      return null;
    }
  }

  async create(watchlistData) {
    try {
      const apperClient = this.getApperClient();
      
      // Filter to only include updateable fields and format data
      const filteredData = {};
      this.updateableFields.forEach(field => {
        if (watchlistData.hasOwnProperty(field)) {
          if (field === 'movie_ids') {
            // Convert array to comma-separated string for MultiPicklist
            filteredData[field] = Array.isArray(watchlistData.movieIds) 
              ? watchlistData.movieIds.join(',') 
              : (watchlistData.movieIds || '');
          } else if (field === 'created_at') {
            // Use ISO format for DateTime
            filteredData[field] = watchlistData.createdAt || new Date().toISOString();
          } else {
            filteredData[field] = watchlistData[field];
          }
        }
      });

      // Set default values
      if (!filteredData.movie_ids) filteredData.movie_ids = '';
      if (!filteredData.created_at) filteredData.created_at = new Date().toISOString();

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
          console.error(`Failed to create ${failedRecords.length} watchlists:${failedRecords}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          toast.success("Watchlist created successfully");
          const item = successfulRecords[0].data;
          return {
            ...item,
            movieIds: item.movie_ids ? item.movie_ids.split(',').filter(id => id.trim()) : [],
            createdAt: item.created_at
          };
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating watchlist:", error);
      toast.error("Failed to create watchlist");
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
          if (field === 'movie_ids') {
            // Convert array to comma-separated string for MultiPicklist
            filteredData[field] = Array.isArray(updateData.movieIds) 
              ? updateData.movieIds.join(',') 
              : (updateData.movieIds || '');
          } else if (field === 'created_at') {
            // Use ISO format for DateTime
            filteredData[field] = updateData.createdAt || updateData[field];
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
          console.error(`Failed to update ${failedUpdates.length} watchlists:${failedUpdates}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          toast.success("Watchlist updated successfully");
          const item = successfulUpdates[0].data;
          return {
            ...item,
            movieIds: item.movie_ids ? item.movie_ids.split(',').filter(id => id.trim()) : [],
            createdAt: item.created_at
          };
        }
      }

      return null;
    } catch (error) {
      console.error("Error updating watchlist:", error);
      toast.error("Failed to update watchlist");
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
          console.error(`Failed to delete ${failedDeletions.length} watchlists:${failedDeletions}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulDeletions.length > 0) {
          toast.success("Watchlist deleted successfully");
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error("Error deleting watchlist:", error);
      toast.error("Failed to delete watchlist");
      return false;
    }
  }

  async addMovie(watchlistId, movieId) {
    try {
      // Get current watchlist
      const watchlist = await this.getById(watchlistId);
      if (!watchlist) {
        throw new Error('Watchlist not found');
      }

      // Add movie if not already in list
      const movieIds = watchlist.movieIds || [];
      if (!movieIds.includes(movieId.toString())) {
        movieIds.push(movieId.toString());
        
        // Update watchlist with new movie list
        return await this.update(watchlistId, { movieIds });
      }

      return watchlist;
    } catch (error) {
      console.error("Error adding movie to watchlist:", error);
      toast.error("Failed to add movie to watchlist");
      return null;
    }
  }

  async removeMovie(movieId) {
    try {
      // Get all watchlists and remove the movie from each
      const watchlists = await this.getAll();
      const updatePromises = watchlists
        .filter(watchlist => watchlist.movieIds.includes(movieId.toString()))
        .map(watchlist => {
          const updatedMovieIds = watchlist.movieIds.filter(id => id !== movieId.toString());
          return this.update(watchlist.Id, { movieIds: updatedMovieIds });
        });

      await Promise.all(updatePromises);
      toast.success("Movie removed from all watchlists");
      return true;
    } catch (error) {
      console.error("Error removing movie from watchlists:", error);
      toast.error("Failed to remove movie from watchlists");
      return false;
    }
  }

  async getByCategory(category) {
    try {
      const apperClient = this.getApperClient();
      const params = {
        fields: this.fields,
        where: [{
          fieldName: "category",
          operator: "ExactMatch",
          values: [category]
        }]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      // Transform the data to match the expected format
      const transformedData = (response.data || []).map(item => ({
        ...item,
        movieIds: item.movie_ids ? item.movie_ids.split(',').filter(id => id.trim()) : [],
        createdAt: item.created_at
      }));

      return transformedData;
    } catch (error) {
      console.error("Error fetching watchlists by category:", error);
      toast.error("Failed to load watchlists");
      return [];
    }
  }
}

export default new WatchlistService();