import {useEffect, useState} from "react";
import JobApplyForm from "./JobApplyForm";
import {getJobDetail} from "../../services/api";
import {JobDto} from "../../data/models/JobDto";
import {useNavigate, useParams} from "react-router-dom";
import {Button} from "antd";
import {ArrowLeftOutlined} from "@ant-design/icons";
import {useAuth} from "../../contexts/AuthContext";
import {UserRole} from '../../data/enum/UserRole';
import ApproveProposal from "../../pages/client/ApproveProposal";

const JobApply = () => {
    const navigate = useNavigate();
    const {user} = useAuth();
    const {jobId} = useParams<{ jobId: string }>();
    const [job, setJob] = useState<JobDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!jobId) return;
        fetchJob(jobId);
    }, []);
    const fetchJob = async (jobId: string) => {
        setLoading(true);
        setError(null);
        try {
            const data = await getJobDetail(jobId);
            setJob(data);
        } catch (err: any) {
            setError("Failed to load job details.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="p-8">
                <Button
                    icon={<ArrowLeftOutlined/>}
                    onClick={() => navigate(-1)}
                    type="default"
                >
                    Back
                </Button>
            </div>
            <div className="flex flex-row bg-gray-100 p-8">
                {/* Left: Job Details */}
                <div className="w-1/2 bg-white rounded-lg shadow-md p-8 mr-4 flex flex-col">
                    {loading ? (
                        <div>Loading...</div>
                    ) : error ? (
                        <div className="text-red-600">{error}</div>
                    ) : job ? (
                        <>
                            <h2 className="text-xl font-bold mb-2">{job.title}</h2>
                            <div className="mt-4 mb-3">
                                <p className="font-semibold text-lg">Job Description</p>
                                <div
                                    dangerouslySetInnerHTML={{__html: job.description}}
                                    className="prose max-w-none text-gray-700"
                                />
                            </div>
                            <div className="mb-3">
                                <p className="font-semibold text-lg">Requirements</p>
                                <div
                                    dangerouslySetInnerHTML={{__html: job.requirements}}
                                    className="prose max-w-none text-gray-700"
                                />
                            </div>
                            <div className="mb-3">
                                <p className="font-semibold text-lg">Benefits</p>
                                <div
                                    dangerouslySetInnerHTML={{__html: job.benefits}}
                                    className="prose max-w-none text-gray-700"
                                />
                            </div>
                            <div className="text-sm text-gray-500">
                                <div>
                                    Budget: ${job.budgetMin}
                                    {typeof job.budgetMax === "number" && job.budgetMax !== job.budgetMin
                                        ? ` - $${job.budgetMax}`
                                        : ""}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div>No job found.</div>
                    )}
                </div>

                {/* Right: Freelancer Application */}
                <div className="w-1/2 bg-white rounded-lg shadow-md p-8 flex flex-col">
                    {user?.roles?.some(role => role === UserRole.CLIENT) ? (
                        <div className="text-red-600">
                            {jobId && <ApproveProposal/>}
                        </div>
                    ) : (
                        <>
                            <h2 className="text-xl font-bold mb-4">Apply for this Job</h2>
                            {jobId && <JobApplyForm jobId={jobId}/>}
                        </>
                    )
                    }
                </div>
            </div>
        </>
    );
};

export default JobApply;