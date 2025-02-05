import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  PageContainer,
} from '@ant-design/pro-components';
import { Button } from 'antd';
import ProTable from '@/components/antd/ProTable';
import CategoryEditModalForm from './CategoryEditModalForm';
import React, { useRef, useState, useEffect } from 'react';
import type { CategoryListItem, CategoryListPagination } from './data';
import { getCategoryList, removeCategory } from './service';

const CategoryList: React.FC = () => {
  /** 新建窗口的弹窗 */
  const [editModalState, setEditModalState] = useState<{ open: boolean, data?: CategoryListItem }>({ open: false });
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<CategoryListItem>[] = [
    {
      title: '名称',
      dataIndex: 'name'
    },
    {
      title: '状态',
      dataIndex: 'status'
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a onClick={() => { openEditModal(record); }}>编辑</a>,
        <a onClick={handleRemove}>删除</a>
      ],
    },
  ];

  function openEditModal(data?: CategoryListItem) {
    setEditModalState({ open: true, data })
  }

  function closeEditModalOpen() {
    setEditModalState({ ...editModalState, open: false })
  }

  function afterFormUpdate() {
    setEditModalState({ ...editModalState, open: false })
    actionRef.current?.reload()
  }

  async function handleRemove(selectedRows: CategoryListItem[]) {
    const flag = await removeCategory(selectedRows)

    if (flag) {
      actionRef.current?.reload()
    }
  }

  return (
    <PageContainer
      header={{ breadcrumb: {} }}
    >
      <ProTable<CategoryListItem, CategoryListPagination>
        actionRef={actionRef}
        showHeader={false}
        rowKey="id"
        toolBarRender={() => [
          <Button
            type="primary"
            onClick={() => {
              setEditModalState({ open: true  });
            }}
          >
            <PlusOutlined /> 新建
          </Button>,
        ]}
        options={{ fullScreen: false, reload: true, density: true, setting: false }}
        request={getCategoryList}
        columns={columns}
      />

      <CategoryEditModalForm
        open={editModalState.open}
        data={editModalState.data}
        onCancel={closeEditModalOpen}
        onUpdated={afterFormUpdate}
      />
    </PageContainer>
  );
};

export default CategoryList;
