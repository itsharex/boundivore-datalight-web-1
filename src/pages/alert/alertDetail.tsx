/**
 * Copyright (C) <2023> <Boundivore> <boundivore@foxmail.com>
 * <p>
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the Apache License, Version 2.0
 * as published by the Apache Software Foundation.
 * <p>
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * Apache License, Version 2.0 for more details.
 * <p>
 * You should have received a copy of the Apache License, Version 2.0
 * along with this program; if not, you can obtain a copy at
 * http://www.apache.org/licenses/LICENSE-2.0.
 */
/**
 * 告警规则详情和编辑
 * @author Tracy
 */
import { FC, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { t } from 'i18next';
import { Row, Col, Card, List, Typography, Badge, Space, Button, Collapse, Tabs } from 'antd';
import APIConfig from '@/api/config';
import RequestHttp from '@/api';
import ContainerCard from '@/components/containerCard';
import AlertForm from '@/components/alert/alertForm';
import useNavigater from '@/hooks/useNavigater';
import { MailList, InterfaceList } from '@/components/alert/alertHandlerList';
const { Text } = Typography;

const AlertDetail: FC = () => {
	const [searchParams] = useSearchParams();
	const id = searchParams.get('id');
	const { navigateToAlertList } = useNavigater();
	const [alertInfoData, setAlertInfoData] = useState([]);
	const [alertRuleData, setAlertRuleData] = useState(null);
	const [tabItems, setTabItems] = useState([]);
	const [keys, setKeys] = useState([]);
	// const { modal } = App.useApp();
	// const [messageApi, contextHolder] = message.useMessage();
	const getAlertDetail = async () => {
		const api = APIConfig.getAlertDetailById;
		const params = {
			AlertId: id
		};
		const {
			Data: { AlertRuleContent, AlertRuleName, Enabled, AlertHandlerList }
		} = await RequestHttp.get(api, { params });
		// console.log(data);
		const alertInfo = [
			{
				key: 1,
				label: <Text strong>{t('permission.roleName')}</Text>,
				text: <span>{AlertRuleName}</span>
			},
			// {
			// 	key: 3,
			// 	label: <Text strong>{t('permission.roleType')}</Text>,
			// 	text: <span>{t(`permission.${Data.RoleType}`)}</span>
			// },
			{
				key: 2,
				label: <Text strong>{t('state')}</Text>,
				text: <Badge status={Enabled ? 'success' : 'error'} text={Enabled ? t(`permission.enabled`) : t(`permission.disabled`)} />
			}
		];
		setAlertInfoData(alertInfo);
		setAlertRuleData({ AlertRuleName, AlertRuleContent });
		const tabs = AlertHandlerList.map(handler => {
			let childrenComponent;
			if (handler.AlertHandlerType === 'ALERT_MAIL') {
				childrenComponent = <MailList handlerIdList={handler.AlertHandlerIdList} />;
			} else if (handler.AlertHandlerType === 'ALERT_INTERFACE') {
				childrenComponent = <InterfaceList handlerIdList={handler.AlertHandlerIdList} />;
			} else {
				// 如果AlertHandlerType不是"mail"或"interface"，你可以定义一个默认的组件或者处理方式
				childrenComponent = <MailList handlerIdList={handler.AlertHandlerIdList} />;
			}
			return {
				key: handler.AlertHandlerType,
				label: t(`alert.${handler.AlertHandlerType}`),
				children: childrenComponent
			};
		});
		setTabItems(tabs);
	};
	const handleExpand = () => {
		setKeys(['1']);
	};
	const handleChange = (keyArr: string[]) => {
		setKeys(keyArr);
	};
	useEffect(() => {
		id && getAlertDetail();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id]);
	const items = [
		{
			key: '1',
			label: <span className="font-semibold text-[16px]">告警规则信息</span>,
			children: alertRuleData && <AlertForm type="edit" alertRuleData={alertRuleData} />,
			extra: (
				<Space>
					<Button type="primary" disabled={keys.length} onClick={handleExpand}>
						{t('edit')}
					</Button>
					<Button onClick={() => navigateToAlertList('alert')}>{t('back')}</Button>
				</Space>
			)
		}
	];
	return (
		<ContainerCard>
			{/* {contextHolder} */}
			<Row gutter={24} className="mt-[20px]">
				<Col span={6}>
					<Card className="data-light-card" title="告警配置信息">
						<List
							size="large"
							dataSource={alertInfoData}
							renderItem={item => (
								<List.Item>
									{item.label}: {item.text}
								</List.Item>
							)}
						/>
					</Card>
				</Col>
				<Col span={18}>
					<Space direction="vertical" size="middle" style={{ display: 'flex' }}>
						<Collapse className="bg-white" items={items} activeKey={keys} onChange={keyArr => handleChange(keyArr)}></Collapse>
						<Card title="绑定告警处理方式">
							<Tabs type="card" items={tabItems}></Tabs>
						</Card>
					</Space>
				</Col>
			</Row>
		</ContainerCard>
	);
};
export default AlertDetail;
