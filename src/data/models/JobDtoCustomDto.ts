export interface JobDtoCustomDto {
    id: number;
    title: string;
    description: string;
    requirements: string;
    benefits: string;
    status: string;
    budgetMin: number;
    budgetMax: number;
    salary: string;
    skills: string[];
    createdAt: string;
    company: string;
    location: string;
}