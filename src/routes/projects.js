const router    = require('express').Router();
const auth      = require('../middleware/auth');
const roleGuard = require('../middleware/roleGuard');
const c         = require('../controllers/projectController');

router.use(auth);

router.post('/',             c.createProject);
router.get('/',              c.getProjects);
router.get('/:id',           c.getProject);
router.put('/:id',           c.updateProject);
router.delete('/:id',        roleGuard('ADMIN'), c.deleteProject);
router.post('/:id/members',  c.addMember);

module.exports = router; 
