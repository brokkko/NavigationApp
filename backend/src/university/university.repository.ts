import { EntityRepository, Repository } from 'typeorm';
import { University } from './models/university.entity';

@EntityRepository(University)
export class UniversityRepository extends Repository<University> {

    async findUniversityById(id: string): Promise<University | undefined> {
        return await this.findOne(id);
    }

    async findAllUniversities(): Promise<University[]> {
        return await this.find();
    }

    async createUniversity(universityData: Partial<University>): Promise<University> {
        const university = this.create(universityData);
        return await this.save(university);
    }

    async updateUniversity(id: string, updateData: Partial<University>): Promise<University> {
        await this.update(id, updateData);
        return this.findUniversityById(id);
    }

    async deleteUniversity(id: string): Promise<void> {
        await this.delete(id);
    }

}