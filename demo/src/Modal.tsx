// @ts-nocheck
import { Input } from "antd";
import { Modal, Form } from "antd";
import { useEffect } from "react";

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};
export function ParseModal({ isOpen, onOk, onCancel }) {
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    await form.validateFields();
    const value = form.getFieldsValue();
    onOk(value);
  };

  useEffect(() => {
    if (isOpen) {
      form.resetFields();
    }
  }, [isOpen, form]);

  return (
    <Modal
      open={isOpen}
      onOk={handleSubmit}
      title="替换匹配"
      onCancel={onCancel}
    >
      <Form form={form}>
        <Form.Item
          label="匹配"
          name="match"
          rules={[{ required: true, message: "请输入要替换的匹配值!" }]}
          {...layout}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="替换"
          name="target"
          rules={[{ required: true, message: "请输入替换后的值" }]}
          {...layout}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}
