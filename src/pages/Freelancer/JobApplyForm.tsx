import { useState } from "react";
import { applyForJob } from "../../services/api";
import { Input, InputNumber, DatePicker, Button, Upload, Form } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";

const { TextArea } = Input;

const JobApplyForm = ({ jobId }: { jobId: string }) => {
    const [form] = Form.useForm();
    const [attachment, setAttachment] = useState<UploadFile[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (values: any) => {
        setSubmitting(true);
        setError(null);
        setSuccess(false);
        try {
            const formData = new FormData();
            const requestData = {
                coverLetter: values.coverLetter.toString(),
                expectedFee: values.expectedFee.toString(),
                estimatedTime: values.estimatedTime.toString(),
            }
            formData.append("data", JSON.stringify(requestData));
            attachment.forEach(file => {
                if (file.originFileObj) {
                    formData.append("files", file.originFileObj as File);
                }
            });
            // TODO: Update applyForJob to accept FormData if backend supports it
            for (const pair of formData.entries()) {
                console.log('formData entry', pair[0], pair[1]);
            }
            await applyForJob(jobId, formData);
            setSuccess(true);
            form.resetFields();
            setAttachment([]);
        } catch (err: any) {
            setError("Failed to apply for job.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <Form
                form={form}
                layout="vertical"
                className="flex flex-col gap-4"
                onFinish={handleSubmit}
            >
            <Form.Item
                label="Cover Letter"
                name="coverLetter"
                rules={[{ required: true, message: "Please enter your cover letter" }]}
            >
                <TextArea rows={4} className="resize-none" />
            </Form.Item>
            <Form.Item
                label="Expected Fee ($)"
                name="expectedFee"
                rules={[{ required: true, message: "Please enter your expected fee" }]}
            >
                <InputNumber className="w-full" min={0} />
            </Form.Item>
            <Form.Item
                label="Estimated Time (days)"
                name="estimatedTime"
                rules={[{ required: true, message: "Please enter estimated time" }]}
            >
                <InputNumber className="w-full" min={1} />
            </Form.Item>
            <Form.Item
                label="Start Date"
                name="startDate"
                rules={[{ required: true, message: "Please select a start date" }]}
            >
                <DatePicker className="w-full" format="YYYY-MM-DD" />
            </Form.Item>
            <Form.Item label="Attachment" name="attachment">
                <Upload
                    beforeUpload={() => false}
                    fileList={attachment}
                    onChange={({ fileList }) => setAttachment(fileList)}
                    maxCount={1}
                >
                    <Button icon={<UploadOutlined />}>Select File</Button>
                </Upload>
                {attachment.length > 0 && (
                    <span className="text-sm text-gray-600 ml-2">{attachment[0].name}</span>
                )}
            </Form.Item>
            <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
                className="bg-blue-600 hover:bg-blue-700"
                block
            >
                {submitting ? "Submitting..." : "Apply"}
            </Button>
            {success && <div className="text-green-600">Application submitted!</div>}
            {error && <div className="text-red-600">{error}</div>}
        </Form>
        </>
    );
};

export default JobApplyForm;