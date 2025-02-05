import { useEffect, useRef } from 'react'
import {
  ModalForm,
  ProFormText
} from '@ant-design/pro-components';
import { addCategory, updateCategory } from './service';
import type { ProFormInstance } from '@ant-design/pro-components'
import type { CategoryListItem } from './data';

export default function CategoryEditModalForm(props: { open?: boolean, data?: CategoryListItem, onCancel?: () => void, onUpdated?: () => void }) {
  const { open, data, onCancel, onUpdated } = props
  const formRef = useRef<ProFormInstance>()

  useEffect(() => {
    if (open) {
      formRef.current?.resetFields()

      if (data && data.id) {
        formRef.current?.setFieldsValue(data)
      }
    }
  }, [open])

  return (
    <ModalForm
      formRef={formRef}
      title={`${data && data.id ? '编辑' : '新增'}分类`}
      width="400px"
      open={open}
      modalProps={{ onCancel }}
      onFinish={async (vals) => {
        const newData = data ? {
          ...data,
          ...vals
        } : vals

        const success = data && data.id ? await updateCategory(newData as CategoryListItem) : await addCategory(newData as CategoryListItem);

        if (success && typeof success === 'object' && success.code === 200) {
          typeof onUpdated === 'function' && onUpdated();
        }
      }}
    >
      <ProFormText
        rules={[{ required: true }]}
        width="md"
        label="名称"
        name="name"
      />

      <ProFormText
        rules={[{ required: true }]}
        width="md"
        label="状态"
        name="status"
      />

    </ModalForm>
  )
}
