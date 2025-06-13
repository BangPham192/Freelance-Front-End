import { notification } from 'antd';

interface ErrorMessageProps {
  message: string;
  description?: string;
}

export const ErrorMessage = ({ message, description }: ErrorMessageProps) => {
  notification.error({
    message,
    description: description || 'An error occurred. Please try again.',
    placement: 'topRight',
    duration: 1
  });
};

export default ErrorMessage;