import { NotFoundError, ValidationError } from '../errors.js';

export class PharmacyService {
  constructor(pharmacyRepository) {
    this.pharmacyRepository = pharmacyRepository;
  }

  listPharmacies() {
    return this.pharmacyRepository.findAll();
  }

  async getPharmacy(id) {
    const pharmacy = await this.pharmacyRepository.findById(id);
    if (!pharmacy) throw new NotFoundError(`Pharmacie ${id} introuvable`);
    return pharmacy;
  }

  createPharmacy(input) {
    const missing = ['name', 'address', 'city', 'postalCode'].filter((field) => !input?.[field]);
    if (missing.length) {
      throw new ValidationError(`Champs obligatoires manquants : ${missing.join(', ')}`);
    }
    return this.pharmacyRepository.create(input);
  }
}
