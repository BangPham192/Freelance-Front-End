import {JobDto} from "src/data/models/JobDto";
import {JobApplicationsBaseDto} from "src/data/models/JobApplicationsBaseDto";

export interface JobApplicationsDto extends JobApplicationsBaseDto{
    job?: JobDto
}