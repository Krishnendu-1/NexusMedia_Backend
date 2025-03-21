import {healthCheck} from '../controllers/healthCheck.controller.js'
import {Router} from 'express'


const HealthCheckrouter = Router();

HealthCheckrouter.get('/',healthCheck);

export default HealthCheckrouter
