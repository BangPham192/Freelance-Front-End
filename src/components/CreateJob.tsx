import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../data/enum/UserRole';
import ErrorMessage from './ErrorMessage';
import SuccessMessage from './SuccessMessage';
import { Navigate, useNavigate } from 'react-router-dom';
import { createJob, getAllSkills, Skill } from '../services/api';
import { CreateJobRequest } from "src/data/request/CreateJobRequest";
import { Input, Button, Form, Select } from 'antd';
import { Editor } from '@tinymce/tinymce-react';

const CreateJob: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [skills, setSkills] = useState<Skill[]>([]);

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const skillsList = await getAllSkills();
                setSkills(skillsList);
            } catch (err) {
                ErrorMessage({ message: 'Failed to fetch skills' });
            }
        };
        fetchSkills();
    }, []);

    // Check if user has permission to create job
    const hasPermission = user?.roles?.some(role => 
        [UserRole.ADMIN, UserRole.CLIENT].includes(role as UserRole)
    );

    if (!hasPermission) {
        return <Navigate to="/jobs" replace />;
    }

    const handleFinish = async (values: CreateJobRequest) => {
        if (values.budgetMax < values.budgetMin) {
            ErrorMessage({ message: 'Maximum budget cannot be less than minimum budget' });
            return;
        }

        try {
            await createJob(values);
            SuccessMessage({ message: 'Job created successfully!' });
            navigate('/jobs');
        } catch (err) {
            ErrorMessage({ message: 'Failed to create job. Please try again.' });
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6">Create New Job</h2>
            
            <Form
                form={form}
                onFinish={handleFinish}
                layout="vertical"
                initialValues={{
                    title: '',
                    description: '',
                    requirements: '',
                    benefits: '',
                    budgetMin: 0,
                    budgetMax: 0,
                    skills: []
                }}
            >
                <Form.Item
                    name="title"
                    label="Title"
                    rules={[{ required: true, message: 'Please input the job title!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="description"
                    label="Description"
                    rules={[{ required: true, message: 'Please input the job description!' }]}
                >
                    <Editor
                        apiKey="c5wpol2qzuov16a6hrgbda2subrhh427lf06zm9jp8qr1ptd"
                        initialValue="<ul><li>Enter job description here...</li></ul>"
                        init={{
                            height: 300,
                            menubar: false,
                            plugins: [
                                'advlist', 'autolink', 'lists', 'link', 'charmap', 'preview',
                                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                'insertdatetime', 'media', 'table', 'help', 'wordcount'
                            ],
                            toolbar: 'undo redo | formatselect | ' +
                                'bold italic backcolor | alignleft aligncenter ' +
                                'alignright alignjustify | bullist numlist outdent indent | ' +
                                'removeformat | help'
                        }}
                        onEditorChange={(content: any) => {
                            console.log('Description content:', content);
                            if (typeof content === 'object' && content.content) {
                                form.setFieldValue('description', content.content);
                            } else {
                                form.setFieldValue('description', content);
                            }
                        }}
                    />
                </Form.Item>

                <Form.Item
                    name="requirements"
                    label="Requirements"
                    rules={[{ required: true, message: 'Please input the job requirements!' }]}
                >
                    <Editor
                        apiKey="c5wpol2qzuov16a6hrgbda2subrhh427lf06zm9jp8qr1ptd"
                        initialValue="<ul><li>Enter job requirements here...</li></ul>"
                        init={{
                            height: 300,
                            menubar: false,
                            plugins: [
                                'advlist', 'autolink', 'lists', 'link', 'charmap', 'preview',
                                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                'insertdatetime', 'media', 'table', 'help', 'wordcount'
                            ],
                            toolbar: 'undo redo | formatselect | ' +
                                'bold italic backcolor | alignleft aligncenter ' +
                                'alignright alignjustify | bullist numlist outdent indent | ' +
                                'removeformat | help'
                        }}
                        onEditorChange={(content: any) => {
                            console.log('Requirements content:', content);
                            if (typeof content === 'object' && content.content) {
                                form.setFieldValue('requirements', content.content);
                            } else {
                                form.setFieldValue('requirements', content);
                            }
                        }}
                    />
                </Form.Item>

                <Form.Item
                    name="benefits"
                    label="Benefits"
                    rules={[{ required: true, message: 'Please input the job benefits!' }]}
                >
                    <Editor
                        apiKey="c5wpol2qzuov16a6hrgbda2subrhh427lf06zm9jp8qr1ptd"
                        initialValue="<ul><li>Enter job benefits here...</li></ul>"
                        init={{
                            height: 300,
                            menubar: false,
                            plugins: [
                                'advlist', 'autolink', 'lists', 'link', 'charmap', 'preview',
                                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                'insertdatetime', 'media', 'table', 'help', 'wordcount'
                            ],
                            toolbar: 'undo redo | formatselect | ' +
                                'bold italic backcolor | alignleft aligncenter ' +
                                'alignright alignjustify | bullist numlist outdent indent | ' +
                                'removeformat | help'
                        }}
                        onEditorChange={(content: any) => {
                            console.log('Benefits content:', content);
                            if (typeof content === 'object' && content.content) {
                                form.setFieldValue('benefits', content.content);
                            } else {
                                form.setFieldValue('benefits', content);
                            }
                        }}
                    />
                </Form.Item>

                <Form.Item
                    name="skills"
                    label="Required Skills"
                    rules={[{ required: true, message: 'Please select at least one skill!' }]}
                >
                    <Select
                        mode="multiple"
                        placeholder="Select required skills"
                        options={skills.map(skill => ({
                            key: skill.publicId,
                            label: skill.name,
                            value: skill.publicId
                        }))}
                    />
                </Form.Item>

                <div className="grid grid-cols-2 gap-4">
                    <Form.Item
                        name="budgetMin"
                        label="Minimum Budget"
                        rules={[{ required: true, message: 'Please input the minimum budget!' }]}
                    >
                        <Input
                            type="number"
                            min={0}
                        />
                    </Form.Item>

                    <Form.Item
                        name="budgetMax"
                        label="Maximum Budget"
                        rules={[{ required: true, message: 'Please input the maximum budget!' }]}
                    >
                        <Input
                            type="number"
                            min={0}
                        />
                    </Form.Item>
                </div>

                <Form.Item>
                    <Button 
                        type="primary" 
                        htmlType="submit"
                        className="w-full"
                    >
                        Create Job
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default CreateJob;