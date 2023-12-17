const errorHandler = require('../../src/middleware/errorHandler');

describe('errorHandler', () => {
  it('should handle an error with status code and message', () => {
    const err = new Error('Sample error');
    err.statusCode = 404;

    const res = {
      status: jest.fn(() => res),
      send: jest.fn(),
    };

    errorHandler(err, {}, res, {});

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith({
      success: false,
      status: 404,
      message: 'Sample error',
      stack: 'development', // Assuming development environment
    });
  });

  it('should handle an error without status code and default to 500', () => {
    const err = new Error('Sample error without status code');

    const res = {
      status: jest.fn(() => res),
      send: jest.fn(),
    };

    errorHandler(err, {}, res, {});

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith({
      success: false,
      status: 500,
      message: 'Sample error without status code',
      stack: 'development', // Assuming development environment
    });
  });
});
