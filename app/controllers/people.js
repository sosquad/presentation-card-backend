const crudController = require('@23people/moonbase-express/crud-controller');
const service = require('../services/people-service');

module.exports = router => {
  router.get('/all', (req, res) => crudController.findAll(req, res, service));

  router.get('/:id', (req, res) => crudController.findById(req, res, service));

  router.get('/', (req, res) => crudController.findPaginated(req, res, service));

  router.post('/undo/:id', (req, res) => crudController.undo(req, res, service));

  router.post('/import', (req, res) => crudController.bulk(req, res, service));

  router.post('/bulk-unordered', (req, res) => crudController.bulkUnordered(req, res, service));

  router.post('/', (req, res) => crudController.createUpdate(req, res, service));

  router.put('/:id', (req, res) => crudController.update(req, res, service));

  router.delete('/:id', (req, res) => crudController.delete(req, res, service));

  router.post('/verify', crudController.validate(service), (req, res) => {
    return res.json({ todo: 'ok' });
  });

  router.post('/upload-file', (req, res) => {
    // file is automatically removed once finished
    const { name, path, size, type } = req.files.file;

    return res.json({ name, path, size, type });
  });
};
