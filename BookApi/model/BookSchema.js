const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://Ravii_1996:Qwerty%2397@cluster0-r98r8.mongodb.net/book" , { useNewUrlParser: true, useUnifiedTopology: true });
var Schema = mongoose.Schema;
const conn = mongoose.connection;

// check db is connected or not..
conn.on('connected', () => {
  console.log('MongoDB connected')
});

// if db is not connected then throw err
conn.on('error', (err) => {
  if (err) {
    throw err;
  }
});

// This schema hold necessary details of book
var VolumeInfo = new Schema({
	title: {
		type: String,
		required: true,
		unique: true
	},
	authors: [String],
	publisher: String,
	publishedDate: String,
	industryIdentifiers: [{
		"types": String,
		identifier: Number
	  }],
	readingModes: {
	  text: Boolean,
	  image: Boolean
	},
	pageCount: Number,
	printType: String,
	averageRating: Number,
	ratingsCount: Number,
	maturityRating: String,
	allowAnonLogging: Boolean,
	contentVersion: String,
	panelizationSummary: {
	  containsEpubBubbles: Boolean,
	  containsImageBubbles: Boolean
	},
	imageLinks: {
	  smallThumbnail: String
	},
	language: String,
	previewLink: String
})

// BookSchema holds all the meta details along with VolumeInfo schema..
var BookSchema = new Schema({
  id: {
    type: String,
    required: true,
	unique: true
  },
  etag: {
    type: String,
    required: true,
	  unique: true
  },
  selfLink: String,
  volumeInfo: {
    type: VolumeInfo,
    required: true
  },
  saleInfo: {
    country: String,
    saleability: String,
    isEbook: Boolean
  },
  accessInfo:{
	country: String,
	viewability: String,
	embeddable: Boolean,
	publicDomain: Boolean,
	textToSpeechPermission: String,
	epub: {
	  isAvailable: Boolean
	},
	pdf: {
	  isAvailable: Boolean
	},
	webReaderLink: String,
	accessViewStatus: String,
	quoteSharingAllowed: Boolean  
  },
  searchInfo:{
	textSnippet: String
  }
  
});

//export
var Books = module.exports = mongoose.model('Books', BookSchema);

/**
 * scheduler function does:-
 * Delete all present data..
 * Insert all new data..
 */
module.exports.scheduler = async function (data, callback) {
  await Books.deleteMany(callback);
  await Books.insertMany(data, callback);
}

// Find book title in db if we get particular book render into output view page.
module.exports.findBook = async function (title, callback) {
  Books.find({ 'volumeInfo.title': title }, callback);
}