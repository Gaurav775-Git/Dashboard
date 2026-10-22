export const mapApiError = (error) => {
  // Our new backend throws: { status: 400, message: "User already exists" }
  if (error.message) {
    return {
      message: error.message,
      fields: {} // We don't have specific field errors from the backend anymore
    }
  }

  return {
    message: 'An unexpected error occurred. Please try again.',
    fields: {}
  }
}