export interface CreateJobRequest {
    title: string;
    description: string;
    requirements: string;
    benefits: string;
    budgetMin: number;
    budgetMax: number;
    skills: string[]; // Array of skill publicIds
}