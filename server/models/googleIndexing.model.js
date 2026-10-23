const mongoose = require('mongoose');

const googleIndexingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // From Step 1
  packageId: { type: String, required: true }, // 'starter', 'growth', 'scale'
  packageName: { type: String, required: true }, // 'Starter', etc.
  totalPrice: { type: Number, required: true }, // 45, 120, 350
  
  // From Step 2
  website: { type: String, required: true },
  property: { type: String, required: true },
  propertyType: { type: String, enum: ['Domain', 'URL-prefix'], default: 'Domain' },
  sitemap: { type: String, default: '' },
  urls: [{ type: String, required: true }],
  totalUrls: { type: Number, required: true },

  // From Step 3
  locale: { type: String, default: 'United States · English' },
  priority: { type: String, enum: ['Standard', 'High'], default: 'Standard' },
  trackingDays: { type: String, default: '30' },
  frequency: { type: String, enum: ['Weekly', 'Daily'], default: 'Weekly' },
  notes: { type: String, default: '' },

  // System fields
  orderId: { type: String, required: true, unique: true }, // e.g., GIDX-A1B2C3
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('GoogleIndexingOrder', googleIndexingSchema);