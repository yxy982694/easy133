<template>
    <div class="resource-container">
        <div class="children-container">
            <kt-buttons>
			<div slot="toolSearch">
				<div class="search-container">
					<el-select v-model="form.dutyType" placeholder="值班类型" @change="dutyTypeChange">
						<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"/>
					</el-select>
					<el-select v-model="form.dutyName" multiple filterable collapse-tags placeholder="值班名称">
						<el-option v-for="item in options2" :key="item.id" :label="item.name" :value="item.id"/>
					</el-select>
					<el-date-picker v-model="form.startDate" type="date" value-format="yyyy-MM-dd" placeholder="开始时间"/>
					<el-date-picker v-model="form.endDate" type="date" value-format="yyyy-MM-dd" placeholder="结束时间"/>
	                <el-input v-model="form.watchmanName" type="text" placeholder="值班人名称"></el-input>
	                <kt-button icon="fa fa-search" type="primary" class="user-search-btn" :label="$t('action.search')" @click="searchDate"></kt-button>
				</div>
			</div>
            </kt-buttons>
			<div class="right-center">
				<div class="btn-container">
					<el-button-group>
                        <kt-button type="primary" icon="fa fa-calendar" :disabled="editAble" label="替班" @click="addInfo"/>
					</el-button-group>
				</div>
			</div>
			<div class="right-bottom">
				<el-table :data="tableData.content" :border="true" height="100%" highlight-current-row @current-change="selected">
					<el-table-column v-for="column in columns" header-align="center" align="center" :prop="column.prop" :label="column.label" :min-width="column.minWidth" :key="column.prop" :sortable="true"/>
				</el-table>
			</div>
			<div class="user-toolbar">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="1" :page-sizes="[100, 200, 300, 400]" :page-size="100" layout="total, sizes, prev, pager, next, jumper" :total="4000"/>
			</div>
		</div>
	  <!--新增编辑界面-->
	  <el-dialog title="替班" width="40%" :visible.sync="dialogVisible" :close-on-click-modal="false">
	    <el-form :model="dataForm" label-width="100px" :rules="dataFormRules" ref="dataForm" :size="size" label-position="right">
	      <el-form-item label="值班名称" prop="username">
	        <el-input v-model="dataForm.dutyName" auto-complete="off"/>
	      </el-form-item>
	      <el-form-item label="值班班次" prop="shifts">
	        <el-input v-model="dataForm.shifts" auto-complete="off"/>
	      </el-form-item>
	      <el-form-item label="替班说明" prop="explain">
	        <el-input v-model="dataForm.explain" auto-complete="off"/>
	      </el-form-item>
	      <el-form-item label="原排班人员" prop="createUser">
	        <el-input v-model="dataForm.oldWatchmanName" auto-complete="off"/>
	      </el-form-item>
	      <el-form-item label="替班人员" prop="valid">
	        <el-select v-model="dataForm.newWatchmanName" placeholder="请选择" style="width: 100%;">
	          <el-option v-for="item in validArr" :key="item.id" :label="item.value" :value="item.id"/>
	        </el-select>
	      </el-form-item>
	    </el-form>
	    <div slot="footer" class="dialog-footer">
	      <el-button :size="size" @click.native="dialogVisible = false">{{$t('action.cancel')}}</el-button>
	      <el-button :size="size" type="primary" @click.native="submitForm" :loading="editLoading">{{$t('action.submit')}}</el-button>
	    </div>
	  </el-dialog>
    </div>
