import { getCustomers }              from '../controllers/customer/GetCustomersController.js';
import { getCustomerByIdController } from '../controllers/customer/GetCustomerByIdController.js';
import { createCustomerController }  from '../controllers/customer/CreateCustomerController.js';
import { updateCustomerController }  from '../controllers/customer/UpdateCustomerController.js';
import { deleteCustomerController }  from '../controllers/customer/DeleteCustomerController.js';
import authMiddleware                from '../middlewares/authMiddleware.js';

const customerRoutes = (app) => {
    app.get('/customers',        authMiddleware, getCustomers);
    app.get('/customers/:id',    authMiddleware, getCustomerByIdController);
    app.post('/customers',       authMiddleware, createCustomerController);
    app.put('/customers/:id',    authMiddleware, updateCustomerController);
    app.delete('/customers/:id', authMiddleware, deleteCustomerController);
};

export default customerRoutes;