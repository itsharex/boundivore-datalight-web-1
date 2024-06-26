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
 * 审计管理列表页
 * @author Tracy
 */
import { FC, useEffect } from 'react';
import ContainerCard from '@/components/containerCard';
import RequestHttp from '@/api';
import APIConfig from '@/api/config';
const AuditList: FC = () => {
	const getList = async () => {
		const api = APIConfig.getAuditLogSimpleList;
		const params = {};
		const data = await RequestHttp.get(api, { params });
		const {
			Data: { AuditLogSimpleList }
		} = data;
		console.log(AuditLogSimpleList);
	};
	useEffect(() => {
		getList();
	}, []);
	return (
		<ContainerCard>
			{/* <Flex justify="space-between">
				<Space>
					{clusterComponent}
					
				</Space>
			</Flex>
			<Table className="mt-[20px]" rowKey="NodeId" columns={columns} dataSource={tableData} /> */}
		</ContainerCard>
	);
};
export default AuditList;
