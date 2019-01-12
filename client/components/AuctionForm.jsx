import React from "react";
import { Form, Input, Button } from "antd";

const AuctionForm = Form.create()(props => {
  const { form, onSubmit, auction } = props;

  const handleSubmit = event => {
    event.preventDefault();

    form.validateFields((err, values) => {
      if (err) return;

      onSubmit(Object.assign({}, auction, values));
    });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Item label="Name">
        {form.getFieldDecorator("name", {
          initialValue: auction && auction.name,
          rules: [{ required: true }]
        })(<Input />)}
      </Form.Item>
      <Form.Item label="Starting price">
        {form.getFieldDecorator("startPrice", {
          initialValue: auction && auction.startPrice,
          type: 'number',
          rules: [{ required: true }]
        })(<Input type="number" />)}
      </Form.Item>
      <Form.Item>
        <Button htmlType="submit">Save</Button>
      </Form.Item>
    </Form>
  );
});

export default AuctionForm;
