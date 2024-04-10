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
 * 顶部可切换的参数
 * @author Tracy.Guo
 */
import { useEffect, useState } from 'react';
// import _ from 'lodash';
import { Select, Space } from 'antd';
import APIConfig from '@/api/config';
import RequestHttp from '@/api';
import useStore from '@/store/store';

export const JobNameComponent: React.FC = ({ clusterId, activeComponent }) => {
	const [jobNameOptions, setJobNameOptions] = useState([]);
	const [instanceOptions, setInstanceOptions] = useState([]);
	const { jobName, setJobName, instance, setInstance } = useStore();
	const getData = async () => {
		const api = APIConfig.prometheus;
		const params = {
			Body: '',
			ClusterId: clusterId,
			Path: '/api/v1/query',
			QueryParamsMap: {
				query: activeComponent === 'DATALIGHT' ? `up{job=~"${activeComponent}.*"}` : `{job="${activeComponent}"}`
			},
			RequestMethod: 'GET'
		};
		const { Data } = await RequestHttp.post(api, params);
		const {
			data: { result }
		} = JSON.parse(Data);
		// console.log('result', _.uniqBy(result, ));
		// const metricsArray = result.map(item => item.metric);
		// 提取所有job，并使用Set去重
		const uniqueJobsSet = new Set(result.map(item => item.metric.job));

		// 遍历Set中的每个job，创建新的对象数组
		const jobsArray = Array.from(uniqueJobsSet).map(job => ({
			value: job,
			label: job
		}));
		setJobNameOptions(jobsArray);
		setJobName([...uniqueJobsSet][0]);
		console.log(11111, [...uniqueJobsSet][0]);
	};
	const getInstanceData = async () => {
		const api = APIConfig.prometheus;
		const params = {
			Body: '',
			ClusterId: clusterId,
			Path: '/api/v1/query',
			QueryParamsMap: {
				query: activeComponent === 'DATALIGHT' ? `up{job=~"${jobName}"}` : `{job="${jobName}"}`
			},
			RequestMethod: 'GET'
		};
		const { Data } = await RequestHttp.post(api, params);
		const {
			data: { result }
		} = JSON.parse(Data);
		// 提取所有job，并使用Set去重
		const uniqueSet = new Set(result.map(item => item.metric.instance));

		// 遍历Set中的每个job，创建新的对象数组
		const jobsArray = Array.from(uniqueSet).map(job => ({
			value: job,
			label: job
		}));
		setInstanceOptions(jobsArray);
		setInstance([...uniqueSet][0]);
		console.log(22222, uniqueSet[0]);
	};
	useEffect(() => {
		getData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	useEffect(() => {
		getData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [activeComponent]);
	useEffect(() => {
		jobName && getInstanceData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [jobName]);
	return (
		<Space>
			<Space>
				jobName:
				<Select
					style={{ width: 200 }}
					options={jobNameOptions}
					value={jobName}
					onChange={value => {
						setJobName(value);
					}}
				/>
			</Space>
			<Space>
				instance:
				<Select
					style={{ width: 150 }}
					options={instanceOptions}
					value={instance}
					onChange={value => {
						setInstance(value);
					}}
				/>
			</Space>
		</Space>
	);
};
