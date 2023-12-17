const GenreController = require('../src/controllers/genre.controller');
const Genre = require('../src/models/genre.model');

// Mocking the Genre model functions
jest.mock('../src/models/genre.model');

describe('Genre Controller', () => {
  afterEach(() => {
    // Clear all mocks after each test
    jest.clearAllMocks();
  });

  // Test the getGenres function
  describe('getGenres', () => {
    it('should get all genres', async () => {
      const genres = [{ name: 'Rock' }, { name: 'Pop' }];
      Genre.find.mockResolvedValue(genres);

      const req = {};
      const res = {
        json: jest.fn(),
        status: jest.fn(),
      };

      await GenreController.getGenres(req, res);

      expect(res.json).toHaveBeenCalledWith(genres);
      expect(res.status).not.toHaveBeenCalled();
    });
  });

  // Test the getGenreById function
  describe('getGenreById', () => {
    it('should get a genre by ID', async () => {
      const genre = { name: 'Rock' };
      Genre.findById.mockResolvedValue(genre);

      const req = { params: { id: '123' } };
      const res = {
        json: jest.fn(),
        status: jest.fn(),
      };

      await GenreController.getGenreById(req, res);

      expect(res.json).toHaveBeenCalledWith(genre);
      expect(res.status).not.toHaveBeenCalled();
    });
  });
});
