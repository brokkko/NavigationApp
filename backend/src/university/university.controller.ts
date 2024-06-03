import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { UniversityService } from './university.service';
import { University } from './models/university.entity';

@Controller('universities')
export class UniversityController {
    constructor(private universityService: UniversityService) {}

    @Get(':id')
    async getUniversityById(@Param('id') id: string): Promise<University | undefined> {
        return this.universityService.getUniversityById(id);
    }

    @Get()
    async getAllUniversities(): Promise<University[]> {
        return this.universityService.getAllUniversities();
    }

    @Post()
    async createUniversity(@Body() universityData: Partial<University>): Promise<University> {
        return this.universityService.createUniversity(universityData);
    }

    @Put(':id')
    async updateUniversity(@Param('id') id: string, @Body() updateData: Partial<University>): Promise<University> {
        return this.universityService.updateUniversity(id, updateData);
    }

    @Delete(':id')
    async deleteUniversity(@Param('id') id: string): Promise<void> {
        return this.universityService.deleteUniversity(id);
    }
}