</template>
<script>
import KtButton from "@/components/KtButton/KtButton"
import KtButtons from "@/components/KtButtons/KtButtons"
export default {
    data(){
        return {
            editAble: true,
            dialogVisible: false,
            editLoading: false,
            size: 'small',
            form: {
                dutyType:'',
                dutyName:'',
                startDate:'',
                endDate:'',
                watchmanName:''
            },
            validArr: [
                {
                id: 1,
                value: '可用'
                },
                {
                    id: 2,
                    value: '不可用'
                }
            ],
            dataForm: {
                dutyName: '',
                shifts: '',
                explain:'',
                oldWatchmanName: "",
                newWatchmanName: '',
            },
            dataFormRules: {
                explain: [
                    { required: true, message: '请输入替班说明', trigger: 'blur' }
                ],
                newWatchmanName: [
                    { required: true, message: '请选择替班人员', trigger: 'blur' }
                ]
            },
            options2:[],
            options: [
                {
                    value: '2',
                    label: '专家值班'
                }, 
                {
                    value: '1',
                    label: '日常维护值班'
                }
            ],
            tableData: {
                content: [
                    {
                        dutyDate: '2017-09-28',
                        startTime: '00:00',
                        endTime: '00:00',
                        name: '袁晓宇',
                        shiftName: '袁晓宇',
                        dutyName:'值班班长',
                        dutyType: '专家值班'
                    }, 
                    {
                        dutyDate: '2017-09-28',
                        startTime: '00:00',
                        endTime: '00:00',
                        name: '袁晓宇',
                        bumen: '袁晓宇',
                        shiftName:'值班助理',
                        dutyType: '专家值班'
                    }, 
                    {
                        dutyDate: "2017-09-28",
                        startTime: '00:00',
                        endTime: '00:00',
                        name: '袁晓宇',
                        shiftName: '袁晓宇',
                        dutyName:'监控',
                        dutyType: '专家值班'
                    }, 
                    {
                        dutyDate: "2017-09-28",
                        startTime: '00:00',
                        endTime: '00:00',
                        name: '袁晓宇',
                        shiftName: '袁晓宇',
                        dutyName:'传输',
                        dutyType: '专家值班'
                    }, 
                    {
                        dutyDate: "2017-09-28",
                        startTime: '00:00',
                        endTime: '00:00',
                        name: '袁晓宇',
                        shiftName: '袁晓宇',
                        dutyName:'交换',
                        dutyType: '专家值班'
                    }, 
                    {
                        dutyDate: "2017-09-28",
                        startTime: '00:00',
                        endTime: '00:00',
                        name: '袁晓宇',
                        shiftName: '袁晓宇',
                        dutyName:'数据',
                        dutyType: '专家值班'
                    }, 
                    {
                        dutyDate: "2017-09-28",
                        startTime: '00:00',
                        endTime: '00:00',
                        name: '袁晓宇',
                        shiftName: '袁晓宇',
                        dutyName:'网管',
                        dutyType: '专家值班'
                    }, 
                    {
                        dutyDate: "2017-09-28",
                        startTime: '00:00',
                        endTime: '00:00',
                        name: '袁晓宇',
                        shiftName: '袁晓宇',
                        dutyName:'监控',
                        dutyType: '日常维护值班'
                    }, 
                    {
                        dutyDate: "2017-09-28",
                        startTime: '00:00',
                        endTime: '00:00',
                        name: '袁晓宇',
                        shiftName: '袁晓宇',
                        dutyName:'数据',
                        dutyType: '专家值班'
                    }, 
                    {
                        dutyDate: "2017-09-28",
                        startTime: '00:00',
                        endTime: '00:00',
                        name: '袁晓宇',
                        shiftName: '袁晓宇',
                        dutyName:'网管',
                        dutyType: '专家值班'
                    }
                ]
            },
            columns: [
                {
                    prop: 'dutyDate',
                    label: '值班日期'
                }, 
                {
                    prop: 'startTime',
                    label: '开始时间'
                }, 
                {
                    prop: 'endTime',
                    label: '结束时间'
                }, 
                {
                    prop: 'name',
                    label: '值班人'
                }, 
                {
                    prop: 'shiftName',
                    label: '替班发起人'
                }, 
                {
                    prop: 'dutyName',
                    label: '值班名称'
                }, 
                {
                    prop: 'dutyType',
                    label: '值班类型'
                }
            ]
        }
    },
    components: {
        KtButton,
        KtButtons
    },
    methods: {
      addInfo: function () {
        let date1 = new Date()
        let date2 = new Date(date1)
        date2.setDate(date1.getDate()+90)
        this.dialogVisible = true
        this.operation = true
      },
      selected(val){
        // console.log(val);
        this.editAble=false;
        this.dataForm.dutyName=val.dutyName;
        this.dataForm.shifts=val.date+' '+val.startTime+'-'+val.endTime
      },
      searchDate(){
        let params={
            dutyType:this.form.dutyType,
            dutyName:this.form.dutyName.join(","),
            startDate:this.form.startDate,
            endDate:this.form.endDate,
            watchmanName:this.form.watchmanName
        }
        this.$api.duty.findDuty(params).then((res) => {
            if(res.returnCode=='200'){
                this.tableData.content=res.valueList
            }
        });
      },
      handleSizeChange(){

      },
      handleCurrentChange(){

      },
      dutyTypeChange(val){
        // console.log(val)
        this.$api.duty.findDutyNamesByDutyType(val).then((res) => {
            if(res.returnCode=='200'){
                this.options2=res.valueList
            }
        });
      }
    }
}
</script>