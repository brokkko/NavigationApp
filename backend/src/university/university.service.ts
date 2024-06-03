import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UniversityRepository } from './university.repository';
import { University } from './models/university.entity';

@Injectable()
export class UniversityService {
    constructor(
        @InjectRepository(UniversityRepository)
        private universityRepository: UniversityRepository,
    ) {}

    async getUniversityById(id: string): Promise<University> {
        const university = await this.universityRepository.findUniversityById(id);
        if (!university) {
            throw new NotFoundException(`University with ID "${id}" not found`);
        }
        return university;
    }

    async getAllUniversities(): Promise<University[]> {
        return await this.universityRepository.findAllUniversities();
    }

    async createUniversity(universityData: Partial<University>): Promise<University> {
        return await this.universityRepository.createUniversity(universityData);
    }

    async updateUniversity(id: string, updateData: Partial<University>): Promise<University> {
        await this.getUniversityById(id); // Проверяем, существует ли университет
        return await this.universityRepository.updateUniversity(id, updateData);
    }

    async deleteUniversity(id: string): Promise<void> {
        const result = await this.universityRepository.deleteUniversity(id);
        if (result.affected === 0) {
            throw new NotFoundException(`University with ID "${id}" not found`);
        }
    }

}