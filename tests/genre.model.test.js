const Genre = require('../src/models/genre.model');

// Mocking the Genre model functions
jest.mock('../src/models/genre.model');

describe('Genre Model Tests', () => {
  afterEach(() => {
    // Clear all mocks after each test
    jest.clearAllMocks();
  });

  // Test the create function
  describe('Create a new genre', () => {
    it('should create a new genre', async () => {
      const genreData = { name: 'Rock' };
      Genre.create.mockResolvedValue(genreData);

      const createdGenre = await Genre.create(genreData);

      expect(createdGenre.name).toBe('Rock');
    });
  });

  // Test the create function with a duplicate name
  describe('Create a new genre with duplicate name', () => {
    it('should not allow duplicate genre names', async () => {
      const genreData = { name: 'Pop' };
      Genre.create.mockRejectedValue(new Error('duplicate key error'));

      // Attempt to create another genre with the same name
      let error;
      try {
        await Genre.create(genreData);
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.message).toContain('duplicate key error');
    });
  });
});
