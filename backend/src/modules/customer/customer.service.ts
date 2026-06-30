import { CustomerRepository } from "./customer.repository.js";

const repo = new CustomerRepository();

export class CustomerService {
  createCustomer(data: any) {
    return repo.create(data);
  }

  getCustomers() {
    return repo.findAll();
  }

  updateCustomer(id: number, data: any) {
    return repo.update(id, data);
  }

  deleteCustomer(id: number) {
    return repo.softDelete(id);
  }
}