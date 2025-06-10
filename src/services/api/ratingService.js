import { delay } from '../index';
import { toast } from 'react-toastify';

class RatingService {
  constructor() {
    this.tableName = 'rating';
    this.fields = [
      'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
      'movie_id', 'user_id', 'rating', 'review', 'timestamp'
    ];
    this.updateableFields = [
      'Name', 'Tags', 'Owner', 'movie_id', 'user_id', 'rating', 'review', 'timestamp'
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
          fieldName: "timestamp",
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
        movieId: item.movie_id,
        userId: item.user_id
      }));

      return transformedData;
    } catch (error) {
      console.error("Error fetching ratings:", error);
      toast.error("Failed to load ratings");
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
        movieId: item.movie_id,
        userId: item.user_id
      };
    } catch (error) {
      console.error(`Error fetching rating with ID ${id}:`, error);
      toast.error("Failed to load rating");
      return null;
    }
  }

  async getByMovieId(movieId) {
    try {
      const apperClient = this.getApperClient();
      const params = {
        fields: this.fields,
        where: [{
          fieldName: "movie_id",
          operator: "EqualTo",
          values: [parseInt(movieId)]
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
        movieId: item.movie_id,
        userId: item.user_id
      }));

      return transformedData;
    } catch (error) {
      console.error("Error fetching ratings by movie ID:", error);
      toast.error("Failed to load movie ratings");
      return [];
    }
  }

  async getByUserId(userId) {
    try {
      const apperClient = this.getApperClient();
      const params = {
        fields: this.fields,
        where: [{
          fieldName: "user_id",
          operator: "EqualTo",
          values: [parseInt(userId)]
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
        movieId: item.movie_id,
        userId: item.user_id
      }));

      return transformedData;
    } catch (error) {
      console.error("Error fetching ratings by user ID:", error);
      toast.error("Failed to load user ratings");
      return [];
    }
  }

  async getUserRatingForMovie(movieId, userId) {
    try {
      const apperClient = this.getApperClient();
      const params = {
        fields: this.fields,
        where: [
          {
            fieldName: "movie_id",
            operator: "EqualTo",
            values: [parseInt(movieId)]
          },
          {
            fieldName: "user_id",
            operator: "EqualTo",
            values: [parseInt(userId)]
          }
        ]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (!response.data || response.data.length === 0) {
        return null;
      }

      // Transform the data to match the expected format
      const item = response.data[0];
      return {
        ...item,
        movieId: item.movie_id,
        userId: item.user_id
      };
    } catch (error) {
      console.error("Error fetching user rating for movie:", error);
      return null;
    }
  }

  async getAverageRating(movieId) {
    try {
      const movieRatings = await this.getByMovieId(movieId);
      
      if (movieRatings.length === 0) {
        return { average: 0, count: 0 };
      }

      const total = movieRatings.reduce((sum, r) => sum + r.rating, 0);
      const average = Math.round((total / movieRatings.length) * 10) / 10; // Round to 1 decimal

      return { 
        average, 
        count: movieRatings.length 
      };
    } catch (error) {
      console.error("Error calculating average rating:", error);
      return { average: 0, count: 0 };
    }
  }

  async create(ratingData) {
    try {
      // Validate required fields
      if (!ratingData.movieId || !ratingData.userId || !ratingData.rating) {
        throw new Error('Missing required fields: movieId, userId, and rating are required');
      }

      if (ratingData.rating < 1 || ratingData.rating > 5) {
        throw new Error('Rating must be between 1 and 5');
      }

      const apperClient = this.getApperClient();
      
      // Check if user already rated this movie
      const existingRating = await this.getUserRatingForMovie(ratingData.movieId, ratingData.userId);
      
      if (existingRating) {
        // Update existing rating instead
        return await this.update(existingRating.Id, {
          rating: ratingData.rating,
          review: ratingData.review || '',
          timestamp: new Date().toISOString()
        });
      }

      // Filter to only include updateable fields and format data
      const filteredData = {};
      this.updateableFields.forEach(field => {
        if (ratingData.hasOwnProperty(field)) {
          if (field === 'movie_id') {
            filteredData[field] = parseInt(ratingData.movieId);
          } else if (field === 'user_id') {
            filteredData[field] = parseInt(ratingData.userId);
          } else if (field === 'rating') {
            filteredData[field] = parseInt(ratingData.rating);
          } else if (field === 'timestamp') {
            filteredData[field] = ratingData.timestamp || new Date().toISOString();
          } else {
            filteredData[field] = ratingData[field];
          }
        }
      });

      // Set default values
      if (!filteredData.review) filteredData.review = '';
      if (!filteredData.timestamp) filteredData.timestamp = new Date().toISOString();

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
          console.error(`Failed to create ${failedRecords.length} ratings:${failedRecords}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          toast.success("Rating created successfully");
          const item = successfulRecords[0].data;
          return {
            ...item,
            movieId: item.movie_id,
            userId: item.user_id
          };
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating rating:", error);
      toast.error("Failed to create rating");
      return null;
    }
  }

  async update(id, updateData) {
    try {
      // Validate rating if provided
      if (updateData.rating && (updateData.rating < 1 || updateData.rating > 5)) {
        throw new Error('Rating must be between 1 and 5');
      }

      const apperClient = this.getApperClient();
      
      // Filter to only include updateable fields and format data
      const filteredData = { Id: parseInt(id) };
      this.updateableFields.forEach(field => {
        if (updateData.hasOwnProperty(field)) {
          if (field === 'movie_id') {
            filteredData[field] = parseInt(updateData.movieId || updateData[field]);
          } else if (field === 'user_id') {
            filteredData[field] = parseInt(updateData.userId || updateData[field]);
          } else if (field === 'rating') {
            filteredData[field] = parseInt(updateData.rating);
          } else if (field === 'timestamp') {
            filteredData[field] = updateData.timestamp || new Date().toISOString();
          } else {
            filteredData[field] = updateData[field];
          }
        }
      });

      // Always update timestamp
      if (!filteredData.timestamp) {
        filteredData.timestamp = new Date().toISOString();
      }

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
          console.error(`Failed to update ${failedUpdates.length} ratings:${failedUpdates}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          toast.success("Rating updated successfully");
          const item = successfulUpdates[0].data;
          return {
            ...item,
            movieId: item.movie_id,
            userId: item.user_id
          };
        }
      }

      return null;
    } catch (error) {
      console.error("Error updating rating:", error);
      toast.error("Failed to update rating");
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
          console.error(`Failed to delete ${failedDeletions.length} ratings:${failedDeletions}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulDeletions.length > 0) {
          toast.success("Rating deleted successfully");
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error("Error deleting rating:", error);
      toast.error("Failed to delete rating");
      return false;
    }
  }

  async deleteByMovieAndUser(movieId, userId) {
    try {
      const existingRating = await this.getUserRatingForMovie(movieId, userId);
      if (!existingRating) {
        throw new Error('Rating not found');
      }

      return await this.delete(existingRating.Id);
    } catch (error) {
      console.error("Error deleting rating by movie and user:", error);
      toast.error("Failed to delete rating");
      return false;
    }
  }

  // Get movie statistics
  async getMovieStats(movieId) {
    try {
      const movieRatings = await this.getByMovieId(movieId);
      
      if (movieRatings.length === 0) {
        return {
          average: 0,
          count: 0,
          distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
        };
      }

      const total = movieRatings.reduce((sum, r) => sum + r.rating, 0);
      const average = Math.round((total / movieRatings.length) * 10) / 10;

      // Calculate rating distribution
      const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      movieRatings.forEach(r => {
        distribution[r.rating]++;
      });

      return {
        average,
        count: movieRatings.length,
        distribution
      };
    } catch (error) {
      console.error("Error getting movie stats:", error);
      return {
        average: 0,
        count: 0,
        distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      };
    }
  }

  // Get ratings with pagination for admin/display purposes
  async getPaginated(page = 1, limit = 10, sortBy = 'timestamp', sortOrder = 'desc') {
    try {
      const apperClient = this.getApperClient();
      const params = {
        fields: this.fields,
        orderBy: [{
          fieldName: sortBy,
          SortType: sortOrder.toUpperCase()
        }],
        pagingInfo: {
          limit: limit,
          offset: (page - 1) * limit
        }
      };

      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return {
          ratings: [],
          pagination: { page, limit, total: 0, totalPages: 0 }
        };
      }

      // Transform the data to match the expected format
      const transformedData = (response.data || []).map(item => ({
        ...item,
        movieId: item.movie_id,
        userId: item.user_id
      }));

      return {
        ratings: transformedData,
        pagination: {
          page,
          limit,
          total: response.totalRecords || transformedData.length,
          totalPages: Math.ceil((response.totalRecords || transformedData.length) / limit)
        }
      };
    } catch (error) {
      console.error("Error fetching paginated ratings:", error);
      return {
        ratings: [],
        pagination: { page, limit, total: 0, totalPages: 0 }
      };
    }
  }
}

export default new RatingService();