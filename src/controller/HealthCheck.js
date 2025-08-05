class HealthCheckController {
  async check(req, res) {
    try {
      
      res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      res.status(500).json({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error.message
      });
    }
  }

  async live(req, res) {
    try {
      res.status(200).json({
        status: 'live',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      res.status(500).json({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error.message
      });
    }
  }
}

module.exports = HealthCheckController;
