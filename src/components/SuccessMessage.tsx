import { notification } from 'antd';

interface SuccessMessageProps {
  message: string;
  description?: string;
}

export const SuccessMessage = ({ message, description }: SuccessMessageProps) => {
  notification.success({
    message,
    description: description || 'Operation completed successfully.',
    placement: 'topRight',
    duration: 1
  });
};

export default SuccessMessage;