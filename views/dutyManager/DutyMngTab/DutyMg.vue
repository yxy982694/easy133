<template>
    <div>
        <el-button type="primary">新建值班</el-button>
        <el-table :data="tableData.content" :stripe="true" :border="true">
            <el-table-column type="index" width="50" header-align="center" align="center"/>
            <el-table-column v-for="column in columns" :key="column.prop" :prop="column.prop" :label="column.label" :min-width="column.minWidth" header-align="center" align="center"/>
            <el-table-column fixed="right" label="操作" width="160" header-align="center" align="center">
                <template>
                    <el-button type="text" size="small">排班</el-button>
                    <el-button type="text" size="small">调整</el-button>
                    <el-button type="text" size="small">作废</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
export default {
    data() {
        return {
            columns: [
                {
                    prop: 'dutyName',
                    label: '值班名称'
                },
                {
                    prop: 'creatTime',
                    label: '创建时间'
                },
                {
                    prop: 'shifts',
                    label: '班次'
                },
                {
                    prop: 'cycle',
                    label: '周期'
                },
                {
                    prop: 'room',
                    label: '机房班'
                },
                {
                    prop: 'dutyType',
                    label: '值班类型'
                }
            ],
            tableData: {
                content: [
                   {
                       dutyName:'监控专业值班组',
                       creatTime:'2019-01-04 08:30:40',
                       shifts:'08:00:00/18:00:00',
                       cycle:'3天',
                       room:'',
                       dutyType:'专家值班'
                   },
                   {
                       dutyName:'EOMS厂家值班',
                       creatTime:'2019-01-04 08:30:40',
                       shifts:'08:00:00/18:00:00',
                       cycle:'3天',
                       room:'网管中心网管室',
                       dutyType:'专家值班'
                   }  
                ]
            }
        }
    }
}
</script>