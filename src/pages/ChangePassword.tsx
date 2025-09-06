import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { changePassWord } from '../services/api';
import ErrorMessage from '../components/ErrorMessage';
import SuccessMessage from '../components/SuccessMessage';

const { Title } = Typography;

const ChangePassword: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values: { oldPassword: string; newPassword: string; confirmPassword: string }) => {
        if (values.newPassword !== values.confirmPassword) {
            ErrorMessage({
                message: 'Password Mismatch',
                description: 'New password and confirm password do not match.'
            });
            return;
        }

        try {
            setLoading(true);
            await changePassWord(values.oldPassword, values.newPassword);
            SuccessMessage({
                message: 'Password Changed',
                description: 'Your password has been changed successfully.'
            });
            navigate('/jobs');
        } catch (error) {
            ErrorMessage({
                message: 'Change Password Failed',
                description: error instanceof Error ? error.message : 'Failed to change password. Please try again.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Card className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Title level={2}>Change Password</Title>
                </div>

                <Form
                    name="changePassword"
                    onFinish={onFinish}
                    layout="vertical"
                    size="large"
                >
                    <Form.Item
                        name="oldPassword"
                        label="Current Password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your current password!',
                            },
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined className="text-gray-400" />}
                            placeholder="Current password"
                            disabled={loading}
                        />
                    </Form.Item>

                    <Form.Item
                        name="newPassword"
                        label="New Password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your new password!',
                            },
                            {
                                min: 8,
                                message: 'Password must be at least 8 characters long',
                            },
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined className="text-gray-400" />}
                            placeholder="New password"
                            disabled={loading}
                        />
                    </Form.Item>

                    <Form.Item
                        name="confirmPassword"
                        label="Confirm New Password"
                        rules={[
                            {
                                required: true,
                                message: 'Please confirm your new password!',
                            },
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined className="text-gray-400" />}
                            placeholder="Confirm new password"
                            disabled={loading}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="default"
                            htmlType="submit"
                            className="w-full"
                            loading={loading}
                        >
                            Change Password
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default ChangePassword;