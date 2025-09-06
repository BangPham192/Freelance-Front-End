import React, {useState} from 'react';
import {Link, useNavigate, useLocation} from 'react-router-dom';
import {Form, Input, Button, Card, Typography} from 'antd';
import ErrorMessage from '../components/ErrorMessage';
import SuccessMessage from '../components/SuccessMessage';
import {UserOutlined, LockOutlined} from '@ant-design/icons';
import {useAuth} from '../contexts/AuthContext';

const {Title} = Typography;

interface LocationState {
    from: {
        pathname: string;
    };
}

const LoginPage: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const {login} = useAuth();

    const from = (location.state as LocationState)?.from?.pathname || '/jobs';

    const onFinish = async (values: { email: string; password: string }) => {
        try {
            setLoading(true);
            await login(values.email, values.password);
            SuccessMessage({
                message: 'Login Successful',
                description: 'Welcome back! You have been logged in successfully.'
            });
            navigate(from, {replace: true});
        } catch (error) {
            ErrorMessage({
                message: 'Login Failed',
                description: error instanceof Error ? error.message : 'Invalid credentials. Please try again.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Card className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Title level={2}>Sign in to your account</Title>
                </div>

                <Form
                    name="login"
                    initialValues={{remember: true}}
                    onFinish={onFinish}
                    layout="vertical"
                    size="large"
                >
                    <Form.Item
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your email!',
                            },
                            {
                                type: 'email',
                                message: 'Please enter a valid email!',
                            },
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined className="text-gray-400"/>}
                            placeholder="Email address"
                            disabled={loading}
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your password!',
                            },
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined className="text-gray-400"/>}
                            placeholder="Password"
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
                            Sign in
                        </Button>
                    </Form.Item>
                </Form>

                <div className="text-center">
                    <Typography.Text className="text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-blue-600 hover:text-blue-500">
                            Register here
                        </Link>
                    </Typography.Text>
                </div>
            </Card>
        </div>
    );
};

export default LoginPage;