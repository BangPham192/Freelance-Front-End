import {JobApplicationsBaseDto} from "src/data/models/JobApplicationsBaseDto";

export interface JobDto {
    id: number;
    title: string;
    description: string;
    requirements: string;
    benefits: string;
    status: string;
    budgetMin: number;
    budgetMax: number;
    skills: string[];
    createdAt: string;
    location: string;
    clientName: string;
    jobApplications: JobApplicationsBaseDto[];
}