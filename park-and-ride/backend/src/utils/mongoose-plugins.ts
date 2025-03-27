import { Schema } from 'mongoose';

/**
 * Plugin to add pagination functionality to models
 */
export const paginationPlugin = (schema: Schema) => {
  schema.statics.paginate = async function(query = {}, options = {}) {
    const { 
      page = 1, 
      limit = 10, 
      sort = { createdAt: -1 },
      populate = [],
      select = '',
    } = options;
    
    const skip = (Number(page) - 1) * Number(limit);
    
    // Execute queries in parallel for better performance
    const [data, total] = await Promise.all([
      this.find(query)
        .sort(sort)
        .skip(skip)
        .limit(Number(limit))
        .populate(populate)
        .select(select),
      this.countDocuments(query),
    ]);
    
    // Calculate pagination metadata
    const pages = Math.ceil(total / Number(limit));
    const currentPage = Number(page);
    const hasNextPage = currentPage < pages;
    const hasPrevPage = currentPage > 1;
    
    return {
      data,
      pagination: {
        total,
        page: currentPage,
        pages,
        limit: Number(limit),
        hasNextPage,
        hasPrevPage,
        nextPage: hasNextPage ? currentPage + 1 : null,
        prevPage: hasPrevPage ? currentPage - 1 : null,
      },
    };
  };
};

/**
 * Plugin to add search functionality to models
 */
export const searchPlugin = (schema: Schema, searchFields: string[]) => {
  schema.statics.search = async function(searchTerm = '', options = {}) {
    if (!searchTerm || typeof searchTerm !== 'string') {
      return this.paginate({}, options);
    }
    
    // Create search query based on provided fields
    const searchQuery = {
      $or: searchFields.map(field => ({
        [field]: { $regex: new RegExp(searchTerm, 'i') },
      })),
    };
    
    return this.paginate(searchQuery, options);
  };
};

/**
 * Plugin to add audit fields to models
 */
export const auditPlugin = (schema: Schema) => {
  // Add fields for audit tracking
  schema.add({
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  });
  
  // Pre-save middleware to update timestamps
  schema.pre('save', function(next) {
    if (this.isNew && this._createdBy) {
      this.createdBy = this._createdBy;
    }
    
    if (this._updatedBy) {
      this.updatedBy = this._updatedBy;
    }
    
    next();
  });
  
  // Method to set created by user
  schema.methods.setCreatedBy = function(userId) {
    this._createdBy = userId;
    return this;
  };
  
  // Method to set updated by user
  schema.methods.setUpdatedBy = function(userId) {
    this._updatedBy = userId;
    return this;
  };
};

/**
 * Soft delete plugin
 */
export const softDeletePlugin = (schema: Schema) => {
  // Add deleted field
  schema.add({
    deleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    deletedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  });
  
  // Add query helpers to filter deleted documents
  schema.query.includeDeleted = function() {
    return this.find({ $or: [{ deleted: false }, { deleted: true }] });
  };
  
  schema.query.onlyDeleted = function() {
    return this.find({ deleted: true });
  };
  
  // Methods for soft deletion
  schema.methods.softDelete = async function(userId = null) {
    this.deleted = true;
    this.deletedAt = new Date();
    
    if (userId) {
      this.deletedBy = userId;
    }
    
    return this.save();
  };
  
  // Methods for restoring
  schema.methods.restore = async function() {
    this.deleted = false;
    this.deletedAt = null;
    this.deletedBy = null;
    
    return this.save();
  };
  
  // Modify all query methods to exclude deleted documents by default
  ['find', 'findOne', 'findById', 'countDocuments', 'count'].forEach((method) => {
    schema.pre(method, function() {
      // Add deleted:false to query conditions by default
      // unless includeDeleted or onlyDeleted was explicitly called
      if (!(this as any)._includeDeleted) {
        this.where({ deleted: false });
      }
    });
  });
};

/**
 * Apply all plugins
 */
export const applyPlugins = (schema: Schema, options: {
  searchFields?: string[];
  audit?: boolean;
  softDelete?: boolean;
} = {}) => {
  // Apply pagination by default
  paginationPlugin(schema);
  
  // Apply search if fields provided
  if (options.searchFields && options.searchFields.length > 0) {
    searchPlugin(schema, options.searchFields);
  }
  
  // Apply audit if enabled
  if (options.audit) {
    auditPlugin(schema);
  }
  
  // Apply soft delete if enabled
  if (options.softDelete) {
    softDeletePlugin(schema);
  }
  
  return schema;
}; 