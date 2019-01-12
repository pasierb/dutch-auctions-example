import React from 'react';
import { Form, Input, Button } from 'antd';

const LoginForm = Form.create()(props => {
  const { form, onSubmit } = props;

  const handleSubmit = event => {
    event.preventDefault();

    form.validateFields((err, values) => {
      if (err) return;

      onSubmit(values);
    });
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Item label="Username">
        {form.getFieldDecorator('username', { rules: [{ required: true }] })(
          <Input />
        )}
      </Form.Item>
      <Form.Item>
        <Button htmlType="submit">Sign in</Button>
      </Form.Item>
    </Form>
  )
});


export default LoginForm;
