import React, { useState } from 'react';
import { Form, Input, Button, Select, notification, ConfigProvider } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import emailjs from 'emailjs-com';

const { Option } = Select;

const CommunicationForm: React.FC<{ userEmail: string; }> = ({ userEmail }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = (values: {reason: string; message: string;}) => {
    setLoading(true);
    const { reason, message } = values;

    emailjs.send('service_f9o2wi1', 'service_f9o2wi1', {
      user_email: userEmail,
      reason,
      message,
    }, '12WolN1sfC28MZ53F')
      .then((result) => {
        setLoading(false);
        notification.success({
          message: 'Email envoyé',
          description: 'Votre message a été envoyé avec succès!',
        });
        form.resetFields();
      }, (error) => {
        setLoading(false);
        notification.error({
          message: "Échec de l'envoi d'e-mail",
          description: "Une erreur est survenue lors de l'envoi de votre message. Veuillez réessayer plus tard.",
        });
      });
  };

  return (
    <Form
      form={form}
      layout="vertical"
      labelAlign='left'
      requiredMark={false}
      onFinish={onFinish}
      className="communication-form"
    >
      <ConfigProvider theme={{ token: { colorPrimary: '#1c575f' }, components: { 
        Select: { optionActiveBg: '#d2fbf9', optionSelectedBg: '#14a0a6', optionSelectedColor: 'white' }, 
        Button: { colorPrimaryHover: '#14a0a6', }} }}>
      <Form.Item
        name="reason"
        label={<label className="font-semibold">Raison de la communication</label>}
        rules={[{ required: true, message: 'Veuillez sélectionner une raison' }]}
      >
        <Select placeholder="Select a reason" style={{ maxWidth: '30%', width: 'fit'}}>
          <Option value="recommendation">Recommendation</Option>
          <Option value="reclamation">Reclamation</Option>
          <Option value="feedback">Feedback</Option>
          <Option value="question">Question</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="message"
        label={<label className='font-semibold'>Message</label>}
        rules={[{ required: true, message: 'Veuillez entrer votre message' }]}
      >
        <Input.TextArea rows={4} placeholder="Entrez votre message" />
      </Form.Item>

      <Form.Item className="flex justify-end">
        <Button type="primary" className="bg-casal-900" htmlType="submit" loading={loading} icon={<MailOutlined />}>
          Envoyer
        </Button>
      </Form.Item>
      </ConfigProvider>
    </Form>
  );
};

export default CommunicationForm;