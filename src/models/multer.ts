import multer from 'multer';

// Create a middleware object to configure the file upload settings
const upload = multer({ dest: 'uploads/' });

// Export the middleware object to be used in other parts of the application
export default upload;