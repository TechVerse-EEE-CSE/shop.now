import './ui-toast.js';
import './navigation.js';
import './auth-ui.js';
import './auth-actions.js';
import './auth-state.js';
import './categories.js';
import './product-modal.js';
import './cart.js';
import './voucher.js';
import './payment.js';
import './checkout.js';

import { loadProductsFromFirestore } from './products.js';

loadProductsFromFirestore();
