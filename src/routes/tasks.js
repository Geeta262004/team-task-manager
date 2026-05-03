const router    = require('express').Router({ mergeParams: true });
const auth      = require('../middleware/auth');
const roleGuard = require('../middleware/roleGuard');
const c         = require('../controllers/taskController');

router.use(auth);

router.post('/',          c.createTask);
router.get('/',           c.getTasks);
router.put('/:taskId',    c.updateTask);
router.delete('/:taskId', roleGuard('ADMIN'), c.deleteTask);

module.exports = router; 
