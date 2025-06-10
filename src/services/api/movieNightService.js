import { delay } from '../index';
import { toast } from 'react-toastify';

class MovieNightService {
  constructor() {
    this.tableName = 'movie_night';
    this.fields = [
      'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
      'theme', 'movie_ids', 'date', 'share_link'
    ];
    this.updateableFields = [
      'Name', 'Tags', 'Owner', 'theme', 'movie_ids', 'date', 'share_link'
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
          fieldName: "date",
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
        shareLink: item.share_link
      }));

      return transformedData;
    } catch (error) {
      console.error("Error fetching movie nights:", error);
      toast.error("Failed to load movie nights");
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
        shareLink: item.share_link
      };
    } catch (error) {
      console.error(`Error fetching movie night with ID ${id}:`, error);
      toast.error("Failed to load movie night");
      return null;
    }
  }

  async create(movieNightData) {
    try {
      const apperClient = this.getApperClient();
      
      // Filter to only include updateable fields and format data
      const filteredData = {};
      this.updateableFields.forEach(field => {
        if (movieNightData.hasOwnProperty(field)) {
          if (field === 'movie_ids') {
            // Convert array to comma-separated string for MultiPicklist
            filteredData[field] = Array.isArray(movieNightData.movieIds) 
              ? movieNightData.movieIds.join(',') 
              : (movieNightData.movieIds || '');
          } else if (field === 'share_link') {
            filteredData[field] = movieNightData.shareLink || movieNightData[field];
          } else if (field === 'date') {
            // Ensure date is in YYYY-MM-DD format
            filteredData[field] = movieNightData.date;
          } else {
            filteredData[field] = movieNightData[field];
          }
        }
      });

      // Set default values
      if (!filteredData.movie_ids) filteredData.movie_ids = '';
      if (!filteredData.share_link && filteredData.theme) {
        filteredData.share_link = `moodflix.app/night/${Date.now()}`;
      }

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
          console.error(`Failed to create ${failedRecords.length} movie nights:${failedRecords}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          toast.success("Movie night created successfully");
          const item = successfulRecords[0].data;
          return {
            ...item,
            movieIds: item.movie_ids ? item.movie_ids.split(',').filter(id => id.trim()) : [],
            shareLink: item.share_link
          };
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating movie night:", error);
      toast.error("Failed to create movie night");
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
          } else if (field === 'share_link') {
            filteredData[field] = updateData.shareLink || updateData[field];
          } else if (field === 'date') {
            // Ensure date is in YYYY-MM-DD format
            filteredData[field] = updateData.date;
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
          console.error(`Failed to update ${failedUpdates.length} movie nights:${failedUpdates}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          toast.success("Movie night updated successfully");
          const item = successfulUpdates[0].data;
          return {
            ...item,
            movieIds: item.movie_ids ? item.movie_ids.split(',').filter(id => id.trim()) : [],
            shareLink: item.share_link
          };
        }
      }

      return null;
    } catch (error) {
      console.error("Error updating movie night:", error);
      toast.error("Failed to update movie night");
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
          console.error(`Failed to delete ${failedDeletions.length} movie nights:${failedDeletions}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulDeletions.length > 0) {
          toast.success("Movie night deleted successfully");
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error("Error deleting movie night:", error);
      toast.error("Failed to delete movie night");
      return false;
    }
  }

  async addMovie(movieNightId, movieId) {
    try {
      // Get current movie night
      const movieNight = await this.getById(movieNightId);
      if (!movieNight) {
        throw new Error('Movie night not found');
      }

      // Add movie if not already in list
      const movieIds = movieNight.movieIds || [];
      if (!movieIds.includes(movieId.toString())) {
        movieIds.push(movieId.toString());
        
        // Update movie night with new movie list
        return await this.update(movieNightId, { movieIds });
      }

      return movieNight;
    } catch (error) {
      console.error("Error adding movie to movie night:", error);
      toast.error("Failed to add movie to movie night");
      return null;
    }
  }

  async removeMovie(movieNightId, movieId) {
    try {
      // Get current movie night
      const movieNight = await this.getById(movieNightId);
      if (!movieNight) {
        throw new Error('Movie night not found');
      }

      // Remove movie from list
      const movieIds = movieNight.movieIds.filter(id => id !== movieId.toString());
      
      // Update movie night with new movie list
      return await this.update(movieNightId, { movieIds });
    } catch (error) {
      console.error("Error removing movie from movie night:", error);
      toast.error("Failed to remove movie from movie night");
      return null;
    }
  }

  async getByShareLink(shareLink) {
    try {
      const apperClient = this.getApperClient();
      const params = {
        fields: this.fields,
        where: [{
          fieldName: "share_link",
          operator: "ExactMatch",
          values: [shareLink]
        }]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (!response.data || response.data.length === 0) {
        throw new Error('Movie night not found');
      }

      // Transform the data to match the expected format
      const item = response.data[0];
      return {
        ...item,
        movieIds: item.movie_ids ? item.movie_ids.split(',').filter(id => id.trim()) : [],
        shareLink: item.share_link
      };
    } catch (error) {
      console.error("Error fetching movie night by share link:", error);
      toast.error("Failed to load movie night");
      return null;
    }
  }
}

export default new MovieNightService();