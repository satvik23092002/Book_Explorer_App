const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema(
	{
		title: { type: String, required: true, index: true },
		price: { type: Number, index: true },
		rating: { type: Number, index: true },
		inStock: { type: Boolean, index: true },
		stockCount: { type: Number },
		availabilityText: { type: String },
		detailUrl: { type: String, required: true, unique: true },
		imageUrl: { type: String },
	},
	{ timestamps: true }
);

BookSchema.index({ title: 'text' });

const Book = mongoose.model('Book', BookSchema);

module.exports = { Book };

